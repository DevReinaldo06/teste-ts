Projeto - Parte 1 (TypeScript, Prisma, PostgreSQL e Swagger)

Este projeto foi desenvolvido como parte da atividade “Projeto - Parte 1”, utilizando TypeScript, Express, Zod, Prisma e PostgreSQL.
O objetivo principal é criar uma API REST com validações, integração com banco de dados e documentação via Swagger, demonstrando que as operações realizadas na API refletem corretamente no banco de dados.

Tecnologias Utilizadas

Node.js – Ambiente de execução para JavaScript no lado do servidor.

TypeScript – Superset de JavaScript com tipagem estática.

Express – Framework para criação de servidores HTTP e rotas.

Zod – Biblioteca para validação de dados de entrada.

Prisma ORM – Ferramenta de mapeamento objeto-relacional para integração com o banco de dados.

PostgreSQL – Banco de dados relacional utilizado no projeto.

Swagger – Ferramenta para documentação e testes interativos da API.

Estrutura do Projeto

O projeto está organizado para garantir clareza e separação de responsabilidades entre as partes do sistema:

.env – Contém variáveis de ambiente, como a URL do banco de dados.

package.json – Lista as dependências e scripts de execução.

tsconfig.json – Define as configurações do compilador TypeScript.

dist/ – Pasta gerada após a compilação do TypeScript, contendo:

server.js – Inicializa o servidor e carrega as rotas.

swagger.js – Configura a documentação Swagger.

prismaClient.js – Gerencia a conexão com o banco de dados.

controllers/ – Contém a lógica de negócio da aplicação.

routes/ – Define as rotas da API.

schemas/ – Define as validações de dados com Zod.

middlewares/ – Inclui middlewares de validação e tratamento.

Observação: o arquivo ursersController.js apresenta um pequeno erro de digitação no nome, o ideal seria renomeá-lo para usersController.js.

Configuração do Ambiente
1. Instalar Dependências

Execute o comando abaixo para instalar todas as dependências do projeto:

npm install

2. Configurar o Banco de Dados

Crie um arquivo .env na raiz do projeto e adicione a variável de ambiente com a URL do banco PostgreSQL:

DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"

3. Criar e Aplicar Migrações

Utilize o Prisma para criar o esquema do banco de dados:

npx prisma migrate dev

4. Iniciar o Servidor

Após configurar o ambiente, execute o servidor com:

npm run dev


O servidor será iniciado na porta padrão 3000.

Testando a API

Com o servidor em execução, acesse a documentação interativa da API no navegador:

http://localhost:3000/api-docs

Através do Swagger, é possível testar todas as rotas da API, incluindo:

Criação de registros (POST)

Listagem (GET)

Atualização (PUT)

Exclusão (DELETE)

Após realizar as operações, é possível verificar as mudanças no banco de dados utilizando o Prisma Studio ou outro gerenciador PostgreSQL.

Vídeo de Apresentação

O vídeo de demonstração apresenta:

A execução da API no terminal.

O uso do Swagger para envio de requisições.

As alterações refletindo no banco de dados.

Uma explicação da estrutura e funcionamento do projeto.

Link do vídeo: [Adicionar link do YouTube aqui]
Repositório público no GitHub: [Adicionar link do repositório aqui]

Integrantes
Nome Completo	RGM
Ysaac William Barbosa Viana Colaço	42924171
José Reinaldo Gomes Bezerra	44034083
Artur Dutra de Oliveira	(adicionar RGM)
Conclusão

Este projeto demonstra a implementação de uma API completa com:

Validações de dados utilizando Zod.

Integração com banco de dados PostgreSQL através do Prisma ORM.

Documentação interativa e acessível via Swagger.

O sistema foi desenvolvido seguindo boas práticas de desenvolvimento, priorizando organização, clareza de código e manutenibilidade, cumprindo todos os requisitos propostos na atividade
