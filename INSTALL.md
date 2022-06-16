# Jouer en local

Pour jouer en local vous avez deux choix, avec NodeJs ou Docker

### Avec Nodejs

Installer NodeJs et yarn

#### Dev build

Dans le dossier client, installer les dépendances et lancer le client
La version de développement n'est pas du tout optimisé.

```
cd client/
yarn
yarn dev
```

Dans le dossier server, installer les dépendances et lancer le server

```
cd server/
yarn
yarn dev
```

Vous pouvez maintenant vous rendre sur http://localhost:3000

#### Production build

Allez dans le dossier client, installer les dépendances et lancer le serveur

```
cd client/
yarn
yarn build
yarn start
```

Allez dans le dossier server, installer les dépendances et lancer le serveur

```
cd server/
yarn
yarn build
yarn start
```

Vous pouvez maintenant vous rendre sur http://localhost:3000

### Avec Docker

Installer docker et docker-compose

#### Local build

```
docker-compose build
docker-compose up -d
```

Vous pouvez maintenant vous rendre sur http://localhost:3000

Pour stopper l'application, vous pouvez faire

```
docker-compose down
```

### Déploiement avec docker

Prérequis :

- Docker sur votre machine
- Un server avec docker et un utilisateur docker
- Utilisateur avec des droits root
- docker-compose sur votre serveur
- Posséder un nom de domaine

Pour le client, vous devez mettre en place .env.production, vous pouvez vous inspirer du .env.example.

Il faut donner pour NEXT_PUBLIC_SERVER_HTTP_URL le lien http vers le server par example : https://api-example.com
Il faut donner pour NEXT_PUBLIC_SERVER_WS_URL le lien websocket vers le server par example : wss://api-example.com

Vous devez aussi adapter la variable d'environement CORS_ORIGIN du service server dans docker-compose.prod.yml pour correspondre au nom de domaine de votre client

Le script deploy_docker.sh permet de créer les images en local et de les envoyer à un server via ssh.
Le parametre pris par le script est l'adresse ip et l'utilisateur d'un serveur dont vous avez accès

on peut exécuter le script comme cela par example :

```
./deploy_docker.sh user@111.111.111.111
```

Le temps d'exécution du script dépend de votre débit internet. Les images ne sont pas très lourdes car elles utilisent comme base alpine linux.
Pour autant il faut compter ~100MB pour le server en compressant avec bz2 et ~450MB pour le client en compressant avec bz2

À la suite de l'exécution du script, votre serveur à un dossier prod avec docker-compose.yml dedans.

En faisant

```
docker-compose up
```

Vous avez le client qui est disponible sur le port 3000 et le serveur disponible sur le port 4000.

Vous pouvez mettre en place un reverse-proxy comme [NGINX](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) pour accèder aux services via un nom de domaine.
