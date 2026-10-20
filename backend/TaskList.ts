import { Tarefa, Materia, Tipo_ativ } from "./Task.ts";
 
export interface DadosEdicao {
  nome?: string;
  materia?: Materia;
  tipo_ativ?: Tipo_ativ;
  prazo?: Date;
  obs_ativ?: string;
}
 
export class Lista {
  private listaTarefas: Tarefa[];
 
  constructor(tarefas: Tarefa[] = []) {
    this.listaTarefas = [...tarefas];
  }
 
  adicionarTarefa(tarefa: Tarefa): void {
    this.listaTarefas.push(tarefa);
  }
 
  // Devolve true se alguma tarefa foi removida.
  excluirTarefa(id: number): boolean {
    const tamanhoAntes = this.listaTarefas.length;
    this.listaTarefas = this.listaTarefas.filter(
      (tarefa) => tarefa.getId() !== id
    );
    return this.listaTarefas.length < tamanhoAntes;
  }
 
  private buscarPorId(id: number): Tarefa | undefined {
    return this.listaTarefas.find((tarefa) => tarefa.getId() === id);
  }
 
  // Ex: lista.editarTarefa(3, { nome: "Novo nome" })
  // Devolve false se não existir tarefa com esse id.
  editarTarefa(id: number, dados: DadosEdicao): boolean {
    const tarefa = this.buscarPorId(id);
    if (!tarefa) return false;
 
    if (dados.nome !== undefined) tarefa.nome = dados.nome;
    if (dados.materia !== undefined) tarefa.materia = dados.materia;
    if (dados.tipo_ativ !== undefined) tarefa.tipo_ativ = dados.tipo_ativ;
    if (dados.prazo !== undefined) tarefa.prazo = dados.prazo;
    if (dados.obs_ativ !== undefined) tarefa.obs_ativ = dados.obs_ativ;
 
    return true;
  }
 
  // Devolve uma CÓPIA: quem chama não consegue bagunçar o array interno.
  listarTarefa(): Tarefa[] {
    return [...this.listaTarefas];
  }
 
  // Do prazo mais próximo ao mais distante (ou o contrário, se decrescente).
  sortearPorPrazoEntrega(decrescente: boolean = false): Tarefa[] {
    const ordenada = [...this.listaTarefas].sort(
      (a, b) => a.prazo.getTime() - b.prazo.getTime()
    );
    return decrescente ? ordenada.reverse() : ordenada;
  }
 
  // Matéria de A a Z; empate desempata pelo prazo mais próximo.
  ordenarPorMateria(): Tarefa[] {
    return [...this.listaTarefas].sort(
      (a, b) =>
        a.materia.localeCompare(b.materia, "pt-BR") ||
        a.prazo.getTime() - b.prazo.getTime()
    );
  }
}