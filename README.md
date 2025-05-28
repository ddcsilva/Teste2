# Sistema de Equipamentos

Sistema Angular para gerenciamento de equipamentos com grid genérico e funcionalidades de CRUD.

## 🚀 Como executar o projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm

### Instalação e execução

1. **Clone o repositório e instale as dependências:**
```bash
npm install
```

2. **Instale as dependências do mock-api:**
```bash
cd mock-api
npm install
cd ..
```

3. **Execute o projeto (Angular + Mock API):**
```bash
npm start
```

Este comando irá iniciar:
- **Angular Dev Server** em `http://localhost:4200`
- **Mock API** em `http://localhost:3001`

### Comandos disponíveis

- `npm start` - Inicia ambos os servidores (Angular + Mock API)
- `npm run start:app` - Inicia apenas o Angular
- `npm run start:api` - Inicia apenas o Mock API
- `npm run build` - Build de produção
- `npm run test` - Executa os testes
- `npm run lint` - Executa o linter

## 📋 Funcionalidades

### Grid Genérico
- ✅ **Ordenação por colunas** - Clique nos headers para ordenar
- ✅ **Paginação** - Navegação entre páginas
- ✅ **Filtros** - Busca por código, categoria e localização
- ✅ **Ações** - Editar e excluir equipamentos
- ✅ **Responsivo** - Adaptável a diferentes tamanhos de tela
- ✅ **Estados de loading e erro**

### Equipamentos
- ✅ **Listagem** com grid paginado
- ✅ **Filtros** por código, categoria e localização
- ✅ **Ordenação** por qualquer coluna
- ✅ **Ações** de editar e excluir
- ✅ **Exportação** para Excel (simulada)

## 🛠️ Tecnologias utilizadas

- **Angular 18** - Framework principal
- **Angular Material** - Componentes UI
- **RxJS** - Programação reativa
- **TypeScript** - Linguagem
- **Express.js** - Mock API
- **JSON Server** - Simulação de API REST

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── core/                 # Módulos e serviços centrais
│   ├── shared/               # Componentes compartilhados
│   │   └── components/
│   │       └── grid-generico/  # Grid reutilizável
│   ├── features/             # Funcionalidades específicas
│   │   └── equipamentos/     # Módulo de equipamentos
│   └── auth/                 # Autenticação
mock-api/                     # API simulada
├── db.json                   # Dados mock
├── server.js                 # Servidor Express
└── package.json              # Dependências da API
```

## 🔧 Configuração da API

A Mock API está configurada em `mock-api/server.js` e utiliza os dados em `mock-api/db.json`.

### Endpoints disponíveis:

- `GET /api/v1/equipamentos` - Lista equipamentos (com paginação e filtros)
- `GET /api/v1/equipamentos/:id` - Busca equipamento por ID
- `POST /api/v1/equipamentos` - Cria novo equipamento
- `PUT /api/v1/equipamentos/:id` - Atualiza equipamento
- `DELETE /api/v1/equipamentos/:id` - Remove equipamento
- `GET /api/v1/categorias` - Lista categorias
- `GET /api/v1/localizacoes` - Lista localizações
- `GET /api/v1/usuarios` - Lista usuários

### Parâmetros de filtro:
- `_page` - Número da página (base 1)
- `_per_page` - Itens por página
- `codigo_like` - Filtro por código (busca parcial)
- `categoria_like` - Filtro por categoria (busca parcial)
- `localizacao_like` - Filtro por localização (busca parcial)

## 🎯 Funcionalidades do Grid

### Ordenação
- Clique no header de qualquer coluna para ordenar
- Suporte a ordenação ascendente e descendente
- Indicadores visuais de ordenação

### Paginação
- Navegação entre páginas
- Seleção de itens por página (5, 10, 20, 50, 100)
- Informações de página atual e total

### Filtros
- Filtros em tempo real
- Busca parcial por texto
- Botões de limpar e pesquisar

### Responsividade
- Adaptável a diferentes tamanhos de tela
- Densidade configurável (compact, comfortable, spacious)

## 🐛 Resolução de problemas

### Erro de conexão com a API
Se você receber erro `ERR_CONNECTION_REFUSED`, verifique se:
1. O comando `npm start` foi executado
2. A porta 3001 não está sendo usada por outro processo
3. As dependências do mock-api foram instaladas

### Ordenação não funciona
A ordenação foi corrigida e agora funciona corretamente. Se ainda houver problemas:
1. Verifique se `mostrarOrdenacao: true` na configuração do grid
2. Confirme se o evento `ordenacaoMudou` está sendo capturado
3. Verifique o console para logs de ordenação

## 📝 Próximos passos

- [ ] Implementar ordenação server-side
- [ ] Adicionar mais filtros avançados
- [ ] Implementar exportação real para Excel
- [ ] Adicionar testes unitários
- [ ] Implementar autenticação
- [ ] Adicionar validações de formulário
