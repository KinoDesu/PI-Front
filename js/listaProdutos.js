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
        let trProduto = document.createElement("tr");
        trProduto.className = "item";

        if (produto.inativo == true) {
            trProduto.classList.add("inactive");
        }

        trProduto.innerHTML = `
        <th scope="row">${produto.produtoId}</th>
            <td>${produto.nome}</td>
            <td>${produto.quantidade}</td>
            <td class="actions">
            <button class="btn-alterar">
            <img src="./resources/images/image 23.png" alt="editar"
            onclick="location.href='editarCadastroProduto.html?produto=${produto.produtoId}'">
            </button>
            <button class="btn-excluir" value=${produto.produtoId} data-toggle="modal" data-target="#ModalCentralizado">
            <img src="./resources/images/image 2.png" alt="excluir">
            </button>
            </td>`;
        tbdTbl.appendChild(trProduto);
    });
    tbl.appendChild(tbdTbl);
    listSpace.appendChild(tbl);

    alterarStatus();
}

function alterarStatus() {
    let changeStatusButton = document.querySelectorAll(".btn-excluir");
    changeStatusButton.forEach(element => {
        element.addEventListener("click", async () => {

            document.getElementById("modal-status").style.display = "block"

            document.getElementById("close-modal-yes").addEventListener("click", async () => {
                document.getElementById("modal-status").style.display = "none"
                await fetch(`${urlApiProduto}/${element.value}`, { method: 'DELETE' })
                location.reload();
            })
            document.getElementById("close-modal-no").addEventListener("click", () => {
                document.getElementById("modal-status").style.display = "none"
                location.reload();
            })
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

        filterButtons.forEach(btnSelected => {
            btnSelected.classList.remove("selected");
            btnSelected.classList.remove("rev-selected");
        });

        getCookie(filter) == 0 ? sortResult(filter) : reverseSort(filter);

        if (filter == "active") {
            if (getCookie(filter) == 1) {
                sorted = result.filter(function (el) {
                    return !el.inativo
                });
            } else {
                sorted = result.filter(function (el) {
                    return el.inativo
                });
            }
        }

        showProdutos(sorted);
    });
});

function sortResult(filter) {
    document.getElementById(`btn-${filter}`).classList.add("selected");

    switch (filter) {
        case "id":
            setCookie("id", 1, 1);
            setCookie("name", 0, 1);
            setCookie("active", 0, 1);
            setCookie("amount", 0, 1);

            sorted = result.sort((a, b) => a.produtoId - b.produtoId);

            break;
        case "name":
            setCookie("id", 0, 1);
            setCookie("name", 1, 1);
            setCookie("active", 0, 1);
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
        case "active":
            setCookie("id", 0, 1);
            setCookie("name", 0, 1);
            setCookie("active", 1, 1);
            setCookie("amount", 0, 1);

            break;
        case "amount":
            setCookie("id", 0, 1);
            setCookie("name", 0, 1);
            setCookie("active", 0, 1);
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

    document.getElementById(`btn-${filter}`).classList.add("rev-selected");

    sorted = sorted.reverse();

    return sorted;
}
