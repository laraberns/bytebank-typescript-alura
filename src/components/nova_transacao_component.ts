import Conta from "../types/Conta.js"
import { TipoTransacao } from "../types/TipoTransacao.js"
import { Transacao } from "../types/Transacao.js"
import ExtratoComponent from "./extrato_component.js"
import saldoComponent from "./valor_saldo_component.js"

const elementoForm = document.querySelector('.block-nova-transacao form') as HTMLFormElement

elementoForm.addEventListener('submit', function (event) {

    try {
        event.preventDefault()

        if (!elementoForm.checkValidity()) {
            alert("Por favor, preencha todos os campos da transação.")
            return
        }

        const inputTipoTransacao = document.querySelector('#tipoTransacao') as HTMLSelectElement
        const inputValor = document.querySelector('#valor') as HTMLInputElement
        const inputData = document.querySelector('#data') as HTMLInputElement

        let tipoTransacao: TipoTransacao = inputTipoTransacao.value as TipoTransacao
        let valor: number = inputValor.valueAsNumber
        let data: Date = new Date(inputData.value + " 00:00:00")

        const novaTransacao: Transacao = {
            tipoTransacao: tipoTransacao,
            valor: valor,
            data: data
        }

        Conta.registrarTransacao(novaTransacao)
        saldoComponent.atualizar()
        ExtratoComponent.atualizar()

        elementoForm.reset()

    } catch (error) {
        alert(error.message)
    }

})
