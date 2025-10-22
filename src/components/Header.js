import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';

const Header = ({ noteCount, onClearAll }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.icon}>✨</Text>
          <Text style={styles.title}>Quick Notes</Text>
        </View>
        {noteCount > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={onClearAll}
          >
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statBadge}>
          <Text style={styles.statNumber}>{noteCount}</Text>
          <Text style={styles.statLabel}>notes</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default Header;
