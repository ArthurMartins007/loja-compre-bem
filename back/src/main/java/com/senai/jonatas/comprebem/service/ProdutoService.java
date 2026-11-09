package com.senai.jonatas.comprebem.service;

import com.senai.jonatas.comprebem.dto.ProdutoRequestDTO;
import com.senai.jonatas.comprebem.dto.ProdutoResponseDTO;
import com.senai.jonatas.comprebem.entity.Produto;
import com.senai.jonatas.comprebem.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public Page<ProdutoResponseDTO> findAll(String busca, Pageable pageable) {
        Page<Produto> produtos;
        if (busca == null || busca.isBlank()) {
            produtos = produtoRepository.findAll(pageable);
        } else {
            produtos = produtoRepository.buscarPorNome(busca.trim(), pageable);
        }
        return produtos.map(ProdutoResponseDTO::toDto);
    }

    public ProdutoResponseDTO findById(UUID id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado."));
        return ProdutoResponseDTO.toDto(produto);
    }

    public ProdutoResponseDTO save(ProdutoRequestDTO produto) {
        Produto produtoSalvo = produtoRepository.save(Produto.toEntity(produto));
        return ProdutoResponseDTO.toDto(produtoSalvo);
    }

    public void delete(UUID produtoId) {
        if (!produtoRepository.existsById(produtoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado.");
        }
        produtoRepository.deleteById(produtoId);
    }

    public ProdutoResponseDTO update(UUID produtoId, ProdutoRequestDTO produto) {
        Produto produtoExistente = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado."));

        produtoExistente.setNome(produto.nome());
        produtoExistente.setDescricao(produto.descricao());
        produtoExistente.setPreco(produto.preco());
        produtoExistente.setCategoria(produto.categoria());
        produtoExistente.setImagem(produto.imagem());
        produtoExistente.setQuantidade(produto.quantidade());

        return ProdutoResponseDTO.toDto(produtoRepository.save(produtoExistente));
    }
}
