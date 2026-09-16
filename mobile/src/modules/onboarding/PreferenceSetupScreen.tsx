import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SCAN_MODES, ScanModeId} from '../scan/scanModes';
import {theme} from '../../theme/theme';

const LANGUAGES = [
  {tag: 'en-IN', label: 'English'},
  {tag: 'hi-IN', label: 'हिन्दी'},
  {tag: 'bn-IN', label: 'বাংলা'},
  {tag: 'mr-IN', label: 'मराठी'},
  {tag: 'ta-IN', label: 'தமிழ்'},
  {tag: 'te-IN', label: 'తెలుగు'},
] as const;

export interface PreferenceSetupValue {
  defaultListeningLanguage: string;
  defaultScanMode: ScanModeId;
}

export function PreferenceSetupScreen({onComplete}: {onComplete: (value: PreferenceSetupValue) => void}) {
  const [language, setLanguage] = useState('en-IN');
  const [mode, setMode] = useState<ScanModeId>('anything');

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.step}>ONE-TIME SETUP</Text>
      <Text style={styles.title}>Make VisionGuide yours</Text>
      <Text style={styles.body}>Choose how you usually want VisionGuide to read. You can change either option whenever you need.</Text>

      <Text style={styles.heading}>I want to hear in</Text>
      <View style={styles.wrap}>
        {LANGUAGES.map(item => (
          <TouchableOpacity key={item.tag} style={[styles.choice, language === item.tag && styles.selected]} onPress={() => setLanguage(item.tag)}>
            <Text style={[styles.choiceText, language === item.tag && styles.selectedText]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.heading}>My usual scan</Text>
      <View style={styles.modeList}>
        {SCAN_MODES.map(item => (
          <TouchableOpacity key={item.id} style={[styles.mode, mode === item.id && styles.modeSelected]} onPress={() => setMode(item.id)}>
            <View style={styles.radio}>{mode === item.id && <View style={styles.radioInner} />}</View>
            <View style={styles.modeCopy}><Text style={styles.modeTitle}>{item.title}</Text><Text style={styles.modeBody}>{item.description}</Text></View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={() => onComplete({defaultListeningLanguage: language, defaultScanMode: mode})}>
        <Text style={styles.continueText}>Continue to VisionGuide</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: theme.colors.background},
  content: {padding: 24, paddingBottom: 44},
  step: {marginTop: 18, fontSize: 12, fontWeight: '900', letterSpacing: 1.2, color: theme.colors.primary},
  title: {fontSize: 31, lineHeight: 38, fontWeight: '800', color: theme.colors.text, marginTop: 8},
  body: {fontSize: 16, lineHeight: 25, color: theme.colors.textSecondary, marginTop: 12},
  heading: {fontSize: 19, fontWeight: '800', color: theme.colors.text, marginTop: 30, marginBottom: 12},
  wrap: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  choice: {borderWidth: 1, borderColor: theme.colors.border, borderRadius: 14, paddingHorizontal: 17, paddingVertical: 13},
  selected: {borderColor: theme.colors.primary, backgroundColor: theme.colors.primarySoft},
  choiceText: {fontSize: 16, fontWeight: '700', color: theme.colors.text},
  selectedText: {color: theme.colors.primary},
  modeList: {gap: 10},
  mode: {borderWidth: 1, borderColor: theme.colors.border, borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'center'},
  modeSelected: {borderColor: theme.colors.primary, backgroundColor: theme.colors.primarySoft},
  radio: {width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 13},
  radioInner: {width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.primary},
  modeCopy: {flex: 1},
  modeTitle: {fontSize: 16, fontWeight: '800', color: theme.colors.text},
  modeBody: {fontSize: 13, lineHeight: 18, color: theme.colors.textSecondary, marginTop: 3},
  continueButton: {height: 58, borderRadius: 14, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 32},
  continueText: {fontSize: 17, fontWeight: '800', color: '#FFFFFF'},
});
