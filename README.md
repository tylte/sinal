# Projet SINAL (Sutom Is Not About Luck)

| Dev                   | Role                   |
| --------------------- | ---------------------- |
| Tanguy Lambert        | Front / Chef de projet |
| Baptiste Meauzé       | Backend                |
| Benjamin Viaud        | Full-stack             |
| Jean-Baptiste Bougaud | Full-stack             |

---

# L'application

SINAL est une application web reprennant les règles de motus et en s'inspirant de sutom et tusmo, les adaptant à des modes multijoueurs, le battle royal et le 1vs1.
Avec d'éventuels modes de jeu suplémentaires à venir plus tard.

# Techonologies utilisées

Typescript pour le serveur et le client

### Client

React/NextJS (front-end framework)

Chakra UI (UI design)

### Serveur

Socket.io / ExpressJS (serveur)


# Fonctionnalités

Les principales fonctionalités sont le mode 1vs1 et le mode Battle Royale

# Jouer en local

Pour jouer en local vous avez deux choix, NodeJs ou Docker

### Avec Nodejs

Installer nodejs et yarn

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
