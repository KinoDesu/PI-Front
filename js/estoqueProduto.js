const urlApiProduto = "http://localhost:5201/api/Produto";

async function getListaProdutos() {

    const result = await fetch(urlApiProduto).then(data => data.json());

    showProdutos(result);

}

function showProdutos(produtos) {
    const listSpace = document.getElementById("items");

    produtos.forEach(produto => {
        let liProduto = document.createElement("li");
        liProduto.className = "item";

        if (produto.inativo != true) {
            liProduto.innerHTML = `
            <h3 class="name">${produto.nome}</h3>
            <h3 class="qtde">${produto.quantidade}</h3>
            <div class="alter-qtde">
            <button class="btn-remover" value= ${produto.produtoId}>
                <img src="./resources/images/image 25.png" alt="editar">
            </button>
            <input type="number" name="qtde" class="qtde-valor" id="input-produto-${produto.produtoId}">
            <button class="btn-adicionar" value= ${produto.produtoId}>
                <img src="./resources/images/image 24.png" alt="excluir">
            </button>
            </div>`;

            listSpace.appendChild(liProduto);
            listSpace.appendChild(document.createElement("hr"));
        }

    });
    adicionarQuantidade();
    removerQuantidade();
}

function adicionarQuantidade() {
    let addQtdeButton = document.querySelectorAll(".btn-adicionar");
    addQtdeButton.forEach(element => {
        element.addEventListener("click", async () => {
            let valorAdd = document.getElementById(`input-produto-${element.value}`).value;
            await fetch(`${urlApiProduto}/add/id=${element.value}&qtde=${valorAdd}`, { method: 'PUT' })
            location.reload();
        })
    });
}

function removerQuantidade() {
    let addQtdeButton = document.querySelectorAll(".btn-remover");
    addQtdeButton.forEach(element => {
        element.addEventListener("click", async () => {
            let valorAdd = document.getElementById(`input-produto-${element.value}`).value;
            await fetch(`${urlApiProduto}/rem/id=${element.value}&qtde=${valorAdd}`, { method: 'PUT' })
            location.reload();
        })
    });
}

getListaProdutos();