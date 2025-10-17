import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ searchQuery, onSearchChange, onToggleFilters }) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onToggleFilters}>
            <Ionicons name="filter" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    paddingVertical: 12,
  },
});

export default SearchBar;