import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors } from '../styles/colors';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

const NoteInput = ({ 
  title, 
  content, 
  attachments = [],
  onTitleChange, 
  onContentChange,
  onAttachmentsChange,
  onSubmit, 
  onCancel,
  isEditing 
}) => {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const newAttachment = {
          id: Date.now().toString(),
          name: file.name,
          uri: file.uri,
          size: file.size,
          mimeType: file.mimeType,
        };
        onAttachmentsChange([...attachments, newAttachment]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const removeAttachment = (id) => {
    onAttachmentsChange(attachments.filter(att => att.id !== id));
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.titleInput}
          placeholder="Give your note a title..."
          placeholderTextColor={colors.textTertiary}
          value={title}
          onChangeText={onTitleChange}
          maxLength={50}
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Write something amazing..."
          placeholderTextColor={colors.textTertiary}
          value={content}
          onChangeText={onContentChange}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Attachments Display */}
        {attachments.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.attachmentsContainer}>
            {attachments.map((file) => (
              <View key={file.id} style={styles.fileChip}>
                <Ionicons name="document-attach" size={16} color={colors.primary} />
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                  <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
                </View>
                <TouchableOpacity onPress={() => removeAttachment(file.id)}>
                  <Ionicons name="close-circle" size={20} color={colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={pickDocument}
          activeOpacity={0.7}
        >
          <Ionicons name="attach" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>✕ Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.button, 
            isEditing ? styles.updateButton : styles.addButton,
            styles.primaryButton
          ]}
          onPress={onSubmit}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {isEditing ? '✓ Update Note' : '+ Add Note'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  inputContainer: {
    gap: 12,
  },
  titleInput: {
    backgroundColor: colors.surfaceLight,
    color: colors.textPrimary,
    padding: 16,
    borderRadius: 12,
    fontSize: 17,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: colors.border,
  },
  contentInput: {
    backgroundColor: colors.surfaceLight,
    color: colors.textPrimary,
    padding: 16,
    borderRadius: 12,
    fontSize: 15,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    maxWidth: 200,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  attachButton: {
    width: 50,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  primaryButton: {
    borderWidth: 0,
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  updateButton: {
    backgroundColor: colors.accent,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
    borderWidth: 2,
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default NoteInput;