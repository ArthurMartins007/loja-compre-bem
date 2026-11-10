import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../App';
import { excluirProduto, getProdutos } from '../service/produto-service';
import type { Produto } from '../types/produto';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaListaProdutos'>;

const CHAVE_FAVORITOS = '@compre-bem:favoritos';

export default function TelaListaProdutos({ navigation }: Props) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState('');
  const [erroMais, setErroMais] = useState('');
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [atualizacao, setAtualizacao] = useState(0);
  const carregandoRef = useRef(false);
  const ultimaBuscaRef = useRef('');
  const requisicaoRef = useRef(0);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_FAVORITOS)
      .then((valor) => {
        if (!valor) return;
        const dados: unknown = JSON.parse(valor);
        if (Array.isArray(dados) && dados.every((item) => typeof item === 'string')) setFavoritos(dados);
      })
      .catch(() => setFavoritos([]));
  }, []);

  useEffect(() => {
    const identificador = setTimeout(() => setBuscaAplicada(busca.trim()), 350);
    return () => clearTimeout(identificador);
  }, [busca]);

  const carregarPrimeiraPagina = useCallback(async () => {
    carregandoRef.current = true;
    setCarregando(true);
    setErro('');
    setErroMais('');
    setProdutos([]);
    setPaginaAtual(0);
    ultimaBuscaRef.current = buscaAplicada;
    const identificador = ++requisicaoRef.current;

    try {
      const resposta = await getProdutos(0, buscaAplicada);
      if (identificador !== requisicaoRef.current) return;
      setProdutos(resposta.content);
      setTotalProdutos(resposta.page.totalElements);
      setTotalPaginas(resposta.page.totalPages);
      setPaginaAtual(resposta.page.number);
    } catch (falha) {
      if (identificador === requisicaoRef.current) {
        setErro(falha instanceof Error ? falha.message : 'Não foi possível carregar os produtos.');
      }
    } finally {
      if (identificador === requisicaoRef.current) {
        carregandoRef.current = false;
        setCarregando(false);
      }
    }
  }, [buscaAplicada]);

  useEffect(() => {
    carregarPrimeiraPagina();
  }, [carregarPrimeiraPagina, atualizacao]);

  const carregarMais = useCallback(async () => {
    if (ultimaBuscaRef.current !== buscaAplicada) return;
    if (carregandoRef.current || carregando || carregandoMais || paginaAtual + 1 >= totalPaginas) return;

    const proximaPagina = paginaAtual + 1;
    const identificador = requisicaoRef.current;
    carregandoRef.current = true;
    setCarregandoMais(true);
    setErroMais('');

    try {
      const resposta = await getProdutos(proximaPagina, buscaAplicada);
      if (identificador !== requisicaoRef.current || ultimaBuscaRef.current !== buscaAplicada) return;
      setProdutos((atuais) => {
        const idsExistentes = new Set(atuais.map((produto) => produto.produtoId));
        return [...atuais, ...resposta.content.filter((produto) => !idsExistentes.has(produto.produtoId))];
      });
      setPaginaAtual(resposta.page.number);
      setTotalProdutos(resposta.page.totalElements);
      setTotalPaginas(resposta.page.totalPages);
    } catch (falha) {
      setErroMais(falha instanceof Error ? falha.message : 'Não foi possível carregar mais produtos.');
    } finally {
      if (identificador === requisicaoRef.current) {
        carregandoRef.current = false;
        setCarregandoMais(false);
      }
    }
  }, [buscaAplicada, carregando, carregandoMais, paginaAtual, requisicaoRef, totalPaginas]);

  const alterarFavorito = useCallback((produtoId: string) => {
    setFavoritos((atuais) => {
      const atualizados = atuais.includes(produtoId)
        ? atuais.filter((id) => id !== produtoId)
        : [...atuais, produtoId];
      AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(atualizados)).catch(() => undefined);
      return atualizados;
    });
  }, []);

  const abrirDetalhes = useCallback((produto: Produto) => {
    Keyboard.dismiss();
    navigation.navigate('TelaDetalheProduto', { produtoId: produto.produtoId });
  }, [navigation]);

  const abrirCadastro = useCallback(() => navigation.navigate('TelaFormularioProduto', {}), [navigation]);

  const confirmarExclusao = useCallback((produto: Produto) => {
    Alert.alert('Excluir produto', `Deseja realmente excluir "${produto.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirProduto(produto.produtoId);
            setProdutos((atuais) => atuais.filter((item) => item.produtoId !== produto.produtoId));
            setTotalProdutos((total) => Math.max(0, total - 1));
            setAtualizacao((valor) => valor + 1);
            Alert.alert('Produto excluído', 'O produto foi removido com sucesso.');
          } catch (falha) {
            Alert.alert('Não foi possível excluir', falha instanceof Error ? falha.message : 'Tente novamente.');
          }
        },
      },
    ]);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => setAtualizacao((valor) => valor + 1));
    return unsubscribe;
  }, [navigation]);

  const rodape = () => {
    if (carregandoMais) return <ActivityIndicator style={styles.rodape} color="#727DAC" />;
    if (erroMais) {
      return (
        <View style={styles.rodapeErro}>
          <Text style={styles.textoErro}>{erroMais}</Text>
          <TouchableOpacity onPress={carregarMais}><Text style={styles.linkAcao}>Tentar novamente</Text></TouchableOpacity>
        </View>
      );
    }
    if (produtos.length > 0 && paginaAtual + 1 < totalPaginas) return <Text style={styles.rodapeTexto}>Role para carregar mais produtos</Text>;
    if (produtos.length > 0) return <Text style={styles.rodapeTexto}>Todos os produtos foram carregados</Text>;
    return null;
  };

  return (
    <SafeAreaView style={styles.area} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView style={styles.area} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.cabecalho}>
          <View style={styles.linhaTitulo}>
            <View style={styles.tituloContainer}>
              <Text style={styles.titulo}>Produtos</Text>
              <Text style={styles.subtitulo}>Catálogo da Loja Compre Bem</Text>
            </View>
            <TouchableOpacity style={styles.botaoNovo} onPress={abrirCadastro} accessibilityRole="button">
              <Text style={styles.textoBotaoNovo}>+ Novo</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.buscar}
            placeholder="Buscar produtos por nome..."
            placeholderTextColor="#7A8491"
            value={busca}
            onChangeText={setBusca}
            returnKeyType="search"
            accessibilityLabel="Buscar produtos por nome"
          />
          <View style={styles.resumo}>
            <Text style={styles.textoResumo}>{totalProdutos} {totalProdutos === 1 ? 'produto' : 'produtos'}</Text>
            <Text style={styles.textoResumo}>{produtos.length} carregados</Text>
          </View>
        </View>

        {carregando ? (
          <View style={styles.estado}>
            <ActivityIndicator size="large" color="#727DAC" />
            <Text style={styles.textoEstado}>Carregando produtos...</Text>
          </View>
        ) : erro ? (
          <View style={styles.estado}>
            <Text style={styles.textoErro}>{erro}</Text>
            <TouchableOpacity style={styles.botaoAcao} onPress={() => setAtualizacao((valor) => valor + 1)}>
              <Text style={styles.textoBotaoAcao}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            style={styles.lista}
            contentContainerStyle={produtos.length === 0 ? styles.listaVazia : styles.listaConteudo}
            data={produtos}
            keyExtractor={(item) => item.produtoId}
            keyboardShouldPersistTaps="handled"
            onEndReached={carregarMais}
            onEndReachedThreshold={0.45}
            ListFooterComponent={rodape}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <TouchableOpacity style={styles.itemInfo} onPress={() => abrirDetalhes(item)} accessibilityRole="button">
                  <Text style={styles.nome}>{item.nome}</Text>
                  <Text style={styles.categoria}>{item.categoria || 'Sem categoria'}</Text>
                  <Text style={styles.preco}>{Number(item.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
                </TouchableOpacity>
                <View style={styles.acoesItem}>
                  <TouchableOpacity style={styles.botaoIcone} onPress={() => navigation.navigate('TelaFormularioProduto', { produtoId: item.produtoId })} accessibilityLabel={`Editar ${item.nome}`}>
                    <Text style={styles.iconeEditar}>✎</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.botaoIcone} onPress={() => confirmarExclusao(item)} accessibilityLabel={`Excluir ${item.nome}`}>
                    <Text style={styles.iconeExcluir}>×</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.botaoIcone} onPress={() => alterarFavorito(item.produtoId)} accessibilityLabel={favoritos.includes(item.produtoId) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
                    <Text style={styles.favoritoTexto}>{favoritos.includes(item.produtoId) ? '♥' : '♡'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={<View style={styles.estadoListaVazia}><Text style={styles.textoEstado}>Nenhum produto encontrado.</Text></View>}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: '#F7F8FA' },
  cabecalho: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E8ED' },
  linhaTitulo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tituloContainer: { flex: 1 },
  titulo: { fontSize: 26, fontWeight: '700', color: '#1B2A41' },
  subtitulo: { marginTop: 4, fontSize: 14, color: '#697586' },
  botaoNovo: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, backgroundColor: '#236749' },
  textoBotaoNovo: { color: '#FFFFFF', fontWeight: '700' },
  buscar: { marginTop: 14, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#F7F8FA', borderWidth: 1, borderColor: '#D9DEE7', borderRadius: 10, color: '#1B2A41' },
  resumo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  textoResumo: { fontSize: 12, color: '#697586' },
  lista: { flex: 1 },
  listaConteudo: { paddingHorizontal: 16, paddingBottom: 12 },
  listaVazia: { flexGrow: 1, justifyContent: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingRight: 8, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E8ED' },
  itemInfo: { flex: 1, paddingVertical: 15, paddingLeft: 16, paddingRight: 8 },
  nome: { fontSize: 16, fontWeight: '600', color: '#1B2A41' },
  categoria: { marginTop: 4, fontSize: 12, color: '#697586' },
  preco: { marginTop: 7, fontSize: 15, fontWeight: '700', color: '#236749' },
  acoesItem: { flexDirection: 'row', alignItems: 'center' },
  botaoIcone: { minWidth: 36, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  iconeEditar: { fontSize: 22, color: '#475467' },
  iconeExcluir: { fontSize: 26, color: '#B42318' },
  favoritoTexto: { fontSize: 23, color: '#C62828' },
  estado: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 12 },
  estadoListaVazia: { padding: 24, alignItems: 'center' },
  textoEstado: { fontSize: 15, color: '#697586', textAlign: 'center' },
  textoErro: { fontSize: 14, color: '#B42318', textAlign: 'center', lineHeight: 20 },
  botaoAcao: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#727DAC' },
  textoBotaoAcao: { color: '#FFFFFF', fontWeight: '600' },
  linkAcao: { marginTop: 6, color: '#475A9B', fontWeight: '700' },
  rodape: { padding: 18 },
  rodapeErro: { padding: 18, alignItems: 'center' },
  rodapeTexto: { padding: 18, color: '#697586', textAlign: 'center', fontSize: 12 },
});
