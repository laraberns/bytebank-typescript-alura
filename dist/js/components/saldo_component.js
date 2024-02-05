import { formatarData, formatarMoeda } from "../utils/formatadores.js";
import { FormatoData } from "../types/FormatoData.js";
import Conta from "../types/Conta.js";
const elementoSaldo = document.querySelector(".saldo-valor .valor");
const elementoDataAcesso = document.querySelector(".block-saldo time");
elementoDataAcesso.textContent = formatarData(Conta.getDataAcesso(), FormatoData.DIA_SEMANA_DIA_MES_ANO);
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
