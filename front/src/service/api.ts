import { API_URL } from '../config/api-config';

type ErroApi = {
  message?: string;
  detail?: string;
  errors?: Record<string, string>;
};

async function requisicao<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique se a API está ligada e tente novamente.');
  }

  if (!response.ok) {
    let mensagem = `Não foi possível concluir a operação (HTTP ${response.status}).`;
    try {
      const dados = await response.json() as ErroApi;
      mensagem = dados.detail || dados.message || mensagem;
      if (dados.errors) {
        mensagem = Object.values(dados.errors).join('\n');
      }
    } catch {
      if (response.status === 404) mensagem = 'O produto não foi encontrado.';
      if (response.status === 400) mensagem = 'Os dados informados são inválidos. Confira os campos e tente novamente.';
      if (response.status >= 500) mensagem = 'O servidor encontrou um problema. Tente novamente mais tarde.';
    }
    throw new Error(mensagem);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string) => requisicao<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) => requisicao<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) => requisicao<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint: string) => requisicao<void>(endpoint, { method: 'DELETE' }),
};
