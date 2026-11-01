// modelo.js — as duas classes do projeto: Tarefa e Lista

export class Tarefa {
  #id; // privado: só se lê pelo getId()

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

  // Linha do banco -> Tarefa. A data é montada no fuso local
  // (new Date("2025-09-18") viria em UTC e poderia cair no dia anterior).
  static fromRow(linha) {
    const [ano, mes, dia] = linha.prazo.split("-").map(Number);
    return new Tarefa(
      linha.id, linha.nome, linha.materia, linha.tipo_ativ,
      new Date(ano, mes - 1, dia), linha.obs_ativ ?? ""
    );
  }

  // Dias até o prazo (negativo = atrasada).
  diasRestantes() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const prazo = new Date(this.prazo);
    prazo.setHours(0, 0, 0, 0);
    return Math.round((prazo - hoje) / 86400000);
  }

  // Regra do projeto: 3 dias ou menos = urgente (vermelho).
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

  // Ex: lista.editarTarefa(3, { nome: "Novo nome" }). false se o id não existe.
  editarTarefa(id, dados) {
    const tarefa = this.#tarefas.find((t) => t.getId() === id);
    if (!tarefa) return false;
    Object.assign(tarefa, dados);
    return true;
  }

  // Devolve uma cópia: quem chama não mexe na lista interna.
  listarTarefa() {
    return [...this.#tarefas];
  }

  // Prazo mais próximo primeiro (ou o contrário, se decrescente = true).
  sortearPorPrazoEntrega(decrescente = false) {
    const lista = [...this.#tarefas].sort((a, b) => a.prazo - b.prazo);
    return decrescente ? lista.reverse() : lista;
  }

  // Matéria de A a Z; empate desempata pelo prazo.
  ordenarPorMateria() {
    return [...this.#tarefas].sort(
      (a, b) => a.materia.localeCompare(b.materia, "pt-BR") || a.prazo - b.prazo
    );
  }
}
