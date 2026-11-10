package com.senai.jonatas.comprebem.config;

import com.senai.jonatas.comprebem.entity.Produto;
import com.senai.jonatas.comprebem.repository.ProdutoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class CargaInicial implements CommandLineRunner {

    private final ProdutoRepository produtoRepository;

    public CargaInicial(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    @Override
    public void run(String... args) {
        long quantidadeAtual = produtoRepository.count();
        if (quantidadeAtual >= 60) {
            return;
        }

        List<String> nomes = List.of(
                    "Cadeira de escritório",
                    "Mesa de jantar",
                    "Sofá de dois lugares",
                    "Estante de madeira",
                    "Luminária de mesa",
                    "Cafeteira elétrica",
                    "Liquidificador",
                    "Ventilador de mesa",
                    "Fone de ouvido",
                    "Teclado sem fio",
                    "Mouse óptico",
                    "Monitor LED 24 polegadas",
                    "Notebook básico",
                    "Mochila para notebook",
                    "Garrafa térmica",
                    "Jogo de panelas",
                    "Frigideira antiaderente",
                    "Prato de cerâmica",
                    "Copo de vidro",
                    "Jogo de talheres",
                    "Toalha de banho",
                    "Lençol casal",
                    "Travesseiro",
                    "Cobertor casal",
                    "Organizador plástico",
                    "Cesto de roupa",
                    "Vassoura multiuso",
                    "Rodo de limpeza",
                    "Aspirador de pó",
                    "Ferro de passar",
                    "Tábua de passar",
                    "Varal retrátil",
                    "Lixeira inox",
                    "Relógio de parede",
                    "Quadro decorativo",
                    "Vaso de planta",
                    "Tapete para sala",
                    "Cortina blackout",
                    "Almofada decorativa",
                    "Espelho de parede",
                    "Prateleira branca",
                    "Caixa organizadora",
                    "Pote hermético",
                    "Balança digital",
                    "Carregador USB",
                    "Cabo HDMI",
                    "Adaptador de tomada",
                    "Extensão elétrica",
                    "Lâmpada LED",
                    "Pilha recarregável",
                    "Guarda-chuva",
                    "Cadeira dobrável",
                    "Mesa lateral",
                    "Banco de jardim",
                    "Mangueira de jardim",
                    "Regador plástico",
                    "Kit ferramentas",
                    "Chave de fenda",
                    "Trena de 5 metros",
                    "Maleta organizadora"
            );

        Set<String> nomesExistentes = produtoRepository.findAll().stream()
                .map(Produto::getNome)
                .collect(Collectors.toSet());

        for (int i = 0; i < nomes.size() && quantidadeAtual < 60; i++) {
            String nome = nomes.get(i);
            if (nomesExistentes.contains(nome)) {
                continue;
            }

            Produto produto = new Produto();
            produto.setNome(nome);
            produto.setDescricao("Produto " + (i + 1) + " do catálogo da Loja Compre Bem.");
            produto.setPreco(BigDecimal.valueOf(9.90 + (i * 7.35)).setScale(2, java.math.RoundingMode.HALF_UP));
            produto.setCategoria(categoriaPorIndice(i));
            produto.setImagem("");
            produto.setQuantidade(5 + (i % 46));
            produtoRepository.save(produto);
            nomesExistentes.add(nome);
            quantidadeAtual++;
        }
    }

    private static String categoriaPorIndice(int indice) {
        return switch (indice % 6) {
            case 0 -> "Móveis";
            case 1 -> "Eletrodomésticos";
            case 2 -> "Eletrônicos";
            case 3 -> "Cozinha";
            case 4 -> "Casa e decoração";
            default -> "Utilidades";
        };
    }
}
