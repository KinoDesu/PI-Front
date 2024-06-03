const urlApiProduto = "http://localhost:5201/api/Produto";

var result;
var sorted;

async function getListaProdutos() {

    result = await fetch(urlApiProduto).then(data => data.json());

    showProdutos(result);

}

function showProdutos(produtos) {
    const listSpace = document.getElementById("list");
    listSpace.innerHTML = "";

    const tbl = document.createElement("table")

    tbl.innerHTML = `
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Título</th>
                <th scope="col">Qtd</th>
                <th scope="col">Ações</th>
            </tr>
        </thead>
    `;

    let tbdTbl = document.createElement("tbody");

    produtos.forEach(produto => {
        let trProduto = document.createElement("li");
        trProduto.className = "item";

        if (produto.inativo != true) {
            trProduto.innerHTML = `
            <th scope="row">${produto.produtoId}</th>
            <td>${produto.nome}</td>
            <td>${produto.quantidade}</td>
            <td class="alter-qtde">
                <button class="btn-remover" value= ${produto.produtoId}>
                    <img src="./resources/images/image 25.png" alt="remover">
                </button>
                <input type="number" name="qtde" class="qtde-valor" id="input-produto-${produto.produtoId}">
                <button class="btn-adicionar" value=${produto.produtoId}>
                    <img src="./resources/images/image 24.png" alt="adicionar">
                </button>
            </td>`;

            tbdTbl.appendChild(trProduto);
        }

        tbl.appendChild(tbdTbl);
        listSpace.appendChild(tbl);

    });
    adicionarQuantidade();
    removerQuantidade();
}

function adicionarQuantidade() {
    document.querySelectorAll(".btn-remover").forEach(element => {
        element.addEventListener("click", async () => {
            let valor = document.getElementById(`input-produto-${element.value}`);
            valor.value = Number(valor.value) - 1;
        });
    });
}

function removerQuantidade() {
    document.querySelectorAll(".btn-adicionar").forEach(element => {
        element.addEventListener("click", async () => {
            let valor = document.getElementById(`input-produto-${element.value}`);
            valor.value = Number(valor.value) + 1;
        });
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

async function searchProduct(search) {
    return await fetch(`${urlApiProduto}/busca/${search}`);
}

function setCookie(nome, info, exdays) {
    Cookies.set(nome, info, exdays)
}

function getCookie(nome) {
    return Cookies.get(nome)
}

setCookie("id", 0, 1);
setCookie("name", 0, 1);
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

        showProdutos(order);
    });
});

function sortResult(filter) {
    document.getElementById(`btn-${filter}`).classList.add("selected");

    switch (filter) {
        case "id":
            setCookie("id", 1, 1);
            setCookie("name", 0, 1);
            setCookie("amount", 0, 1);

            sorted = result.sort((a, b) => a.produtoId - b.produtoId);

            break;
        case "name":
            setCookie("id", 0, 1);
            setCookie("name", 1, 1);
            setCookie("amount", 0, 1);

            sorted = result.sort((a, b) => {
                const nA = a.nome.toUpperCase();
                const nB = b.nome.toUpperCase();

                if (nA < nB) {
                    return -1;
                }
                if (nA > nB) {
                    return 1;
                }
                return 0;
            });

            break;
        case "amount":
            setCookie("id", 0, 1);
            setCookie("name", 0, 1);
            setCookie("amount", 1, 1);

            sorted = result.sort((a, b) => a.quantidade - b.quantidade);

            break;

        default:
            break;
    }
    return sorted;
}

function reverseSort(filter) {
    setCookie(filter, 0, 1);

    document.getElementById(`btn-${filter}`).classList.replace("selected", "rev-selected");

    return result.reverse();
}

document.getElementById("btn-save").addEventListener("click", () => {
    let alterProducts = document.getElementsByClassName("qtde-valor");
    let bsb = Array.from(alterProducts)
    let altered = [];
    bsb.forEach(element => {
        if (element.value > 0 || element.value < 0) {
            altered.push(element);
        }
    });

    if (altered.length > 0) {
        document.getElementById("modal-confirmation").style.display = "block"

        document.getElementById("close-modal-confirmation-yes").addEventListener("click", () => {
            document.getElementById("modal-confirmation").style.display = "none"
            putProducts(altered);
        })
        document.getElementById("close-modal-confirmation-no").addEventListener("click", () => {
            document.getElementById("modal-confirmation").style.display = "none"
        })
    }
});

async function putProducts(alterProducts) {
    alterProducts.forEach(async item => {
        let id = item.id.split("-")[2];

        if (item.value > 0) {
            await fetch(`${urlApiProduto}/add/id=${id}&qtde=${item.value}`
                , { method: 'PUT' })
        } else {
            await fetch(`${urlApiProduto}/rem/id=${id}&qtde=${item.value}`
                , { method: 'PUT' })
        }
        location.reload();
    });
}