// ─── MOCK DATA ───────────────────────────────────────────────────────────────

export const GRUPOS = [
  {
    id: '1',
    nome: 'Empresa / Trabalho',
    role: 'Júnior',
    notifs: 9,
    iconLib: 'MaterialCommunityIcons',
    iconName: 'laptop',
    cor: '#ff2d55',
    pendentes: 6,
    concluidas: 10,
    membros: 25,
    chatNotifs: 9,
  },
  {
    id: '2',
    nome: 'Faculdade',
    role: 'Aluno',
    notifs: 0,
    iconLib: 'MaterialCommunityIcons',
    iconName: 'school',
    cor: '#845ef7',
    pendentes: 3,
    concluidas: 7,
    membros: 12,
    chatNotifs: 0,
  },
  {
    id: '3',
    nome: 'Tarefas / Casa',
    role: 'ADM',
    notifs: 5,
    iconLib: 'MaterialCommunityIcons',
    iconName: 'home-variant',
    cor: '#4dabf7',
    pendentes: 4,
    concluidas: 3,
    membros: 3,
    chatNotifs: 4,
  },
];

export const AVISOS_EMPRESA = [
  {
    id: '1',
    de: 'Gerente',
    msg: 'Estou tirando umas folgas, nesse período, o Usuário4 irá tirar suas dúvidas e ajudar no que for preciso.',
    urgente: false,
  },
  {
    id: '2',
    de: 'Sistema / Empresa',
    msg: 'Feriado amanhã, um ótimo descanso a todos.',
    urgente: false,
  },
  {
    id: '3',
    de: 'Relatório',
    msg: 'Usuário3, a entrega do seu relatório está 1h atrasado. Deve ser entregue até as 10:30h hoje.',
    urgente: true,
  },
  {
    id: '4',
    de: 'Advertência',
    msg: 'O Usuário2 recebeu uma advertência por quebrar uma das normas.',
    urgente: true,
  },
];

export const TAREFAS_EMPRESA = [
  {
    id: '1',
    titulo: 'Entregar Documentação Projeto',
    desc: 'Terminar a documentação do Projeto Web da Empresa X',
    prazo: '17/02 até 18:30h',
    prazoRelativo: '32h restantes',
    prioridade: 'Alta',
    concluida: false,
  },
  {
    id: '2',
    titulo: 'Fazer Relatório da Reunião',
    desc: 'Após a reunião, fazer um relatório dos tópicos comentados',
    prazo: '16/02 até 15:00h',
    prazoRelativo: '3h restantes',
    prioridade: 'Média',
    concluida: false,
  },
  {
    id: '3',
    titulo: 'Entregar Planilha de Preços',
    desc: 'Enviar Planilha de preço ao e-mail "empresateste@gmail.com"',
    prazo: '16/02 / 07:42',
    prazoRelativo: 'Concluída às 07:42',
    prioridade: 'Alta',
    concluida: true,
  },
];

export const MEMBROS = [
  { id: '1', nome: 'Chefe',    cargo: 'ADM',            online: true,  voce: false, isAdm: true },
  { id: '2', nome: 'Gerente',  cargo: 'Administrativo', online: true,  voce: false, isAdm: false },
  { id: '3', nome: 'Analista', cargo: 'Administrativo', online: true,  voce: false, isAdm: false },
  { id: '4', nome: 'Usuário',  cargo: 'Júnior',         online: true,  voce: true,  isAdm: false },
  { id: '5', nome: 'Usuário2', cargo: 'Estagiário',     online: true,  voce: false, isAdm: false },
  { id: '6', nome: 'Usuário3', cargo: 'Sênior',         online: false, voce: false, isAdm: false },
];

export const CHAT_MSGS = [
  {
    id: '1',
    autor: 'Analista',
    cargo: 'Administrativo',
    msg: 'Bom dia a todos! Hoje será necessário a colaboração de todos para completarmos as metas diárias. @Usuário, preciso que me mande a planilha dos preços.',
    hora: '07:10',
    meu: false,
  },
  {
    id: '2',
    autor: 'Analista',
    cargo: 'Administrativo',
    msg: 'Para o e-mail: "empresateste@gmail.com". Com a descrição especificando a planilha.',
    hora: '07:11',
    meu: false,
  },
  {
    id: '3',
    autor: 'Analista',
    cargo: 'Administrativo',
    msg: 'Entendido?',
    hora: '07:11',
    meu: false,
  },
  {
    id: '4',
    autor: 'Você',
    cargo: 'Júnior',
    msg: 'Certo, estou apenas com um problema na planilha. Quando terminar, irei encaminhar para o Senhor.',
    hora: '07:30',
    meu: true,
  },
  {
    id: '5',
    autor: 'Você',
    cargo: 'Júnior',
    msg: 'Enviada ao Senhor.',
    hora: '07:42',
    meu: true,
  },
];
