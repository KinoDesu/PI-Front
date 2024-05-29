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

        if (produto.inativo == true) {
            liProduto.classList.add("inactive");
        }

        liProduto.innerHTML = `
        <h3 class="name">${produto.nome}</h3>
        <h3 class="qtde">${produto.quantidade}</h3>
        <div class="imgs">
        <button class="btn-alterar">
            <img src="./resources/images/image 23.png" alt="editar"
                onclick="location.href='editarCadastroProduto.html?produto=${produto.produtoId}'">
        </button>
        <button class="btn-excluir" value=${produto.produtoId}>
            <img src="./resources/images/image 2.png" alt="excluir">
        </button>
        </div>`;

        listSpace.appendChild(liProduto);
        listSpace.appendChild(document.createElement("hr"));
    });

    alterarStatus();
}

function alterarStatus() {
    let changeStatusButton = document.querySelectorAll(".btn-excluir");
    changeStatusButton.forEach(element => {
        element.addEventListener("click", async () => {
            await fetch(`${urlApiProduto}/${element.value}`, { method: 'DELETE' })
            location.reload();
        })
    });
}

getListaProdutos();