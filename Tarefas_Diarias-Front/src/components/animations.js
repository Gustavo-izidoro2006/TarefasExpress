import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { C } from '../constants/theme';

/**
 * PageTransition — wraps a screen with a Persona-style slide+fade entry.
 * direction: 'right' (default, push forward), 'left' (pop back), 'up' (modal)
 */
export function PageTransition({ children, direction = 'right', style }) {
  const translateX = useRef(new Animated.Value(
    direction === 'right' ? 60 :
    direction === 'left'  ? -60 : 0
  )).current;
  const translateY = useRef(new Animated.Value(direction === 'up' ? 80 : 0)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        tension: 80,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 80,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        { flex: 1, opacity, transform: [{ translateX }, { translateY }] },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * FadeIn — simples fade de entrada, bom para conteúdo dentro das abas
 */
export function FadeIn({ children, delay = 0, style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 100,
        friction: 12,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

/**
 * PulseView — pulsa suavemente (útil para badges de notificação urgentes)
 */
export function PulseView({ children, active = true, style }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.1, duration: 700, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1,   duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active]);

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      {children}
    </Animated.View>
  );
}

/**
 * TaskCompleteFlash — flash verde quando tarefa é concluída
 */
export function useTaskCompleteAnim() {
  const scale   = useRef(new Animated.Value(1)).current;
  const bgFlash = useRef(new Animated.Value(0)).current;

  const trigger = (onDone) => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale,   { toValue: 0.96, duration: 80, useNativeDriver: true }),
        Animated.spring(scale,   { toValue: 1,    tension: 200, friction: 6, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(bgFlash, { toValue: 1, duration: 150, useNativeDriver: false }),
        Animated.timing(bgFlash, { toValue: 0, duration: 400, useNativeDriver: false }),
      ]),
    ]).start(onDone);
  };

  const bgColor = bgFlash.interpolate({
    inputRange: [0, 1],
    outputRange: [C.surface, C.green + '33'],
  });

  return { scale, bgColor, trigger };
}

/**
 * StaggerList — anima itens de lista em cascata
 */
export function StaggerItem({ children, index, style }) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const delay = index * 60;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 100,
        friction: 12,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
