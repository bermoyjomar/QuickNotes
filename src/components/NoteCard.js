import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors } from '../styles/colors';
import { storageService } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleTextToSpeech = async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${note.title}. ${note.content}`;
    
    setIsSpeaking(true);
    Speech.speak(textToSpeak, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => {
        setIsSpeaking(false);
        Alert.alert('Error', 'Failed to read note');
      },
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.content}
        onPress={() => onEdit(note)}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {note.title}
          </Text>
          <View style={styles.colorDot} />
        </View>
        
        <Text style={styles.noteContent} numberOfLines={3}>
          {note.content}
        </Text>

        {/* Attachments */}
        {note.attachments && note.attachments.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.attachmentsContainer}>
            {note.attachments.map((file) => (
              <View key={file.id} style={styles.fileChip}>
                <Ionicons name="document-attach" size={14} color={colors.primary} />
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                  <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
        
        <View style={styles.footer}>
          <View style={styles.timeContainer}>
            <Text style={styles.date}>
              {storageService.formatDate(note.timestamp)}
            </Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.time}>
              {storageService.formatTime(note.timestamp)}
            </Text>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleTextToSpeech}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={isSpeaking ? "stop-circle" : "volume-high"} 
                size={20} 
                color={isSpeaking ? colors.accent : colors.textSecondary} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(note.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: -0.3,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  noteContent: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 6,
    marginRight: 8,
    maxWidth: 150,
  },
  fileInfo: {
    marginLeft: 4,
    flex: 1,
  },
  fileName: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  fileSize: {
    color: colors.textTertiary,
    fontSize: 9,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontSize: 13,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  separator: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  time: {
    fontSize: 13,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  deleteIcon: {
    fontSize: 16,
  },
});

export default NoteCard;