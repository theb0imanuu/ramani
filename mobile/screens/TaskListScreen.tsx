import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import api from '../services/api';
import styled from 'styled-components/native';
import TaskCard from '../components/TaskCard';

interface Task {
  ID: number;
  title: string;
  description: string;
  status: string;
}

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const EmptyText = styled.Text`
  text-align: center;
  margin-top: 50px;
  font-size: 16px;
  color: #888;
`;

const TaskListScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks'); // Assuming API returns tasks for the logged-in user
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <Container>
        <EmptyText>Loading tasks...</EmptyText>
      </Container>
    );
  }

  return (
    <Container>
      {tasks.length === 0 ? (
        <EmptyText>No tasks assigned to you.</EmptyText>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.ID.toString()}
          renderItem={({ item }) => <TaskCard task={item} />}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </Container>
  );
};

export default TaskListScreen;
