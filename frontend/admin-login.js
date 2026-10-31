// =========================================================
// admin-login.js — lógica da página admin-login.html
// =========================================================

const form = document.getElementById("admin-login-form");
const feedback = document.getElementById("login-feedback");

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  mostrarFeedback("Entrando...", "info");

  const { error } = await window.db.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    mostrarFeedback("E-mail ou senha inválidos.", "erro");
    console.error(error);
    return;
  }

  // Login ok: volta para a lista de tarefas, agora com os botões de admin.
  window.location.href = "index.html";
});

function mostrarFeedback(texto, tipo) {
  feedback.textContent = texto;
  feedback.className = `form-feedback form-feedback--${tipo}`;
}
