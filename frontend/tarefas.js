// =========================================================
// tarefas.js — lógica da tela "Tarefas" (index.html)
// =========================================================

const listEl = document.getElementById("task-list");
const sortSelect = document.getElementById("sort-select");
const adminBar = document.getElementById("admin-bar");

// ---------------------------------------------------------
// Funções auxiliares
// ---------------------------------------------------------

// "Matemática" -> "matematica" (sem acento, minúsculo),
// pra bater com as classes do CSS: .task__type--matematica etc.
function slug(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Quantos dias faltam entre hoje e a data de entrega (pode ser negativo).
function diasRestantes(dataEntregaISO) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const entrega = new Date(dataEntregaISO + "T00:00:00");

  const diffMs = entrega - hoje;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

// "2025-09-15" -> "15/09/2025"
function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Texto do selo (badge) de contagem regressiva.
function textoContagem(dias) {
  if (dias < 0) return "Atrasada";
  if (dias === 0) return "Entrega hoje";
  if (dias === 1) return "1 dia restante";
  return `${dias} dias restantes`;
}

// ---------------------------------------------------------
// Renderização
// ---------------------------------------------------------

// Monta o HTML de UM card de tarefa.
function renderTarefa(tarefa, souAdmin) {
  const dias = diasRestantes(tarefa.data_entrega);
  const urgente = dias <= 3;
  const tipoClasse = `task__type--${slug(tarefa.materia)}`;

  const botaoExcluir = souAdmin
    ? `<button class="task__delete" data-id="${tarefa.id}" type="button">Excluir</button>`
    : "";

  return `
    <article class="task ${urgente ? "is-urgent" : ""}">
      <div class="task__subject">
        <span class="task__subject-name">${tarefa.materia}</span>
        <span class="task__type ${tipoClasse}">${tarefa.tipo}</span>
      </div>
      <div>
        <p class="task__name">${tarefa.nome}</p>
        <p class="task__desc">${tarefa.descricao ?? ""}</p>
      </div>
      <div class="task__meta">
        <span class="task__date">${formatarData(tarefa.data_entrega)}</span>
        <span class="task__countdown">${textoContagem(dias)}</span>
        ${botaoExcluir}
      </div>
    </article>
  `;
}

// Busca as tarefas no Supabase (respeitando a ordenação escolhida)
// e desenha a lista inteira na tela.
async function carregarTarefas() {
  listEl.innerHTML = `<p class="task-list__status">Carregando tarefas...</p>`;

  const ordem = sortSelect.value; // "proximas" | "distantes" | "materia"
  let query = window.db.from("tarefas").select("*");

  if (ordem === "proximas") query = query.order("data_entrega", { ascending: true });
  if (ordem === "distantes") query = query.order("data_entrega", { ascending: false });
  if (ordem === "materia") query = query.order("materia", { ascending: true });

  const { data, error } = await query;

  if (error) {
    listEl.innerHTML = `<p class="task-list__status">Não foi possível carregar as tarefas. Verifique o js/config.js.</p>`;
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    listEl.innerHTML = `<p class="task-list__status">Nenhuma tarefa cadastrada ainda.</p>`;
    return;
  }

  const souAdmin = await estaLogadoComoAdmin();
  listEl.innerHTML = data.map((tarefa) => renderTarefa(tarefa, souAdmin)).join("");

  // Liga o clique dos botões "Excluir" recém-criados no HTML.
  if (souAdmin) {
    document.querySelectorAll(".task__delete").forEach((botao) => {
      botao.addEventListener("click", () => excluirTarefa(botao.dataset.id));
    });
  }
}

// ---------------------------------------------------------
// Admin: sessão, barra superior e exclusão
// ---------------------------------------------------------

// Verifica se existe uma sessão de admin ativa (login feito em admin-login.html).
async function estaLogadoComoAdmin() {
  const { data } = await window.db.auth.getSession();
  return !!data.session;
}

// Exclui uma tarefa. Só funciona de verdade se a política RLS permitir
// (ou seja, se este usuário estiver cadastrado na tabela "admins").
async function excluirTarefa(id) {
  const confirmar = confirm("Excluir esta tarefa?");
  if (!confirmar) return;

  const { error } = await window.db.from("tarefas").delete().eq("id", id);

  if (error) {
    alert("Não foi possível excluir. Confirme se você está logado como admin.");
    console.error(error);
    return;
  }

  carregarTarefas();
}

// Mostra "Entrar como admin" ou "Sair do modo admin" no topo da página.
async function atualizarBarraAdmin() {
  const souAdmin = await estaLogadoComoAdmin();

  adminBar.innerHTML = souAdmin
    ? `<button id="btn-logout" class="admin-bar__link" type="button">Sair do modo admin</button>`
    : `<a href="admin-login.html" class="admin-bar__link">Entrar como admin</a>`;

  if (souAdmin) {
    document.getElementById("btn-logout").addEventListener("click", async () => {
      await window.db.auth.signOut();
      location.reload();
    });
  }
}

// ---------------------------------------------------------
// Início
// ---------------------------------------------------------

sortSelect.addEventListener("change", carregarTarefas);

atualizarBarraAdmin();
carregarTarefas();
