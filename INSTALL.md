# Jouer en local

Pour jouer en local vous avez deux choix, avec NodeJs ou Docker

### Avec Nodejs

Installer NodeJs et yarn

#### Client

Dans le dossier client, installer les dépendances et lancer le client

```
cd client/
yarn
yarn build && yarn start
```

#### Serveur

Dans le dossier server, installer les dépendances et lancer le server

```
cd server/
yarn
yarn build && yarn start
```

Vous pouvez maintenant vous rendre sur [localhost:3000](http://localhost:3000)

### Avec Docker

Installer docker et docker-compose

```
docker-compose build
docker-compose up -d
```

Vous pouvez maintenant vous rendre sur [localhost:3000](http://localhost:3000)

# Lancer la suite de test

```
cd server/
yarn
yarn test
```
