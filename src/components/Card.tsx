import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Icon, IconName } from './Icon';

interface CardProps {
  title: string;
  icon: IconName;
  // `children` is whatever you put BETWEEN <Card> and </Card>.
  children: ReactNode;
}

// A see-through rounded box with a small icon + title on top.
export function Card({ title, icon, children }: CardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Icon name={icon} size={13} color="rgba(255, 255, 255, 0.8)" />
        <Text style={styles.title}>{title.toUpperCase()}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
