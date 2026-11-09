drop table if exists public.tarefas;

create table public.tarefas (
  id             bigint generated always as identity primary key,

  nome           text not null check (char_length(nome) between 1 and 100),

  materia        text not null check (materia in (
                   'Artes', 'Banco de Dados', 'Biologia', 'Educação Física',
                   'Engenharia de Software', 'Filosofia', 'Física', 'Geografia',
                   'História', 'Português', 'Matemática', 'PPO', 'Programação',
                   'Química', 'Redes de Computadores', 'Sociologia',
                   'IA e Machine Learning', 'Python', 'Inglês'
                 )),

  tipo_ativ      text not null check (tipo_ativ in (
                   'Prova', 'Trabalho', 'Apresentação'
                 )),

  prazo          date not null,
  obs_ativ       text check (char_length(obs_ativ) <= 500),

  status         text not null default 'pendente' check (status in (
                   'pendente', 'concluida'
                 )),

  data_cadastro  timestamptz not null default now()
);

create index tarefas_prazo_idx on public.tarefas (prazo);


create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  criado_em  timestamptz not null default now()
);


alter table public.tarefas enable row level security;
alter table public.admins  enable row level security;

-- Qualquer pessoa (sem login) pode ver as tarefas.
create policy "tarefas_select_publico"
  on public.tarefas for select
  using (true);

-- Qualquer pessoa (sem login) pode cadastrar tarefas.
create policy "tarefas_insert_publico"
  on public.tarefas for insert
  with check (true);

-- só admin edita
create policy "tarefas_update_admin"
  on public.tarefas for update
  using (exists (select 1 from public.admins where user_id = auth.uid()))
  with check (exists (select 1 from public.admins where user_id = auth.uid()));

-- só admin exclui
create policy "tarefas_delete_admin"
  on public.tarefas for delete
  using (exists (select 1 from public.admins where user_id = auth.uid()));

-- Cada usuário logado só consegue ler a PRÓPRIA linha em "admins".
-- É isso que permite ao site descobrir se quem entrou é admin
-- (sem expor a lista de admins para ninguém).
drop policy if exists "admins_select_proprio" on public.admins;
create policy "admins_select_proprio"
  on public.admins for select
  using (user_id = auth.uid());
