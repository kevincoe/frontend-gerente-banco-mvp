document.addEventListener('DOMContentLoaded', () => {
    const clienteService = new ClienteService(Api);

    const nomeInput = document.getElementById('nome');
    const agenciaInput = document.getElementById('agencia');
    const contaInput = document.getElementById('conta');
    const nivelInput = document.getElementById('nivel');
    const produtosInput = document.getElementById('produtos');
    const addClienteButton = document.getElementById('add-cliente');
    const clientesList = document.getElementById('clientes-list');

    const renderClientes = async () => {
        const clientes = await clienteService.listarClientes();
        clientesList.innerHTML = '';
        clientes.forEach(cliente => {
            const clienteItem = document.createElement('div');
            clienteItem.className = 'cliente-item';
            clienteItem.innerHTML = `
                <p><strong>Nome:</strong> ${cliente.nome}</p>
                <p><strong>Agência:</strong> ${cliente.agencia}</p>
                <p><strong>Conta:</strong> ${cliente.conta}</p>
                <p><strong>Nível:</strong> ${cliente.nivel}</p>
                <p><strong>Produtos:</strong> ${cliente.produtos}</p>
                <button onclick="removerCliente(${cliente.id})">Remover</button>
            `;
            clientesList.appendChild(clienteItem);
        });
    };

    const adicionarCliente = async () => {
        const cliente = new Cliente(
            nomeInput.value,
            agenciaInput.value,
            contaInput.value,
            nivelInput.value,
            produtosInput.value
        );
        await clienteService.adicionarCliente(cliente);
        renderClientes();
    };

    window.removerCliente = async (id) => {
        await clienteService.removerCliente(id);
        renderClientes();
    };

    addClienteButton.addEventListener('click', adicionarCliente);

    renderClientes();
});