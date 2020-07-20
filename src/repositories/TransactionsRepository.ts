import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    // TODO
    return this.transactions;
  }

  public getBalance(): Balance {
    // TODO
    function agruparPor(objetoArray, propriedade) {
      return objetoArray.reduce(function (acc, obj) {
        const key = obj[propriedade];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    }

    const groupFromTransactions = agruparPor(this.transactions, 'type');

    if (!groupFromTransactions.income) {
      const balance: Balance = {
        income: 0,
        outcome: 0,
        total: 0,
      };
      return balance;
    }
    const valorInicial = 0;
    const somaIncome = groupFromTransactions.income.reduce(function (
      acumulador: number,
      valorAtual: Transaction,
    ) {
      return acumulador + valorAtual.value;
    },
    valorInicial);

    if (!groupFromTransactions.outcome) {
      const balance: Balance = {
        income: somaIncome,
        outcome: 0,
        total: somaIncome,
      };
      return balance;
    }

    const somaOutcome = groupFromTransactions.outcome.reduce(function (
      acumulador: number,
      valorAtual: Transaction,
    ) {
      return acumulador + valorAtual.value;
    },
    valorInicial);

    const totalBalence = somaIncome - somaOutcome;

    const balance: Balance = {
      income: somaIncome,
      outcome: somaOutcome,
      total: totalBalence,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    // TODO
    const transaction = new Transaction({ title, value, type });

    const balance = this.getBalance();

    if (transaction.type === 'outcome') {
      const varValidated = balance.total - transaction.value;
      if (varValidated < 0) {
        throw Error(`You don't have enough cash`);
      }
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
