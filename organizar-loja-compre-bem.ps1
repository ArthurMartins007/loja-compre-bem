$ErrorActionPreference = 'Stop'

$repoRoot = (Get-Location).Path

if (-not (Test-Path -LiteralPath (Join-Path $repoRoot '.git'))) {
    throw 'Abra o PowerShell na raiz do repositório clonado. Não execute este script dentro de front ou back.'
}

$frontPath = Join-Path $repoRoot 'front'
$backPath = Join-Path $repoRoot 'back'

New-Item -ItemType Directory -Path $frontPath -Force | Out-Null
New-Item -ItemType Directory -Path $backPath -Force | Out-Null

$frontItems = @(
    'App.tsx',
    'app.json',
    'assets',
    'index.ts',
    'package.json',
    'package-lock.json',
    'src',
    'tsconfig.json',
    '.env',
    '.env.example',
    'README-INTEGRACAO-API.md',
    'AGENTS.md',
    'CLAUDE.md'
)

foreach ($item in $frontItems) {
    $source = Join-Path $repoRoot $item
    $destination = Join-Path $frontPath $item

    if (Test-Path -LiteralPath $source) {
        if (Test-Path -LiteralPath $destination) {
            Write-Warning "Ignorado porque já existe em front: $item"
        } else {
            Move-Item -LiteralPath $source -Destination $frontPath
            Write-Host "Movido para front: $item"
        }
    }
}

$backendSourceInput = Read-Host 'Informe o caminho completo da pasta do projeto Spring Boot (a pasta que contém pom.xml). Pressione Enter para copiar o back-end depois'

if (-not [string]::IsNullOrWhiteSpace($backendSourceInput)) {
    $backendSource = (Resolve-Path -LiteralPath $backendSourceInput).Path
    $pomPath = Join-Path $backendSource 'pom.xml'

    if (-not (Test-Path -LiteralPath $pomPath)) {
        throw 'A pasta informada não contém pom.xml. Informe a pasta raiz do projeto Spring Boot.'
    }

    $existingBackFiles = @(Get-ChildItem -LiteralPath $backPath -Force | Where-Object { $_.Name -ne '.gitkeep' })
    if ($existingBackFiles.Count -gt 0) {
        throw 'A pasta back já contém arquivos. Para evitar sobrescrever seu projeto, o script não copiou o back-end.'
    }

    Get-ChildItem -LiteralPath $backendSource -Force |
        Where-Object { $_.Name -ne '.git' } |
        ForEach-Object {
            Copy-Item -LiteralPath $_.FullName -Destination $backPath -Recurse -Force
        }

    $gitkeepPath = Join-Path $backPath '.gitkeep'
    if (Test-Path -LiteralPath $gitkeepPath) {
        Remove-Item -LiteralPath $gitkeepPath -Force
    }
    Write-Host 'Projeto Spring Boot copiado para back.'
} else {
    Write-Host 'O back-end não foi copiado agora. A pasta back foi criada para recebê-lo depois.'
}

$gitignore = @'
# Dependencias JavaScript
**/node_modules/

# Front-end: Expo / React Native
front/.expo/
front/dist/
front/web-build/
front/expo-env.d.ts
front/.env
front/.env.*
!front/.env.example
front/ios/
front/android/
front/.kotlin/
front/.metro-health-check*
front/npm-debug.*
front/yarn-debug.*
front/yarn-error.*
front/*.orig.*
front/*.jks
front/*.p8
front/*.p12
front/*.key
front/*.mobileprovision
front/*.pem
front/*.tsbuildinfo

# Back-end: Spring Boot / Maven
**/target/
back/data/
back/*.log

# Arquivos locais e IDE
.env
.env*.local
.DS_Store
.idea/
.vscode/
*.iml
'@
Set-Content -LiteralPath (Join-Path $repoRoot '.gitignore') -Value $gitignore -Encoding UTF8

$readme = @'
# Loja Compre Bem

Projeto dividido em duas aplicações independentes:

- `front/`: aplicativo React Native com Expo.
- `back/`: API REST desenvolvida com Spring Boot.

## Executar o back-end

Abra um terminal na raiz do repositório e execute:

```powershell
cd .\back
.\mvnw.cmd spring-boot:run
```

A API ficará disponível em `http://localhost:8080`.

## Executar o front-end

Abra outro terminal na raiz do repositório e execute:

```powershell
cd .\front
npm install
npx expo start
```

## Configuração da URL da API

Crie `front/.env` com a URL adequada ao dispositivo:

- Expo Web no mesmo computador: `EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1`
- Emulador Android: `EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/api/v1`
- Celular físico: use o IP local do computador na rede Wi-Fi.

O arquivo `front/.env` é local e não deve ser enviado ao Git. O modelo público fica em `front/.env.example`.
'@
if (-not (Test-Path -LiteralPath (Join-Path $repoRoot 'README.md'))) {
    Set-Content -LiteralPath (Join-Path $repoRoot 'README.md') -Value $readme -Encoding UTF8
} else {
    Write-Warning 'README.md já existe na raiz e foi preservado. Atualize-o manualmente com as instruções front/back, se necessário.'
}

if (-not (Test-Path -LiteralPath (Join-Path $backPath 'pom.xml'))) {
    Set-Content -LiteralPath (Join-Path $backPath '.gitkeep') -Value '' -Encoding UTF8
}

Write-Host ''
Write-Host 'Estrutura preparada:'
Get-ChildItem -LiteralPath $repoRoot -Force | Select-Object Mode, Name | Format-Table -AutoSize
Write-Host 'Confira os arquivos com git status antes de fazer o commit.'
