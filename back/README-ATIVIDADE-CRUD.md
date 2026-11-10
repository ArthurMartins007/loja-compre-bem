# Atividade — API de produtos

## Funcionalidades

- Carga inicial que garante pelo menos 60 produtos quando o catálogo começa com menos de 60.
- CRUD de produtos: `GET`, `POST`, `PUT` e `DELETE`.
- Validação de nome, categoria, preço, descrição e quantidade no DTO de entrada.
- Respostas de erro consistentes para dados inválidos, identificadores inválidos e produtos inexistentes.
- Paginação de 20 itens por padrão, com limite máximo de 50.

## Executar

```powershell
.\mvnw.cmd spring-boot:run
```

Swagger UI: http://localhost:8080/swagger-ui.html

## Endpoints

- `GET /api/v1/produtos?page=0&size=20`
- `GET /api/v1/produtos/{id}`
- `POST /api/v1/produtos`
- `PUT /api/v1/produtos/{produtoId}`
- `DELETE /api/v1/produtos/{produtoId}`

O corpo de criação/edição deve conter `nome`, `preco`, `categoria` e `quantidade`. `descricao` e `imagem` são opcionais.
