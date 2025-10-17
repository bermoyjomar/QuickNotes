import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking, Platform } from 'react-native';
import { colors } from '../styles/colors';
import { storageService } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';

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

  const getFileIcon = (mimeType) => {
    if (!mimeType) return 'document-outline';
    
    if (mimeType.startsWith('image/')) return 'image-outline';
    if (mimeType.startsWith('video/')) return 'videocam-outline';
    if (mimeType.startsWith('audio/')) return 'musical-notes-outline';
    if (mimeType.includes('pdf')) return 'document-text-outline';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document-outline';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'grid-outline';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'easel-outline';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed')) return 'archive-outline';
    
    return 'document-outline';
  };

  const openFile = async (file) => {
    try {
      if (!file.uri) {
        Alert.alert('Error', 'File location not found');
        return;
      }

      // For images, show preview option
      if (file.mimeType && file.mimeType.startsWith('image/')) {
        Alert.alert(
          file.name,
          'Choose an action',
          [
            {
              text: 'Open',
              onPress: () => openWithIntent(file)
            },
            {
              text: 'Share',
              onPress: () => shareFile(file)
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
        return;
      }

      // For other files, try to open directly
      openWithIntent(file);

    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert(
        'Cannot Open File',
        'Would you like to share this file instead?',
        [
          {
            text: 'Share',
            onPress: () => shareFile(file)
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    }
  };

  const openWithIntent = async (file) => {
    try {
      if (Platform.OS === 'android') {
        // Directly use the file URI for Android
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: file.uri,
          flags: 1,
          type: file.mimeType || '*/*'
        });
      } else {
        // For iOS
        const supported = await Linking.canOpenURL(file.uri);
        if (supported) {
          await Linking.openURL(file.uri);
        } else {
          throw new Error('Cannot open this file type');
        }
      }
    } catch (error) {
      console.error('Error with intent:', error);
      // Fallback to sharing
      shareFile(file);
    }
  };

  const shareFile = async (file) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      await Sharing.shareAsync(file.uri, {
        mimeType: file.mimeType || '*/*',
        dialogTitle: `Share ${file.name}`
      });
    } catch (error) {
      console.error('Error sharing file:', error);
      Alert.alert('Error', 'Failed to share file');
    }
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
              <TouchableOpacity
                key={file.id}
                style={styles.fileChip}
                onPress={() => openFile(file)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={getFileIcon(file.mimeType)} 
                  size={20} 
                  color={colors.primary} 
                />
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                  <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
                </View>
                <Ionicons name="open-outline" size={16} color={colors.textTertiary} />
              </TouchableOpacity>
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
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    maxWidth: 180,
  },
  fileInfo: {
    marginLeft: 6,
    marginRight: 6,
    flex: 1,
  },
  fileName: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  fileSize: {
    color: colors.textTertiary,
    fontSize: 10,
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