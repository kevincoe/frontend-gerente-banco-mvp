class Api {
    static baseUrl = 'http://127.0.0.1:5000/api/clientes';

    static async getClientes() {
        const response = await fetch(this.baseUrl);
        return response.json();
    }

    static async getCliente(id) {
        const response = await fetch(`${this.baseUrl}/${id}`);
        return response.json();
    }

    static async addCliente(cliente) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });
        return response.json();
    }

    static async updateCliente(id, cliente) {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });
        return response.json();
    }

    static async deleteCliente(id) {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    }
}