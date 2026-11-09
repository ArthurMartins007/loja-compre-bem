package com.senai.jonatas.comprebem;

import com.senai.jonatas.comprebem.entity.Produto;
import com.senai.jonatas.comprebem.repository.ProdutoRepository;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.util.List;

@SpringBootApplication
@OpenAPIDefinition
public class ComprebemApplication {

    public static void main(String[] args) {
        SpringApplication.run(ComprebemApplication.class, args);
    }

    @Bean
    CommandLineRunner carregarProdutosIniciais(ProdutoRepository produtoRepository) {
        return args -> {
            if (produtoRepository.count() > 0) {
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

            for (int i = 0; i < nomes.size(); i++) {
                Produto produto = new Produto();
                produto.setNome(nomes.get(i));
                produto.setDescricao("Produto " + (i + 1) + " do catálogo da Loja Compre Bem.");
                produto.setPreco(BigDecimal.valueOf(9.90 + (i * 7.35)).setScale(2, java.math.RoundingMode.HALF_UP));
                produto.setCategoria(categoriaPorIndice(i));
                produto.setImagem("");
                produto.setQuantidade(5 + (i % 46));
                produtoRepository.save(produto);
            }
        };
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
