package com.senai.jonatas.comprebem.controller;

import com.senai.jonatas.comprebem.dto.ProdutoRequestDTO;
import com.senai.jonatas.comprebem.dto.ProdutoResponseDTO;
import com.senai.jonatas.comprebem.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/produtos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final ProdutoService produtoService;

    @GetMapping
    public Page<ProdutoResponseDTO> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String busca) {
        if (page < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O parâmetro page não pode ser negativo.");
        }
        if (size < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O parâmetro size deve ser maior que zero.");
        }
        Pageable pageable = PageRequest.of(page, Math.min(size, 50));
        return produtoService.findAll(busca, pageable);
    }

    @GetMapping("/{id}")
    public ProdutoResponseDTO findById(@PathVariable("id") UUID id) {
        return produtoService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProdutoResponseDTO save(@Valid @RequestBody ProdutoRequestDTO produto) {
        return produtoService.save(produto);
    }

    @PutMapping("/{produtoId}")
    public ProdutoResponseDTO update(@PathVariable("produtoId") UUID produtoId, @Valid @RequestBody ProdutoRequestDTO produto) {
        return produtoService.update(produtoId, produto);
    }

    @DeleteMapping("/{produtoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("produtoId") UUID produtoId) {
        produtoService.delete(produtoId);
    }
}
