import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ONBOARDING_SLIDES} from './src/modules/onboarding/onboardingSlides';
import {PreferenceSetupScreen, PreferenceSetupValue} from './src/modules/onboarding/PreferenceSetupScreen';
import {SCAN_MODES, ScanModeId} from './src/modules/scan/scanModes';
import {FirebaseAuthService} from './src/modules/auth/FirebaseAuthService';
import {theme} from './src/theme/theme';

type Screen = 'landing' | 'login' | 'preferences' | 'home';
const LANGUAGE_LABELS: Record<string, string> = {'en-IN': 'English', 'hi-IN': 'हिन्दी', 'bn-IN': 'বাংলা', 'mr-IN': 'मराठी', 'ta-IN': 'தமிழ்', 'te-IN': 'తెలుగు'};
const authService = new FirebaseAuthService();

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('landing');
  const [slide, setSlide] = useState(0);
  const [languageTag, setLanguageTag] = useState('en-IN');
  const [defaultMode, setDefaultMode] = useState<ScanModeId>('anything');
  const [profileOpen, setProfileOpen] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    if (authBusy) return;
    setAuthBusy(true);
    setAuthError(null);
    try {
      await authService.signInWithGoogle();
      setScreen('preferences');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google sign-in failed. Please try again.';
      setAuthError(message);
    } finally {
      setAuthBusy(false);
    }
  };

  const finishPreferences = (value: PreferenceSetupValue) => {
    setLanguageTag(value.defaultListeningLanguage);
    setDefaultMode(value.defaultScanMode);
    setScreen('home');
  };

  const logOut = async () => {
    setProfileOpen(false);
    try { await authService.signOut(); } finally { setScreen('landing'); }
  };

  if (screen === 'preferences') return <View style={styles.page}><SafeAreaView style={styles.navSafe}><View style={styles.innerTopBar}><BackButton onPress={() => setScreen('home')} /><Text style={styles.navTitle}>Preferences</Text><View style={styles.navSpacer} /></View></SafeAreaView><View style={styles.preferenceBody}><PreferenceSetupScreen onComplete={finishPreferences} /></View></View>;

  if (screen === 'landing') {
    const item = ONBOARDING_SLIDES[slide];
    const last = slide === ONBOARDING_SLIDES.length - 1;
    return <SafeAreaView style={styles.page}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.topBar}><Brand /><TouchableOpacity onPress={() => setScreen('login')}><Text style={styles.signIn}>Sign in</Text></TouchableOpacity></View>
      <View style={styles.heroArea}><View style={styles.visualCircle}><Text style={styles.visualIcon}>◎</Text></View><Text style={styles.eyebrow}>{item.eyebrow}</Text><Text style={styles.hero}>{item.title}</Text><Text style={styles.description}>{item.description}</Text><View style={styles.points}>{item.points.map(point => <Text key={point} style={styles.point}>✓  {point}</Text>)}</View></View>
      <View style={styles.bottomArea}><View style={styles.dots}>{ONBOARDING_SLIDES.map((_, i) => <View key={i} style={[styles.dot, i === slide && styles.dotActive]} />)}</View>{last ? <PrimaryButton label="Continue with Google" onPress={() => setScreen('login')} /> : <PrimaryButton label="Continue" onPress={() => setSlide(v => v + 1)} />}</View>
    </SafeAreaView>;
  }

  if (screen === 'login') return <SafeAreaView style={styles.page}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /><View style={styles.loginPage}><BackButton onPress={() => setScreen('landing')} /><Text style={styles.loginTitle}>Welcome to VisionGuide</Text><Text style={styles.description}>Sign in or create your account with Google. We'll ask for your reading preferences only once.</Text><View style={styles.loginActions}><PrimaryButton label={authBusy ? 'Opening Google…' : 'Continue with Google'} onPress={signInWithGoogle} />{authError && <Text style={styles.authError}>{authError}</Text>}</View><Text style={styles.helper}>Secure authentication is provided by Firebase.</Text></View></SafeAreaView>;

  const primary = SCAN_MODES.find(m => m.id === defaultMode) ?? SCAN_MODES[0];
  return <SafeAreaView style={styles.page}><StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
    <View style={styles.homeTopNav}><BackButton onPress={() => setScreen('landing')} /><Brand /><View style={styles.navSpacer} /></View>
    <ScrollView contentContainerStyle={styles.home}>
      <View style={styles.homeHeader}><View><Text style={styles.welcome}>What would you like to read?</Text></View><View style={styles.freePill}><Text style={styles.freePillText}>FREE</Text></View></View>
      <View style={styles.languageRow}><View><Text style={styles.smallLabel}>HEAR IN</Text><Text style={styles.languageText}>{LANGUAGE_LABELS[languageTag] ?? languageTag}</Text></View><TouchableOpacity style={styles.changeButton} onPress={() => setScreen('preferences')}><Text style={styles.changeText}>Change</Text></TouchableOpacity></View>
      <Text style={styles.sectionTitle}>Your quick scan</Text><TouchableOpacity style={styles.primaryCard}><Text style={styles.cardIcon}>{iconFor(primary.id)}</Text><View style={styles.cardBody}><Text style={styles.primaryCardTitle}>{primary.title}</Text><Text style={styles.primaryCardDescription}>{primary.description}</Text></View><Text style={styles.arrow}>›</Text></TouchableOpacity>
      <View style={styles.allowance}><Text style={styles.allowanceText}>2 free scans available today</Text></View><Text style={styles.sectionTitle}>Choose what you're scanning</Text><View style={styles.grid}>{SCAN_MODES.filter(m => m.id !== defaultMode).map(mode => <TouchableOpacity key={mode.id} style={styles.modeCard}><Text style={styles.modeIcon}>{iconFor(mode.id)}</Text><Text style={styles.modeTitle}>{mode.title}</Text><Text style={styles.modeDescription}>{mode.description}</Text></TouchableOpacity>)}</View>
    </ScrollView>
    {profileOpen && <View style={styles.profileMenu}><Text style={styles.profileMenuTitle}>Profile</Text><ProfileItem label="My profile" onPress={() => setProfileOpen(false)} /><ProfileItem label="Preferences" onPress={() => {setProfileOpen(false); setScreen('preferences');}} /><ProfileItem label="Subscription & plan" onPress={() => setProfileOpen(false)} /><ProfileItem label="Help" onPress={() => setProfileOpen(false)} /><ProfileItem label="Log out" onPress={logOut} danger /></View>}
    <TouchableOpacity accessibilityLabel="Open profile menu" style={styles.profileButton} onPress={() => setProfileOpen(v => !v)}><Text style={styles.profileIcon}>●</Text><Text style={styles.profileText}>Profile</Text></TouchableOpacity>
  </SafeAreaView>;
}

function Brand() { return <Text style={styles.brand}>Vision<Text style={styles.brandBlue}>Guide</Text></Text>; }
function BackButton({onPress}: {onPress: () => void}) { return <TouchableOpacity accessibilityLabel="Go back" style={styles.backButton} onPress={onPress}><Text style={styles.backArrow}>‹</Text><Text style={styles.backLabel}>Back</Text></TouchableOpacity>; }
function PrimaryButton({label, onPress}: {label: string; onPress: () => void}) { return <TouchableOpacity style={styles.primaryButton} onPress={onPress}><Text style={styles.primaryButtonText}>{label}</Text></TouchableOpacity>; }
function ProfileItem({label, onPress, danger = false}: {label: string; onPress: () => void; danger?: boolean}) { return <TouchableOpacity style={styles.profileItem} onPress={onPress}><Text style={[styles.profileItemText, danger && styles.dangerText]}>{label}</Text><Text style={styles.profileItemArrow}>›</Text></TouchableOpacity>; }
function iconFor(id: string) { return ({anything: '◎', electricity_bill: '⚡', newspaper: '▤', school_book: '▱', notebook: '✎', letter: '✉'} as Record<string, string>)[id] ?? '◎'; }

const styles = StyleSheet.create({
  page:{flex:1,backgroundColor:theme.colors.background},navSafe:{backgroundColor:theme.colors.background},topBar:{paddingHorizontal:24,paddingTop:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},innerTopBar:{height:58,paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:theme.colors.border},homeTopNav:{height:58,paddingHorizontal:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:theme.colors.border},navTitle:{fontSize:18,fontWeight:'800',color:theme.colors.text},navSpacer:{width:72},preferenceBody:{flex:1},brand:{fontSize:24,fontWeight:'800',color:theme.colors.text},brandBlue:{color:theme.colors.primary},signIn:{fontSize:16,fontWeight:'700',color:theme.colors.primary,padding:10},backButton:{minWidth:72,minHeight:44,flexDirection:'row',alignItems:'center'},backArrow:{fontSize:31,lineHeight:34,color:theme.colors.primary},backLabel:{fontSize:15,fontWeight:'800',color:theme.colors.primary,marginLeft:3},heroArea:{flex:1,justifyContent:'center',paddingHorizontal:28},visualCircle:{width:92,height:92,borderRadius:46,backgroundColor:theme.colors.primarySoft,alignItems:'center',justifyContent:'center',marginBottom:30},visualIcon:{fontSize:48,color:theme.colors.primary,fontWeight:'700'},eyebrow:{fontSize:14,color:theme.colors.primary,fontWeight:'800',textTransform:'uppercase',letterSpacing:1,marginBottom:10},hero:{fontSize:36,lineHeight:43,fontWeight:'800',color:theme.colors.text,marginBottom:16},description:{fontSize:18,lineHeight:28,color:theme.colors.textSecondary},points:{marginTop:24,gap:12},point:{fontSize:16,color:theme.colors.text,fontWeight:'600'},bottomArea:{padding:24,paddingBottom:28},dots:{flexDirection:'row',gap:7,justifyContent:'center',marginBottom:22},dot:{width:8,height:8,borderRadius:4,backgroundColor:theme.colors.border},dotActive:{width:24,backgroundColor:theme.colors.primary},primaryButton:{minHeight:56,borderRadius:theme.radius.button,backgroundColor:theme.colors.primary,justifyContent:'center',alignItems:'center',paddingHorizontal:20},primaryButtonText:{fontSize:17,fontWeight:'800',color:'#FFFFFF'},loginPage:{flex:1,padding:24,paddingTop:18},loginTitle:{fontSize:32,lineHeight:40,fontWeight:'800',color:theme.colors.text,marginTop:58,marginBottom:16},loginActions:{marginTop:40},helper:{fontSize:13,lineHeight:20,color:theme.colors.textSecondary,textAlign:'center',marginTop:24},authError:{fontSize:14,lineHeight:20,color:'#B42318',marginTop:14,textAlign:'center'},home:{padding:22,paddingBottom:104},homeHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24},welcome:{fontSize:19,fontWeight:'700',color:theme.colors.text,marginTop:2},freePill:{backgroundColor:theme.colors.primarySoft,paddingHorizontal:12,paddingVertical:7,borderRadius:99},freePillText:{fontSize:12,color:theme.colors.primary,fontWeight:'900'},languageRow:{borderWidth:1,borderColor:theme.colors.border,borderRadius:theme.radius.card,padding:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:26},smallLabel:{fontSize:11,color:theme.colors.textSecondary,fontWeight:'800',letterSpacing:1},languageText:{fontSize:19,color:theme.colors.text,fontWeight:'800',marginTop:3},changeButton:{backgroundColor:theme.colors.primarySoft,paddingHorizontal:16,paddingVertical:10,borderRadius:12},changeText:{color:theme.colors.primary,fontWeight:'800'},sectionTitle:{fontSize:19,fontWeight:'800',color:theme.colors.text,marginBottom:12},primaryCard:{backgroundColor:theme.colors.primary,borderRadius:theme.radius.card,padding:20,flexDirection:'row',alignItems:'center'},cardIcon:{fontSize:35,color:'#FFFFFF',marginRight:16},cardBody:{flex:1},primaryCardTitle:{fontSize:21,fontWeight:'800',color:'#FFFFFF'},primaryCardDescription:{fontSize:14,lineHeight:20,color:'#EAF2FF',marginTop:4},arrow:{fontSize:34,color:'#FFFFFF',marginLeft:8},allowance:{alignSelf:'flex-start',backgroundColor:theme.colors.primarySoft,borderRadius:99,paddingHorizontal:12,paddingVertical:7,marginTop:10,marginBottom:26},allowanceText:{fontSize:13,fontWeight:'700',color:theme.colors.primary},grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:12},modeCard:{width:'48%',minHeight:168,borderWidth:1,borderColor:theme.colors.border,borderRadius:theme.radius.card,padding:16,backgroundColor:theme.colors.surface},modeIcon:{fontSize:27,color:theme.colors.primary,marginBottom:14},modeTitle:{fontSize:17,lineHeight:22,fontWeight:'800',color:theme.colors.text},modeDescription:{fontSize:13,lineHeight:18,color:theme.colors.textSecondary,marginTop:5},profileButton:{position:'absolute',left:18,bottom:18,minHeight:52,paddingHorizontal:17,borderRadius:26,backgroundColor:theme.colors.surface,borderWidth:1,borderColor:theme.colors.border,flexDirection:'row',alignItems:'center',shadowColor:'#000000',shadowOpacity:0.1,shadowRadius:8,elevation:4},profileIcon:{fontSize:20,color:theme.colors.primary,marginRight:9},profileText:{fontSize:15,fontWeight:'800',color:theme.colors.text},profileMenu:{position:'absolute',left:18,bottom:80,width:230,backgroundColor:theme.colors.surface,borderWidth:1,borderColor:theme.colors.border,borderRadius:18,padding:10,shadowColor:'#000000',shadowOpacity:0.14,shadowRadius:12,elevation:8},profileMenuTitle:{fontSize:17,fontWeight:'900',color:theme.colors.text,paddingHorizontal:10,paddingVertical:9},profileItem:{minHeight:45,paddingHorizontal:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderTopWidth:1,borderTopColor:theme.colors.border},profileItemText:{fontSize:14,fontWeight:'700',color:theme.colors.text},profileItemArrow:{fontSize:22,color:theme.colors.textSecondary},dangerText:{color:'#B42318'},
});
