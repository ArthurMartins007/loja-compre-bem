import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, StyleSheet, Text } from 'react-native';
import type { RootStackParamList } from '../../App';
import FormularioProduto from '../components/FormularioProduto';
import { atualizarProduto, cadastrarProduto, getProdutoPorId } from '../service/produto-service';
import type { Produto, ProdutoInput } from '../types/produto';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaFormularioProduto'>;

export default function TelaFormularioProduto({ route, navigation }: Props) {
  const { produtoId } = route.params;
  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(Boolean(produtoId));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!produtoId) return;
    let ativo = true;
    setCarregando(true);
    getProdutoPorId(produtoId)
      .then((resposta) => {
        if (ativo) setProduto(resposta);
      })
      .catch((falha: unknown) => {
        if (ativo) setErro(falha instanceof Error ? falha.message : 'Não foi possível carregar o produto para edição.');
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [produtoId]);

  async function salvar(dados: ProdutoInput) {
    setSalvando(true);
    setErro('');
    try {
      if (produtoId) {
        await atualizarProduto(produtoId, dados);
        Alert.alert('Produto atualizado', 'As alterações foram salvas na API.');
      } else {
        await cadastrarProduto(dados);
        Alert.alert('Produto cadastrado', 'O produto foi salvo na API.');
      }
      navigation.goBack();
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível salvar o produto.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.estado}>
        <ActivityIndicator size="large" color="#727DAC" />
        <Text style={styles.textoEstado}>Carregando dados do produto...</Text>
      </View>
    );
  }

  if (produtoId && erro && !produto) {
    return (
      <View style={styles.estado}>
        <Text style={styles.erro}>{erro}</Text>
        <Text style={styles.textoEstado}>Volte à lista e tente abrir o produto novamente.</Text>
      </View>
    );
  }

  return (
    <FormularioProduto
      produto={produto}
      salvando={salvando}
      erro={erro}
      onSalvar={salvar}
      onCancelar={() => navigation.goBack()}
    />
  );
}

const styles = StyleSheet.create({
  estado: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, backgroundColor: '#F7F8FA' },
  textoEstado: { color: '#697586', textAlign: 'center' },
  erro: { color: '#B42318', textAlign: 'center' },
});
