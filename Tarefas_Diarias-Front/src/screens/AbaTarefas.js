import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Animated, StyleSheet, ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { C, RADIUS, SHADOW } from '../constants/theme';
import { FadeIn, StaggerItem, useTaskCompleteAnim } from '../components/animations';
import { apiClient } from '../services/api';


const PRIO_COLOR = { Alta: C.red, Média: C.yellow, Baixa: C.green };
const PRIO_ICON  = { Alta: 'alert-circle', Média: 'alert', Baixa: 'checkmark-circle' };

function TarefaCard({ item, onToggle, index }) {
  const { scale, bgColor, trigger } = useTaskCompleteAnim();

  return (
    <StaggerItem index={index}>
      <TouchableOpacity onPress={() => trigger(() => onToggle(item.id))} activeOpacity={0.9}>
        <Animated.View
          style={[
            s.card,
            item.concluida && s.cardConcluida,
            { transform: [{ scale }], backgroundColor: bgColor },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <View style={[s.check, item.concluida && s.checkDone]}>
              {item.concluida && <Ionicons name="checkmark" size={16} color={C.white} />}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={[s.titulo, item.concluida && { textDecorationLine: 'line-through', color: C.grey2 }]}
              >
                {item.titulo}
              </Text>
              <Text style={s.desc}>• {item.desc}</Text>

              <View style={s.metaRow}>
                <View style={s.prazoBox}>
                  <Ionicons name="calendar-outline" size={13} color={C.grey2} />
                  <Text style={s.prazoText}>{item.prazo}</Text>
                </View>
                <View style={s.prazoRelBox}>
                  <Ionicons name="time-outline" size={13} color={C.grey2} />
                  <Text style={[s.prazoRelText, item.concluida && { color: C.green }]}>
                    {item.prazoRelativo}
                  </Text>
                </View>
              </View>

              <View style={s.prioRow}>
                <Ionicons name={PRIO_ICON[item.prioridade]} size={14} color={PRIO_COLOR[item.prioridade]} />
                <Text style={s.prioLabel}>Prioridade: </Text>
                <Text style={[s.prioValor, { color: PRIO_COLOR[item.prioridade] }]}>
                  {item.prioridade}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </StaggerItem>
  );
}

export default function AbaTarefas({ grupo }) {
  const [filtro, setFiltro]     = useState('todas');
  const [tarefas, setTarefas]   = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarTarefas = useCallback(async () => {
    try {
      const data = await apiClient.get(`/grupos/${grupo?.id}/tarefas`);
      setTarefas(Array.isArray(data) ? data : (data?.items ?? data?.tarefas ?? []));

    } catch {
      // mantém lista vazia para não usar mock
      setTarefas([]);
    } finally {
      setCarregando(false);
    }

  }, [grupo?.id]);

  useEffect(() => { carregarTarefas(); }, [carregarTarefas]);

  const lista =
    filtro === 'todas'       ? tarefas :
    filtro === 'incompletas' ? tarefas.filter(t => !t.concluida) :
                               tarefas.filter(t =>  t.concluida);

  const toggle = async (id) => {
    // Atualiza otimisticamente na UI
    setTarefas(prev => prev.map(t => t.id === id ? { ...t, concluida: !t.concluida } : t));
    try {
      const tarefa = tarefas.find(t => t.id === id);
      if (!tarefa) return;
      await apiClient.put(`/tarefas/${id}`, { concluida: !tarefa.concluida });

    } catch {
      // Reverte em caso de erro
      setTarefas(prev => prev.map(t => t.id === id ? { ...t, concluida: !t.concluida } : t));
    }
  };

  const FILTROS = ['todas', 'incompletas', 'concluídas'];

  return (
    <View style={{ flex: 1 }}>
      <FadeIn delay={0}>
        <Text style={s.secTitle}>Lista de Tarefas</Text>
      </FadeIn>

      <FadeIn delay={60} style={s.filtrosRow}>
        {FILTROS.map(f => (
          <TouchableOpacity
            key={f}
            style={[s.filtroBotao, filtro === f && s.filtroAtivo]}
            onPress={() => setFiltro(f)}
            activeOpacity={0.8}
          >
            <Text style={[s.filtroLabel, filtro === f && { color: C.white }]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </FadeIn>

      {carregando ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator size="large" color={C.red} />
        </View>
      ) : (
        <FlatList
          data={lista}
          keyExtractor={i => String(i.id)}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TarefaCard item={item} onToggle={toggle} index={index} />
          )}
          ListEmptyComponent={
            <View style={s.empty}>
              <MaterialCommunityIcons name="clipboard-check-outline" size={48} color={C.grey3} />
              <Text style={s.emptyText}>Nenhuma tarefa aqui</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  secTitle: {
    fontSize: 18, fontWeight: '900', color: C.white,
    letterSpacing: 0.5, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  filtrosRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingBottom: 8 },
  filtroBotao: {
    flex: 1, paddingVertical: 10,
    borderRadius: RADIUS.full, alignItems: 'center',
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
  },
  filtroAtivo: { backgroundColor: C.red, borderColor: C.red },
  filtroLabel: { color: C.grey1, fontWeight: '700', fontSize: 12 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  card: {
    backgroundColor: C.surface, borderRadius: RADIUS.md,
    padding: 16, borderWidth: 1, borderColor: C.border, ...SHADOW.card,
  },
  cardConcluida: { borderColor: C.green + '44' },
  check: {
    width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: C.grey3,
    alignItems: 'center', justifyContent: 'center', marginTop: 2, backgroundColor: C.card,
  },
  checkDone: { backgroundColor: C.green, borderColor: C.green },
  titulo: { color: C.white, fontWeight: '800', fontSize: 15, marginBottom: 4 },
  desc:   { color: C.grey1, fontSize: 13, lineHeight: 18, marginBottom: 10 },
  metaRow: { flexDirection: 'row', gap: 14, marginBottom: 8, flexWrap: 'wrap' },
  prazoBox:    { flexDirection: 'row', alignItems: 'center', gap: 4 },
  prazoRelBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  prazoText:    { color: C.grey2, fontSize: 12 },
  prazoRelText: { color: C.grey2, fontSize: 12, fontWeight: '600' },
  prioRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  prioLabel: { color: C.grey2, fontSize: 12 },
  prioValor: { fontSize: 12, fontWeight: '800' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: C.grey2, fontSize: 16, fontWeight: '600' },
});
