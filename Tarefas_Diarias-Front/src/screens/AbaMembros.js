import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { C, RADIUS, SHADOW } from '../constants/theme';
import { Avatar } from '../components/ui';
import { FadeIn, StaggerItem } from '../components/animations';
import { apiClient } from '../services/api';


export default function AbaMembros({ grupo }) {
  const [membros, setMembros]       = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarMembros = useCallback(async () => {
    try {
      const data = await apiClient.get(`/grupos/${grupo?.id}/membros`);
      setMembros(Array.isArray(data) ? data : (data?.items ?? data?.membros ?? []));

    } catch {
      // mantém lista vazia para não usar mock
      setMembros([]);
    } finally {
      setCarregando(false);
    }

  }, [grupo?.id]);

  useEffect(() => { carregarMembros(); }, [carregarMembros]);

  const onlineCount = membros.filter(m => m.online).length;

  return (
    <View style={{ flex: 1 }}>
      <FadeIn delay={0} style={s.headerWrap}>
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={s.titulo}>Membros</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={s.onlineDot} />
              <Text style={s.onlines}>{onlineCount} Onlines</Text>
            </View>
          </View>
          <View style={s.countBadge}>
            <Text style={s.countText}>{membros.length}</Text>
          </View>
        </View>
      </FadeIn>

      {carregando ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator size="large" color={C.red} />
        </View>
      ) : (
        <FlatList
          data={membros}
          keyExtractor={i => String(i.id)}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <StaggerItem index={index}>
              <View style={[s.card, item.isAdm && s.cardAdm, item.voce && s.cardVoce]}>
                <Avatar size={44} voce={item.voce} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={s.nome}>{item.nome}</Text>
                    {item.voce && (
                      <View style={s.voceBadge}>
                        <Text style={{ color: C.red, fontSize: 10, fontWeight: '800' }}>VOCÊ</Text>
                      </View>
                    )}
                    {item.isAdm && (
                      <View style={s.admBadge}>
                        <Text style={{ color: '#ffd700', fontSize: 10, fontWeight: '800' }}>ADM</Text>
                      </View>
                    )}
                  </View>
                  <Text style={s.cargo}>{item.cargo}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ alignItems: 'center', gap: 3 }}>
                    <View style={[s.statusDot, { backgroundColor: item.online ? C.green : C.grey3 }]} />
                    <Text style={[s.statusLabel, { color: item.online ? C.green : C.grey2 }]}>
                      {item.online ? 'Online' : 'Offline'}
                    </Text>
                  </View>
                  <TouchableOpacity style={s.dmBtn} activeOpacity={0.8}>
                    <Ionicons name="mail-outline" size={18} color={C.grey1} />
                  </TouchableOpacity>
                </View>
              </View>
            </StaggerItem>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  headerWrap: { padding: 16, paddingBottom: 0 },
  header: {
    backgroundColor: C.surface, borderRadius: RADIUS.md, padding: 16,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border,
  },
  titulo:    { color: C.white, fontWeight: '900', fontSize: 20 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.green },
  onlines:   { color: C.green, fontSize: 12, fontWeight: '700' },
  countBadge: {
    backgroundColor: C.red, borderRadius: RADIUS.sm, paddingHorizontal: 10, paddingVertical: 5,
  },
  countText: { color: C.white, fontWeight: '900', fontSize: 15 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface,
    borderRadius: RADIUS.md, padding: 14, gap: 12, borderWidth: 1, borderColor: C.border, ...SHADOW.card,
  },
  cardAdm:  { borderColor: '#ffd70033', backgroundColor: '#ffd70008' },
  cardVoce: { borderColor: C.red + '44' },
  nome:  { color: C.white, fontWeight: '800', fontSize: 14 },
  cargo: { color: C.grey2, fontSize: 12, marginTop: 2 },
  voceBadge: {
    backgroundColor: C.red + '22', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2,
    borderWidth: 1, borderColor: C.red + '55',
  },
  admBadge: {
    backgroundColor: '#ffd70022', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2,
    borderWidth: 1, borderColor: '#ffd70055',
  },
  statusDot:   { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: 10, fontWeight: '700' },
  dmBtn: {
    width: 36, height: 36, backgroundColor: C.card, borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border,
  },
});
