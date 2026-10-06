import { Tarefa } from "./Task"

export class Lista {

    private listaTarefas: Tarefa[] = []

    adicionarTarefa(tarefa: Tarefa): void {
        this.listaTarefas.push(tarefa);
    }

    excluirTarefa(id: number) {
        const tamanhoAntes = this.listaTarefas.length;
        this.listaTarefas = this.listaTarefas.filter(tarefa => tarefa.id !== id);
        return this.listaTarefas.length < tamanhoAntes;
    }

    editarTarefa(id: number) {

    }

    listarTarefa() {

    }

    sortearPorPrazoEntrega() {

    }

    
}