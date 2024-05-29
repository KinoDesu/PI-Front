const urlApiProduto = "http://localhost:5201/api/Produto";

const btnSalvar = document.getElementById("btn-save");
var errorMessage = "O(s) seguinte(s) campo(s) está(ão) inválido(s):";
var erros = []

function validarNome() {
    let input = document.getElementById("nome").value;

    if (input.length <= 3 || input.length > 50) {
        erros.push("Nome");
        return false;
    } else {
        return true;
    }
}
function validarPreco() {
    let input = document.getElementById("preco").value;

    if (input < 0 || input == "") {
        erros.push("Preço");
        return false;
    } else {
        return true;
    }
}
function validarPeso() {
    let input = document.getElementById("peso").value;

    if (input < 0 || input == "") {
        erros.push("Peso");
        return false;
    } else {
        return true;
    }
}
function validarQuantidade() {
    let input = document.getElementById("quantidade").value;

    if (input < 0 || input == "") {
        erros.push("Quantidade");
        return false;
    } else {
        return true;
    }
}
function validarDescricao() {
    let input = document.getElementById("descricao").value;

    if (input.length <= 10 || input.length > 100) {
        erros.push("Descrição");
        return false;
    } else {
        return true;
    }
}
function validarDados() {
    let nome = validarNome();
    let preco = validarPreco();
    let peso = validarPeso();
    let qtde = validarQuantidade();
    let desc = validarDescricao();
    if (
        nome &&
        preco &&
        peso &&
        qtde &&
        desc
    ) {
        return true;
    } else {
        return false;
    }
}

async function saveProduto() {

    if (validarDados()) {

        let produto = {
            produtoId: 0,
            nome: document.getElementById("nome").value,
            descricao: document.getElementById("descricao").value,
            valor: document.getElementById("preco").value,
            quantidade: document.getElementById("quantidade").value,
            peso: document.getElementById("peso").value,
            inativo: false
        }

        let result = null;
        let status = null;
        result = await fetch(urlApiProduto, {
            method: "POST",
            headers: {
                'Content-Type':
                    'application/json;charset=utf-8'
            },
            body: JSON.stringify(produto),

        }).then((data) => {
            status = data.status
            return data.json()
        });

        if (status == 200) {
            alert("Produto criado com sucesso!");
            window.location = "/index.html";
        } else {
            alert("falha ao criar produto. Tente novamente!")
        }
    }
    else {
        let finalError = errorMessage;
        for (let i = 0; i < erros.length; i++) {
            let erro = erros[i];
            if (i == erros.length - 1) {
                if (erros.length > 1) {
                    finalError = finalError.substring(0, finalError.length - 1);
                    finalError += ` e ${erro}.`;
                } else {
                    finalError += ` ${erro}.`;
                }
            } else {
                finalError += ` ${erro},`;
            }
        }

        console.log(finalError);
        erros = [];
    }


}

btnSalvar.addEventListener("click", async () => {
    saveProduto();
})