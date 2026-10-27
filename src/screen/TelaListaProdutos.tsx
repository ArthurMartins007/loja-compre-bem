import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
import { getProdutos } from '../service/produto-service';
import type { Pagina } from '../types/pagina';
import type { Produto } from '../types/produto';

type Props = NativeStackScreenProps<RootStackParamList, 'TelaListaProdutos'>;

const CHAVE_FAVORITOS = '@compre-bem:favoritos';
const TAMANHO_PAGINA = 20;

export default function TelaListaProdutos({ navigation }: Props) {
  const [paginaProdutos, setPaginaProdutos] = useState<Pagina<Produto> | null>(null);
  const [pagina, setPagina] = useState(0);
  const [busca, setBusca] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [versaoConsulta, setVersaoConsulta] = useState(0);

  const produtos = useMemo(() => paginaProdutos?.content ?? [], [paginaProdutos]);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_FAVORITOS)
      .then((valor) => {
        if (!valor) {
          return;
        }

        const dados: unknown = JSON.parse(valor);
        if (Array.isArray(dados) && dados.every((item) => typeof item === 'string')) {
          setFavoritos(dados);
        }
      })
      .catch(() => setFavoritos([]));
  }, []);

  useEffect(() => {
    const identificador = setTimeout(() => {
      setPagina(0);
      setBuscaAplicada(busca.trim());
    }, 350);

    return () => clearTimeout(identificador);
  }, [busca]);

  useEffect(() => {
    let ativo = true;

    setCarregando(true);
    setErro('');

    getProdutos(pagina, buscaAplicada)
      .then((resposta) => {
        if (ativo) {
          setPaginaProdutos(resposta);
        }
      })
      .catch((falha: unknown) => {
        if (ativo) {
          setPaginaProdutos(null);
          setErro(falha instanceof Error ? falha.message : 'Não foi possível carregar os produtos.');
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
  }, [pagina, buscaAplicada, versaoConsulta]);

  const alterarFavorito = useCallback((id: string) => {
    setFavoritos((atuais) => {
      const atualizados = atuais.includes(id)
        ? atuais.filter((favoritoId) => favoritoId !== id)
        : [...atuais, id];

      AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(atualizados)).catch(() => undefined);
      return atualizados;
    });
  }, []);

  const abrirDetalhes = useCallback((produto: Produto) => {
    Keyboard.dismiss();
    navigation.navigate('TelaDetalheProduto', { produtoId: produto.produtoId });
  }, [navigation]);

  const totalProdutos = paginaProdutos?.totalElements ?? 0;
  const totalPaginas = paginaProdutos?.totalPages ?? 0;
  const podeVoltar = paginaProdutos ? !paginaProdutos.first : false;
  const podeAvancar = paginaProdutos ? !paginaProdutos.last : false;

  function tentarNovamente() {
    setVersaoConsulta((atual) => atual + 1);
  }

  return (
    <SafeAreaView style={styles.area} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.area}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>Produtos</Text>
          <Text style={styles.subtitulo}>Catálogo da Loja Compre Bem</Text>
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
            <Text style={styles.textoResumo}>
              {totalProdutos} {totalProdutos === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </Text>
            <Text style={styles.textoResumo}>{TAMANHO_PAGINA} por página</Text>
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
            <TouchableOpacity style={styles.botaoAcao} onPress={tentarNovamente}>
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
            renderItem={({ item }) => (
              <View style={styles.item}>
                <TouchableOpacity
                  style={styles.itemInfo}
                  onPress={() => abrirDetalhes(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Ver detalhes de ${item.nome}`}
                >
                  <Text style={styles.nome}>{item.nome}</Text>
                  <Text style={styles.categoria}>{item.categoria || 'Sem categoria'}</Text>
                  <Text style={styles.preco}>
                    {Number(item.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.botaoFavorito}
                  onPress={() => alterarFavorito(item.produtoId)}
                  accessibilityRole="button"
                  accessibilityLabel={favoritos.includes(item.produtoId) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Text style={styles.favoritoTexto}>
                    {favoritos.includes(item.produtoId) ? '♥' : '♡'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={(
              <View style={styles.estadoListaVazia}>
                <Text style={styles.textoEstado}>Nenhum produto encontrado.</Text>
              </View>
            )}
          />
        )}

        <View style={styles.paginacao}>
          <TouchableOpacity
            style={[styles.botaoPagina, !podeVoltar && styles.botaoDesabilitado]}
            disabled={!podeVoltar || carregando}
            onPress={() => setPagina((atual) => Math.max(0, atual - 1))}
          >
            <Text style={styles.textoBotaoPagina}>Anterior</Text>
          </TouchableOpacity>
          <Text style={styles.textoPagina}>
            Página {totalPaginas === 0 ? 0 : (paginaProdutos?.number ?? pagina) + 1} de {totalPaginas}
          </Text>
          <TouchableOpacity
            style={[styles.botaoPagina, !podeAvancar && styles.botaoDesabilitado]}
            disabled={!podeAvancar || carregando}
            onPress={() => setPagina((atual) => atual + 1)}
          >
            <Text style={styles.textoBotaoPagina}>Próxima</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  cabecalho: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E8ED',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1B2A41',
  },
  subtitulo: {
    marginTop: 4,
    fontSize: 14,
    color: '#697586',
  },
  buscar: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: '#D9DEE7',
    borderRadius: 10,
    color: '#1B2A41',
  },
  resumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  textoResumo: {
    fontSize: 12,
    color: '#697586',
  },
  lista: {
    flex: 1,
  },
  listaConteudo: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  listaVazia: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E8ED',
  },
  itemInfo: {
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 16,
    paddingRight: 8,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B2A41',
  },
  categoria: {
    marginTop: 4,
    fontSize: 12,
    color: '#697586',
  },
  preco: {
    marginTop: 7,
    fontSize: 15,
    fontWeight: '700',
    color: '#236749',
  },
  botaoFavorito: {
    minWidth: 52,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoritoTexto: {
    fontSize: 25,
    color: '#C62828',
  },
  estado: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  estadoListaVazia: {
    padding: 24,
    alignItems: 'center',
  },
  textoEstado: {
    fontSize: 15,
    color: '#697586',
    textAlign: 'center',
  },
  textoErro: {
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
  paginacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E8ED',
  },
  botaoPagina: {
    minWidth: 88,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#727DAC',
    alignItems: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.4,
  },
  textoBotaoPagina: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textoPagina: {
    fontSize: 12,
    color: '#475467',
  },
});
