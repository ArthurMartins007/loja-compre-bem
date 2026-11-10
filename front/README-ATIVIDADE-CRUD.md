# Atividade — CRUD, tratamento de erros e rolagem infinita

## Requisitos implementados

- A API inicializa com pelo menos 60 produtos.
- O aplicativo lista e consulta produtos diretamente na API.
- O formulário cadastra produtos por `POST` e edita por `PUT`.
- A lista exclui por `DELETE`, após confirmação.
- A validação é feita tanto no front quanto no DTO da API.
- Erros de conexão, HTTP, dados inválidos e produto inexistente são apresentados em mensagens compreensíveis.
- A lista carrega páginas de 20 produtos automaticamente no fim da rolagem.

## Executar

Back-end, em um terminal na raiz do repositório:

```powershell
cd .\back
.\mvnw.cmd spring-boot:run
```

Front-end, em outro terminal na raiz:

```powershell
cd .\front
npm install
npx expo start
```

Configure `front/.env` com a URL da API. Para Expo Web no mesmo computador, use `EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1`. Para Android Emulator, use `http://10.0.2.2:8080/api/v1`. Para aparelho físico, use o IP local do computador.

## Capturas de tela exigidas

1. **60 produtos:** capture o Swagger com `totalElements` igual ou superior a 60 e a lista do app mostrando o total.
2. **CRUD:** capture o formulário de cadastro, o produto cadastrado na lista, a edição salva e a confirmação de exclusão. O Swagger pode demonstrar a persistência consultando o produto após criar/editar e conferindo 404 após excluir.
3. **Tratamento de erros:** capture a validação de um formulário vazio ou com preço inválido; desligue a API, tente atualizar a lista e capture a mensagem de conexão; teste um UUID inexistente para comprovar o 404.
4. **Rolagem infinita:** capture a lista após rolar, com a quantidade de produtos carregados aumentando em páginas de 20, e a indicação de fim quando todos forem exibidos.

As capturas devem ser feitas no dispositivo, emulador ou navegador que esteja executando o aplicativo. Não utilize imagens simuladas como evidência de funcionamento.

## Formato da resposta paginada

Como a API usa `spring.data.web.pageable.serialization-mode=via_dto`, a resposta contém os produtos em `content` e os metadados dentro do objeto `page` (`number`, `size`, `totalElements` e `totalPages`). O tipo `Pagina<T>` e a listagem usam essa estrutura.
