# Atividade — paginação do catálogo de produtos

## Requisitos implementados

- `GET /api/v1/produtos` retorna uma página, com `page=0` e `size=20` por padrão.
- `size` é limitado a 50, mesmo que a requisição peça um valor maior.
- `busca` filtra pelo nome sem diferenciar maiúsculas e minúsculas.
- `GET /api/v1/produtos/{id}` responde com 404 quando o UUID não existe.
- A aplicação cadastra 60 produtos de demonstração no primeiro início, caso o banco esteja vazio.

## Executar

Use Java 21. No PowerShell, abra a pasta raiz do projeto e execute:

```powershell
.\mvnw.cmd spring-boot:run
```

Swagger UI: http://localhost:8080/swagger-ui.html

## Roteiro de apresentação

1. `GET /api/v1/produtos` — confira `content` com 20 registros, `totalElements: 60`, `totalPages: 3` e `size: 20`.
2. `GET /api/v1/produtos?page=2` — confira `number: 2` e os itens da terceira página (a numeração da página começa em zero).
3. `GET /api/v1/produtos?size=500` — confira `size: 50` no objeto `pageable`/página e até 50 itens em `content`.
4. `GET /api/v1/produtos?busca=cAdEiRa` — deve retornar produtos cujo nome contém o termo, ignorando maiúsculas/minúsculas.
5. Copie um `produtoId` existente para `GET /api/v1/produtos/{id}` e depois use um UUID válido que não exista, por exemplo `00000000-0000-0000-0000-000000000000`; o segundo caso deve retornar HTTP 404.

Observação: a atividade menciona `page=2` como última página, mas com 60 produtos e páginas de 20, a numeração baseada em zero torna `page=2` a terceira e última página. A carga inicial tem exatamente 60 produtos para demonstrar três páginas de 20. O parâmetro `page` começa em zero, então `page=2` é a terceira página e a última quando existem 60 produtos.
