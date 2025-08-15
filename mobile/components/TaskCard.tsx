import React from 'react';
import styled from 'styled-components/native';

interface Task {
  ID: number;
  title: string;
  description: string;
  status: string;
}

interface TaskCardProps {
  task: Task;
}

const Card = styled.View`
  background-color: white;
  padding: 16px;
  margin-bottom: 10px;
  border-radius: 8px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  elevation: 3;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Description = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const StatusContainer = styled.View`
  align-self: flex-start;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${props => props.status === 'completed' ? '#d4edda' : '#fff3cd'};
`;

const StatusText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.status === 'completed' ? '#155724' : '#856404'};
`;


const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <Card>
      <Title>{task.title}</Title>
      <Description>{task.description}</Description>
      <StatusContainer status={task.status}>
        <StatusText status={task.status}>{task.status.toUpperCase()}</StatusText>
      </StatusContainer>
    </Card>
  );
};

export default TaskCard;
