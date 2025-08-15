import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Image, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

const PRIMARY_COLOR = '#0e2944';

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;

const Input = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  min-height: 100px;
`;

const ImagePreview = styled.Image`
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
  border-radius: 5px;
  background-color: #eee;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const ReportIncidentScreen = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
          Alert.alert('Permissions required', 'Sorry, we need camera and gallery permissions to make this work!');
        }
      }
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        Alert.alert('Permission required', 'Permission to access location was denied');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
        setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!description || !image || !location) {
      Alert.alert('Incomplete form', 'Please fill out the description and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('latitude', String(location.coords.latitude));
    formData.append('longitude', String(location.coords.longitude));

    // Append file
    const uriParts = image.uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    formData.append('image', {
      uri: image.uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    try {
      await api.post('/incidents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Success', 'Incident reported successfully.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to report incident.');
    }
  };

  return (
    <Container>
      <Input
        placeholder="Describe the incident..."
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <ButtonsContainer>
        <Button title="Pick an image from gallery" onPress={pickImage} color={PRIMARY_COLOR} />
        <Button title="Take a photo" onPress={takePhoto} color={PRIMARY_COLOR} />
      </ButtonsContainer>
      {image && <ImagePreview source={{ uri: image.uri }} />}
      <Button title="Submit Incident" onPress={handleSubmit} color={PRIMARY_COLOR} />
    </Container>
  );
};

export default ReportIncidentScreen;
