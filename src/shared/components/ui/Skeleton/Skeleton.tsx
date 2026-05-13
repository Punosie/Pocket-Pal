import React, { useEffect } from 'react';

import { StyleSheet, View, type ViewStyle } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { borderRadius, duration } from '@/theme';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadiusSize?: keyof typeof borderRadius;
  style?: ViewStyle;
}

export const Skeleton = React.memo<SkeletonProps>(
  ({ width, height = 16, borderRadiusSize = 'md', style }) => {
    const shimmer = useSharedValue(0);

    useEffect(() => {
      shimmer.value = withRepeat(withTiming(1, { duration: duration.slowest * 2 }), -1, false);
    }, [shimmer]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: interpolate(shimmer.value, [0, 1], [-200, 200]),
        },
      ],
    }));

    return (
      <View
        style={[
          styles.container,
          {
            width: width ?? '100%',
            height,
            borderRadius: borderRadius[borderRadiusSize],
          },
          style,
        ]}
      >
        <Animated.View style={[StyleSheet.absoluteFillObject, animatedStyle]}>
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255, 255, 255, 0.06)',
              'rgba(255, 255, 255, 0.12)',
              'rgba(255, 255, 255, 0.06)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      </View>
    );
  },
);

Skeleton.displayName = 'Skeleton';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
});
