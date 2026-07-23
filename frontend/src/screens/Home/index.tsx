import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, FAB, Searchbar, Chip, useTheme, Surface, ProgressBar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { fetchTasks, deleteTask, toggleTask, setSearchTerm, setFilter, clearFilters } from '../../redux/slices/taskSlice';
import { logoutUser } from '../../redux/slices/authSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { ROUTES } from '../../constants';
import { TaskCard } from '../../components/ui/TaskCard';
import { SkeletonCard } from '../../components/ui/SkeletonCard';
import { Task } from '../../types';

export const HomeScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, searchTerm, selectedCategory, selectedSortBy, selectedOrder, selectedPriority, selectedCompleted } = useSelector((state: RootState) => state.tasks);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks(undefined));
  }, [dispatch, searchTerm, selectedCategory, selectedSortBy, selectedOrder, selectedPriority, selectedCompleted]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchTasks(undefined));
    setRefreshing(false);
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  // Derived Analytics using useMemo for performance
  const { pendingCount, completedCount, overdueCount, dueTodayCount, completionPercentage, groupedTasks } = useMemo(() => {
    let pending = 0, completed = 0, overdue = 0, dueToday = 0;
    const now = new Date();
    const todayStr = now.toDateString();

    const sections: { title: string, data: Task[] }[] = [
      { title: '🔴 Overdue', data: [] },
      { title: '📅 Due Today', data: [] },
      { title: '⏳ Upcoming', data: [] },
      { title: '✅ Completed', data: [] }
    ];

    tasks.forEach(t => {
      if (t.completed) {
        completed++;
        sections[3].data.push(t);
      } else {
        pending++;
        const deadlineDate = new Date(t.deadline);
        const deadlineStr = deadlineDate.toDateString();
        
        if (deadlineDate < now && deadlineStr !== todayStr) {
          overdue++;
          sections[0].data.push(t);
        } else if (deadlineStr === todayStr) {
          dueToday++;
          sections[1].data.push(t);
        } else {
          sections[2].data.push(t);
        }
      }
    });

    const percent = tasks.length === 0 ? 0 : completed / tasks.length;
    const validSections = sections.filter(s => s.data.length > 0);

    return { 
      pendingCount: pending, 
      completedCount: completed, 
      overdueCount: overdue, 
      dueTodayCount: dueToday, 
      completionPercentage: percent,
      groupedTasks: validSections 
    };
  }, [tasks]);

  const AnimatedView = Animated.View as any;

  const renderEmptyState = () => (
    <AnimatedView entering={FadeInUp} style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📭</Text>
      <Text style={styles.emptyText}>No tasks found.</Text>
      <Text style={styles.emptySubText}>Try adjusting your filters or create a new task.</Text>
    </AnimatedView>
  );

  const navigateToDetails = useCallback((id: string) => navigation.navigate(ROUTES.TASK_DETAILS, { taskId: id }), [navigation]);
  const navigateToEdit = useCallback((id: string) => navigation.navigate(ROUTES.ADD_TASK, { taskId: id }), [navigation]);
  const handleDelete = useCallback((id: string) => dispatch(deleteTask(id)), [dispatch]);
  const handleToggle = useCallback((id: string) => dispatch(toggleTask(id)), [dispatch]);

  const ListHeader = useMemo(() => (
    <View style={styles.headerBanner}>
      <Text style={[styles.greeting, { color: colors.onBackground }]}>Dashboard</Text>
      <Text style={[styles.dateText, { color: colors.onSurfaceVariant }]}>{new Date().toDateString()}</Text>
      <Surface style={[styles.statsRow, { backgroundColor: colors.surface }]} elevation={2}>
        <View style={styles.statCol}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{tasks.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={[styles.statValue, { color: '#f57c00' }]}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={[styles.statValue, { color: '#d32f2f' }]}>{overdueCount}</Text>
          <Text style={styles.statLabel}>Overdue</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={[styles.statValue, { color: '#388e3c' }]}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </Surface>
      
      <View style={styles.progressContainer}>
        <Text style={[styles.progressText, { color: colors.onSurfaceVariant }]}>
          Completion Progress: {Math.round(completionPercentage * 100)}%
        </Text>
        <ProgressBar progress={completionPercentage} color={colors.primary} style={styles.progressBar} />
      </View>

      <View style={[styles.filtersContainer, { backgroundColor: colors.background }]}>
        <Searchbar
          placeholder="Search tasks..."
          onChangeText={(query) => dispatch(setSearchTerm(query))}
          value={searchTerm}
          style={styles.searchBar}
          elevation={1}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          <Chip style={styles.chip} icon="filter-variant" onPress={() => dispatch(clearFilters())}>Clear</Chip>
          
          {['Work', 'Personal', 'College', 'Shopping', 'Health', 'Other', 'General'].map(cat => (
            <Chip 
              key={cat} 
              style={styles.chip} 
              selected={selectedCategory === cat} 
              onPress={() => dispatch(setFilter({ key: 'selectedCategory', value: selectedCategory === cat ? '' : cat }))}
            >
              {cat}
            </Chip>
          ))}
        </ScrollView>
      </View>
    </View>
  ), [tasks.length, pendingCount, overdueCount, completedCount, completionPercentage, searchTerm, selectedCategory, colors, dispatch]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.Content title="TaskFlow" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      {loading && !refreshing && tasks.length === 0 ? (
        <ScrollView style={{ flex: 1 }}>
          {ListHeader}
          {[1, 2, 3, 4].map(key => <SkeletonCard key={key} />)}
        </ScrollView>
      ) : (
        <SectionList
          sections={groupedTasks}
          keyExtractor={(item) => item._id}
          contentContainerStyle={tasks.length === 0 && styles.flatListEmpty}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={renderEmptyState}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.sectionHeader, { backgroundColor: colors.background, color: colors.onBackground }]}>{title}</Text>
          )}
          renderItem={({ item, index }) => (
            <TaskCard
              task={item}
              index={index}
              onPress={() => navigateToDetails(item._id)}
              onEdit={() => navigateToEdit(item._id)}
              onDelete={() => handleDelete(item._id)}
              onToggleComplete={() => handleToggle(item._id)}
            />
          )}
        />
      )}

      <AnimatedView entering={FadeInRight.delay(500)} style={styles.fabContainer}>
        <FAB
          style={[styles.fab, { backgroundColor: colors.primaryContainer }]}
          icon="plus"
          onPress={() => navigation.navigate(ROUTES.ADD_TASK)}
        />
      </AnimatedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBanner: { paddingHorizontal: 16, marginBottom: 8 },
  greeting: { fontSize: 24, fontWeight: 'bold' },
  dateText: { fontSize: 14, marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 24, marginBottom: 16 },
  statCol: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  progressContainer: { marginBottom: 16 },
  progressText: { fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  progressBar: { height: 8, borderRadius: 8 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', paddingHorizontal: 16, paddingVertical: 8, marginTop: 8 },
  fabContainer: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
  fab: { borderRadius: 28 },
  flatListEmpty: { flexGrow: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#666' },
  emptySubText: { fontSize: 16, textAlign: 'center', color: '#999' },
  filtersContainer: { paddingBottom: 8 },
  searchBar: { marginBottom: 12, borderRadius: 24, elevation: 1 },
  chipScroll: { flexDirection: 'row', marginBottom: 8 },
  chip: { marginRight: 8, borderRadius: 24 }
});
