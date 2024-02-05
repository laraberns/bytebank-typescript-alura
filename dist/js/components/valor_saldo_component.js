import { formatarMoeda } from "../utils/formatadores.js";
import Conta from "../types/Conta.js";
const elementoSaldo = document.querySelector(".saldo-valor .valor");
atualizarSaldoTela();
function atualizarSaldoTela() {
    elementoSaldo.textContent = formatarMoeda(Conta.getsaldo());
}
const saldoComponent = {
    atualizar() {
        atualizarSaldoTela();
    }
};
export default saldoComponent;
