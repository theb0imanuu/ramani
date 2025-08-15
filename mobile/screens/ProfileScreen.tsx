import React, { useEffect, useState } from 'react';
import { View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
// A library to decode JWTs. In a real app, you'd add this to package.json
import { jwtDecode } from 'jwt-decode';
import "core-js/stable/atob"; // Polyfill for atob

const PRIMARY_COLOR = '#0e2944';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
`;

const ProfileText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
`;

const LogoutButton = styled.TouchableOpacity`
  background-color: #d9534f;
  padding: 15px 40px;
  border-radius: 8px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const getUsernameFromToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        try {
          const decodedToken: { username: string } = jwtDecode(token);
          setUsername(decodedToken.username);
        } catch (e) {
          console.error("Failed to decode token", e);
        }
      }
    };
    getUsernameFromToken();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    // @ts-ignore
    navigation.navigate('Login');
  };

  return (
    <Container>
      <ProfileText>Welcome, {username || 'User'}!</ProfileText>
      <LogoutButton onPress={handleLogout}>
        <ButtonText>Logout</ButtonText>
      </LogoutButton>
    </Container>
  );
};

export default ProfileScreen;
