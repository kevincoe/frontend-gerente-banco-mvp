class ClienteService {
    constructor(api) {
        this.api = api;
    }

    async listarClientes() {
        return await this.api.getClientes();
    }

    async adicionarCliente(cliente) {
        return await this.api.addCliente(cliente);
    }

    async atualizarCliente(id, cliente) {
        return await this.api.updateCliente(id, cliente);
    }

    async removerCliente(id) {
        return await this.api.deleteCliente(id);
    }
}