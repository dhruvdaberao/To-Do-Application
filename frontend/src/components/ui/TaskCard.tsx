import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Card, Title, Paragraph, Button, IconButton, useTheme } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
  index: number;
}

export const TaskCard: React.FC<TaskCardProps> = memo(({ task, onPress, onEdit, onDelete, onToggleComplete, index }) => {
  const { colors } = useTheme();
  
  const isOverdue = !task.completed && new Date(task.deadline) < new Date() && new Date(task.deadline).toDateString() !== new Date().toDateString();

  const getPriorityColor = () => {
    if (task.completed) return 'grey';
    switch (task.priority) {
      case 'HIGH': return '#d32f2f';
      case 'MEDIUM': return '#ed6c02';
      case 'LOW': return '#2e7d32';
      default: return 'grey';
    }
  };

  const AnimatedView = Animated.View as any;

  return (
    <AnimatedView entering={FadeInUp.delay(index * 100).duration(400)}>
      <Card style={[styles.card, { backgroundColor: colors.surfaceVariant }]} onPress={onPress}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Title style={[styles.title, task.completed && styles.completedText, { color: colors.onSurfaceVariant }]}>
              {task.title}
            </Title>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <Text style={[styles.badge, { backgroundColor: '#888' }]}>{task.category}</Text>
              <Text style={[styles.badge, { backgroundColor: getPriorityColor() }]}>{task.priority}</Text>
            </View>
          </View>

          {task.description ? (
            <Paragraph numberOfLines={2} style={[task.completed && styles.completedText, { color: colors.onSurfaceVariant, opacity: 0.8 }]}>
              {task.description}
            </Paragraph>
          ) : null}

          <View style={styles.dateRow}>
            <Text style={[styles.dateText, { color: colors.onSurfaceVariant }]}>
              📅 {new Date(task.dateTime).toLocaleDateString()}
            </Text>
            <Text style={[styles.dateText, isOverdue ? { color: '#d32f2f', fontWeight: 'bold' } : { color: colors.onSurfaceVariant }]}>
              ⏰ {new Date(task.deadline).toLocaleDateString()} {isOverdue && '(Overdue)'}
            </Text>
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button 
            mode={task.completed ? "outlined" : "contained"} 
            onPress={onToggleComplete}
            compact
          >
            {task.completed ? 'Undo' : 'Complete'}
          </Button>
          <View style={styles.iconActions}>
            <IconButton icon="pencil" size={20} onPress={onEdit} iconColor={colors.primary} />
            <IconButton icon="delete" size={20} onPress={onDelete} iconColor={colors.error} />
          </View>
        </Card.Actions>
      </Card>
    </AnimatedView>
  );
});

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    borderRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  badge: {
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    fontSize: 10,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  dateRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  dateText: {
    fontSize: 12,
  },
  actions: {
    justifyContent: 'space-between',
    marginTop: -8,
  },
  iconActions: {
    flexDirection: 'row',
  }
});
