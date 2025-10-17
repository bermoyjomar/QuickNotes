import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

const ActiveFilters = ({ 
  searchQuery, 
  selectedCategory, 
  onClearSearch, 
  onClearCategory, 
  onClearAll 
}) => {
  const getCategoryColor = (category) => {
    const colorsMap = {
      'Personal': '#10B981',
      'Work': '#6366F1',
      'Ideas': '#F59E0B',
      'Tasks': '#EF4444',
      'Important': '#DC2626',
    };
    return colorsMap[category] || colors.primary;
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'All';

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <View style={styles.activeFiltersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {searchQuery && (
          <View style={styles.activeFilterChip}>
            <Text style={styles.activeFilterText}>Search: "{searchQuery}"</Text>
            <TouchableOpacity onPress={onClearSearch}>
              <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        )}
        {selectedCategory !== 'All' && (
          <View style={styles.activeFilterChip}>
            <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(selectedCategory) }]} />
            <Text style={styles.activeFilterText}>{selectedCategory}</Text>
            <TouchableOpacity onPress={onClearCategory}>
              <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.clearAllFilters} onPress={onClearAll}>
          <Text style={styles.clearAllFiltersText}>Clear All</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  activeFiltersContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 6,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  clearAllFilters: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.danger + '20',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  clearAllFiltersText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ActiveFilters;