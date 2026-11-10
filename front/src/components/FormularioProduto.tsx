import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { Produto, ProdutoInput } from '../types/produto';

type Props = {
  produto?: Produto | null;
  salvando: boolean;
  erro: string;
  onSalvar: (dados: ProdutoInput) => Promise<void>;
  onCancelar: () => void;
};

type Campos = {
  nome: string;
  descricao: string;
  preco: string;
  categoria: string;
  imagem: string;
  quantidade: string;
};

const CAMPOS_INICIAIS: Campos = { nome: '', descricao: '', preco: '', categoria: '', imagem: '', quantidade: '0' };

export default function FormularioProduto({ produto, salvando, erro, onSalvar, onCancelar }: Props) {
  const [campos, setCampos] = useState<Campos>(CAMPOS_INICIAIS);
  const [erros, setErros] = useState<string[]>([]);

  useEffect(() => {
    setCampos(produto ? {
      nome: produto.nome,
      descricao: produto.descricao ?? '',
      preco: String(produto.preco).replace('.', ','),
      categoria: produto.categoria ?? '',
      imagem: produto.imagem ?? '',
      quantidade: String(produto.quantidade),
    } : CAMPOS_INICIAIS);
  }, [produto]);

  function alterar(campo: keyof Campos, valor: string) {
    setCampos((atuais) => ({ ...atuais, [campo]: valor }));
  }

  async function enviar() {
    const novosErros: string[] = [];
    const preco = Number(campos.preco.replace(',', '.'));
    const quantidade = Number(campos.quantidade);

    if (!campos.nome.trim()) novosErros.push('Informe o nome do produto.');
    if (!campos.categoria.trim()) novosErros.push('Informe a categoria.');
    if (!campos.preco.trim() || !Number.isFinite(preco) || preco <= 0) novosErros.push('Informe um preço maior que zero.');
    if (!Number.isInteger(quantidade) || quantidade < 0) novosErros.push('A quantidade deve ser um número inteiro igual ou maior que zero.');
    if (campos.descricao.length > 500) novosErros.push('A descrição deve ter no máximo 500 caracteres.');

    setErros(novosErros);
    if (novosErros.length) return;

    await onSalvar({
      nome: campos.nome.trim(),
      descricao: campos.descricao.trim(),
      preco,
      categoria: campos.categoria.trim(),
      imagem: campos.imagem.trim(),
      quantidade,
    });
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>{produto ? 'Editar produto' : 'Cadastrar produto'}</Text>
        <Text style={styles.subtitulo}>Preencha as informações do produto.</Text>
        {erros.map((mensagem) => <Text key={mensagem} style={styles.erro}>{mensagem}</Text>)}
        {!!erro && <Text style={styles.erro}>{erro}</Text>}
        <Campo label="Nome *" value={campos.nome} onChangeText={(v) => alterar('nome', v)} placeholder="Ex.: Cadeira de escritório" />
        <Campo label="Categoria *" value={campos.categoria} onChangeText={(v) => alterar('categoria', v)} placeholder="Ex.: Móveis" />
        <Campo label="Preço (R$) *" value={campos.preco} onChangeText={(v) => alterar('preco', v)} placeholder="0,00" keyboardType="decimal-pad" />
        <Campo label="Quantidade em estoque *" value={campos.quantidade} onChangeText={(v) => alterar('quantidade', v)} placeholder="0" keyboardType="number-pad" />
        <Campo label="Descrição" value={campos.descricao} onChangeText={(v) => alterar('descricao', v)} placeholder="Descrição do produto" multiline />
        <Campo label="URL da imagem" value={campos.imagem} onChangeText={(v) => alterar('imagem', v)} placeholder="https://..." />
        <TouchableOpacity style={[styles.botao, salvando && styles.desabilitado]} onPress={enviar} disabled={salvando}>
          <Text style={styles.textoBotao}>{salvando ? 'Salvando...' : 'Salvar produto'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoSecundario} onPress={onCancelar} disabled={salvando}>
          <Text style={styles.textoSecundario}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type CampoProps = {
  label: string;
  value: string;
  onChangeText: (valor: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'decimal-pad' | 'number-pad';
  multiline?: boolean;
};

function Campo({ label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false }: CampoProps) {
  return (
    <View style={styles.campoContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textarea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#87909D"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        maxLength={multiline ? 500 : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  conteudo: { padding: 18, paddingBottom: 36, backgroundColor: '#F7F8FA' },
  titulo: { fontSize: 24, fontWeight: '700', color: '#1B2A41' },
  subtitulo: { marginTop: 5, marginBottom: 18, color: '#697586' },
  campoContainer: { marginBottom: 14 },
  label: { marginBottom: 6, fontWeight: '600', color: '#344054' },
  input: { minHeight: 46, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#D9DEE7', borderRadius: 9, backgroundColor: '#FFFFFF', color: '#1B2A41' },
  textarea: { minHeight: 100 },
  erro: { marginBottom: 8, color: '#B42318', lineHeight: 20 },
  botao: { marginTop: 8, padding: 14, borderRadius: 9, alignItems: 'center', backgroundColor: '#727DAC' },
  textoBotao: { color: '#FFFFFF', fontWeight: '700' },
  desabilitado: { opacity: 0.55 },
  botaoSecundario: { marginTop: 10, padding: 13, alignItems: 'center' },
  textoSecundario: { color: '#475467', fontWeight: '600' },
});
