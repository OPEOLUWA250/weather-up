import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PHRASES } from '../i18n';
import { useSettings } from '../settings';
import { findVoice, SPEECH_RATE } from '../speech';
import { summarizeWeather } from '../summary';
import { Unit, Weather } from '../types';
import { Card } from './Card';
import { Icon } from './Icon';

interface ForecastSummaryProps {
  weather: Weather;
  unit: Unit;
}

// Explains the forecast in simple sentences, and can read them aloud
// for people who can't read the screen.
export function ForecastSummary({ weather, unit }: ForecastSummaryProps) {
  // Language and voice speed come from Settings, via React Context.
  const { language, voiceSpeed } = useSettings();
  const say = PHRASES[language];
  const sentences = summarizeWeather(weather, unit, language);

  const [speaking, setSpeaking] = useState(false);
  // undefined = still looking, null = no suitable voice on this phone
  const [voice, setVoice] = useState<Speech.Voice | null | undefined>(undefined);

  // Find the best voice whenever the language changes.
  useEffect(() => {
    findVoice(language)
      .then(setVoice)
      .catch((error) => {
        console.warn('Could not choose a voice:', error);
        setVoice(null); // Fall back to the phone's default voice
      });
  }, [language]);

  // Stop talking when the forecast or language changes, or this card
  // disappears. A function returned from useEffect is a "cleanup" function.
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, [weather, unit, language]);

  function handleReadAloud() {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);

    // Speak one sentence at a time. The phone queues them up, and the first
    // one starts sooner than if it had to prepare the whole paragraph.
    sentences.forEach((sentence, index) => {
      const isLast = index === sentences.length - 1;
      // Voices don't say "°" well, so we swap it for the word "degrees".
      Speech.speak(sentence.replace(/°/g, ' degrees'), {
        language: 'en',
        voice: voice?.identifier, // The best voice found for this language
        rate: SPEECH_RATE[voiceSpeed],
        onDone: isLast ? () => setSpeaking(false) : undefined,
        onStopped: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    });
  }

  return (
    <Card title={say.cardTitle} icon="comment-dots">
      <View style={styles.body}>
        {/* The list never changes order, so the index is fine as a key here */}
        {sentences.map((sentence, index) => (
          <Text key={index} style={styles.sentence}>
            {sentence}
          </Text>
        ))}

        <Pressable
          onPress={handleReadAloud}
          accessibilityLabel={speaking ? 'Stop reading' : 'Read the forecast aloud'}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Icon name={speaking ? 'stop' : 'volume-high'} size={16} color="#2C3E50" />
          <Text style={styles.buttonText}>{speaking ? say.stop : say.readAloud}</Text>
        </Pressable>

        {voice === null && (
          <Text style={styles.voiceHint}>
            No Nigerian voice found, so a standard voice is used. To add one, open your phone's
            Settings, search for "Text-to-speech", choose Google as the engine, then install the
            "English (Nigeria)" voice and restart the app.
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16,
  },
  sentence: {
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 23,
    color: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', // Only as wide as its content
    marginTop: 4,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#fff',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  voiceHint: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
