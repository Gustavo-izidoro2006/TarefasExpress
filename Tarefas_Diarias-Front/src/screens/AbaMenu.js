import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { C, RADIUS } from '../constants/theme';
import { Badge, Avatar, StatCard } from '../components/ui';
import { FadeIn, StaggerItem, PulseView } from '../components/animations';
import { AVISOS_EMPRESA } from '../data/mock';

export default function AbaMenu({ grupo }) {
  const [avisosAbertos, setAvisosAbertos] = useState(true);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={s.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Estatísticas */}
      <FadeIn delay={0}>
        <Text style={s.secTitle}>Suas estatísticas</Text>
        <View style={s.statsRow}>
          <StatCard num={grupo.pendentes}  label="Pendentes"  tipo="pendente"  />
          <StatCard num={grupo.concluidas} label="Concluídas" tipo="concluida" />
        </View>
      </FadeIn>

      {/* Avisos */}
      <FadeIn delay={100}>
        <TouchableOpacity
          style={s.avisosHeader}
          onPress={() => setAvisosAbertos(!avisosAbertos)}
          activeOpacity={0.85}
        >
          <Ionicons
            name={avisosAbertos ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={C.grey2}
          />
          <Text style={s.avisosTitle}>AVISOS</Text>
          <PulseView active style={{ position: 'relative' }}>
            <MaterialCommunityIcons name="bell-ring" size={26} color={C.red} />
            <Badge count={9} />
          </PulseView>
        </TouchableOpacity>
      </FadeIn>

      {avisosAbertos && (
        <View style={{ gap: 10 }}>
          {AVISOS_EMPRESA.map((av, i) => (
            <StaggerItem key={av.id} index={i}>
              <View style={[s.avisoCard, av.urgente && s.avisoCardUrgente]}>
                <Avatar size={36} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={s.avisoAutor}>{av.de}</Text>
                    {av.urgente && (
                      <View style={s.urgenteBadge}>
                        <Text style={{ color: C.red, fontSize: 10, fontWeight: '800' }}>URGENTE</Text>
                      </View>
                    )}
                  </View>
                  <Text style={s.avisoMsg}>• {av.msg}</Text>
                </View>
              </View>
            </StaggerItem>
          ))}

          <TouchableOpacity style={s.verMais}>
            <MaterialCommunityIcons name="chevron-down" size={16} color={C.white} />
            <Text style={s.verMaisText}>5+ avisos</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { padding: 20, gap: 16 },

  secTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: C.white,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },

  avisosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.surface,
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  avisosTitle: {
    flex: 1,
    color: C.white,
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1.5,
    marginLeft: 10,
  },

  avisoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: C.cardAlt,
    borderRadius: RADIUS.md,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  avisoCardUrgente: {
    borderColor: C.red + '44',
    backgroundColor: C.red + '0d',
  },
  avisoAutor: { color: C.white, fontWeight: '800', fontSize: 13, marginBottom: 3 },
  avisoMsg: { color: C.grey1, fontSize: 13, lineHeight: 18 },
  urgenteBadge: {
    backgroundColor: C.red + '22',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: C.red + '55',
  },

  verMais: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: C.red,
    borderRadius: RADIUS.full,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  verMaisText: { color: C.white, fontWeight: '800', fontSize: 13 },
});
