


//Referenciamos os campos em tela
const lancamentosUl = document.querySelector('#lancamentos');
const exibeReceita = document.querySelector('#lancamento-positivo');
const exibeDespesa = document.querySelector('#lancamento-negativo');
const exibeSaldoAtual = document.querySelector('#saldoAtual');
const form = document.querySelector('#form')
const inputNomeLancamento = document.querySelector('#nomeLancamento')
const inputDataLancamento = document.querySelector('#dataLancamento')
const inputValorLancamento = document.querySelector('#valorLancamento')

const lancamentosLocalStorage = JSON.parse(localStorage
    .getItem('lancamentos'));

let listaLancamentos = localStorage
    .getItem('lancamentos') !== null ? lancamentosLocalStorage : []



const excluirLancamento = lancamentoId => {
    listaLancamentos = listaLancamentos.filter(lancamento => 
        lancamento.id !== lancamentoId);
    atualizarLocalStorage()
    init()
}

const addLancamentoDOM = lancamento => {
    const operador = lancamento.valor < 0 ? '-' : '+'
    const cssClasse = lancamento.valor < 0 ? 'negativo' : 'positivo'
    const valorSemSinal = Math.abs(lancamento.valor)
    const li = document.createElement('li')

    dataAux = new Date(lancamento.data);
    lancamento.data = dataAux.toLocaleDateString('pt-BR', {timeZone: 'UTC'});

    li.classList.add(cssClasse);
    li.innerHTML = `
        ${lancamento.nome} - ${lancamento.data}
        <span>${operador} R$ ${valorSemSinal}</span>       
        <button class="delete-btn" onClick="excluirLancamento(${lancamento.id})">x</button>
    `

    lancamentosUl.prepend(li)

}

function obterReceita(valoresLancamentos) {
    return valoresLancamentos
        .filter( valor => valor > 0)
        .reduce( (somador, valor) => somador + valor, 0)
        .toFixed(2);

}

function obterDespesa(valoresLancamentos) {
    return Math.abs(valoresLancamentos
        .filter( valor => valor < 0)
        .reduce( (somador, valor) => somador + valor, 0))
        .toFixed(2);
} 

function obterValorTotal(valoresLancamentos) {
    return valoresLancamentos
        .reduce((somador, lancamento) => somador + lancamento, 0)
        .toFixed(2);

}


const atualizaLancamentos = () => {
    const valoresLancamentos = listaLancamentos
        .map(lancamento => lancamento.valor);
    console.log(valoresLancamentos);

    const valorTotal = obterValorTotal(valoresLancamentos)

    const receita = obterReceita(valoresLancamentos);

    const despesa = obterDespesa(valoresLancamentos);
    
    exibeSaldoAtual.textContent = `R$ ${valorTotal}`
    exibeReceita.textContent = `R$ ${receita}`
    exibeDespesa.textContent = `R$ ${despesa}`
}

const init = () => {
    const usuarioValidado = localStorage.getItem('usuarioValidado')

    if (usuarioValidado == "true") {
        lancamentosUl.innerHTML = '' //Limpo a lista em tela para não haver duplicação
        listaLancamentos.forEach(addLancamentoDOM)
        atualizaLancamentos();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Aviso!',
            text: 'Usuário não validado!',
            timer: 1800,
            timerProgressBar: true
        });

        setTimeout(function () {
            window.location.href = 'login.html';
        }, 1800);
    }
}

init()

function atualizarLocalStorage() {
    localStorage.setItem('lancamentos', JSON.stringify(listaLancamentos))
}

function gerarId() {
    var idGerado = Math.round(Math.random() * 100000);

    let listaIds = listaLancamentos.filter(lancamento => lancamento.id == idGerado);

    if (listaIds.length <= 0) {
        return idGerado;
    } else {
        gerarId();
    }


}

function addLancamentoLista(lancamentoNome, lancamentoData, lancamentoValor) {
    //Cria um objeto de lançamento a partir dos dados inseridos no input
    var lancamento =  
    { 
        id: gerarId(), 
        nome: lancamentoNome, 
        data: lancamentoData, 
        valor: Number(lancamentoValor)
    }

    //Adiciono o lançamento cadastrado na lista de lançamentos
    listaLancamentos.push(lancamento);
}


function trataDadosForm() {
    return event => {
        event.preventDefault() //bloqueamos o envio do form e o reload da pagina
    
        //armazenamos os valores dos inputs em variáveis
        var lancamentoNome = inputNomeLancamento.value.trim();
        var lancamentoData = inputDataLancamento.value.trim();
        // var lancamentoValor = parseInt(inputValorLancamento.value.trim());
        var lancamentoValor = inputValorLancamento.value.trim();

        const contemCampoVazio = lancamentoNome === '' || lancamentoData === '' || lancamentoValor === '';
    
        // Verifico se os campos estão vazios, caso positivo, exibo um alert avisando o usuário
        if (contemCampoVazio) {
            Swal.fire({
                icon: 'warning',
                title: 'Aviso!',
                text: 'Preencha todos os campos!',
            });
            
            return
        }
    
        addLancamentoLista(lancamentoNome, lancamentoData, lancamentoValor);
        init() 
        atualizarLocalStorage()
    
        //Limpo os campos em Tela
        limparCampos();
    
    }
}

form.addEventListener('submit', trataDadosForm() )

function limparCampos() {
    inputNomeLancamento.value = "";
    inputDataLancamento.value = "";
    inputValorLancamento.value = "";
}