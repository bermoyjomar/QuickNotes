import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors } from './colors';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = ['All', 'Personal', 'Work', 'Ideas', 'Tasks', 'Important'];

const NoteInput = ({ 
  title, 
  content, 
  attachments = [],
  category = 'Personal',
  onTitleChange, 
  onContentChange,
  onAttachmentsChange,
  onCategoryChange,
  onSubmit, 
  onCancel,
  isEditing 
}) => {
  const [showCategories, setShowCategories] = useState(false);

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

  const selectCategory = (selectedCategory) => {
    onCategoryChange(selectedCategory);
    setShowCategories(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {/* Category Selector */}
        <TouchableOpacity 
          style={styles.categorySelector}
          onPress={() => setShowCategories(!showCategories)}
          activeOpacity={0.7}
        >
          <View style={styles.categorySelected}>
            <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(category) }]} />
            <Text style={styles.categorySelectedText}>{category}</Text>
            <Ionicons 
              name={showCategories ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={colors.textTertiary} 
            />
          </View>
        </TouchableOpacity>

        {/* Categories Dropdown */}
        {showCategories && (
          <View style={styles.categoriesDropdown}>
            {CATEGORIES.filter(cat => cat !== 'All').map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryOption,
                  category === cat && styles.categoryOptionSelected
                ]}
                onPress={() => selectCategory(cat)}
              >
                <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(cat) }]} />
                <Text style={[
                  styles.categoryOptionText,
                  category === cat && styles.categoryOptionTextSelected
                ]}>
                  {cat}
                </Text>
                {category === cat && (
                  <Ionicons name="checkmark" size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

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
      </Vie
