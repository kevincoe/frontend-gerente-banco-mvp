document.addEventListener("DOMContentLoaded", () => {
  // Elementos DOM
  const clientSelector = document.getElementById("client-selector");
  const loadClientButton = document.getElementById("load-client");
  const clientDashboard = document.getElementById("client-dashboard");

  // Elementos de informações do cliente
  const clientInitials = document.getElementById("client-initials");
  const clientName = document.getElementById("client-name");
  const clientAgency = document.getElementById("client-agency");
  const clientAccount = document.getElementById("client-account");
  const clientLevel = document.getElementById("client-level");
  const clientBalance = document.getElementById("client-balance");
  const portfolioValue = document.getElementById("portfolio-value");
  const portfolioItems = document.getElementById("portfolio-items");

  // Elementos de compra de ações
  const stockSymbol = document.getElementById("stock-symbol");
  const stockQuantity = document.getElementById("stock-quantity");
  const buyStockButton = document.getElementById("buy-stock");
  const stockSuccess = document.getElementById("stock-success");
  const stockError = document.getElementById("stock-error");

  // Elementos de compra de dólares
  const dollarQuantity = document.getElementById("dollar-quantity");
  const buyDollarButton = document.getElementById("buy-dollar");
  const dollarSuccess = document.getElementById("dollar-success");
  const dollarError = document.getElementById("dollar-error");

  // Cliente atual
  let currentClient = null;

  // Carregar lista de clientes
  const loadClients = async () => {
    try {
      const clients = await Api.getClientes();
      clientSelector.innerHTML =
        '<option value="">-- Escolha um cliente --</option>';

      clients.forEach((client) => {
        const option = document.createElement("option");
        option.value = client.id;
        option.textContent = `${client.nome} - Conta: ${client.conta}`;
        clientSelector.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      alert("Não foi possível carregar a lista de clientes.");
    }
  };

  // Carregar dados do cliente selecionado
  const loadClientData = async (clientId) => {
    try {
      currentClient = await Api.getCliente(clientId);

      // Exibir informações do cliente
      clientName.textContent = currentClient.nome;
      clientInitials.textContent = getInitials(currentClient.nome);
      clientAgency.textContent = currentClient.agencia;
      clientAccount.textContent = currentClient.conta;
      clientLevel.textContent = currentClient.nivel;
      clientLevel.className = `nivel-badge nivel-${currentClient.nivel}`;
      clientBalance.textContent = formatCurrency(currentClient.saldo);

      // Exibir dashboard
      clientDashboard.style.display = "block";

      // Carregar portfólio
      await loadPortfolio(clientId);
    } catch (error) {
      console.error("Erro ao carregar dados do cliente:", error);
      alert("Não foi possível carregar os dados do cliente selecionado.");
    }
  };

  // Carregar portfólio de investimentos
  const loadPortfolio = async (clientId) => {
    try {
      // Obter valor da carteira
      const carteira = await Api.getValorCarteira(clientId);
      portfolioValue.textContent = formatCurrency(carteira.valor_carteira);

      // Obter investimentos agregados
      const investimentos = await Api.getInvestimentosAgregados(clientId);

      // Limpar lista atual
      portfolioItems.innerHTML = "";

      if (investimentos && investimentos.length > 0) {
        investimentos.forEach((inv) => {
          const itemElement = document.createElement("div");
          itemElement.className = "portfolio-item";

          const tipoFormatado = inv.tipo === "acao" ? "Ações" : "Dólar";
          const simboloFormatado = inv.simbolo;

          itemElement.innerHTML = `
                        <div>
                            <strong>${tipoFormatado}: ${simboloFormatado}</strong>
                            <p>Quantidade: ${inv.quantidade}</p>
                        </div>
                        <div>
                            <p>Preço médio: ${formatCurrency(
                              inv.preco_compra
                            )}</p>
                            <p>Valor investido: ${formatCurrency(
                              inv.valor_investido
                            )}</p>
                        </div>
                    `;

          portfolioItems.appendChild(itemElement);
        });
      } else {
        portfolioItems.innerHTML = "<p>Nenhum investimento encontrado.</p>";
      }
    } catch (error) {
      console.error("Erro ao carregar portfólio:", error);
      portfolioItems.innerHTML = "<p>Erro ao carregar investimentos.</p>";
      portfolioValue.textContent = "Erro ao calcular";
    }
  };

  // Comprar ações
  const buyStock = async () => {
    if (!currentClient) {
      alert("Selecione um cliente primeiro!");
      return;
    }

    const symbol = stockSymbol.value.trim().toUpperCase();
    const quantity = parseFloat(stockQuantity.value);

    if (!symbol) {
      showError(stockError, "O símbolo da ação é obrigatório");
      return;
    }

    if (!quantity || quantity <= 0) {
      showError(stockError, "A quantidade deve ser um número positivo");
      return;
    }

    try {
      hideMessage(stockError);
      hideMessage(stockSuccess);

      await Api.comprarAcoes(currentClient.id, {
        simbolo: symbol,
        quantidade: quantity,
      });

      // Mostrar mensagem de sucesso
      showSuccess(stockSuccess);

      // Limpar formulário
      stockSymbol.value = "";
      stockQuantity.value = "";

      // Recarregar dados do cliente e portfólio
      await loadClientData(currentClient.id);
    } catch (error) {
      console.error("Erro ao comprar ações:", error);

      let errorMessage = "Falha na compra de ações";

      if (error.response && error.response.data && error.response.data.erro) {
        errorMessage = error.response.data.erro;
      }

      showError(stockError, errorMessage);
    }
  };

  // Comprar dólares
  const buyDollar = async () => {
    if (!currentClient) {
      alert("Selecione um cliente primeiro!");
      return;
    }

    const quantity = parseFloat(dollarQuantity.value);

    if (!quantity || quantity <= 0) {
      showError(dollarError, "A quantidade deve ser um número positivo");
      return;
    }

    try {
      hideMessage(dollarError);
      hideMessage(dollarSuccess);

      await Api.comprarDolar(currentClient.id, {
        quantidade: quantity,
      });

      // Mostrar mensagem de sucesso
      showSuccess(dollarSuccess);

      // Limpar formulário
      dollarQuantity.value = "";

      // Recarregar dados do cliente e portfólio
      await loadClientData(currentClient.id);
    } catch (error) {
      console.error("Erro ao comprar dólares:", error);

      let errorMessage = "Falha na compra de dólares";

      if (error.response && error.response.data && error.response.data.erro) {
        errorMessage = error.response.data.erro;
      }

      showError(dollarError, errorMessage);
    }
  };

  // Funções auxiliares
  function getInitials(name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  function formatCurrency(value) {
    if (value === null || value === undefined) return "R$ 0,00";
    return `R$ ${parseFloat(value).toFixed(2).replace(".", ",")}`;
  }

  function showError(element, message) {
    element.textContent = message;
    element.style.display = "block";
  }

  function showSuccess(element) {
    element.style.display = "block";
    setTimeout(() => {
      element.style.display = "none";
    }, 3000);
  }

  function hideMessage(element) {
    element.style.display = "none";
  }

  // Event listeners
  loadClientButton.addEventListener("click", () => {
    const clientId = clientSelector.value;
    if (clientId) {
      loadClientData(clientId);
    } else {
      alert("Por favor, selecione um cliente.");
    }
  });

  buyStockButton.addEventListener("click", buyStock);
  buyDollarButton.addEventListener("click", buyDollar);

  // Atualizar o Api.js para incluir os novos métodos
  // Carregar lista de clientes ao iniciar
  loadClients();
});
