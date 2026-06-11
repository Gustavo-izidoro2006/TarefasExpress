import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  TextInput, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { C, RADIUS, SHADOW } from '../constants/theme';
import { Badge, BotaoPrimario, BotaoSecundario, Avatar } from '../components/ui';
import { PageTransition, StaggerItem, FadeIn } from '../components/animations';
import { apiClient } from '../services/api';
import { useAuth } from '../hooks/useAuth';
// fallback para quando a API não estiver disponível
import { GRUPOS as GRUPOS_MOCK } from '../data/mock';

export default function TelaGrupos({ onEntrar, onLogout }) {
  const [busca, setBusca]       = useState('');
  const [grupos, setGrupos]     = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { user } = useAuth();

  const carregarGrupos = useCallback(async () => {
    try {
      const data = await apiClient.get('/grupos');
      setGrupos(data);
    } catch {
      // API fora do ar — usa mock para não quebrar a tela
      setGrupos(GRUPOS_MOCK);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregarGrupos(); }, [carregarGrupos]);

  const filtrados = grupos.filter(g =>
    g.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaView style={s.tela}>
      <PageTransition direction="right">
        {/* Header de usuário */}
        <View style={s.topBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar size={44} />
            <View>
              <Text style={s.ola}>Olá,</Text>
              <Text style={s.usuario}>{user?.name ?? 'Usuário'}!</Text>
            </View>
          </View>
          <TouchableOpacity style={s.gear} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={20} color={C.grey1} />
          </TouchableOpacity>
        </View>

        {/* Barra de busca */}
        <FadeIn delay={80} style={s.buscaWrap}>
          <View style={s.buscaBox}>
            <Ionicons name="search" size={18} color={C.grey2} style={{ marginRight: 10 }} />
            <TextInput
              style={s.buscaInput}
              placeholder="Buscar grupos..."
              placeholderTextColor={C.grey2}
              value={busca}
              onChangeText={setBusca}
            />
          </View>
        </FadeIn>

        {carregando ? (
          <View style={s.loadingWrap}>
            <ActivityIndicator size="large" color={C.red} />
          </View>
        ) : (
          <FlatList
            data={filtrados}
            keyExtractor={i => String(i.id)}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 16, gap: 12 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <StaggerItem index={index}>
                <TouchableOpacity
                  style={s.grupoCard}
                  onPress={() => onEntrar(item)}
                  activeOpacity={0.85}
                >
                  <View style={[s.grupoCorFaixa, { backgroundColor: item.cor }]} />
                  <View style={[s.grupoIconBox, { backgroundColor: item.cor + '22' }]}>
                    <MaterialCommunityIcons name={item.iconName} size={28} color={item.cor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.grupoNome}>{item.nome}</Text>
                    <Text style={[s.grupoRole, { color: item.cor }]}>{item.role}</Text>
                  </View>
                  <View style={{ position: 'relative' }}>
                    <MaterialCommunityIcons
                      name={item.notifs > 0 ? 'bell-ring' : 'bell-outline'}
                      size={24}
                      color={item.notifs > 0 ? C.red : C.grey2}
                    />
                    {item.notifs > 0 && <Badge count={item.notifs} />}
                  </View>
                </TouchableOpacity>
              </StaggerItem>
            )}
            ListEmptyComponent={
              <View style={s.empty}>
                <MaterialCommunityIcons name="account-group-outline" size={48} color={C.grey3} />
                <Text style={s.emptyText}>Nenhum grupo encontrado</Text>
              </View>
            }
            ListFooterComponent={
              <StaggerItem index={filtrados.length}>
                <TouchableOpacity style={s.grupoCardPlus} activeOpacity={0.7}>
                  <MaterialCommunityIcons name="plus" size={28} color={C.grey3} />
                </TouchableOpacity>
              </StaggerItem>
            }
          />
        )}

        {/* Botões inferiores */}
        <FadeIn delay={300} style={s.botoesWrap}>
          <BotaoPrimario
            label="+ Criar Grupo"
            iconName="plus"
            iconLib="MaterialCommunityIcons"
            onPress={() => Alert.alert('Em breve', 'Função disponível na próxima versão.')}
            style={{ flex: 1 }}
          />
          <BotaoSecundario
            label="Entrar em Grupo"
            iconName="home-outline"
            onPress={() => Alert.alert('Em breve', 'Função disponível na próxima versão.')}
            style={{ flex: 1 }}
          />
        </FadeIn>
      </PageTransition>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  ola:     { fontSize: 20, fontWeight: '700', color: C.white },
  usuario: { fontSize: 22, fontWeight: '900', color: C.red },
  gear: {
    width: 40, height: 40,
    backgroundColor: C.card,
    borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  buscaWrap: { paddingHorizontal: 20, marginBottom: 16 },
  buscaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: C.border,
  },
  buscaInput: { flex: 1, color: C.white, fontSize: 15, fontWeight: '600' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  grupoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
    paddingRight: 16,
    paddingVertical: 14,
    gap: 14,
    ...SHADOW.card,
  },
  grupoCorFaixa: { width: 4, alignSelf: 'stretch', borderRadius: 2 },
  grupoIconBox: {
    width: 52, height: 52,
    borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  grupoNome: { color: C.white, fontWeight: '800', fontSize: 15, marginBottom: 3 },
  grupoRole: { fontWeight: '700', fontSize: 13 },
  grupoCardPlus: {
    backgroundColor: C.surface,
    borderRadius: RADIUS.md,
    height: 60,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
    borderStyle: 'dashed',
  },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: C.grey2, fontSize: 16, fontWeight: '600' },
  botoesWrap: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
});
