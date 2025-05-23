import { HttpResponse } from './http';

export const HttpStatusCode = {
  OK: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  UnprocessableEntity: 422,
  InternalServerError: 500,
  NotFound: 404,
  Conflict: 409,
  ServerError: 500
} as const;

export interface IPresenter {
  OK(response?: unknown): HttpResponse;
  conflict(message: string): HttpResponse;
  noContent(message: string): HttpResponse;
  created(response: unknown): HttpResponse;
  badRequest(response: unknown): HttpResponse;
  notFound(response?: unknown): HttpResponse;
  serverError(error?: unknown): HttpResponse;
}

export class Presenter implements IPresenter {
  OK(response?: unknown): HttpResponse {
    return {
      status: HttpStatusCode.OK,
      body: response
    };
  }

  conflict(message: string): HttpResponse {
    return {
      status: HttpStatusCode.Conflict,
      body: { message }
    };
  }

  noContent(message: string): HttpResponse {
    return {
      status: HttpStatusCode.NoContent,
      body: { result: message }
    };
  }

  created(response: unknown): HttpResponse {
    return {
      status: HttpStatusCode.Created,
      body: [response]
    };
  }

  badRequest(response: unknown): HttpResponse {
    return {
      status: HttpStatusCode.BadRequest,
      body: { response }
    };
  }

  notFound(response?: unknown): HttpResponse {
    return {
      status: HttpStatusCode.NotFound,
      body: { response }
    };
  }

  serverError(error?: unknown): HttpResponse {
    return {
      status: HttpStatusCode.ServerError,
      body: {
        error:
          error ??
          'Ocorreu um erro interno no servidor. Tente novamente mais tarde.'
      }
    };
  }
}
