import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ONBOARDING_SLIDES} from './src/modules/onboarding/onboardingSlides';
import {SCAN_MODES} from './src/modules/scan/scanModes';
import {theme} from './src/theme/theme';

type Screen = 'landing' | 'login' | 'home';

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('landing');
  const [slide, setSlide] = useState(0);
  const [language, setLanguage] = useState('English');

  if (screen === 'landing') {
    const item = ONBOARDING_SLIDES[slide];
    const last = slide === ONBOARDING_SLIDES.length - 1;
    return (
      <SafeAreaView style={styles.page}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <View style={styles.topBar}>
          <Text style={styles.brand}>Vision<Text style={styles.brandBlue}>Guide</Text></Text>
          <TouchableOpacity accessibilityRole="button" onPress={() => setScreen('login')}>
            <Text style={styles.signIn}>Sign in</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heroArea}>
          <View style={styles.visualCircle}><Text style={styles.visualIcon}>◎</Text></View>
          <Text style={styles.eyebrow}>{item.eyebrow}</Text>
          <Text style={styles.hero}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.points}>
            {item.points.map(point => <Text key={point} style={styles.point}>✓  {point}</Text>)}
          </View>
        </View>
        <View style={styles.bottomArea}>
          <View style={styles.dots}>
            {ONBOARDING_SLIDES.map((_, index) => <View key={index} style={[styles.dot, index === slide && styles.dotActive]} />)}
          </View>
          {last ? (
            <>
              <PrimaryButton label="Continue with Google" onPress={() => setScreen('home')} />
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen('login')}>
                <Text style={styles.secondaryButtonText}>Continue with phone OTP</Text>
              </TouchableOpacity>
            </>
          ) : (
            <PrimaryButton label="Continue" onPress={() => setSlide(value => value + 1)} />
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'login') {
    return (
      <SafeAreaView style={styles.page}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <View style={styles.loginPage}>
          <TouchableOpacity onPress={() => setScreen('landing')}><Text style={styles.back}>‹ Back</Text></TouchableOpacity>
          <Text style={styles.loginTitle}>Welcome to VisionGuide</Text>
          <Text style={styles.description}>Sign in or create your account. New users will choose their preferred language and scan purpose next.</Text>
          <View style={styles.loginActions}>
            <PrimaryButton label="Continue with Google" onPress={() => setScreen('home')} />
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen('home')}>
              <Text style={styles.secondaryButtonText}>Continue with phone OTP</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.helper}>Firebase authentication wiring follows this UI milestone.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <ScrollView contentContainerStyle={styles.home}>
        <View style={styles.homeHeader}>
          <View><Text style={styles.brand}>Vision<Text style={styles.brandBlue}>Guide</Text></Text><Text style={styles.welcome}>What would you like to read?</Text></View>
          <View style={styles.freePill}><Text style={styles.freePillText}>FREE</Text></View>
        </View>
        <View style={styles.languageRow}>
          <View><Text style={styles.smallLabel}>HEAR IN</Text><Text style={styles.languageText}>{language}</Text></View>
          <TouchableOpacity style={styles.changeButton} onPress={() => setLanguage(language === 'English' ? 'Hindi' : 'English')}><Text style={styles.changeText}>Change</Text></TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Your quick scan</Text>
        <TouchableOpacity style={styles.primaryCard}>
          <Text style={styles.cardIcon}>◎</Text><View style={styles.cardBody}><Text style={styles.primaryCardTitle}>Scan Anything</Text><Text style={styles.primaryCardDescription}>Point your camera at any printed text and hear it clearly.</Text></View><Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <View style={styles.allowance}><Text style={styles.allowanceText}>2 free scans available today</Text></View>
        <Text style={styles.sectionTitle}>Choose what you're scanning</Text>
        <View style={styles.grid}>
          {SCAN_MODES.filter(mode => mode.id !== 'anything').map(mode => (
            <TouchableOpacity key={mode.id} style={styles.modeCard}>
              <Text style={styles.modeIcon}>{iconFor(mode.id)}</Text>
              <Text style={styles.modeTitle}>{mode.title}</Text>
              <Text style={styles.modeDescription}>{mode.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PrimaryButton({label, onPress}: {label: string; onPress: () => void}) {
  return <TouchableOpacity accessibilityRole="button" style={styles.primaryButton} onPress={onPress}><Text style={styles.primaryButtonText}>{label}</Text></TouchableOpacity>;
}

function iconFor(id: string): string {
  return ({electricity_bill: '⚡', newspaper: '▤', school_book: '▱', notebook: '✎', letter: '✉'} as Record<string, string>)[id] ?? '◎';
}

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: theme.colors.background},
  topBar: {paddingHorizontal: 24, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  brand: {fontSize: 24, fontWeight: '800', color: theme.colors.text},
  brandBlue: {color: theme.colors.primary},
  signIn: {fontSize: 16, fontWeight: '700', color: theme.colors.primary, padding: 10},
  heroArea: {flex: 1, justifyContent: 'center', paddingHorizontal: 28},
  visualCircle: {width: 92, height: 92, borderRadius: 46, backgroundColor: theme.colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 30},
  visualIcon: {fontSize: 48, color: theme.colors.primary, fontWeight: '700'},
  eyebrow: {fontSize: 14, color: theme.colors.primary, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10},
  hero: {fontSize: 36, lineHeight: 43, fontWeight: '800', color: theme.colors.text, marginBottom: 16},
  description: {fontSize: 18, lineHeight: 28, color: theme.colors.textSecondary},
  points: {marginTop: 24, gap: 12},
  point: {fontSize: 16, color: theme.colors.text, fontWeight: '600'},
  bottomArea: {padding: 24, paddingBottom: 28},
  dots: {flexDirection: 'row', gap: 7, justifyContent: 'center', marginBottom: 22},
  dot: {width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.border},
  dotActive: {width: 24, backgroundColor: theme.colors.primary},
  primaryButton: {minHeight: 56, borderRadius: theme.radius.button, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20},
  primaryButtonText: {fontSize: 17, fontWeight: '800', color: '#FFFFFF'},
  secondaryButton: {minHeight: 56, borderRadius: theme.radius.button, borderWidth: 1.5, borderColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginTop: 12},
  secondaryButtonText: {fontSize: 17, fontWeight: '800', color: theme.colors.primary},
  loginPage: {flex: 1, padding: 24, paddingTop: 18},
  back: {fontSize: 17, color: theme.colors.primary, fontWeight: '700', paddingVertical: 10},
  loginTitle: {fontSize: 32, lineHeight: 40, fontWeight: '800', color: theme.colors.text, marginTop: 70, marginBottom: 16},
  loginActions: {marginTop: 40},
  helper: {fontSize: 13, lineHeight: 20, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 24},
  home: {padding: 22, paddingBottom: 48},
  homeHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24},
  welcome: {fontSize: 17, color: theme.colors.textSecondary, marginTop: 5},
  freePill: {backgroundColor: theme.colors.primarySoft, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99},
  freePillText: {fontSize: 12, color: theme.colors.primary, fontWeight: '900'},
  languageRow: {borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.card, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26},
  smallLabel: {fontSize: 11, color: theme.colors.textSecondary, fontWeight: '800', letterSpacing: 1},
  languageText: {fontSize: 19, color: theme.colors.text, fontWeight: '800', marginTop: 3},
  changeButton: {backgroundColor: theme.colors.primarySoft, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12},
  changeText: {color: theme.colors.primary, fontWeight: '800'},
  sectionTitle: {fontSize: 19, fontWeight: '800', color: theme.colors.text, marginBottom: 12},
  primaryCard: {backgroundColor: theme.colors.primary, borderRadius: theme.radius.card, padding: 20, flexDirection: 'row', alignItems: 'center'},
  cardIcon: {fontSize: 35, color: '#FFFFFF', marginRight: 16},
  cardBody: {flex: 1},
  primaryCardTitle: {fontSize: 21, fontWeight: '800', color: '#FFFFFF'},
  primaryCardDescription: {fontSize: 14, lineHeight: 20, color: '#EAF2FF', marginTop: 4},
  arrow: {fontSize: 34, color: '#FFFFFF', marginLeft: 8},
  allowance: {alignSelf: 'flex-start', backgroundColor: theme.colors.primarySoft, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 7, marginTop: 10, marginBottom: 26},
  allowanceText: {fontSize: 13, fontWeight: '700', color: theme.colors.primary},
  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12},
  modeCard: {width: '48%', minHeight: 168, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.card, padding: 16, backgroundColor: theme.colors.surface},
  modeIcon: {fontSize: 27, color: theme.colors.primary, marginBottom: 14},
  modeTitle: {fontSize: 17, lineHeight: 22, fontWeight: '800', color: theme.colors.text},
  modeDescription: {fontSize: 13, lineHeight: 18, color: theme.colors.textSecondary, marginTop: 5},
});
