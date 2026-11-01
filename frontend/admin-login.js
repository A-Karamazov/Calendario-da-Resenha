// adm-login.js — página de login do administrador

import { entrar, sair, usuarioEhAdmin, pegar, mostrarMensagem } from "./api.js";

const form = pegar("admin-login-form");
const feedback = pegar("login-feedback");

// Já logado como admin? Não precisa ver o formulário.
usuarioEhAdmin().then((ehAdmin) => {
  if (ehAdmin) window.location.href = "index.html";
});

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mostrarMensagem(feedback, "Entrando...", "info");

  try {
    await entrar(pegar("email").value.trim(), pegar("senha").value);
  } catch (erro) {
    console.error(erro);
    mostrarMensagem(feedback, "E-mail ou senha inválidos.", "erro");
    return;
  }

  // Login válido não basta: a conta precisa estar na tabela "admins".
  if (!(await usuarioEhAdmin())) {
    await sair();
    mostrarMensagem(feedback, "Esta conta não tem permissão de administrador.", "erro");
    return;
  }
  window.location.href = "index.html";
});
