// api.js — conexão com o Supabase, funções do banco e utilitários de tela

import { Lista, Tarefa } from "./modelo.js";

const cfg = window.SUPABASE_CONFIG;
const db = window.supabase.createClient(cfg.url, cfg.anonKey);

// ---------- tarefas ----------
export async function buscarTarefas() {
  const { data, error } = await db.from("tarefas").select("*");
  if (error) throw error;
  return new Lista(data.map((linha) => Tarefa.fromRow(linha)));
}

export async function inserirTarefa(dados) {
  const { error } = await db.from("tarefas").insert(dados);
  if (error) throw error;
}

export async function excluirTarefaNoBanco(id) {
  const { data, error } = await db.from("tarefas").delete().eq("id", id).select();
  if (error) throw error;
  if (data.length === 0) throw new Error("Nada foi removido (sem permissão de admin?).");
}

// ---------- admin ----------
export async function entrar(email, senha) {
  const { error } = await db.auth.signInWithPassword({ email, password: senha });
  if (error) throw error;
}

export async function sair() {
  await db.auth.signOut();
}

export async function usuarioEhAdmin() {
  const { data: sessao } = await db.auth.getSession();
  if (!sessao.session) return false;
  const { data, error } = await db
    .from("admins").select("user_id").eq("user_id", sessao.session.user.id).maybeSingle(); 
  return !error && data !== null;
}

// ---------- utilitários de tela ----------

export function pegar(id) { 
  const el = document.getElementById(id);
  if (!el) throw new Error(`Elemento #${id} não encontrado no HTML.`);
  return el;
}

// Cria elemento com classe e texto. textContent (e não innerHTML) impede
// que alguém cadastre HTML/JS malicioso numa tarefa.
export function criar(tag, classe = "", texto = "") {
  const el = document.createElement(tag); 
  if (classe) el.className = classe;
  if (texto) el.textContent = texto;
  return el;
}

// "Apresentação" -> "apresentacao" (para nomes de classe CSS)
export function slug(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function mostrarMensagem(el, texto, tipo) {
  el.textContent = texto;
  el.className = `form-feedback form-feedback--${tipo}`; // tipo: "erro" ou "info"
}
