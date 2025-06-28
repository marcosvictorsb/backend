import {
  ExpenseStatus,
  IUpdateExpenseGateway,
  UpdateExpenseData
} from '../interfaces/';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputUpdateExpense } from '../interfaces/';
import { ManipulateMonthlySummaryInteractor } from '../../../domains/monthly-summary/usecases';
import {
  ManipulateMonthlySummaryType,
  OperationType
} from '../../../domains/monthly-summary/interfaces';

export class UpdateExpenseInteractor {
  constructor(
    private readonly gateway: IUpdateExpenseGateway,
    private presenter: IPresenter,
    private manipulateMonthlySummaryInteractor: ManipulateMonthlySummaryInteractor
  ) {}

  async execute(input: InputUpdateExpense): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo('Atualizando despesa', {
        requestTxt: JSON.stringify(input)
      });

      const {
        id,
        amount,
        description,
        id_user,
        status,
        id_bank,
        date_payment
      } = input;

      // 1. Busca a despesa atual
      const currentExpense = await this.gateway.findExpense({ id });
      if (!currentExpense) {
        this.gateway.loggerInfo('Despesa não encontrada', {
          requestTxt: JSON.stringify(input)
        });
        return this.presenter.notFound('Despesa não encontrada');
      }

      // 2. Verifica mudança de banco
      const isChangingBank = id_bank && currentExpense.id_bank !== id_bank;
      const oldBank = currentExpense.id_bank
        ? await this.gateway.findBank({ id: currentExpense.id_bank })
        : null;

      // 3. Determina os estados
      const wasPaid =
        currentExpense.status.toLowerCase() ===
        ExpenseStatus.PAID.toLowerCase();
      const willBePaid =
        status.toLowerCase() === ExpenseStatus.PAID.toLowerCase();

      // 4. Lógica de atualização de bancos
      if (wasPaid && !willBePaid) {
        // Caso 1: Estava pago e será marcado como pendente
        // Devolve o valor ao banco original
        if (oldBank) {
          const newAmount = oldBank.amount + currentExpense.amount;
          await this.gateway.updateBank({ id: oldBank.id, amount: newAmount });
        }

        // Remover do monthly summary quando deixa de ser PAID
        await this.manipulateMonthlySummaryInteractor.execute({
          referenceMonth: currentExpense.reference_month,
          userId: currentExpense.id_user,
          amount: currentExpense.amount,
          type: ManipulateMonthlySummaryType.Expense,
          operation: OperationType.Subtract
        });
      } else if (!wasPaid && willBePaid) {
        // Caso 2: Estava pendente e será marcado como pago
        // Retira o valor do banco (novo ou atual)
        const targetBankId = id_bank || currentExpense.id_bank;
        if (targetBankId) {
          const targetBank = await this.gateway.findBank({ id: targetBankId });
          if (!targetBank) {
            return this.presenter.notFound('Banco não encontrado');
          }
          const newAmount = targetBank.amount - amount;
          await this.gateway.updateBank({
            id: targetBank.id,
            amount: newAmount
          });
        }

        // Adicionar ao monthly summary quando passa a ser PAID
        await this.manipulateMonthlySummaryInteractor.execute({
          referenceMonth: currentExpense.reference_month,
          userId: currentExpense.id_user,
          amount: amount,
          type: ManipulateMonthlySummaryType.Expense,
          operation: OperationType.Add
        });
      } else if (wasPaid && willBePaid && isChangingBank) {
        // Caso 3: Continua pago, mas mudou de banco
        // Devolve ao banco antigo e retira do novo
        const newBank = await this.gateway.findBank({ id: id_bank });
        if (!newBank) {
          return this.presenter.notFound('Novo banco não encontrado');
        }

        if (oldBank) {
          const oldBankNewAmount = oldBank.amount + currentExpense.amount;
          await this.gateway.updateBank({
            id: oldBank.id,
            amount: oldBankNewAmount
          });
        }

        const newBankNewAmount = newBank.amount - amount;
        await this.gateway.updateBank({
          id: newBank.id,
          amount: newBankNewAmount
        });

        // Ajustar monthly summary pela diferença de valor quando continua PAID
        const amountDifference = amount - currentExpense.amount;
        if (amountDifference !== 0) {
          await this.manipulateMonthlySummaryInteractor.execute({
            referenceMonth: currentExpense.reference_month,
            userId: currentExpense.id_user,
            amount: Math.abs(amountDifference),
            type: ManipulateMonthlySummaryType.Expense,
            operation:
              amountDifference > 0 ? OperationType.Add : OperationType.Subtract
          });
        }
      } else if (wasPaid && willBePaid && !isChangingBank) {
        // Caso 4: Continua pago, mesmo banco, mas pode ter mudado o valor
        const amountDifference = amount - currentExpense.amount;
        if (amountDifference !== 0) {
          // Atualizar o banco pela diferença
          if (oldBank) {
            const newBankAmount = oldBank.amount - amountDifference;
            await this.gateway.updateBank({
              id: oldBank.id,
              amount: newBankAmount
            });
          }

          // Ajustar monthly summary pela diferença
          await this.manipulateMonthlySummaryInteractor.execute({
            referenceMonth: currentExpense.reference_month,
            userId: currentExpense.id_user,
            amount: Math.abs(amountDifference),
            type: ManipulateMonthlySummaryType.Expense,
            operation:
              amountDifference > 0 ? OperationType.Add : OperationType.Subtract
          });
        }
      }

      // 5. Atualiza a despesa
      const updateCriteria: UpdateExpenseData = {
        id,
        amount,
        description,
        id_user,
        status,
        id_bank,
        date_payment
      };

      await this.gateway.updateExpense(updateCriteria);
      this.gateway.loggerInfo('Despesa atualizada com sucesso');

      return this.presenter.OK();
    } catch (error) {
      this.gateway.loggerError('Erro ao atualizar despesa', { error });
      return this.presenter.serverError('Erro ao atualizar despesa');
    }
  }
}