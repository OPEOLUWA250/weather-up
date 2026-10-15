import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Icon, IconName } from '../components/Icon';
import { LANGUAGE_NAMES } from '../i18n';
import { alertsAvailable, requestAlertPermission, sendTestAlert } from '../notifications';
import { useSettings } from '../settings';
import { Language, Unit, VoiceSpeed } from '../types';

const BLUE = '#4A90E2';
const DARK = '#2C3E50';

// --- Small building blocks for this screen ------------------------------------------

function Section({ title, icon, children }: { title: string; icon: IconName; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name={icon} size={14} color={BLUE} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

interface Option<T> {
  value: T;
  label: string;
}

// A row of buttons where exactly one is selected.
// `<T extends string>` makes it work with any of our string types (Unit, VoiceSpeed...).
function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, selected && styles.segmentSelected]}
          >
            <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const UNIT_OPTIONS: Option<Unit>[] = [
  { value: 'C', label: 'Celsius °C' },
  { value: 'F', label: 'Fahrenheit °F' },
];

const SPEED_OPTIONS: Option<VoiceSpeed>[] = [
  { value: 'slow', label: 'Slow' },
  { value: 'normal', label: 'Normal' },
  { value: 'fast', label: 'Fast' },
];

// Object.keys gives the keys as plain strings, so we tell TypeScript they're Languages.
const LANGUAGES = Object.keys(LANGUAGE_NAMES) as Language[];

// --- The screen -----------------------------------------------------------------------

export default function SettingsScreen() {
  const {
    unit,
    setUnit,
    language,
    setLanguage,
    voiceSpeed,
    setVoiceSpeed,
    morningAlert,
    setMorningAlert,
  } = useSettings();

  function showBlockedMessage() {
    Alert.alert(
      'Notifications are blocked',
      'To get morning alerts, allow notifications for this app in your phone settings.',
    );
  }

  async function handleAlertChange(on: boolean) {
    if (!on) {
      setMorningAlert(false);
      return;
    }
    // Turning it ON: we need permission first.
    const allowed = await requestAlertPermission();
    if (allowed) {
      setMorningAlert(true);
    } else {
      showBlockedMessage();
    }
  }

  async function handleTestAlert() {
    const allowed = await requestAlertPermission();
    if (allowed) {
      await sendTestAlert(language);
    } else {
      showBlockedMessage();
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Section title="Temperature" icon="temperature-half">
        <Segmented options={UNIT_OPTIONS} value={unit} onChange={setUnit} />
      </Section>

      <Section title="Plain-words language" icon="language">
        {LANGUAGES.map((code) => {
          const selected = code === language;
          return (
            <Pressable
              key={code}
              onPress={() => setLanguage(code)}
              style={({ pressed }) => [styles.languageRow, pressed && styles.rowPressed]}
            >
              <Text style={[styles.languageText, selected && styles.languageTextSelected]}>
                {LANGUAGE_NAMES[code]}
              </Text>
              {selected && <Icon name="circle-check" size={20} color={BLUE} />}
            </Pressable>
          );
        })}
        <Text style={styles.note}>
          Yorùbá, Igbo and Hausa are read aloud with a Nigerian English voice if your phone has no
          voice for them, so the pronunciation may not be perfect.
        </Text>
      </Section>

      <Section title="Read-aloud speed" icon="volume-high">
        <Segmented options={SPEED_OPTIONS} value={voiceSpeed} onChange={setVoiceSpeed} />
      </Section>

      <Section title="Morning alert" icon="bell">
        {alertsAvailable ? (
          <>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Weather alert at 7 AM</Text>
              <Switch
                value={morningAlert}
                onValueChange={handleAlertChange}
                trackColor={{ true: BLUE }}
              />
            </View>
            <Text style={styles.note}>
              Uses the last city you viewed. Alerts are planned 3 days ahead, so open the app every
              few days to keep them coming.
            </Text>
            <Pressable
              onPress={handleTestAlert}
              style={({ pressed }) => [styles.testButton, pressed && styles.rowPressed]}
            >
              <Icon name="paper-plane" size={14} color={BLUE} />
              <Text style={styles.testButtonText}>Send a test alert now</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.note}>
            Notifications aren't available in this version of the app. They will work once the app
            is installed as a full build (APK).
          </Text>
        )}
      </Section>

      <Text style={styles.footer}>Weather data by Open-Meteo.com</Text>
      <StatusBar style="light" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EAF3FC', // A very light blue
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: BLUE,
    textTransform: 'uppercase',
  },
  segmented: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 12,
    backgroundColor: '#EAF3FC',
  },
  segment: {
    flex: 1, // All options share the width equally
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  segmentSelected: {
    backgroundColor: BLUE,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '600',
    color: DARK,
  },
  segmentTextSelected: {
    color: '#fff',
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Name on the left, tick on the right
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DDE6EF',
  },
  rowPressed: {
    opacity: 0.6,
  },
  languageText: {
    fontSize: 16,
    color: DARK,
  },
  languageTextSelected: {
    fontWeight: '700',
    color: BLUE,
  },
  note: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7C8F',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
    color: DARK,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#EAF3FC',
  },
  testButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: BLUE,
  },
  footer: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 13,
    color: '#6B7C8F',
  },
});
