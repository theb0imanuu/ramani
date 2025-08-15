import React from 'react';
import styled from 'styled-components/native';

interface Incident {
  ID: number;
  description: string;
  ImageURL: string;
  status: string;
}

interface IncidentCardProps {
  incident: Incident;
}

const Card = styled.View`
  background-color: white;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
  elevation: 3;
`;

const CardImage = styled.Image`
  width: 100%;
  height: 180px;
`;

const CardContent = styled.View`
  padding: 15px;
`;

const Description = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Status = styled.Text`
  font-size: 14px;
  color: #555;
`;

const IncidentCard = ({ incident }: IncidentCardProps) => {
  // A placeholder image if the URL is invalid or missing
  const imageUrl = incident.ImageURL ? `http://localhost:8080${incident.ImageURL}` : 'https://via.placeholder.com/400x300.png?text=No+Image';

  return (
    <Card>
      <CardImage source={{ uri: imageUrl }} />
      <CardContent>
        <Description>{incident.description}</Description>
        <Status>Status: {incident.status}</Status>
      </CardContent>
    </Card>
  );
};

export default IncidentCard;
