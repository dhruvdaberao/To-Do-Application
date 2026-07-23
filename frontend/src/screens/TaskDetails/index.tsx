import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, Card, Title, Paragraph, ActivityIndicator, Dialog, Portal, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTaskById, deleteTask, toggleTask } from '../../redux/slices/taskSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { ROUTES } from '../../constants';

export const TaskDetailsScreen = ({ route, navigation }: any) => {
  const { taskId } = route.params;
  const { colors } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTask, loading, error } = useSelector((state: RootState) => state.tasks);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchTaskById(taskId));
  }, [dispatch, taskId]);

  const handleDelete = async () => {
    setDialogVisible(false);
    await dispatch(deleteTask(taskId));
    navigation.goBack();
  };

  const getPriorityColor = (priority: string) => {
    if (selectedTask?.completed) return 'grey';
    switch (priority) {
      case 'HIGH': return '#d32f2f';
      case 'MEDIUM': return '#f57c00';
      case 'LOW': return '#388e3c';
      default: return 'grey';
    }
  };

  if (loading && !selectedTask) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error || !selectedTask) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text>Error loading task: {error}</Text>
        <Button onPress={() => navigation.goBack()}>Go Back</Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Task Details" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={[styles.card, { backgroundColor: colors.surfaceVariant }]}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Title style={[styles.title, selectedTask.completed && styles.completedText, { color: colors.onSurfaceVariant }]}>
                {selectedTask.title}
              </Title>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                <Text style={[styles.badge, { backgroundColor: '#888' }]}>{selectedTask.category}</Text>
                <Text style={[styles.badge, { backgroundColor: getPriorityColor(selectedTask.priority) }]}>
                  {selectedTask.priority}
                </Text>
              </View>
            </View>

            <Paragraph style={[styles.description, { color: colors.onSurfaceVariant, opacity: 0.8 }]}>
              {selectedTask.description || 'No description provided.'}
            </Paragraph>

            <View style={[styles.infoRow, { borderBottomColor: colors.outlineVariant }]}>
              <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Created:</Text>
              <Text style={{ color: colors.onSurfaceVariant }}>{new Date(selectedTask.dateTime).toLocaleString()}</Text>
            </View>

            <View style={[styles.infoRow, { borderBottomColor: colors.outlineVariant }]}>
              <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Deadline:</Text>
              <Text style={{ color: colors.onSurfaceVariant }}>{new Date(selectedTask.deadline).toLocaleString()}</Text>
            </View>

            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Status:</Text>
              <Text style={{ color: colors.onSurfaceVariant, fontWeight: 'bold' }}>
                {selectedTask.completed ? 'Completed ✅' : 'Pending ⏳'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actionButtons}>
          <Button 
            mode="contained" 
            icon={selectedTask.completed ? "undo" : "check"} 
            onPress={() => dispatch(toggleTask(taskId))}
            style={styles.largeButton}
            contentStyle={{ height: 50 }}
          >
            {selectedTask.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </Button>

          <Button 
            mode="outlined" 
            icon="pencil" 
            onPress={() => navigation.navigate(ROUTES.ADD_TASK, { taskId })}
            style={styles.largeButton}
            contentStyle={{ height: 50 }}
          >
            Edit Task
          </Button>

          <Button 
            mode="outlined" 
            icon="delete" 
            textColor="#d32f2f"
            style={[styles.largeButton, { borderColor: '#d32f2f' }]}
            contentStyle={{ height: 50 }}
            onPress={() => setDialogVisible(true)}
          >
            Delete Task
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Delete Task</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to delete this task? This action cannot be undone.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDelete} textColor="#d32f2f">Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16 },
  card: { marginBottom: 24, elevation: 2, borderRadius: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  title: { flex: 1, fontSize: 22, fontWeight: 'bold', marginRight: 8 },
  completedText: { textDecorationLine: 'line-through', opacity: 0.5 },
  badge: { color: 'white', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  description: { fontSize: 16, marginBottom: 24, lineHeight: 24 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1 },
  label: { fontWeight: 'bold' },
  actionButtons: { gap: 16 },
  largeButton: { borderRadius: 32 }
});
