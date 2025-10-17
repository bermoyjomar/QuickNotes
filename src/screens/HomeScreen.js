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
import NoteInput from '../components/NoteInput';
import NoteCard from '../components/NoteCard';
import EmptyState from '../components/EmptyState';

const HomeScreen = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const savedNotes = await storageService.getNotes();
    setNotes(savedNotes);
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
    setEditingId(null);
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
        noteCount={notes.length}
        onClearAll={clearAllNotes}
      />
      
      <NoteInput
        title={title}
        content={content}
        attachments={attachments}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onAttachmentsChange={setAttachments}
        onSubmit={editingId ? updateNote : saveNote}
        onCancel={resetForm}
        isEditing={!!editingId}
      />

      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 20,
    flexGrow: 1,
  },
});

export default HomeScreen;