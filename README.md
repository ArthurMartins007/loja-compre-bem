# Loja Compre Bem

Projeto dividido em duas aplicaÃ§Ãµes independentes:

- `front/`: aplicativo React Native com Expo.
- `back/`: API REST desenvolvida com Spring Boot.

## Executar o back-end

Abra um terminal na raiz do repositÃ³rio e execute:

```powershell
cd .\back
.\mvnw.cmd spring-boot:run
```

A API ficarÃ¡ disponÃ­vel em `http://localhost:8080`.

## Executar o front-end

Abra outro terminal na raiz do repositÃ³rio e execute:

```powershell
cd .\front
npm install
npx expo start
```

## ConfiguraÃ§Ã£o da URL da API

Crie `front/.env` com a URL adequada ao dispositivo:

- Expo Web no mesmo computador: `EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1`
- Emulador Android: `EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/api/v1`
- Celular fÃ­sico: use o IP local do computador na rede Wi-Fi.

O arquivo `front/.env` Ã© local e nÃ£o deve ser enviado ao Git. O modelo pÃºblico fica em `front/.env.example`.
