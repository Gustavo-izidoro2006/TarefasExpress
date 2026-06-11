import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Animated, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, RADIUS } from '../constants/theme';
import { Campo, BotaoPrimario } from '../components/ui';
import { PageTransition, FadeIn } from '../components/animations';
import { useAuth } from '../hooks/useAuth';

export default function TelaCadastro({ onCadastrar, onLogin }) {
  const [nome, setNome]   = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { register } = useAuth();

  const logoAnim = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    Animated.spring(logoAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }).start();
  }, []);

  const handleCadastrar = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (senha !== confirmar) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setCarregando(true);
    try {
      await register(nome.trim(), email.trim(), senha);
      onCadastrar();
    } catch (err) {
      Alert.alert('Erro ao cadastrar', err.message || 'Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={s.tela}>
      <PageTransition direction="right">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={s.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={[s.logoWrap, { transform: [{ scale: logoAnim }] }]}>
              <View style={s.logoIconBox}>
                <Ionicons name="checkmark-done" size={40} color={C.red} />
              </View>
              <Text style={s.logoText}>
                <Text style={{ color: C.white }}>Tarefa </Text>
                <Text style={{ color: C.red }}>Express</Text>
              </Text>
            </Animated.View>

            <FadeIn delay={80}>
              <Text style={s.titulo}>Criar Conta</Text>
            </FadeIn>

            <FadeIn delay={140} style={s.campos}>
              <Campo
                placeholder="NOME"
                iconName="person-outline"
                value={nome}
                onChangeText={setNome}
              />
              <Campo
                placeholder="E-MAIL"
                iconName="mail-outline"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <Campo
                placeholder="SENHA"
                iconName="lock-closed-outline"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
              <Campo
                placeholder="CONFIRMAR SENHA"
                iconName="lock-closed-outline"
                secureTextEntry
                value={confirmar}
                onChangeText={setConfirmar}
              />
            </FadeIn>

            <FadeIn delay={200} style={{ width: '100%' }}>
              <BotaoPrimario
                label={carregando ? 'CADASTRANDO...' : 'CADASTRAR'}
                onPress={handleCadastrar}
                disabled={carregando}
                style={{ width: '100%' }}
              />
            </FadeIn>

            <FadeIn delay={260}>
              <TouchableOpacity onPress={onLogin} style={s.linkBtn}>
                <Text style={s.linkTextSec}>
                  Já tem uma conta?{'  '}
                  <Text style={{ color: C.red, fontWeight: '800' }}>Login</Text>
                </Text>
              </TouchableOpacity>
            </FadeIn>
          </ScrollView>
        </KeyboardAvoidingView>
      </PageTransition>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.bg },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  logoWrap: {
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: RADIUS.xl,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 32,
  },
  logoIconBox: {
    width: 80, height: 80,
    borderRadius: 22,
    backgroundColor: C.card,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.borderBright,
    marginBottom: 12,
  },
  logoText: { fontSize: 32, fontWeight: '900', letterSpacing: 1 },
  titulo: {
    fontSize: 30,
    fontWeight: '900',
    color: C.white,
    letterSpacing: 1,
    marginBottom: 28,
    alignSelf: 'flex-start',
  },
  campos: { width: '100%', gap: 14, marginBottom: 20 },
  linkBtn: { marginTop: 16, alignItems: 'center' },
  linkTextSec: { color: C.grey1, fontSize: 14, fontWeight: '600' },
});
