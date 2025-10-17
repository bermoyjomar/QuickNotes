import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

const EmptyState = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📝</Text>
      <Text style={styles.title}>No notes yet</Text>
      <Text style={styles.subtitle}>
        Create your first note above to get started
      </Text>
      <View style={styles.tipsContainer}>
        <View style={styles.tip}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>Tap a note to edit it</Text>
        </View>
        <View style={styles.tip}>
          <Text style={styles.tipIcon}>🗑️</Text>
          <Text style={styles.tipText}>Swipe or tap trash to delete</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
    opacity: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  tipsContainer: {
    gap: 12,
    alignSelf: 'stretch',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default EmptyState;