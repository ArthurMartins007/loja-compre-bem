export type Produto = {
  produtoId: string;
  nome: string;
  descricao: string | null;
  preco: number;
  categoria: string | null;
  imagem: string | null;
  quantidade: number;
};

export type ProdutoInput = {
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem: string;
  quantidade: number;
};
