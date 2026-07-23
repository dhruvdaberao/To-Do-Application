import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, Card, Switch, useTheme, Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/uiSlice';
import { RootState, AppDispatch } from '../../redux/store';

export const ProfileScreen = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDarkMode } = useSelector((state: RootState) => state.ui);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.Content title="Profile" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={styles.content}>
        <View style={styles.header}>
          <Avatar.Icon size={80} icon="account" style={{ backgroundColor: colors.primary }} />
          <Text style={[styles.emailText, { color: colors.onBackground }]}>{user?.email}</Text>
          <Text style={[styles.versionText, { color: colors.onSurfaceVariant }]}>TaskFlow v1.0.0</Text>
        </View>

        <Card style={[styles.card, { backgroundColor: colors.surfaceVariant }]}>
          <Card.Content>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.onSurfaceVariant }]}>Dark Mode</Text>
                <Text style={{ color: colors.onSurfaceVariant, opacity: 0.8 }}>Toggle app appearance</Text>
              </View>
              <Switch value={isDarkMode} onValueChange={(val: boolean) => { dispatch(toggleTheme()); }} color={colors.primary} />
            </View>
          </Card.Content>
        </Card>

        <Button 
          mode="contained" 
          onPress={() => dispatch(logoutUser())} 
          style={styles.logoutBtn} 
          contentStyle={styles.btnContent}
        >
          Logout
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, flex: 1 },
  header: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  emailText: { fontSize: 20, fontWeight: 'bold', marginTop: 16 },
  versionText: { fontSize: 14, marginTop: 4 },
  card: { marginBottom: 24, borderRadius: 32, elevation: 1 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 8 },
  settingTextContainer: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  logoutBtn: { marginTop: 'auto', marginBottom: 16, borderRadius: 32 },
  btnContent: { height: 50 },
});
