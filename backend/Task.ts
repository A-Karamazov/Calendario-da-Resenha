export type MATERIAS = ["Artes" | "Banco de Dados" | "Biologia" | "Educação Física" | "Engenharia de Software" | "Filosofia" | "Física" | "Geografia" | "História" | "Português" | "Matemática" | "PPO" | "Programação" | "Química" | "Redes de Computadores" | "Sociologia" | "IA e Machine Learning" | "Python" | "Inglês"] as const;
export type TIPOS_ATIV = ["Prova" | "Trabalho" | "Apresentação"] as const;

export type Materia = (typeof MATERIAS)[number];
export type Tipo_ativ = (typeof TIPOS_ATIV)[number];
 
// Type guards: confirmam que um texto qualquer (ex: vindo de um <select>)
// é mesmo uma Materia / Tipo_ativ válidos, sem usar "as" às cegas.
export function ehMateria(valor: string): valor is Materia {
  return (MATERIAS as readonly string[]).includes(valor);
}
 
export function ehTipoAtiv(valor: string): valor is Tipo_ativ {
  return (TIPOS_ATIV as readonly string[]).includes(valor);
}
 
// Formato de uma linha da tabela "tarefas" no Supabase (ver schema.sql).
export interface TarefaRow {
  id: number;
  nome: string;
  materia: Materia;
  tipo_ativ: Tipo_ativ;
  prazo: string; // "AAAA-MM-DD"
  obs_ativ: string | null;
  status: string;
  data_cadastro: string;
}
 
// Dados enviados ao banco ao criar uma tarefa (sem id: o banco gera).
export interface NovaTarefaDados {
  nome: string;
  materia: Materia;
  tipo_ativ: Tipo_ativ;
  prazo: string; // "AAAA-MM-DD", direto do <input type="date">
  obs_ativ: string;
}
 
export class Tarefa {
  constructor(
    private id: number,
    public nome: string,
    public materia: Materia,
    public tipo_ativ: Tipo_ativ,
    public prazo: Date,
    public obs_ativ: string = ""
  ) {}
 
  // "id" é private: este getter é a única forma de ler fora da classe.
  getId(): number {
    return this.id;
  }
 
  // Converte uma linha do banco em um objeto Tarefa.
  static fromRow(row: TarefaRow): Tarefa {
    // Monta a data no fuso local. Usar new Date("2025-09-18") interpretaria
    // como UTC e poderia mostrar o dia anterior no Brasil.
    const [ano, mes, dia] = row.prazo.split("-").map(Number);
    return new Tarefa(
      row.id,
      row.nome,
      row.materia,
      row.tipo_ativ,
      new Date(ano, mes - 1, dia),
      row.obs_ativ ?? ""
    );
  }
 
  // Dias que faltam até o prazo. Negativo = atrasada.
  diasRestantes(): number {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
 
    const prazoSemHora = new Date(this.prazo);
    prazoSemHora.setHours(0, 0, 0, 0);
 
    const diffMs = prazoSemHora.getTime() - hoje.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  }