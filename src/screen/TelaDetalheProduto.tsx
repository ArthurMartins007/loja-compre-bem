import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../../App';
import { getProdutoPorId } from '../service/produto-service';
import type { Produto } from '../types/produto';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaDetalheProduto'>;

export default function TelaDetalheProduto({ route }: Props) {
  const { produtoId } = route.params;
  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    setCarregando(true);
    setErro('');

    getProdutoPorId(produtoId)
      .then((resposta) => {
        if (ativo) {
          setProduto(resposta);
        }
      })
      .catch((falha: unknown) => {
        if (ativo) {
          setErro(falha instanceof Error ? falha.message : 'Não foi possível carregar o produto.');
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [produtoId]);

  if (carregando) {
    return (
      <View style={styles.estado}>
        <ActivityIndicator size="large" color="#727DAC" />
        <Text style={styles.textoEstado}>Carregando produto...</Text>
      </View>
    );
  }

  if (erro || !produto) {
    return (
      <View style={styles.estado}>
        <Text style={styles.erro}>{erro || 'Produto não encontrado.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{produto.nome}</Text>
      <Text style={styles.categoria}>{produto.categoria || 'Sem categoria'}</Text>
      <Text style={styles.preco}>
        {Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </Text>
      <Text style={styles.rotulo}>Descrição</Text>
      <Text style={styles.descricao}>{produto.descricao || 'Sem descrição disponível.'}</Text>
      <Text style={styles.rotulo}>Quantidade em estoque</Text>
      <Text style={styles.quantidade}>{produto.quantidade}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  nome: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B2A41',
  },
  categoria: {
    marginTop: 8,
    fontSize: 14,
    color: '#697586',
  },
  preco: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: '700',
    color: '#236749',
  },
  rotulo: {
    marginTop: 24,
    fontSize: 14,
    fontWeight: '700',
    color: '#1B2A41',
  },
  descricao: {
    marginTop: 6,
    fontSize: 15,
    color: '#475467',
    lineHeight: 22,
  },
  quantidade: {
    marginTop: 6,
    fontSize: 15,
    color: '#475467',
  },
  estado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  textoEstado: {
    fontSize: 15,
    color: '#697586',
  },
  erro: {
    fontSize: 15,
    color: '#B42318',
    textAlign: 'center',
  },
});
