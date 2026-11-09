import { API_URL } from '../config/api-config';

export async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Não foi possível consultar a API. Código HTTP: ${response.status}.`);
  }

  return response.json() as Promise<T>;
}
