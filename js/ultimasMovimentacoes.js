const urlApiMovimentos = "http://localhost:5201/api/Movimentos";

var result;
var sorted;

async function getListaMovimentos() {

    result = await fetch(urlApiMovimentos).then(data => data.json());

    showMovimentos(result);

}

function showMovimentos(movProdutos) {
    const listSpace = document.getElementById("list");
    listSpace.innerHTML = "";

    if (movProdutos.length != 0) {
        const tbl = document.createElement("table")

        tbl.innerHTML = `
        <thead>
            <tr>
                <th scope="col">ID<br>prod</th>
                <th scope="col">Tipo</th>
                <th scope="col">Qtd<br>Mov</th>
                <th scope="col">Qtd<br>Est</th>
                <th scope="col">Data<br>Mov</th>
            </tr>
        </thead>
        `;

        let tbdTbl = document.createElement("tbody");

        movProdutos.forEach(mov => {
            let trProduto = document.createElement("tr");
            trProduto.className = "item";

            trProduto.innerHTML = `
                <th scope="row">${mov.produtoId}</th>
                <td>${movType(mov.tipoAlteracao)}</td>
                <td>${mov.diferencaQuantidade}</td>
                <td>${mov.quantidadeNew}</td>
                <td>${(mov.dataAlteracao).slice(0, 10).split("-").reverse().join("/")}</td>
            `;

            tbdTbl.appendChild(trProduto);
        });

        tbl.appendChild(tbdTbl);
        listSpace.appendChild(tbl);
    } else {
        listSpace.innerHTML = `<h5 style="text-align: center;">Nenhum produto encontrado</h5>`;
    }
}

getListaMovimentos()

function movType(type) {
    return type == "ENTRADA" ? `<img src="./resources/images/add.png" alt="">` : `<img src="./resources/images/delete.png" alt="">`;
}

function setCookie(nome, info, exdays) {
    Cookies.set(nome, info, exdays)
}

function getCookie(nome) {
    return Cookies.get(nome)
}

setCookie("id", 0, 1);
setCookie("type", 0, 1);

let filterButtons = document.querySelectorAll(".btn-filter");

filterButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
        let filter = btn.value;

        filterButtons.forEach(btnSelected => {
            btnSelected.classList.remove("selected");
            btnSelected.classList.remove("rev-selected");
            btnSelected.classList.remove("selected-full");
        });

        if (filter != "reset") {
            getCookie(filter) == 0 ? sortResult(filter) : reverseSort(filter);

            if (filter == "date") {
                let dtStart = document.getElementById("date-start").value;
                let dtEnd = document.getElementById("date-end").value;

                sorted = await fetch(`${urlApiMovimentos}/${dtStart}/${dtEnd}`).then(data => data.json());
            }

            if (filter == "type") {
                if (getCookie(filter) == 1) {
                    sorted = await fetch(`${urlApiMovimentos}/type=entrada`).then(data => data.json());
                } else {
                    sorted = await fetch(`${urlApiMovimentos}/type=saida`).then(data => data.json());
                }
            }

            showMovimentos(sorted);
        } else {
            getListaMovimentos();
        }
    });
});

async function sortResult(filter) {

    switch (filter) {
        case "id":
            setCookie("id", 1, 1);
            setCookie("type", 0, 1);
            document.getElementById(`btn-${filter}`).classList.add("selected");

            sorted = result.sort((a, b) => a.produtoId - b.produtoId);

            break;
        case "type":
            setCookie("id", 0, 1);
            setCookie("type", 1, 1);
            document.getElementById(`btn-${filter}`).classList.add("selected");

            break;
        case "date":
            setCookie("id", 0, 1);
            setCookie("type", 0, 1);

            document.getElementById(`btn-${filter}`).classList.add("selected-full");

            break;

        default:
            break;
    }
}

function reverseSort(filter) {
    setCookie(filter, 0, 1);

    document.getElementById(`btn-${filter}`).classList.add("rev-selected");
    sorted = sorted.reverse();
}