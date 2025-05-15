import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useTheme } from "react-native-paper";

interface ContainerProps {
  animationDuration: number;
  isFinished: boolean;
  children: React.ReactNode;
}

export function Container({ animationDuration, isFinished, children }: ContainerProps) {
  const fadeAnim = React.useRef(new Animated.Value(isFinished ? 0 : 1)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isFinished ? 0 : 1,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  }, [isFinished, animationDuration, fadeAnim]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        pointerEvents: "none",
      }}>
      {children}
    </Animated.View>
  );
}

interface BarProps {
  animationDuration: number;
  progress: number;
}

export function Bar({ animationDuration, progress }: BarProps) {
  const theme = useTheme();
  const progressAnim = React.useRef(new Animated.Value(progress)).current;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  }, [progress, animationDuration, progressAnim]);

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            backgroundColor: theme.colors.primary,
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}>
        <View
          style={[
            styles.progressGlow,
            {
              backgroundColor: theme.colors.primary,
              shadowColor: theme.colors.primary,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

interface SpinnerProps {
  isAnimating: boolean;
}

export function Spinner({ isAnimating }: SpinnerProps) {
  const theme = useTheme();
  const spinAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isAnimating) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [isAnimating, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!isAnimating) return null;

  return (
    <View style={styles.spinnerContainer}>
      <Animated.View
        style={[
          styles.spinner,
          {
            borderColor: theme.colors.primary,
            transform: [{ rotate: spin }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 4,
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "transparent",
    zIndex: 1031,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
  progressGlow: {
    height: "100%",
    width: 100,
    position: "absolute",
    right: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
  },
  spinnerContainer: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1031,
  },
  spinner: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 9,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});
