import { Armazenador } from "../utils/Armazenador.js"
import { ValidaDebito, ValidaDeposito } from "./Decorators.js"
import { GrupoTransacao } from "./GrupoTransacao.js"
import { TipoTransacao } from "./TipoTransacao.js"
import { Transacao } from "./Transacao.js"

export class Conta {
    // attributes
    protected nome: string
    protected saldo: number = Armazenador.obter<number>("saldo") || 0
    private transacoes: Transacao[] = Armazenador.obter<Transacao[]>(("transacoes"), (key: string, value: any) => {
        if (key == "data") {
            return new Date(value)
        }
        return value
    }) || []

    constructor(nome: string) {
        this.nome = nome
    }

    // methods
    getTitular() {
        return this.nome
    }

    getsaldo(): number {
        return this.saldo
    }

    getDataAcesso(): Date {
        return new Date()
    }

    getGruposTransacoes(): GrupoTransacao[] {
        const gruposTransacoes: GrupoTransacao[] = []
        const listaTransacoes: Transacao[] = structuredClone(this.transacoes) // clona do objeto transacao - nova referencia
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
    }

    registrarTransacao(novaTransacao: Transacao): void {
        if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            this.depositar(novaTransacao.valor)
        } else if (novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO || novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA) {
            this.debitar(novaTransacao.valor)
            novaTransacao.valor *= -1
        } else {
            throw new Error("Tipo de transação inválida!")
        }

        this.transacoes.push(novaTransacao)
        Armazenador.salvar("transacoes", this.transacoes)

        console.log(this.getGruposTransacoes())
    }

    @ValidaDebito
    debitar(valor: number): void {
        this.saldo -= valor
        Armazenador.salvar("saldo", this.saldo)
    }

    @ValidaDeposito
    depositar(valor: number): void {
        this.saldo += valor
        Armazenador.salvar("saldo", this.saldo)
    }
}

export class ContaPremium extends Conta{
    
    registrarTransacao(transacao: Transacao): void {
        
        if (transacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            console.log("Ganhou um bônus de R$ 0,50");
            transacao.valor += 0.5
        }

        super.registrarTransacao(transacao)
    }
}

const conta= new ContaPremium("Lurdes")

export default conta