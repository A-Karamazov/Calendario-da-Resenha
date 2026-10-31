// =========================================================
// nova-tarefa.js — lógica do formulário "Criar Nova Tarefa"
// =========================================================

const form = document.getElementById("nova-tarefa-form");
const feedback = document.getElementById("form-feedback");

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const novaTarefa = {
    nome: document.getElementById("nome").value.trim(),
    materia: document.getElementById("materia").value,
    tipo: document.getElementById("tipo").value,
    data_entrega: document.getElementById("data").value,
    descricao: document.getElementById("descricao").value.trim() || null,
  };

  if (!novaTarefa.nome || !novaTarefa.materia || !novaTarefa.tipo || !novaTarefa.data_entrega) {
    mostrarFeedback("Preencha todos os campos obrigatórios.", "erro");
    return;
  }

  mostrarFeedback("Salvando...", "info");

  const { error } = await window.db.from("tarefas").insert(novaTarefa);

  if (error) {
    mostrarFeedback("Não foi possível salvar a tarefa. Tente novamente.", "erro");
    console.error(error);
    return;
  }

  // Tarefa salva com sucesso: volta para a lista.
  window.location.href = "index.html";
});

function mostrarFeedback(texto, tipo) {
  feedback.textContent = texto;
  feedback.className = `form-feedback form-feedback--${tipo}`;
}
