//App.js
import React from 'react';
import { StatusBar } from 'react-native';
import HomeScreen from './HomeScreen';
import { colors } from './colors';
import ActiveFilters from './ActiveFilters';
import EmptyState from './EmptyState';
import FiltersModal from './FiltersModal';
import Header from './Header';
import NoteCard from './NoteCard';
import NoteInput from './NoteInput';
import SearchBar from './SearchBar';

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