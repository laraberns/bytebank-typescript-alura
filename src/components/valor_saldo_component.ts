import {formatarMoeda } from "../utils/formatadores.js"
import Conta from "../types/Conta.js"

const elementoSaldo = document.querySelector(".saldo-valor .valor") as HTMLElement

atualizarSaldoTela()
function atualizarSaldoTela(): void {
    elementoSaldo.textContent = formatarMoeda(Conta.getsaldo())
}

const saldoComponent = {
    atualizar() {
        atualizarSaldoTela()
    }
}

export default saldoComponent