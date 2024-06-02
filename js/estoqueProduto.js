const urlApiProduto = "http://localhost:5201/api/Produto";

var result;
var sorted;

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
        <hr>
    `;
    listSpace.appendChild(liHeader);

    produtos.forEach(produto => {
        let liProduto = document.createElement("li");
        liProduto.className = "item";

        if (produto.inativo != true) {
            liProduto.innerHTML = `
            <h3 class="cod">${produto.produtoId}</h3>
            <h3 class="name">${produto.nome}</h3>
            <h3 class="amount">${produto.quantidade}</h3>
            <div class="alter-qtde">
            <button class="btn-remover" value= ${produto.produtoId}>
                <img src="./resources/images/image 25.png" alt="remover">
            </button>
            <input type="number" name="qtde" class="qtde-valor" id="input-produto-${produto.produtoId}">
            <button class="btn-adicionar" value=${produto.produtoId}>
                <img src="./resources/images/image 24.png" alt="adicionar">
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

    let resultSearch = searchProduct(search)

    if (resultSearch.length() > 0) {
        showProdutos(resultSearch)
    } else {
        document.getElementById("items").innerHTML = `<h5 style="text-align: center;">Nenhum produto encontrado</h5>`;
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
            if(btn.classList.length >1){
                btn.classList.toggle("selected")
                btn.classList.toggle("rev-selected")
            }else{
                filterButtons.forEach(element=>{
                    element.classList.remove("selected")
                    element.classList.remove("rev-selected")
                })
                btn.classList.add("selected")
            }
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

                if(nA < nB){
                    return -1;
                }
                if(nA>nB){
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
    sorted = sorted.reverse();
    return sorted;
}

document.getElementById("btn-save").addEventListener("click", () => {
    let alterProducts = document.getElementsByClassName("qtde-valor");
    let bsb = Array.from(alterProducts)
    let altered = [];
    bsb.forEach(element => {
        if (element.value != 0 || element.value != "") {
            altered.push(element)
        }
    });

    putProducts(altered);
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