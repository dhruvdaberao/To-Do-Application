import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, TextInput, Button, SegmentedButtons, Chip, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask } from '../../redux/slices/taskSlice';
import { RootState, AppDispatch } from '../../redux/store';

export const AddTaskScreen = ({ route, navigation }: any) => {
  const { taskId } = route.params || {};
  const { colors } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);

  const existingTask = tasks.find(t => t._id === taskId);
  const isEditing = !!taskId;

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: isEditing && existingTask ? {
      title: existingTask.title,
      description: existingTask.description || '',
      dateTime: existingTask.dateTime.split('T')[0],
      deadline: existingTask.deadline.split('T')[0],
      priority: existingTask.priority,
      category: existingTask.category || 'General',
    } : {
      priority: 'MEDIUM',
      category: 'General',
      dateTime: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    }
  });

  const onSubmit = async (data: any) => {
    // Add time component for valid ISO string
    const formattedData = {
      ...data,
      dateTime: `${data.dateTime}T00:00:00Z`,
      deadline: `${data.deadline}T23:59:59Z`,
    };

    if (isEditing) {
      await dispatch(updateTask({ id: taskId, data: formattedData }));
    } else {
      await dispatch(createTask(formattedData));
    }
    
    if (!error) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? 'Edit Task' : 'New Task'} titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <Controller
          control={control}
          rules={{ required: 'Title is required' }}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Task Title"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.title}
              style={styles.input}
            />
          )}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title.message as string}</Text>}

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Description (Optional)"
              mode="outlined"
              multiline
              numberOfLines={4}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />

        <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {['Work', 'Personal', 'College', 'Shopping', 'Health', 'Other', 'General'].map(cat => (
            <Controller
              key={cat}
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <Chip 
                  selected={value === cat} 
                  onPress={() => onChange(cat)}
                  style={[styles.chip, value === cat && { backgroundColor: colors.secondaryContainer }]}
                >
                  {cat}
                </Chip>
              )}
            />
          ))}
        </ScrollView>

        <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>Priority</Text>
        <Controller
          control={control}
          name="priority"
          render={({ field: { onChange, value } }) => (
            <SegmentedButtons
              value={value}
              onValueChange={onChange}
              buttons={[
                { value: 'LOW', label: 'Low', style: { borderColor: colors.outline } },
                { value: 'MEDIUM', label: 'Medium', style: { borderColor: colors.outline } },
                { value: 'HIGH', label: 'High', style: { borderColor: colors.outline } },
              ]}
              style={styles.input}
            />
          )}
        />

        <View style={styles.row}>
          <View style={[styles.flex, { marginRight: 8 }]}>
            <Controller
              control={control}
              rules={{ required: 'Required' }}
              name="dateTime"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Start Date (YYYY-MM-DD)"
                  mode="outlined"
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.dateTime}
                  style={styles.input}
                />
              )}
            />
          </View>
          <View style={[styles.flex, { marginLeft: 8 }]}>
            <Controller
              control={control}
              rules={{ required: 'Required' }}
              name="deadline"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Deadline (YYYY-MM-DD)"
                  mode="outlined"
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.deadline}
                  style={styles.input}
                />
              )}
            />
          </View>
        </View>

        <Button 
          mode="contained" 
          onPress={handleSubmit(onSubmit)} 
          loading={loading}
          disabled={loading}
          style={styles.submitBtn}
          contentStyle={styles.btnContent}
        >
          {isEditing ? 'Save Changes' : 'Create Task'}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  input: { marginBottom: 16 },
  errorText: { color: '#d32f2f', marginBottom: 8, fontSize: 12 },
  row: { flexDirection: 'row' },
  flex: { flex: 1 },
  label: { marginBottom: 8, marginTop: 8, fontWeight: 'bold' },
  chipScroll: { flexDirection: 'row', marginBottom: 16 },
  chip: { marginRight: 8, borderRadius: 20 },
  submitBtn: { marginTop: 24, borderRadius: 25 },
  btnContent: { height: 50 },
});
