// tarefas.js — página principal (tarefas.html)

import { buscarTarefas, excluirTarefaNoBanco, sair, usuarioEhAdmin, pegar, criar, slug } from "./api.js";
import { Lista } from "./modelo.js";

const listaEl = pegar("task-list");
const ordenarEl = pegar("sort-select");
const barraAdminEl = pegar("admin-bar");

let lista = new Lista();
let souAdmin = false;

function tarefasOrdenadas() {
  if (ordenarEl.value === "distantes") return lista.sortearPorPrazoEntrega(true);
  if (ordenarEl.value === "materia") return lista.ordenarPorMateria();
  return lista.sortearPorPrazoEntrega();
}

function criarCard(tarefa) {
  const card = criar("article", tarefa.estaUrgente() ? "task is-urgent" : "task");

  const assunto = criar("div", "task__subject");
  assunto.append(
    criar("span", "task__subject-name", tarefa.materia),
    criar("span", `task__type task__type--${slug(tarefa.tipo_ativ)}`, tarefa.tipo_ativ)
  );

  const corpo = criar("div");
  corpo.append(criar("p", "task__name", tarefa.nome), criar("p", "task__desc", tarefa.obs_ativ));

  const meta = criar("div", "task__meta");
  meta.append(
    criar("span", "task__date", tarefa.prazoFormatado()),
    criar("span", "task__countdown", tarefa.textoContagem())
  );

  if (souAdmin) {
    const botao = criar("button", "task__delete", "Excluir");
    botao.type = "button";
    botao.addEventListener("click", () => excluir(tarefa));
    meta.append(botao);
  }

  card.append(assunto, corpo, meta);
  return card;
}

function desenhar() {
  listaEl.replaceChildren();
  const tarefas = tarefasOrdenadas();
  if (tarefas.length === 0) {
    listaEl.append(criar("p", "task-list__status", "Nenhuma tarefa cadastrada ainda."));
    return;
  }
  tarefas.forEach((tarefa) => listaEl.append(criarCard(tarefa)));
}

async function excluir(tarefa) {
  if (!confirm(`Excluir "${tarefa.nome}"?`)) return;
  try {
    await excluirTarefaNoBanco(tarefa.getId());
    lista.excluirTarefa(tarefa.getId());
    desenhar();
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível excluir. Confirme se você está logado como admin.");
  }
}

async function iniciar() {
  listaEl.replaceChildren(criar("p", "task-list__status", "Carregando tarefas..."));
  try {
    [souAdmin, lista] = await Promise.all([usuarioEhAdmin(), buscarTarefas()]);
  } catch (erro) {
    console.error(erro);
    listaEl.replaceChildren(criar("p", "task-list__status", "Não foi possível carregar as tarefas. Veja o console (F12)."));
    return;
  }

  if (souAdmin) {
    const botao = criar("button", "admin-bar__link", "Sair do modo admin");
    botao.type = "button";
    botao.addEventListener("click", async () => {
      await sair();
      location.reload();
    });
    barraAdminEl.append(botao);
  }
  desenhar();
}

ordenarEl.addEventListener("change", desenhar);
iniciar();