import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = ['All', 'Personal', 'Work', 'Ideas', 'Tasks', 'Important'];

const FiltersModal = ({ 
  visible, 
  selectedCategory, 
  onCategorySelect, 
  onClearFilters, 
  onClose 
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filter Notes</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Category</Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryFilterChip,
                  selectedCategory === category && styles.categoryFilterChipSelected,
                  { borderColor: getCategoryColor(category) }
                ]}
                onPress={() => onCategorySelect(category)}
              >
                <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(category) }]} />
                <Text style={[
                  styles.categoryFilterText,
                  selectedCategory === category && styles.categoryFilterTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.clearFiltersButton} onPress={onClearFilters}>
            <Text style={styles.clearFiltersText}>Clear Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyFiltersButton} onPress={onClose}>
            <Text style={styles.applyFiltersText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  filterSection: {
    marginBottom: 30,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    minWidth: 100,
  },
  categoryFilterChipSelected: {
    backgroundColor: colors.primary + '20',
  },
  categoryFilterText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  categoryFilterTextSelected: {
    color: colors.primary,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
  },
  clearFiltersButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.border,
  },
  clearFiltersText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  applyFiltersButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  applyFiltersText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FiltersModal;