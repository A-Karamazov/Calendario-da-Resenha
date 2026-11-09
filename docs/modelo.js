// modelo.js — as duas classes do projeto: Tarefa e Lista

export class Tarefa {
  #id; 

  constructor(id, nome, materia, tipo_ativ, prazo, obs_ativ = "") {
    this.#id = id;
    this.nome = nome;
    this.materia = materia;
    this.tipo_ativ = tipo_ativ;
    this.prazo = prazo; // objeto Date
    this.obs_ativ = obs_ativ;
  }

  getId() {
    return this.#id;
  }

  // Formata a data do banco (YYYY-MM-DD) para um objeto Date. O mês é 0-11.
  static fromRow(linha) {
    const [ano, mes, dia] = linha.prazo.split("-").map(Number);
    return new Tarefa(
      linha.id, linha.nome, linha.materia, linha.tipo_ativ,
      new Date(ano, mes - 1, dia), linha.obs_ativ ?? ""
    );
  }

  diasRestantes() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const prazo = new Date(this.prazo);
    prazo.setHours(0, 0, 0, 0);
    return Math.round((prazo - hoje) / 86400000);
  }

  estaUrgente() {
    return this.diasRestantes() <= 3;
  }

  textoContagem() {
    const dias = this.diasRestantes();
    if (dias < 0) return "Atrasada";
    if (dias === 0) return "Entrega hoje";
    if (dias === 1) return "1 dia restante";
    return `${dias} dias restantes`;
  }

  prazoFormatado() {
    const dia = String(this.prazo.getDate()).padStart(2, "0");
    const mes = String(this.prazo.getMonth() + 1).padStart(2, "0");
    return `${dia}/${mes}/${this.prazo.getFullYear()}`;
  }
}



export class Lista {
  #tarefas;

  constructor(tarefas = []) {
    this.#tarefas = [...tarefas];
  }

  adicionarTarefa(tarefa) {
    this.#tarefas.push(tarefa);
  }

  // true se alguma tarefa foi removida
  excluirTarefa(id) {
    const antes = this.#tarefas.length;
    this.#tarefas = this.#tarefas.filter((t) => t.getId() !== id);
    return this.#tarefas.length < antes;
  }

  editarTarefa(id, dados) {
    const tarefa = this.#tarefas.find((t) => t.getId() === id);
    if (!tarefa) return false;
    Object.assign(tarefa, dados);
    return true;
  }

  listarTarefa() {
    return [...this.#tarefas];
  }

  sortearPorPrazoEntrega(decrescente = false) {
    const lista = [...this.#tarefas].sort((a, b) => a.prazo - b.prazo);
    return decrescente ? lista.reverse() : lista;
  }

  ordenarPorMateria() {
    return [...this.#tarefas].sort(
      (a, b) => a.materia.localeCompare(b.materia, "pt-BR") || a.prazo - b.prazo
    );
  }
}