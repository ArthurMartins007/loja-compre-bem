# Loja Compre Bem App

## Integração com a API

A tela de listagem consome `GET /api/v1/produtos` e renderiza os itens recebidos em `content` na resposta paginada do Spring Boot. A consulta envia `page` e `size=20`; quando há texto de pesquisa, envia também `busca`.

O serviço de produtos fica em `src/service/produto-service.ts`, o cliente HTTP em `src/service/api.ts`, a URL base em `src/config/api-config.ts` e os tipos da resposta em `src/types`.

## Configurar endereço da API

A aplicação precisa alcançar o servidor Spring Boot na porta 8080.

- Expo Web no mesmo computador: `http://localhost:8080/api/v1`
- Emulador Android: crie um arquivo `.env` com `EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/api/v1`
- Celular físico: crie um arquivo `.env` com `EXPO_PUBLIC_API_URL=http://IP_DO_COMPUTADOR:8080/api/v1`, usando o IP local do computador conectado à mesma rede Wi-Fi do celular.

O arquivo `.env.example` é apenas um modelo. Depois de alterar a URL, reinicie o Expo para carregar a variável.

## Executar

1. Inicie a API Spring Boot.
2. Na pasta deste projeto, instale dependências com `npm install`.
3. Execute `npx expo start`.
4. Abra o app no navegador, emulador ou Expo Go.

A listagem mostra a página atual, total de produtos e controles para navegar entre páginas. A pesquisa é enviada à API e os detalhes consultam o endpoint por ID.
