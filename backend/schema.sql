-- =========================================================
-- Agenda Acadêmica — Schema SQL (PostgreSQL / Supabase)
-- Cole este arquivo inteiro no SQL Editor do Supabase e rode.
-- =========================================================

-- Extensão necessária para gerar IDs únicos (uuid) automaticamente.
create extension if not exists "pgcrypto";


-- ---------------------------------------------------------
-- Tabela: tarefas
-- Guarda cada prova/trabalho/apresentação cadastrada.
-- ---------------------------------------------------------
create table public.tarefas (
  id             uuid primary key default gen_random_uuid(),

  nome           text not null,                -- Ex: "Prova de Matemática"

  materia        text not null check (materia in (
                   'Matemática', 'História', 'Geografia',
                   'Português', 'Biologia', 'Química'
                 )),

  tipo           text not null check (tipo in (
                   'Prova', 'Trabalho', 'Apresentação', 'Redação'
                 )),

  data_entrega   date not null,                 -- dd/mm/aaaa no formulário
  descricao      text,                          -- opcional, pode ficar em branco

  status         text not null default 'pendente' check (status in (
                   'pendente', 'concluida'
                 )),

  data_cadastro  timestamptz not null default now()  -- preenchido sozinho na criação
);

-- Índice para a tela "Próximas Tarefas" (ordenar por data de entrega é a operação mais comum).
create index tarefas_data_entrega_idx on public.tarefas (data_entrega);


-- ---------------------------------------------------------
-- Tabela: admins
-- Lista de quem tem permissão de administrador.
-- Cada linha aponta para um usuário já criado em Authentication > Users.
-- ---------------------------------------------------------
create table public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  criado_em  timestamptz not null default now()
);

-- Não crie nenhuma policy de select/insert nesta tabela para o público.
-- Sem policy = RLS bloqueia todo mundo por padrão, exceto você mesmo
-- inserindo manualmente pelo painel (Table Editor) quando criar o admin.


-- ---------------------------------------------------------
-- Row Level Security (RLS)
-- É isso que garante a regra de negócio direto no banco,
-- não só escondendo botões no front-end.
-- ---------------------------------------------------------
alter table public.tarefas enable row level security;
alter table public.admins  enable row level security;

-- Qualquer pessoa (mesmo sem login) pode VER as tarefas.
create policy "tarefas_select_publico"
  on public.tarefas for select
  using (true);

-- Qualquer pessoa (mesmo sem login) pode CADASTRAR uma nova tarefa,
-- já que os alunos não precisam de conta para usar a agenda.
create policy "tarefas_insert_publico"
  on public.tarefas for insert
  with check (true);

-- Só quem está na tabela "admins" pode EDITAR uma tarefa existente.
create policy "tarefas_update_admin"
  on public.tarefas for update
  using (
    exists (
      select 1 from public.admins
      where user_id = auth.uid()
    )
  );

-- Só quem está na tabela "admins" pode EXCLUIR uma tarefa.
create policy "tarefas_delete_admin"
  on public.tarefas for delete
  using (
    exists (
      select 1 from public.admins
      where user_id = auth.uid()
    )
  );


-- ---------------------------------------------------------
-- Depois de rodar este script:
-- 1. Vá em Authentication > Users e crie o usuário do admin
--    (e-mail + senha).
-- 2. Vá em Table Editor > admins e insira uma linha com o
--    user_id desse usuário (copie o ID lá de Authentication).
-- 3. Pronto: esse login agora passa nas policies de update/delete.
-- ---------------------------------------------------------
