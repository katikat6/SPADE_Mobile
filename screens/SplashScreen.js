import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.75)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Fade in and spring up the logo and title
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Gentle pulse on the leaf circle
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Smoothly fill the loading bar over 2.4 seconds
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim, pulseAnim, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.splashContainer}
      onPress={() => navigation.replace('Login')}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBrown} />

      <Animated.View
        style={{
          alignItems: 'center',
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Animated.View
          style={[
            styles.logoCircle,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Ionicons name="leaf" size={52} color="#4CAF50" />
        </Animated.View>

        <Text style={styles.splashTitle}>SPADE</Text>
        <Text style={styles.splashSub}>
          Soil Probe for Agricultural{'\n'}Data & Evaluation
        </Text>
      </Animated.View>

      {/* Animated Progress Bar */}
      <View style={styles.splashProgressBg}>
        <Animated.View
          style={[styles.splashProgressFill, { width: progressWidth }]}
        />
      </View>
      <Text style={styles.loadingHint}>Initializing sensors & records...</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.darkBrown,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#4E3225',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  splashTitle: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginTop: 8,
  },
  splashSub: {
    color: '#D7C4B2',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  splashProgressBg: {
    width: 140,
    height: 5,
    backgroundColor: '#5C3D2E',
    borderRadius: 3,
    marginTop: 34,
    overflow: 'hidden',
  },
  splashProgressFill: {
    height: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  loadingHint: {
    color: '#9E8C80',
    fontSize: 10,
    marginTop: 10,
  },
});