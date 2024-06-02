const urlApiMovimentos = "http://localhost:5201/api/Movimentos";

var result;
var sorted;

async function getListaMovimentos() {

    result = await fetch(urlApiProduto).then(data => data.json());

    showMovimentos(result);

}

function showMovimentos(produtos) {
    const listSpace = document.getElementById("items");
    listSpace.innerHTML = "";

    let liHeader = document.createElement("li");
    liHeader.className = "item";
    liHeader.setAttribute("id", "header");
    liHeader.innerHTML = `
        <h3 class="cod" style="text-align: center;">ID</h3>
        <h3 class="name" style="text-align: center;">Título</h3>
        <h3 class="amount">Qtd</h3>
        <h3 class="actions">Ações</h3>
    `;
    listSpace.appendChild(liHeader);

    listSpace.appendChild(document.createElement("hr"))

    produtos.forEach(produto => {
        let liProduto = document.createElement("li");
        liProduto.className = "item";

        if (produto.inativo == true) {
            liProduto.classList.add("inactive");
        }

        liProduto.innerHTML = `
        <h3 class="cod">${produto.produtoId}</h3>
        <h3 class="name">${produto.nome}</h3>
        <h3 class="amount">${produto.quantidade}</h3>
        <div class="actions">
            <button class="btn-alterar">
            <img src="./resources/images/image 23.png" alt="editar"
                onclick="location.href='editarCadastroProduto.html?produto=${produto.produtoId}'">
            </button>
            <button class="btn-excluir" value=${produto.produtoId} data-toggle="modal" data-target="#ModalCentralizado">
                <img src="./resources/images/image 2.png" alt="excluir">
            </button>
        </div>`;

        listSpace.appendChild(liProduto);
        listSpace.appendChild(document.createElement("hr"));
    });

    alterarStatus();
}