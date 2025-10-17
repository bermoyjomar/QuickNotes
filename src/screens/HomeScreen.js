import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors } from '../styles/colors';
import { storageService } from '../utils/storage';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ActiveFilters from '../components/ActiveFilters';
import FiltersModal from '../components/FiltersModal';
import NoteInput from '../components/NoteInput';
import NoteCard from '../components/NoteCard';
import EmptyState from '../components/EmptyState';

const HomeScreen = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [category, setCategory] = useState('Personal');
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, searchQuery, selectedCategory]);

  const loadNotes = async () => {
    const savedNotes = await storageService.getNotes();
    setNotes(savedNotes);
  };

  const filterNotes = () => {
    let filtered = notes;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNotes(filtered);
  };

  const saveNote = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty Note', 'Please add a title or content');
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      attachments: attachments,
      category: category,
      timestamp: new Date().toISOString(),
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    await storageService.saveNotes(updatedNotes);
    resetForm();
  };

  const updateNote = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty Note', 'Please add a title or content');
      return;
    }

    const updatedNotes = notes.map(note =>
      note.id === editingId
        ? {
            ...note,
            title: title.trim() || 'Untitled Note',
            content: content.trim(),
            attachments: attachments,
            category: category,
            timestamp: new Date().toISOString(),
          }
        : note
    );

    setNotes(updatedNotes);
    await storageService.saveNotes(updatedNotes);
    resetForm();
  };

  const deleteNote = (id) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedNotes = notes.filter(note => note.id !== id);
            setNotes(updatedNotes);
            await storageService.saveNotes(updatedNotes);
            if (editingId === id) {
              resetForm();
            }
          },
        },
      ]
    );
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setAttachments(note.attachments || []);
    setCategory(note.category || 'Personal');
    setEditingId(note.id);
  };

  const clearAllNotes = () => {
    Alert.alert(
      'Clear All Notes',
      'This will delete all your notes. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setNotes([]);
            await storageService.clearAllNotes();
            resetForm();
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setAttachments([]);
    setCategory('Personal');
    setEditingId(null);
  };

  // Search and Filter handlers
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setShowFilters(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearCategory = () => {
    setSelectedCategory('All');
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const renderNote = ({ item }) => (
    <NoteCard
      note={item}
      onEdit={editNote}
      onDelete={deleteNote}
    />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <Header 
        noteCount={filteredNotes.length}
        onClearAll={clearAllNotes}
      />
      
      {/* Search Section */}
      <View style={styles.searchSection}>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onToggleFilters={() => setShowFilters(true)}
        />
      </View>

      <NoteInput
        title={title}
        content={content}
        attachments={attachments}
        category={category}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onAttachmentsChange={setAttachments}
        onCategoryChange={setCategory}
        onSubmit={editingId ? updateNote : saveNote}
        onCancel={resetForm}
        isEditing={!!editingId}
      />

      {/* Active Filters */}
      <ActiveFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onClearSearch={clearSearch}
        onClearCategory={clearCategory}
        onClearAll={clearAllFilters}
      />

      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />

      {/* Filters Modal */}
      <FiltersModal
        visible={showFilters}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategoryFilter}
        onClearFilters={clearAllFilters}
        onClose={() => setShowFilters(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listContent: {
    padding: 20,
    flexGrow: 1,
  },
});

export default HomeScreen;