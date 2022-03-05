<div align="center">
<h1>e-scambo: backend</h1>
<p>Aplicação backend que faz parte da plataforma <a href="http://github.com/e-scambo">e-scambo</a></p>
</div>

## Instalação

Faça uma cópia do arquivo `.env.exampe` chamada `.env` e preencha as variáveis de acordo com a sua preferência. Exemplo:

```
# ENV
# description: application environment, used to determine some API behavior in specific environments.
# example: dev, test, prod
ENV=dev

# PORT 
# description: application http port 
# example: 3000
PORT=3000

# DATABASE_URL
# description: full database url
# example: mongodb://<user>:<pwd>@<host>:<port>/database
DATABASE_URL=mongodb://localhost:27017/e-scambo-api
```

Após isso, instale as dependências do projeto:

```bash
$ npm install
```

## Executando a aplicação

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Executando os testes

```bash
# all tests
npm run test

# unit tests
$ npm run test:unit

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Equipe de desenvolvimento

- [Lucas Carvalho](https://github.com/magao02) - Scrum Master
- [Thiago Dutra](https://github.com/thiagodutra) - Desenvolvedor Backend
- [Lucas Rocha](https://github.com/lucasrochagit) - Desenvolvedor Backend
- [Joanderson Souza](https://github.com/WaifuForever) - Desenvolvedor Backend
