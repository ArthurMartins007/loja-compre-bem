import type { Pagina } from '../types/pagina';
import type { Produto, ProdutoInput } from '../types/produto';
import { api } from './api';

const ENDPOINT = '/produtos';

export function getProdutos(pagina: number, busca: string): Promise<Pagina<Produto>> {
  const parametros = new URLSearchParams({ page: String(pagina), size: '20' });
  const termo = busca.trim();
  if (termo) parametros.set('busca', termo);
  return api.get<Pagina<Produto>>(`${ENDPOINT}?${parametros.toString()}`);
}

export function getProdutoPorId(produtoId: string): Promise<Produto> {
  return api.get<Produto>(`${ENDPOINT}/${encodeURIComponent(produtoId)}`);
}

export function cadastrarProduto(produto: ProdutoInput): Promise<Produto> {
  return api.post<Produto>(ENDPOINT, produto);
}

export function atualizarProduto(produtoId: string, produto: ProdutoInput): Promise<Produto> {
  return api.put<Produto>(`${ENDPOINT}/${encodeURIComponent(produtoId)}`, produto);
}

export function excluirProduto(produtoId: string): Promise<void> {
  return api.delete(`${ENDPOINT}/${encodeURIComponent(produtoId)}`);
}
