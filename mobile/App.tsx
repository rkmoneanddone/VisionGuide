import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ONBOARDING_SLIDES} from './src/modules/onboarding/onboardingSlides';
import {PreferenceSetupScreen, PreferenceSetupValue} from './src/modules/onboarding/PreferenceSetupScreen';
import {SCAN_MODES, ScanModeId} from './src/modules/scan/scanModes';
import {theme} from './src/theme/theme';

type Screen = 'landing' | 'login' | 'preferences' | 'home';
const LANGUAGE_LABELS: Record<string, string> = {'en-IN': 'English', 'hi-IN': 'हिन्दी', 'bn-IN': 'বাংলা', 'mr-IN': 'मराठी', 'ta-IN': 'தமிழ்', 'te-IN': 'తెలుగు'};

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('landing');
  const [slide, setSlide] = useState(0);
  const [languageTag, setLanguageTag] = useState('en-IN');
  const [defaultMode, setDefaultMode] = useState<ScanModeId>('anything');

  const authenticated = () => setScreen('preferences');
  const finishPreferences = (value: PreferenceSetupValue) => {
    setLanguageTag(value.defaultListeningLanguage);
    setDefaultMode(value.defaultScanMode);
    setScreen('home');
  };

  if (screen === 'preferences') return <PreferenceSetupScreen onComplete={finishPreferences} />;

  if (screen === 'landing') {
    const item = ONBOARDING_SLIDES[slide];
    const last = slide === ONBOARDING_SLIDES.length - 1;
    return <SafeAreaView style={styles.page}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.topBar}><Brand /><TouchableOpacity onPress={() => setScreen('login')}><Text style={styles.signIn}>Sign in</Text></TouchableOpacity></View>
      <View style={styles.heroArea}><View style={styles.visualCircle}><Text style={styles.visualIcon}>◎</Text></View><Text style={styles.eyebrow}>{item.eyebrow}</Text><Text style={styles.hero}>{item.title}</Text><Text style={styles.description}>{item.description}</Text><View style={styles.points}>{item.points.map(point => <Text key={point} style={styles.point}>✓  {point}</Text>)}</View></View>
      <View style={styles.bottomArea}><View style={styles.dots}>{ONBOARDING_SLIDES.map((_, i) => <View key={i} style={[styles.dot, i === slide && styles.dotActive]} />)}</View>{last ? <><PrimaryButton label="Continue with Google" onPress={authenticated} /><SecondaryButton label="Continue with phone OTP" onPress={() => setScreen('login')} /></> : <PrimaryButton label="Continue" onPress={() => setSlide(v => v + 1)} />}</View>
    </SafeAreaView>;
  }

  if (screen === 'login') return <SafeAreaView style={styles.page}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /><View style={styles.loginPage}><TouchableOpacity onPress={() => setScreen('landing')}><Text style={styles.back}>‹ Back</Text></TouchableOpacity><Text style={styles.loginTitle}>Welcome to VisionGuide</Text><Text style={styles.description}>Sign in or create your account. We'll ask for your reading preferences only once.</Text><View style={styles.loginActions}><PrimaryButton label="Continue with Google" onPress={authenticated} /><SecondaryButton label="Continue with phone OTP" onPress={authenticated} /></View><Text style={styles.helper}>Secure authentication is provided by Firebase.</Text></View></SafeAreaView>;

  const primary = SCAN_MODES.find(m => m.id === defaultMode) ?? SCAN_MODES[0];
  return <SafeAreaView style={styles.page}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /><ScrollView contentContainerStyle={styles.home}>
    <View style={styles.homeHeader}><View><Brand /><Text style={styles.welcome}>What would you like to read?</Text></View><View style={styles.freePill}><Text style={styles.freePillText}>FREE</Text></View></View>
    <View style={styles.languageRow}><View><Text style={styles.smallLabel}>HEAR IN</Text><Text style={styles.languageText}>{LANGUAGE_LABELS[languageTag] ?? languageTag}</Text></View><TouchableOpacity style={styles.changeButton} onPress={() => setScreen('preferences')}><Text style={styles.changeText}>Change</Text></TouchableOpacity></View>
    <Text style={styles.sectionTitle}>Your quick scan</Text><TouchableOpacity style={styles.primaryCard}><Text style={styles.cardIcon}>{iconFor(primary.id)}</Text><View style={styles.cardBody}><Text style={styles.primaryCardTitle}>{primary.title}</Text><Text style={styles.primaryCardDescription}>{primary.description}</Text></View><Text style={styles.arrow}>›</Text></TouchableOpacity>
    <View style={styles.allowance}><Text style={styles.allowanceText}>2 free scans available today</Text></View><Text style={styles.sectionTitle}>Choose what you're scanning</Text><View style={styles.grid}>{SCAN_MODES.filter(m => m.id !== defaultMode).map(mode => <TouchableOpacity key={mode.id} style={styles.modeCard}><Text style={styles.modeIcon}>{iconFor(mode.id)}</Text><Text style={styles.modeTitle}>{mode.title}</Text><Text style={styles.modeDescription}>{mode.description}</Text></TouchableOpacity>)}</View>
  </ScrollView></SafeAreaView>;
}

function Brand() { return <Text style={styles.brand}>Vision<Text style={styles.brandBlue}>Guide</Text></Text>; }
function PrimaryButton({label, onPress}: {label: string; onPress: () => void}) { return <TouchableOpacity style={styles.primaryButton} onPress={onPress}><Text style={styles.primaryButtonText}>{label}</Text></TouchableOpacity>; }
function SecondaryButton({label, onPress}: {label: string; onPress: () => void}) { return <TouchableOpacity style={styles.secondaryButton} onPress={onPress}><Text style={styles.secondaryButtonText}>{label}</Text></TouchableOpacity>; }
function iconFor(id: string) { return ({anything: '◎', electricity_bill: '⚡', newspaper: '▤', school_book: '▱', notebook: '✎', letter: '✉'} as Record<string, string>)[id] ?? '◎'; }

const styles = StyleSheet.create({
  page:{flex:1,backgroundColor:theme.colors.background},topBar:{paddingHorizontal:24,paddingTop:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},brand:{fontSize:24,fontWeight:'800',color:theme.colors.text},brandBlue:{color:theme.colors.primary},signIn:{fontSize:16,fontWeight:'700',color:theme.colors.primary,padding:10},heroArea:{flex:1,justifyContent:'center',paddingHorizontal:28},visualCircle:{width:92,height:92,borderRadius:46,backgroundColor:theme.colors.primarySoft,alignItems:'center',justifyContent:'center',marginBottom:30},visualIcon:{fontSize:48,color:theme.colors.primary,fontWeight:'700'},eyebrow:{fontSize:14,color:theme.colors.primary,fontWeight:'800',textTransform:'uppercase',letterSpacing:1,marginBottom:10},hero:{fontSize:36,lineHeight:43,fontWeight:'800',color:theme.colors.text,marginBottom:16},description:{fontSize:18,lineHeight:28,color:theme.colors.textSecondary},points:{marginTop:24,gap:12},point:{fontSize:16,color:theme.colors.text,fontWeight:'600'},bottomArea:{padding:24,paddingBottom:28},dots:{flexDirection:'row',gap:7,justifyContent:'center',marginBottom:22},dot:{width:8,height:8,borderRadius:4,backgroundColor:theme.colors.border},dotActive:{width:24,backgroundColor:theme.colors.primary},primaryButton:{minHeight:56,borderRadius:theme.radius.button,backgroundColor:theme.colors.primary,justifyContent:'center',alignItems:'center',paddingHorizontal:20},primaryButtonText:{fontSize:17,fontWeight:'800',color:'#FFFFFF'},secondaryButton:{minHeight:56,borderRadius:theme.radius.button,borderWidth:1.5,borderColor:theme.colors.primary,justifyContent:'center',alignItems:'center',paddingHorizontal:20,marginTop:12},secondaryButtonText:{fontSize:17,fontWeight:'800',color:theme.colors.primary},loginPage:{flex:1,padding:24,paddingTop:18},back:{fontSize:17,color:theme.colors.primary,fontWeight:'700',paddingVertical:10},loginTitle:{fontSize:32,lineHeight:40,fontWeight:'800',color:theme.colors.text,marginTop:70,marginBottom:16},loginActions:{marginTop:40},helper:{fontSize:13,lineHeight:20,color:theme.colors.textSecondary,textAlign:'center',marginTop:24},home:{padding:22,paddingBottom:48},homeHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24},welcome:{fontSize:17,color:theme.colors.textSecondary,marginTop:5},freePill:{backgroundColor:theme.colors.primarySoft,paddingHorizontal:12,paddingVertical:7,borderRadius:99},freePillText:{fontSize:12,color:theme.colors.primary,fontWeight:'900'},languageRow:{borderWidth:1,borderColor:theme.colors.border,borderRadius:theme.radius.card,padding:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:26},smallLabel:{fontSize:11,color:theme.colors.textSecondary,fontWeight:'800',letterSpacing:1},languageText:{fontSize:19,color:theme.colors.text,fontWeight:'800',marginTop:3},changeButton:{backgroundColor:theme.colors.primarySoft,paddingHorizontal:16,paddingVertical:10,borderRadius:12},changeText:{color:theme.colors.primary,fontWeight:'800'},sectionTitle:{fontSize:19,fontWeight:'800',color:theme.colors.text,marginBottom:12},primaryCard:{backgroundColor:theme.colors.primary,borderRadius:theme.radius.card,padding:20,flexDirection:'row',alignItems:'center'},cardIcon:{fontSize:35,color:'#FFFFFF',marginRight:16},cardBody:{flex:1},primaryCardTitle:{fontSize:21,fontWeight:'800',color:'#FFFFFF'},primaryCardDescription:{fontSize:14,lineHeight:20,color:'#EAF2FF',marginTop:4},arrow:{fontSize:34,color:'#FFFFFF',marginLeft:8},allowance:{alignSelf:'flex-start',backgroundColor:theme.colors.primarySoft,borderRadius:99,paddingHorizontal:12,paddingVertical:7,marginTop:10,marginBottom:26},allowanceText:{fontSize:13,fontWeight:'700',color:theme.colors.primary},grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:12},modeCard:{width:'48%',minHeight:168,borderWidth:1,borderColor:theme.colors.border,borderRadius:theme.radius.card,padding:16,backgroundColor:theme.colors.surface},modeIcon:{fontSize:27,color:theme.colors.primary,marginBottom:14},modeTitle:{fontSize:17,lineHeight:22,fontWeight:'800',color:theme.colors.text},modeDescription:{fontSize:13,lineHeight:18,color:theme.colors.textSecondary,marginTop:5},
});
