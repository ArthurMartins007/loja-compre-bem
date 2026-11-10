# Loja Compre Bem

Projeto dividido em duas aplicações independentes:

- `front/`: aplicativo React Native com Expo.
- `back/`: API REST em Java e Spring Boot.

## Requisitos da atividade

- A API garante um catálogo inicial com pelo menos 60 produtos.
- O aplicativo realiza cadastro, consulta, edição e exclusão diretamente na API.
- Os formulários validam os dados antes do envio e a API reforça as validações no DTO.
- Erros de conexão, dados inválidos e produtos inexistentes são apresentados em mensagens compreensíveis.
- A listagem carrega novas páginas automaticamente conforme a rolagem.

## Executar o back-end

Em um terminal na raiz do repositório:

```powershell
cd .\back
.\mvnw.cmd spring-boot:run
```

A API fica disponível em `http://localhost:8080`. O Swagger está em `http://localhost:8080/swagger-ui.html`.

## Executar o front-end

Em outro terminal na raiz:

```powershell
cd .\front
npm install
npx expo start
```

## Configurar a URL da API

Crie `front/.env` com a URL acessível pelo dispositivo:

- Expo Web no mesmo computador: `EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1`
- Emulador Android: `EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/api/v1`
- Celular físico: `EXPO_PUBLIC_API_URL=http://IP_DO_COMPUTADOR:8080/api/v1`

O arquivo `.env` é local e não deve ser enviado ao Git. O modelo fica em `front/.env.example`.

## Evidências

Salve as quatro capturas exigidas na pasta `evidencias/`. O roteiro detalhado está em `front/README-ATIVIDADE-CRUD.md`.

A resposta paginada usa o formato DTO do Spring Data: os itens ficam em `content` e os metadados em `page`.
