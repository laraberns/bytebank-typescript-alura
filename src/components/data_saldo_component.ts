import { formatarData } from "../utils/formatadores.js"
import { FormatoData } from "../types/FormatoData.js"
import Conta from "../types/Conta.js"

const elementoDataAcesso = document.querySelector(".block-saldo time") as HTMLElement

elementoDataAcesso.textContent = formatarData(Conta.getDataAcesso(), FormatoData.DIA_SEMANA_DIA_MES_ANO) 