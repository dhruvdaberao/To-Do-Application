import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

export const SkeletonCard = () => {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const AnimatedView = Animated.View as any;

  return (
    <Card style={styles.card}>
      <Card.Content>
        <AnimatedView style={[styles.skeletonTitle, animatedStyle, { backgroundColor: colors.surfaceVariant }]} />
        <AnimatedView style={[styles.skeletonDesc, animatedStyle, { backgroundColor: colors.surfaceVariant }]} />
        <AnimatedView style={[styles.skeletonDate, animatedStyle, { backgroundColor: colors.surfaceVariant }]} />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    paddingVertical: 8,
  },
  skeletonTitle: {
    height: 24,
    width: '60%',
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonDesc: {
    height: 16,
    width: '90%',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonDate: {
    height: 16,
    width: '40%',
    borderRadius: 4,
  }
});
