// nova-tarefa.js — formulário "Criar nova tarefa"

import { inserirTarefa, pegar, mostrarMensagem } from "./api.js";

const form = pegar("nova-tarefa-form");
const feedback = pegar("form-feedback");
const botaoSalvar = pegar("btn-salvar");

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const dados = {
    nome: pegar("nome").value.trim(),
    materia: pegar("materia").value,
    tipo_ativ: pegar("tipo").value,
    prazo: pegar("data").value,
    obs_ativ: pegar("descricao").value.trim(),
  };

  if (!dados.nome || !dados.materia || !dados.tipo_ativ || !dados.prazo) {
    mostrarMensagem(feedback, "Preencha todos os campos obrigatórios.", "erro");
    return;
  }

  botaoSalvar.disabled = true; // evita duplo clique cadastrando duas vezes
  mostrarMensagem(feedback, "Salvando...", "info");

  try {
    await inserirTarefa(dados);
    window.location.href = "tarefas.html";
  } catch (erro) {
    console.error(erro);
    mostrarMensagem(feedback, "Não foi possível salvar a tarefa. Tente novamente.", "erro");
    botaoSalvar.disabled = false;
  }
});
