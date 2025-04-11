class Api {
  static baseUrl = "http://127.0.0.1:5000/api/clientes";

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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    });
    return response.json();
  }

  static async updateCliente(id, cliente) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    });
    return response.json();
  }

  static async deleteCliente(id) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
    return response.json();
  }

  static async getInvestimentos(clienteId) {
    const response = await fetch(`${this.baseUrl}/${clienteId}/investimentos`);
    return response.json();
  }

  static async getInvestimentosAgregados(clienteId) {
    const response = await fetch(
      `${this.baseUrl}/${clienteId}/investimentos/agregados`
    );
    return response.json();
  }

  static async getValorCarteira(clienteId) {
    const response = await fetch(
      `${this.baseUrl}/${clienteId}/investimentos/carteira`
    );
    return response.json();
  }

  static async comprarAcoes(clienteId, dadosCompra) {
    const response = await fetch(
      `${this.baseUrl}/${clienteId}/investimentos/acoes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosCompra),
      }
    );
    return response.json();
  }

  static async comprarDolar(clienteId, dadosCompra) {
    const response = await fetch(
      `${this.baseUrl}/${clienteId}/investimentos/dolar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosCompra),
      }
    );
    return response.json();
  }

  static async getValorCarteira(clienteId) {
    const response = await fetch(
      `${this.baseUrl}/${clienteId}/investimentos/carteira`
    );
    return response.json();
  }

  static async getInvestimentos(clienteId) {
    const response = await fetch(`${this.baseUrl}/${clienteId}/investimentos`);
    return response.json();
  }

  static async getInvestimentosAgregados(clienteId) {
    const response = await fetch(
      `${this.baseUrl}/${clienteId}/investimentos/agregados`
    );
    return response.json();
  }

  static async comprarAcoes(clienteId, dados) {
    const response = await fetch(
      `${this.baseUrl}/${clienteId}/investimentos/acoes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }

    return response.json();
  }

  static async comprarDolar(clienteId, dados) {
    const response = await fetch(
      `${this.baseUrl}/${clienteId}/investimentos/dolar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }

    return response.json();
  }
}
