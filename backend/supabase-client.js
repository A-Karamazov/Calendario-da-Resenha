// =========================================================
// supabase-client.js
// Cria UMA instância do cliente Supabase e deixa disponível
// em window.db para as outras páginas usarem
// (tarefas.js, nova-tarefa.js, admin-login.js).
//
// "supabase" aqui é o objeto global que vem do script da CDN
// carregado antes deste arquivo no HTML.
// =========================================================

window.db = window.supabase.createClient(
  window.SUPABASE_CONFIG.url,
  window.SUPABASE_CONFIG.anonKey
);
