# Componentes Angular - Demonstração

Este projeto contém uma implementação dos componentes Angular que você forneceu, incluindo:

## Componentes Implementados

### 1. BotaoComponent (`app-botao`)
- **Localização**: `src/app/shared/components/botao/`
- **Funcionalidades**:
  - Diferentes variantes: primary, accent, danger, secondary, warning
  - Tamanhos: pequeno, medio, grande
  - Estados: carregando, desabilitado
  - Suporte a ícones (esquerda/direita)
  - Tooltips configuráveis
  - Animações e efeitos visuais

### 2. FiltroBotoesComponent (`app-filtro-botoes`)
- **Localização**: `src/app/shared/components/filtro-botoes/`
- **Funcionalidades**:
  - Conjunto de botões para ações de filtro
  - Botões: Pesquisar, Incluir, Limpar
  - Responsivo para telas pequenas

### 3. FiltrosComponent (`app-filtros`)
- **Localização**: `src/app/shared/components/filtros/`
- **Funcionalidades**:
  - Container expansível para formulários de filtro
  - Baseado no Material Design Expansion Panel
  - Suporte a conteúdo projetado (ng-content)

### 4. DemoComponent
- **Localização**: `src/app/features/suporte-plataforma/`
- **Funcionalidades**:
  - Demonstração dos componentes
  - Log de ações em tempo real
  - Interface de teste interativa

## Estrutura de Arquivos

```
src/
├── app/
│   ├── features/
│   │   └── suporte-plataforma/
│   │       └── demo.component.ts
│   ├── shared/
│   │   └── components/
│   │       ├── botao/
│   │       │   ├── botao.component.ts
│   │       │   ├── botao.component.html
│   │       │   ├── botao.component.scss
│   │       │   ├── botao.types.ts
│   │       │   └── index.ts
│   │       ├── filtro-botoes/
│   │       │   ├── filtro-botoes.component.ts
│   │       │   ├── filtro-botoes.component.html
│   │       │   └── filtro-botoes.component.scss
│   │       └── filtros/
│   │           ├── filtros.component.ts
│   │           ├── filtros.component.html
│   │           └── filtros.component.scss
│   └── app.component.ts
└── styles/
    └── themes/
        └── _variables.scss
```

## Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento**:
   ```bash
   ng serve
   ```

3. **Abrir no navegador**:
   - Acesse: `http://localhost:4200`
   - A página de demonstração será carregada automaticamente

## Funcionalidades da Demonstração

### Teste de Botões
- Botões com diferentes cores do Material Design
- Log de cliques em tempo real
- Interface responsiva

### Log de Ações
- Registro de todas as interações
- Timestamp de cada ação
- Histórico limitado aos últimos 20 eventos

## Tecnologias Utilizadas

- **Angular 18**: Framework principal
- **Angular Material**: Componentes de UI
- **SCSS**: Estilização avançada
- **TypeScript**: Linguagem de programação
- **Standalone Components**: Arquitetura moderna do Angular

## Próximos Passos

Para expandir a demonstração com os componentes completos:

1. **Adicionar os componentes customizados**:
   - Descomente os imports no `demo.component.ts`
   - Adicione os formulários reativos
   - Implemente as funcionalidades completas

2. **Adicionar mais funcionalidades**:
   - Validação de formulários
   - Integração com APIs
   - Testes unitários

3. **Melhorar a UI**:
   - Temas personalizados
   - Animações avançadas
   - Responsividade aprimorada

## Observações

- O projeto está configurado com Angular Material
- Os componentes são standalone (não precisam de módulos)
- As variáveis SCSS estão centralizadas em `_variables.scss`
- O projeto usa as novas funcionalidades do Angular 18 (signals, control flow)

## Comandos Úteis

```bash
# Desenvolvimento
ng serve

# Build de produção
ng build

# Testes
ng test

# Linting
ng lint
```
