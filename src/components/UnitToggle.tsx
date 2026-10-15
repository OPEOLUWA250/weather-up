import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Unit } from '../types';

const UNITS: Unit[] = ['C', 'F'];

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

// A two-option switch: °C | °F
export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <View style={styles.toggle}>
      {UNITS.map((option) => {
        const selected = option === unit;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            accessibilityLabel={option === 'C' ? 'Show Celsius' : 'Show Fahrenheit'}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
              °{option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  option: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 13,
  },
  optionSelected: {
    backgroundColor: '#fff',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  optionTextSelected: {
    color: '#2C3E50',
  },
});
