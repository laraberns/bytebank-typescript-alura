import Conta from "../types/Conta.js";
import ExtratoComponent from "./extrato_component.js";
import saldoComponent from "./valor_saldo_component.js";
const elementoForm = document.querySelector('.block-nova-transacao form');
elementoForm.addEventListener('submit', function (event) {
    try {
        event.preventDefault();
        if (!elementoForm.checkValidity()) {
            alert("Por favor, preencha todos os campos da transação.");
            return;
        }
        const inputTipoTransacao = document.querySelector('#tipoTransacao');
        const inputValor = document.querySelector('#valor');
        const inputData = document.querySelector('#data');
        let tipoTransacao = inputTipoTransacao.value;
        let valor = inputValor.valueAsNumber;
        let data = new Date(inputData.value + " 00:00:00");
        const novaTransacao = {
            tipoTransacao: tipoTransacao,
            valor: valor,
            data: data
        };
        Conta.registrarTransacao(novaTransacao);
        saldoComponent.atualizar();
        ExtratoComponent.atualizar();
        elementoForm.reset();
    }
    catch (error) {
        alert(error.message);
    }
});
