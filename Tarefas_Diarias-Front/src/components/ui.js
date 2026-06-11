import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Animated, StyleSheet, Platform,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { C, RADIUS, SHADOW } from '../constants/theme';

// ─── BADGE ───────────────────────────────────────────────────────────────────
export function Badge({ count, cor = C.red, style }) {
  if (!count) return null;
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 120, friction: 6 }).start();
  }, []);
  return (
    <Animated.View style={[styles.badge, { backgroundColor: cor, transform: [{ scale: anim }] }, style]}>
      <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
    </Animated.View>
  );
}

// ─── BOTÃO PRIMÁRIO ───────────────────────────────────────────────────────────
export function BotaoPrimario({ label, onPress, style, iconName, iconLib = 'Ionicons', disabled }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, tension: 300, friction: 10 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, tension: 300, friction: 10 }).start();
  const IconComp = iconLib === 'MaterialCommunityIcons' ? MaterialCommunityIcons
    : iconLib === 'Feather' ? Feather : Ionicons;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style, disabled && { opacity: 0.6 }]}>
      <TouchableOpacity
        style={[styles.btnPrimario, SHADOW.red]}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={1}
        disabled={disabled}
      >
        {iconName && <IconComp name={iconName} size={18} color={C.white} style={{ marginRight: 6 }} />}
        <Text style={styles.btnPrimarioText}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── BOTÃO SECUNDÁRIO ────────────────────────────────────────────────────────
export function BotaoSecundario({ label, onPress, style, iconName }) {
  return (
    <TouchableOpacity style={[styles.btnSecundario, style]} onPress={onPress} activeOpacity={0.8}>
      {iconName && <Ionicons name={iconName} size={16} color={C.grey1} style={{ marginRight: 6 }} />}
      <Text style={styles.btnSecundarioText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── CAMPO DE ENTRADA ────────────────────────────────────────────────────────
export function Campo({ placeholder, iconName, secureTextEntry, value, onChangeText, keyboardType }) {
  const [show, setShow]       = useState(false);
  const [focused, setFocused] = useState(false);
  const border = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(border, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(border, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = border.interpolate({ inputRange: [0, 1], outputRange: [C.border, C.red] });

  return (
    <Animated.View style={[styles.campo, { borderColor }]}>
      {iconName && (
        <Ionicons name={iconName} size={20} color={focused ? C.red : C.grey2} style={{ marginRight: 10 }} />
      )}
      <TextInput
        style={styles.campoInput}
        placeholder={placeholder}
        placeholderTextColor={C.grey2}
        secureTextEntry={secureTextEntry && !show}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setShow(!show)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name={show ? 'eye-off' : 'eye'} size={20} color={C.grey2} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
export function Header({ titulo, iconName, iconColor = C.white, onBack, showSettings = true }) {
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {onBack && (
          <TouchableOpacity style={styles.headerBack} onPress={onBack} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={20} color={C.white} />
          </TouchableOpacity>
        )}
        <View style={styles.headerCard}>
          {iconName && (
            <MaterialCommunityIcons name={iconName} size={22} color={iconColor} style={{ marginRight: 8 }} />
          )}
          <Text style={styles.headerTitulo} numberOfLines={1}>{titulo}</Text>
        </View>
      </View>
      {showSettings && (
        <TouchableOpacity style={styles.headerGear} activeOpacity={0.8}>
          <Ionicons name="settings-outline" size={20} color={C.grey1} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── BOTTOM TAB ──────────────────────────────────────────────────────────────
export function BottomTab({ aba, setAba, notifs = {} }) {
  const TABS = [
    { id: 'menu',    label: 'MENU',    icon: 'view-list-outline' },
    { id: 'tarefas', label: 'TAREFAS', icon: 'clipboard-list-outline' },
    { id: 'chat',    label: 'CHAT',    icon: 'chat-processing-outline' },
    { id: 'membros', label: 'MEMBROS', icon: 'account-group-outline' },
  ];

  return (
    <View style={styles.bottomTab}>
      {TABS.map(t => {
        const ativo = aba === t.id;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const scale = useRef(new Animated.Value(1)).current;

        const press = () => {
          Animated.sequence([
            Animated.spring(scale, { toValue: 0.85, useNativeDriver: true, tension: 300, friction: 8 }),
            Animated.spring(scale, { toValue: 1,    useNativeDriver: true, tension: 300, friction: 8 }),
          ]).start();
          setAba(t.id);
        };

        return (
          <TouchableOpacity key={t.id} style={styles.tabItem} onPress={press} activeOpacity={1}>
            <Animated.View style={[styles.tabIconWrapper, ativo && styles.tabIconActive, { transform: [{ scale }] }]}>
              <View style={{ position: 'relative' }}>
                <MaterialCommunityIcons name={t.icon} size={24} color={ativo ? C.white : C.grey2} />
                {notifs[t.id] ? <Badge count={notifs[t.id]} style={{ top: -6, right: -8 }} /> : null}
              </View>
            </Animated.View>
            <Text style={[styles.tabLabel, ativo && { color: C.red }]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── AVATAR ──────────────────────────────────────────────────────────────────
export function Avatar({ size = 36, borderColor = C.border, voce = false, style }) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, borderColor: voce ? C.red : borderColor, borderWidth: voce ? 2 : 1.5 },
        style,
      ]}
    >
      <Ionicons name="person" size={size * 0.5} color={C.grey2} />
    </View>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
export function StatCard({ num, label, tipo }) {
  const isRed = tipo === 'pendente';
  const anim  = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 7, delay: isRed ? 0 : 150 }).start();
  }, []);

  return (
    <Animated.View
      style={[styles.statCard, { borderColor: isRed ? C.red + '55' : C.green + '55' }, { transform: [{ scale: anim }] }]}
    >
      <Ionicons name={isRed ? 'close-circle' : 'checkmark-circle'} size={24} color={isRed ? C.red : C.green} />
      <Text style={[styles.statNum, { color: isRed ? C.red : C.green }]}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  badge: {
    position: 'absolute', top: -6, right: -8,
    minWidth: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  badgeText: { color: C.white, fontSize: 10, fontWeight: '900' },

  btnPrimario: {
    backgroundColor: C.red, borderRadius: RADIUS.md, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  btnPrimarioText: { color: C.white, fontWeight: '900', fontSize: 16, letterSpacing: 2 },

  btnSecundario: {
    backgroundColor: C.surface, borderRadius: RADIUS.md, paddingVertical: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  btnSecundarioText: { color: C.grey1, fontWeight: '700', fontSize: 14 },

  campo: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.card,
    borderRadius: RADIUS.md, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1.5,
  },
  campoInput: { flex: 1, color: C.white, fontSize: 15, fontWeight: '600' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  headerBack: {
    width: 40, height: 40, backgroundColor: C.red, borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center', ...SHADOW.red,
  },
  headerCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.card,
    borderRadius: RADIUS.sm, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: C.border, maxWidth: 220,
  },
  headerTitulo: { color: C.white, fontWeight: '800', fontSize: 15 },
  headerGear: {
    width: 40, height: 40, backgroundColor: C.card, borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border,
  },

  bottomTab: {
    flexDirection: 'row', backgroundColor: C.surface,
    borderTopWidth: 1, borderTopColor: C.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10, paddingTop: 10,
  },
  tabItem:          { flex: 1, alignItems: 'center', gap: 3 },
  tabIconWrapper:   { width: 40, height: 40, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  tabIconActive:    { backgroundColor: C.red + '22' },
  tabLabel:         { color: C.grey2, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },

  avatar: { backgroundColor: C.cardAlt, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },

  statCard: {
    flex: 1, backgroundColor: C.surface, borderRadius: RADIUS.lg, padding: 20,
    alignItems: 'center', gap: 6, borderWidth: 1, ...SHADOW.card,
  },
  statNum:   { fontSize: 40, fontWeight: '900', lineHeight: 44 },
  statLabel: { color: C.grey1, fontWeight: '700', fontSize: 14 },
});
