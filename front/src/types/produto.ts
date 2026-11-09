export type Produto = {
  produtoId: string;
  nome: string;
  descricao: string | null;
  preco: number;
  categoria: string | null;
  imagem: string | null;
  quantidade: number;
};
