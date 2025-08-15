import React from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const PRIMARY_COLOR = '#0e2944';

const HeaderContainer = styled.View`
  height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${PRIMARY_COLOR};
  padding: 0 15px;
`;

const Title = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

const Placeholder = styled.View`
    width: 30px;
`;

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header = ({ title, showBackButton = false }: HeaderProps) => {
  const navigation = useNavigation();

  return (
    <HeaderContainer>
      {showBackButton ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* You can use an Icon here */}
          <Title>‹</Title>
        </TouchableOpacity>
      ) : <Placeholder />}
      <Title>{title}</Title>
      <Placeholder />
    </HeaderContainer>
  );
};

export default Header;
