const form = document.getElementById("nova-tarefa-form");
const feedback = document.getElementById("form-feedback");
 
form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
 

export type Materia = "Artes" | "Banco de Dados" | "Biologia" | "Educação Física" | "Engenharia de Software" | "Filosofia" | "Física" | "Geografia" | "História" | "Português" | "Matemática" | "PPO" | "Programação" | "Química" | "Redes de Computadores" | "Sociologia" | "IA e Machine Learning" | "Python" | "Inglês"
export type Tipo_ativ = "Prova" | "Trabalho" | "Apresentação"

export class novaTarefa {

    constructor(
        private id: number,
        public nome: String,
        public materia: Materia,
        public tipo_ativ: Tipo_ativ,
        public prazo: Date,
        public obs_ativ: String
    ) { }

    getId(): number {
        return this.id
    }
}



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
 
function mostrarFeedback(texto: any, tipo: any) {
  feedback.textContent = texto;
  feedback.className = `form-feedback form-feedback--${tipo}`;
}