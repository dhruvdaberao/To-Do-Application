import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';

export const SplashScreen = () => {
  const { colors } = useTheme();

  const AnimatedView = Animated.View as any;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AnimatedView entering={FadeIn.duration(1200)} style={styles.content}>
        <Image 
          source={require('../../assets/logo.jpg')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
        <Text style={[styles.title, { color: colors.primary }]}>TaskFlow</Text>
        <Text style={[styles.tagline, { color: colors.onSurfaceVariant }]}>
          Master your productivity.
        </Text>
      </AnimatedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
    marginBottom: 24,
  },
  title: { 
    fontSize: 36, 
    fontWeight: 'bold', 
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    letterSpacing: 0.5,
  }
});
