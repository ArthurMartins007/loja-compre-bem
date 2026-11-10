import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RootStackParamList } from '../../App';
import { getProdutoPorId } from '../service/produto-service';
import type { Produto } from '../types/produto';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaDetalheProduto'>;

export default function TelaDetalheProduto({ route }: Props) {
  const { produtoId } = route.params;
  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [versaoConsulta, setVersaoConsulta] = useState(0);
  const [versaoConsulta, setVersaoConsulta] = useState(0);

  useEffect(() => {
    let ativo = true;

    setCarregando(true);
    setErro('');
    setProduto(null);

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
  }, [produtoId, versaoConsulta]);

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
        <TouchableOpacity style={styles.botaoAcao} onPress={() => setVersaoConsulta((atual) => atual + 1)}>
          <Text style={styles.textoBotaoAcao}>Tentar novamente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoAcao} onPress={() => setVersaoConsulta((atual) => atual + 1)}>
          <Text style={styles.textoBotaoAcao}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={styles.cabecalho}>
        <Text style={styles.categoria}>{produto.categoria || 'Sem categoria'}</Text>
        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.preco}>
          {Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Text>
      </View>
      <View style={styles.secao}>
        <Text style={styles.rotulo}>Descrição</Text>
        <Text style={styles.descricao}>{produto.descricao || 'Sem descrição disponível.'}</Text>
      </View>
      <View style={styles.secao}>
        <Text style={styles.rotulo}>Disponibilidade</Text>
        <Text style={styles.quantidade}>{produto.quantidade > 0 ? `${produto.quantidade} unidades em estoque` : 'Produto indisponível no momento'}</Text>
      </View>
      <View style={styles.identificador}>
        <Text style={styles.rotulo}>Código do produto</Text>
        <Text style={styles.codigo}>{produto.produtoId}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  conteudo: {
    padding: 16,
    paddingBottom: 32,
  },
  cabecalho: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E8ED',
  },
  secao: {
    marginTop: 14,
    padding: 18,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E8ED',
  },
  identificador: {
    marginTop: 14,
    paddingHorizontal: 4,
  },
  nome: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B2A41',
  },
  categoria: {
    fontSize: 14,
    color: '#697586',
  },
  preco: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: '700',
    color: '#236749',
  },
  rotulo: {
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
  codigo: {
    marginTop: 6,
    fontSize: 12,
    color: '#697586',
  },
  botaoAcao: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#727DAC',
  },
  textoBotaoAcao: {
    color: '#FFFFFF',
    fontWeight: '600',
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
  botaoAcao: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#727DAC',
  },
  textoBotaoAcao: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
