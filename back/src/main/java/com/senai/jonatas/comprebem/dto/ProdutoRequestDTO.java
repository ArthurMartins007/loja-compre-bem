package com.senai.jonatas.comprebem.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProdutoRequestDTO(
        @NotBlank(message = "O nome do produto é obrigatório.")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres.")
        String nome,
        @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres.")
        String descricao,
        @NotNull(message = "O preço é obrigatório.")
        @DecimalMin(value = "0.01", message = "O preço deve ser maior que zero.")
        BigDecimal preco,
        @NotBlank(message = "A categoria é obrigatória.")
        @Size(max = 100, message = "A categoria deve ter no máximo 100 caracteres.")
        String categoria,
        String imagem,
        @NotNull(message = "A quantidade é obrigatória.")
        @Min(value = 0, message = "A quantidade não pode ser negativa.")
        Integer quantidade
) {
}
