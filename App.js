import React from 'react';
import { StatusBar } from 'react-native';
import Header from './Header';
import SearchBar from './SearchBar';
import ActiveFilters from './ActiveFilters';
import FiltersModal from './FiltersModal';
import NoteInput from './NoteInput';
import NoteCard from './NoteCard';
import EmptyState from './EmptyState';
import { storageService } from './storage';
import { colors } from './colors';
import HomeScreen from './HomeScreen';

export default function App() {
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={colors.background}
      />
      <HomeScreen />
    </>
  );
}