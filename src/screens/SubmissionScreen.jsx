import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function SubmissionScreen({ route, navigation }) {
  const { contest } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to make this work!'
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Choose Image Source',
      'Select how you want to add an image',
      [
        {
          text: 'Camera',
          onPress: takePhoto,
        },
        {
          text: 'Photo Library',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your submission');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description for your submission');
      return false;
    }
    if (!selectedImage) {
      Alert.alert('Error', 'Please add an image to your submission');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate submission process
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Submission Successful!',
        'Your entry has been submitted successfully. Good luck!',
        [
          {
            text: 'View Results',
            onPress: () => navigation.navigate('Results', { contest }),
          },
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Submit Your Entry</Text>
          <Text style={styles.headerSubtitle}>
            Share your creativity for "{contest.title}"
          </Text>
        </View>

        <View style={styles.contestInfo}>
          <Image source={{ uri: contest.image }} style={styles.contestImage} />
          <View style={styles.contestDetails}>
            <Text style={styles.contestTitle}>{contest.title}</Text>
            <Text style={styles.contestCategory}>{contest.category}</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Entry Details</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Title *</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Give your entry a catchy title"
              maxLength={100}
            />
            <Text style={styles.characterCount}>{title.length}/100</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description *</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your entry, inspiration, or creative process..."
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{description.length}/500</Text>
          </View>
        </View>

        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Entry Image *</Text>
          
          {selectedImage ? (
            <View style={styles.selectedImageContainer}>
              <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
              <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.imagePickerButton} onPress={showImagePickerOptions}>
              <Ionicons name="camera-outline" size={48} color="#6366f1" />
              <Text style={styles.imagePickerText}>Add Image</Text>
              <Text style={styles.imagePickerSubtext}>
                Tap to choose from camera or photo library
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.guidelinesSection}>
          <Text style={styles.sectionTitle}>Submission Guidelines</Text>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.guidelineText}>
              Image should be high quality (minimum 1200x800 pixels)
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.guidelineText}>
              Supported formats: JPEG, PNG, GIF
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.guidelineText}>
              Maximum file size: 10MB
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.guidelineText}>
              Original work only - no copyrighted material
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.submittingContainer}>
              <Text style={styles.submittingText}>Submitting...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.submitButtonText}>Submit Entry</Text>
              <Ionicons name="paper-plane" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.termsNote}>
          <Text style={styles.termsText}>
            By submitting, you agree to our terms and confirm this is your original work.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  contestInfo: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
    alignItems: 'center',
  },
  contestImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  contestDetails: {
    flex: 1,
  },
  contestTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  contestCategory: {
    fontSize: 14,
    color: '#64748b',
  },
  formSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 100,
  },
  characterCount: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 4,
  },
  imageSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  imagePickerButton: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  imagePickerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366f1',
    marginTop: 12,
    marginBottom: 4,
  },
  imagePickerSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  selectedImageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  guidelinesSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 24,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  guidelineText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 18,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  submittingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submittingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  termsNote: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});
