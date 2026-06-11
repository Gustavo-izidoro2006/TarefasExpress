import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { C, RADIUS, SHADOW } from '../constants/theme';
import { Avatar } from '../components/ui';
import { FadeIn, StaggerItem } from '../components/animations';
import { apiClient } from '../services/api';
import { useAuth } from '../hooks/useAuth';


export default function AbaChat({ grupo }) {
  const [msg, setMsg]       = useState('');
  const [msgs, setMsgs]     = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando]     = useState(false);
  const flatRef = useRef(null);
  const { user } = useAuth();

  const carregarMensagens = useCallback(async () => {
    try {
      const data = await apiClient.get(`/grupos/${grupo?.id}/chat`);
      setMsgs(Array.isArray(data) ? data : (data?.items ?? data?.mensagens ?? []));

    } catch {
      // mantém lista vazia para não usar mock
      setMsgs([]);
    } finally {
      setCarregando(false);
    }

  }, [grupo?.id]);

  useEffect(() => { carregarMensagens(); }, [carregarMensagens]);

  const enviar = async () => {
    if (!msg.trim() || enviando) return;
    const texto = msg.trim();
    setMsg('');

    // Mensagem otimista
    const tempId = String(Date.now());
    const nova = {
      id: tempId,
      autor: user?.name ?? 'Você',
      cargo: user?.cargo ?? '',
      msg: texto,
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      meu: true,
    };
    setMsgs(prev => [...prev, nova]);
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);

    setEnviando(true);
    try {
      await apiClient.post(`/grupos/${grupo?.id}/chat`, { msg: texto });
    } catch {
      // Silencia o erro — mensagem já exibida otimisticamente
    } finally {
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <FadeIn delay={0} style={s.chatHeaderWrap}>
        <View style={s.chatHeader}>
          <View style={{ flex: 1 }}>
            <Text style={s.chatTitle}>Chat</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={s.onlineDot} />
              <Text style={s.chatOnlines}>Online</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="dots-vertical" size={22} color={C.grey2} />
        </View>
      </FadeIn>

      {carregando ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator size="large" color={C.red} />
        </View>
      ) : (
        <FlatList
          ref={flatRef}
          data={msgs}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item, index }) => (
            <StaggerItem index={index} style={[s.msgRow, item.meu && { justifyContent: 'flex-end' }]}>
              {!item.meu && <Avatar size={32} style={{ marginRight: 8, alignSelf: 'flex-end' }} />}
              <View style={{ maxWidth: '75%' }}>
                {!item.meu && (
                  <View style={s.msgMeta}>
                    <Text style={s.msgAutor}>{item.autor}</Text>
                    <Text style={s.msgCargo}>{item.cargo}</Text>
                  </View>
                )}
                <View style={[s.bubble, item.meu ? s.bubbleMeu : s.bubbleDele]}>
                  <Text style={s.bubbleText}>{item.msg}</Text>
                  <Text style={s.bubbleHora}>{item.hora}</Text>
                </View>
              </View>
              {item.meu && <Avatar size={32} style={{ marginLeft: 8, alignSelf: 'flex-end' }} />}
            </StaggerItem>
          )}
        />
      )}

      <View style={s.inputRow}>
        <TouchableOpacity style={s.inputBtn}>
          <Ionicons name="attach" size={22} color={C.grey2} />
        </TouchableOpacity>
        <TextInput
          style={s.input}
          placeholder="Mensagem..."
          placeholderTextColor={C.grey2}
          value={msg}
          onChangeText={setMsg}
          onSubmitEditing={enviar}
          returnKeyType="send"
          multiline
        />
        <TouchableOpacity
          style={[s.inputBtn, msg.trim() && s.sendBtnActive]}
          onPress={enviar}
          disabled={enviando}
        >
          <Ionicons name="send" size={18} color={msg.trim() ? C.white : C.grey2} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  chatHeaderWrap: { padding: 16, paddingBottom: 0 },
  chatHeader: {
    backgroundColor: C.surface, borderRadius: RADIUS.md, padding: 16,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border,
  },
  chatTitle:   { color: C.white, fontWeight: '900', fontSize: 20 },
  onlineDot:   { width: 8, height: 8, borderRadius: 4, backgroundColor: C.green },
  chatOnlines: { color: C.green, fontSize: 12, fontWeight: '700' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  msgRow:      { flexDirection: 'row', alignItems: 'flex-end' },
  msgMeta:     { marginBottom: 3, paddingLeft: 2 },
  msgAutor:    { color: C.white, fontWeight: '800', fontSize: 11 },
  msgCargo:    { color: C.grey2, fontSize: 10 },
  bubble:         { borderRadius: 16, padding: 12 },
  bubbleDele:     { backgroundColor: C.cardAlt, borderTopLeftRadius: 4, borderWidth: 1, borderColor: C.border },
  bubbleMeu:      { backgroundColor: C.red, borderTopRightRadius: 4 },
  bubbleText:     { color: C.white, fontSize: 14, lineHeight: 20 },
  bubbleHora:     { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 4, textAlign: 'right' },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border,
    padding: 12, gap: 8,
  },
  inputBtn: {
    width: 40, height: 40, backgroundColor: C.card, borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border,
  },
  input: {
    flex: 1, backgroundColor: C.card, borderRadius: RADIUS.sm,
    paddingHorizontal: 14, paddingVertical: 10, color: C.white, fontSize: 14,
    borderWidth: 1, borderColor: C.border, maxHeight: 100,
  },
  sendBtnActive: { backgroundColor: C.red, borderColor: C.red, ...SHADOW.red },
});
