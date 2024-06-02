const urlApiProduto = "http://localhost:5201/api/Produto";
sessionStorage.setItem("key", "value");


var result;

async function getListaProdutos() {

    result = await fetch(urlApiProduto).then(data => data.json());

    showProdutos(result);

}

function showProdutos(produtos) {
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

document.getElementById("btn-search").addEventListener("click", async () => {
    let search = document.getElementById("inpt-search").value;

    if (search.length == 0) {
        showProdutos(result)
    } else {
        try {
            let resultSearch = await fetch(`${urlApiProduto}/busca/${search}`).then(data => data.json());
            showProdutos(resultSearch)
        } catch (error) {
            document.getElementById("items").innerHTML = `<h5 style="text-align: center;">Nenhum produto encontrado</h5>`;
        }
    }
});

function setCookie(nome, info, exdays) {
    Cookies.set(nome, info, exdays)
}

function getCookie(nome) {
    return Cookies.get(nome)
}

setCookie("id", 0, 1);
setCookie("name", 0, 1);
setCookie("active", 0, 1);
setCookie("amount", 0, 1);


let filterButtons = document.querySelectorAll(".btn-filter");

filterButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
        let filter = btn.value;
        let order;

        filterButtons.forEach(btnSelected => {
            btnSelected.classList.remove("selected");
            btnSelected.classList.remove("rev-selected");
        });

        getCookie(filter) == 0 ? order = sortResult(filter) : order = reverseSort(filter);
        console.log(order)

        showProdutos(order);
    });
});

function sortResult(filter) {
    let sorted;

    document.getElementById(`btn-${filter}`).classList.add("selected");
    document.getElementById(`btn-${filter}`).classList.add("selected");

    switch (filter) {
        case "id":
            setCookie("id", 1, 1);
            setCookie("name", 0, 1);
            setCookie("active", 0, 1);
            setCookie("amount", 0, 1);

            sorted = result.sort((a, b) => a.produtoId - b.produtoId);
            result = sorted;

            break;
        case "name":
            setCookie("id", 0, 1);
            setCookie("name", 1, 1);
            setCookie("active", 0, 1);
            setCookie("amount", 0, 1);

            sorted = result.sort((a, b) => {
                const nA = a.nome.toUpperCase();
                const nB = b.nome.toUpperCase();

                nA < nB ? -1 : nA > nB ? 1 : 0;
            });
            result = sorted;

            break;
        case "active":
            setCookie("id", 0, 1);
            setCookie("name", 0, 1);
            setCookie("active", 1, 1);
            setCookie("amount", 0, 1);

            let prevSorted;

            prevSorted = result.sort((a, b) => {
                const nA = a.nome.toUpperCase();
                const nB = b.nome.toUpperCase();

                nA < nB ? -1 : nA > nB ? 1 : 0;
            });

            sorted = prevSorted.sort((a, b) => a.inativo - b.inativo);
            result = sorted;

            break;
        case "amount":
            setCookie("id", 0, 1);
            setCookie("name", 0, 1);
            setCookie("active", 0, 1);
            setCookie("amount", 1, 1);

            sorted = result.sort((a, b) => a.quantidade - b.quantidade);
            result = sorted;

            break;

        default:
            break;
    }

    return sorted;
}

function reverseSort(filter) {
    document.getElementById(`btn-${filter}`).classList.replace("selected", "rev-selected");

    console.log(result)

    return result.reverse();
}
