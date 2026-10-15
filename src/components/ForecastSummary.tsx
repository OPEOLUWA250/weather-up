import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getNigerianVoice } from '../speech';
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
  const [speaking, setSpeaking] = useState(false);
  // undefined = still looking, null = no Nigerian voice on this phone
  const [voice, setVoice] = useState<Speech.Voice | null | undefined>(undefined);
  const sentences = summarizeWeather(weather, unit);

  useEffect(() => {
    getNigerianVoice().then(setVoice);
  }, []);

  // Stop talking when the forecast changes (e.g. a new city) or this card
  // disappears. A function returned from useEffect is a "cleanup" function.
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, [weather, unit]);

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
        voice: voice?.identifier, // The Nigerian voice, if the phone has one
        rate: 0.95, // Slightly slower than normal, easier to follow
        onDone: isLast ? () => setSpeaking(false) : undefined,
        onStopped: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    });
  }

  return (
    <Card title="In plain words" icon="comment-dots">
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
          <Text style={styles.buttonText}>{speaking ? 'Stop' : 'Read aloud'}</Text>
        </Pressable>

        {voice === null && (
          <Text style={styles.voiceHint}>
            No Nigerian voice found, so a standard English voice is used. To add one, open your
            phone's Settings, search for "Text-to-speech", choose Google as the engine, then
            install the "English (Nigeria)" voice and restart the app.
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
    color: 'rgba(255, 255, 255, 0.75)',
  },
});
