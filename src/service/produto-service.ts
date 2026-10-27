import type { Pagina } from '../types/pagina';
import type { Produto } from '../types/produto';
import { get } from './api';

export function getProdutos(pagina: number, busca: string): Promise<Pagina<Produto>> {
  const parametros = new URLSearchParams({ page: String(pagina), size: '20' });
  const termo = busca.trim();

  if (termo) {
    parametros.set('busca', termo);
  }

  return get<Pagina<Produto>>(`/produtos?${parametros.toString()}`);
}

export function getProdutoPorId(id: string): Promise<Produto> {
  return get<Produto>(`/produtos/${encodeURIComponent(id)}`);
}
