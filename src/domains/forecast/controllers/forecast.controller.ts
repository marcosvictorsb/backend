import { Request, Response } from 'express';
import { FinancialForecastInteractor } from '../usecases/financial.forecast.interactor';
import { ForecastControllerParams, InputForecast } from '../interfaces';

interface IForecastController {
  getFinancialForecast(request: Request, response: Response): Promise<Response>;
}

export class ForecastController implements IForecastController {
  protected financialForecast: FinancialForecastInteractor;

  constructor(params: ForecastControllerParams) {
    this.financialForecast = params.useCases.financialForecast;
  }

  public async getFinancialForecast(request: Request, response: Response): Promise<Response> {
    const input: InputForecast = {
      userId: String(request.user?.id),
      referenceMonth: request.query.reference_month as string
    };
    
    const result = await this.financialForecast.execute(input);
    return response.status(result.status).json(result.body);
  }
}
