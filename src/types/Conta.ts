import { GrupoTransacao } from "./GrupoTransacao.js"
import { TipoTransacao } from "./TipoTransacao.js"
import { Transacao } from "./Transacao.js"
import { ResumoTransacoes } from "./ResumoTransacoes.js"

let saldo: number = JSON.parse(localStorage.getItem("saldo")) || 0

const transacoes: Transacao[] = JSON.parse(localStorage.getItem("transacoes"),
    (key: string, value: string) => {
        if (key == "data") {
            return new Date(value)
        }

        return value
    }
) || []

function atualizarTotalTransacoes():void {

    let resumoDasTransicoes: ResumoTransacoes = {
        totalDepositos: 0,
        totalTransferencias: 0,
        totalPagamentosBoleto: 0
    }
    
    for (let index = 0; index < transacoes.length; index++) {
        if (transacoes[index].tipoTransacao == TipoTransacao.DEPOSITO) {
            resumoDasTransicoes.totalDepositos += transacoes[index].valor
        } else if (transacoes[index].tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO) {
            resumoDasTransicoes.totalPagamentosBoleto += transacoes[index].valor
        } else {
            resumoDasTransicoes.totalTransferencias += transacoes[index].valor
        }
    }
    
    console.log(resumoDasTransicoes);
}

atualizarTotalTransacoes()

function debitar(valor: number): void {
    if (valor <= 0) {
        throw new Error("O valor a ser debitado deve ser maior que zero!")
    }

    if (valor > saldo) {
        throw new Error("Saldo insuficiente!")
    }

    saldo -= valor
    localStorage.setItem("saldo", JSON.stringify(saldo))
}

function depositar(valor: number): void {
    if (valor <= 0) {
        throw new Error("O valor a ser depositado deve ser maior que zero!")
    }

    saldo += valor
    localStorage.setItem("saldo", JSON.stringify(saldo))
}

const Conta = {
    getsaldo(): number {
        return saldo
    },

    getDataAcesso(): Date {
        return new Date()
    },

    getGruposTransacoes(): GrupoTransacao[] {
        const gruposTransacoes: GrupoTransacao[] = []
        const listaTransacoes: Transacao[] = structuredClone(transacoes) // clona do objeto transacao - nova referencia
        const transacoesOrdenadas: Transacao[] = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime())
        let labelAtualGrupoTransacao: string = ""

        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao: string = transacao.data.toLocaleDateString("pt-br", { month: "long", year: "numeric" })

            if (labelAtualGrupoTransacao !== labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: []
                })
            }
            gruposTransacoes.at(-1).transacoes.push(transacao)
        }

        return gruposTransacoes
    },

    registrarTransacao(novaTransacao: Transacao): void {
        if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor)
        } else if (novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO || novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA) {
            debitar(novaTransacao.valor)
            novaTransacao.valor *= -1
        } else {
            throw new Error("Tipo de transação inválida!")
        }

        transacoes.push(novaTransacao)
        localStorage.setItem("transacoes", JSON.stringify(transacoes))

        console.log(this.getGruposTransacoes());
        atualizarTotalTransacoes()
    }
}

export default Conta