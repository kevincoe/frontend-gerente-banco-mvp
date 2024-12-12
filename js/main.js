document.addEventListener('DOMContentLoaded', () => {
    const clienteService = new ClienteService(Api);

    const nomeInput = document.getElementById('nome');
    const agenciaInput = document.getElementById('agencia');
    const contaInput = document.getElementById('conta');
    const nivelInput = document.getElementById('nivel');
    const produtosSelect = document.getElementById('produtos');
    const addClienteButton = document.getElementById('add-cliente');
    const clientesList = document.getElementById('clientes-list');
    const pesquisaResultados = document.getElementById('pesquisa-resultados');
    const menuInicial = document.getElementById('menu-inicial');
    const clienteForm = document.getElementById('cliente-form');
    const listarClientesButton = document.getElementById('listar-clientes');
    const adicionarClienteButton = document.getElementById('adicionar-cliente');
    const pesquisarClienteButton = document.getElementById('pesquisar-cliente');
    const pesquisaInput = document.getElementById('pesquisa-input');
    const voltarButton = document.getElementById('voltar');

    let clienteEditando = null;

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
                <button class="edit" onclick="editarCliente(${cliente.id})">Editar</button>
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
            produtosSelect.value
        );
        if (clienteEditando) {
            await clienteService.atualizarCliente(clienteEditando, cliente);
            clienteEditando = null;
            addClienteButton.textContent = 'Adicionar Cliente';
        } else {
            await clienteService.adicionarCliente(cliente);
        }
        limparFormulario();
        mostrarListaClientes();
    };

    const limparFormulario = () => {
        nomeInput.value = '';
        agenciaInput.value = '';
        contaInput.value = '';
        nivelInput.value = '';
        produtosSelect.value = 'Conta Corrente';
    };

    const mostrarTelaInicial = () => {
        menuInicial.style.display = 'flex';
        clienteForm.style.display = 'none';
        clientesList.style.display = 'none';
        pesquisaResultados.style.display = 'none';
        voltarButton.style.display = 'none';
    };

    const mostrarListaClientes = () => {
        menuInicial.style.display = 'none';
        clienteForm.style.display = 'none';
        clientesList.style.display = 'block';
        pesquisaResultados.style.display = 'none';
        voltarButton.style.display = 'block';
        renderClientes();
    };

    const pesquisarCliente = async () => {
        const termo = pesquisaInput.value.trim().toLowerCase();
        const tooltipText = document.getElementById('tooltip-text');
    
        if (!termo) {
            tooltipText.style.visibility = 'visible';
            tooltipText.style.opacity = '1';
            setTimeout(() => {
                tooltipText.style.visibility = 'hidden';
                tooltipText.style.opacity = '0';
            }, 3000);
            return;
        }
    
        const clientes = await clienteService.listarClientes();
        const resultados = clientes.filter(cliente => 
            cliente.nome.toLowerCase().includes(termo) || 
            cliente.conta.toString().includes(termo)
        );
    
        pesquisaResultados.innerHTML = '';
        if (resultados.length === 0) {
            pesquisaResultados.innerHTML = '<p>Cliente Não Encontrado</p>';
        } else {
            resultados.forEach(cliente => {
                const clienteItem = document.createElement('div');
                clienteItem.className = 'cliente-item';
                clienteItem.innerHTML = `
                    <p><strong>Nome:</strong> ${cliente.nome}</p>
                    <p><strong>Agência:</strong> ${cliente.agencia}</p>
                    <p><strong>Conta:</strong> ${cliente.conta}</p>
                    <p><strong>Nível:</strong> ${cliente.nivel}</p>
                    <p><strong>Produtos:</strong> ${cliente.produtos}</p>
                    <button class="edit" onclick="editarCliente(${cliente.id})">Editar</button>
                    <button onclick="removerCliente(${cliente.id})">Remover</button>
                `;
                pesquisaResultados.appendChild(clienteItem);
            });
        }
    
        menuInicial.style.display = 'none';
        clienteForm.style.display = 'none';
        clientesList.style.display = 'none';
        pesquisaResultados.style.display = 'block';
        voltarButton.style.display = 'block';
    };

    window.removerCliente = async (id) => {
        await clienteService.removerCliente(id);
        renderClientes();
    };

    window.editarCliente = async (id) => {
        const cliente = await clienteService.api.getCliente(id);
        nomeInput.value = cliente.nome;
        agenciaInput.value = cliente.agencia;
        contaInput.value = cliente.conta;
        nivelInput.value = cliente.nivel;
        produtosSelect.value = cliente.produtos;
        clienteEditando = id;
        addClienteButton.textContent = 'Atualizar Cliente';
        menuInicial.style.display = 'none';
        clienteForm.style.display = 'flex';
        clientesList.style.display = 'none';
        pesquisaResultados.style.display = 'none';
        voltarButton.style.display = 'block';
    };

    addClienteButton.addEventListener('click', adicionarCliente);

    listarClientesButton.addEventListener('click', mostrarListaClientes);

    adicionarClienteButton.addEventListener('click', () => {
        menuInicial.style.display = 'none';
        clienteForm.style.display = 'flex';
        clientesList.style.display = 'none';
        pesquisaResultados.style.display = 'none';
        voltarButton.style.display = 'block';
    });

    pesquisarClienteButton.addEventListener('click', pesquisarCliente);

    voltarButton.addEventListener('click', () => {
        mostrarTelaInicial();
        limparFormulario();
        clienteEditando = null;
        addClienteButton.textContent = 'Adicionar Cliente';
    });
});