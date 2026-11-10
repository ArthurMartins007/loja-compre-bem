package com.senai.jonatas.comprebem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> tratarValidacao(MethodArgumentNotValidException exception) {
        Map<String, String> erros = new LinkedHashMap<>();
        for (FieldError erro : exception.getBindingResult().getFieldErrors()) {
            erros.putIfAbsent(erro.getField(), erro.getDefaultMessage());
        }
        Map<String, Object> resposta = new LinkedHashMap<>();
        resposta.put("timestamp", Instant.now().toString());
        resposta.put("status", HttpStatus.BAD_REQUEST.value());
        resposta.put("error", "Dados inválidos");
        resposta.put("message", "Confira os campos informados.");
        resposta.put("errors", erros);
        return ResponseEntity.badRequest().body(resposta);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> tratarCorpoInvalido(HttpMessageNotReadableException exception) {
        return resposta(HttpStatus.BAD_REQUEST, "O formato dos dados enviados é inválido.");
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> tratarParametroInvalido(MethodArgumentTypeMismatchException exception) {
        return resposta(HttpStatus.BAD_REQUEST, "O identificador ou parâmetro informado é inválido.");
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> tratarStatus(ResponseStatusException exception) {
        String mensagem = exception.getReason() == null
                ? "Não foi possível concluir a operação."
                : exception.getReason();
        return resposta(HttpStatus.valueOf(exception.getStatusCode().value()), mensagem);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> tratarErroInterno(Exception exception) {
        return resposta(HttpStatus.INTERNAL_SERVER_ERROR, "Ocorreu um erro interno. Tente novamente mais tarde.");
    }

    private ResponseEntity<Map<String, Object>> resposta(HttpStatusCode status, String mensagem) {
        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("timestamp", Instant.now().toString());
        corpo.put("status", status.value());
        corpo.put("message", mensagem);
        return ResponseEntity.status(status).body(corpo);
    }
}
