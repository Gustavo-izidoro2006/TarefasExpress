import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../constants/theme';
import { Header, BottomTab } from '../components/ui';
import { PageTransition } from '../components/animations';
import AbaMenu    from './AbaMenu';
import AbaTarefas from './AbaTarefas';
import AbaChat    from './AbaChat';
import AbaMembros from './AbaMembros';

export default function TelaGrupo({ grupo, onBack }) {
  const [aba, setAba] = useState('menu');

  const notifs = {
    tarefas: 4,
    chat: grupo.chatNotifs,
    membros: grupo.membros > 9 ? 9 : grupo.membros,
  };

  return (
    <SafeAreaView style={s.tela}>
      <PageTransition direction="right">
        <Header
          titulo={grupo.nome}
          iconName={grupo.iconName}
          iconColor={grupo.cor}
          onBack={onBack}
        />

        <View style={{ flex: 1 }}>
          {aba === 'menu'    && <AbaMenu    grupo={grupo} key="menu" />}
          {aba === 'tarefas' && <AbaTarefas grupo={grupo} key="tarefas" />}
          {aba === 'chat'    && <AbaChat    grupo={grupo} key="chat" />}
          {aba === 'membros' && <AbaMembros grupo={grupo} key="membros" />}
        </View>

        <BottomTab aba={aba} setAba={setAba} notifs={notifs} />
      </PageTransition>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.bg },
});
