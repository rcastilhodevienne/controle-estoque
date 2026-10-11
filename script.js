let estoque = JSON.parse(localStorage.getItem('meuEstoque')) || [];

function adicionarProduto() {
    const nome = document.getElementById('nome').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const vendasPorDia = parseInt(document.getElementById('vendasPorDia').value);

    if (!nome || isNaN(quantidade) || isNaN(vendasPorDia)) {
        alert("Por favor, preencha todos os campos com valores válidos.");
        return;
    }

    estoque.push({ id: Date.now(), nome, quantidade, vendasPorDia });
    salvarDados();
    
    document.getElementById('nome').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('vendasPorDia').value = '';
}

function alterarEstoque(id, alteracao) {
    const index = estoque.findIndex(p => p.id === id);
    if (index !== -1) {
        estoque[index].quantidade += alteracao;
        if (estoque[index].quantidade < 0) estoque[index].quantidade = 0;
        salvarDados();
    }
}

function excluirProduto(id) {
    if(confirm("Tem certeza que deseja excluir?")) {
        estoque = estoque.filter(p => p.id !== id);
        salvarDados();
    }
}

function salvarDados() {
    localStorage.setItem('meuEstoque', JSON.stringify(estoque));
    renderizarTela();
}

function renderizarTela() {
    const lista = document.getElementById('lista-produtos');
    lista.innerHTML = '';

    if (estoque.length === 0) {
        lista.innerHTML = '<p style="text-align: center; color: #888;">Nenhum produto cadastrado.</p>';
        return;
    }

    estoque.forEach(produto => {
        let diasRestantes = "Indefinido";
        let classeAlerta = "previsao";

        if (produto.vendasPorDia > 0) {
            diasRestantes = Math.floor(produto.quantidade / produto.vendasPorDia);
            if (diasRestantes <= 3) classeAlerta += " alerta-estoque";
        }

        const textoPrevisao = produto.vendasPorDia > 0 ? `⏱️ Dura aprox. ${diasRestantes} dias` : `Sem previsão`;

        const div = document.createElement('div');
        div.className = 'produto-item';
        div.innerHTML = `
            <div class="produto-header">
                <span>${produto.nome}</span>
                <span>📦 ${produto.quantidade} un.</span>
            </div>
            <div class="${classeAlerta}">${textoPrevisao} (Sai ${produto.vendasPorDia}/dia)</div>
            <div class="acoes">
                <button class="btn-saida" onclick="alterarEstoque(${produto.id}, -1)">-1 Venda</button>
                <button class="btn-entrada" onclick="alterarEstoque(${produto.id}, 1)">+1 Estoque</button>
                <button class="btn-excluir" onclick="excluirProduto(${produto.id})">🗑️</button>
            </div>
        `;
        lista.appendChild(div);
    });
}
renderizarTela();
