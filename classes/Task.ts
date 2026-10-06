export type Materia = "Artes" | "Banco de Dados" | "Biologia" | "Educação Física" | "Engenharia de Software" | "Filosofia" | "Física" | "Geografia" | "História" | "Português" | "Matemática" | "PPO" | "Programação" | "Química" | "Redes de Computadores" | "Sociologia" | "IA e Machine Learning" | "Python" | "Inglês"
export type Tipo_ativ = "Prova" | "Trabalho" | "Apresentação"

export class Tarefa {

    constructor(
        private id: number,
        public nome: String,
        public materia: Materia,
        public tipo_ativ: Tipo_ativ,
        public prazo: Date,
        public obs_ativ: String
    ) { }

    public get id(): string {
        return this.id
    }
}



