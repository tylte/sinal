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

Pour jouer en local vous avez deux choix, avec NodeJs ou Docker

### Avec Nodejs

Installer NodeJs et yarn

#### Dev build

Dans le dossier client, installer les dépendances et lancer le client

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

Pour le client, vous pouvez mettre en place .env.production, vous pouvez vous inspirer du .env.example.

Il faut donner pour NEXT_PUBLIC_SERVER_HTTP_URL le lien http vers le server par example : https://api-example.com
Il faut donner pour NEXT_PUBLIC_SERVER_WS_URL le lien websocket vers le server par example : wss://api-example.com

En laissant vide .env.production, les valeurs par défauts sont http://localhost:3000 et ws://localhost:3000

puis faire

```
cd client/
yarn
yarn build
yarn start
```

Pour le server, vous devez mettre en place .env.

Il faut donner pour CORS_ORIGIN le domain du client, par example https://example.com

En laissant vide .env, la valeur par défaut est http://localhost:4000

puis faire

```
cd server/
yarn
yarn build
yarn start
```

### Avec Docker

Installer docker et docker-compose

#### Local build

```
docker-compose build
docker-compose up -d
```

Vous pouvez maintenant vous rendre sur http://localhost:3000

#### Production build

Pour le client, vous avez besoin de mettre en place .env.production, vous pouvez vous inspirer du .env.example.

Il faut donner pour NEXT_PUBLIC_SERVER_HTTP_URL le lien http vers le server par example : https://api-example.com
Il faut donner pour NEXT_PUBLIC_SERVER_WS_URL le lien websocket vers le server par example : wss://api-example.com

Vous devez aussi adapter la variable d'environement CORS_ORIGIN du service server dans docker-compose.prod.yml

puis faire :

```
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

Pour stopper l'application, vous pouvez faire

```
docker-compose down
```

# Images du jeu

![image](https://user-images.githubusercontent.com/59796115/173549011-b820d7ce-7905-4d9f-9de6-80746de05333.png)
|:--:|
| <b>Salle des lobbys</b>|

![image](https://user-images.githubusercontent.com/59796115/173543730-4ce48c50-3aa2-4753-8b70-96dcf7151ef0.png)
|:--:|
| <b>Lobby 1vs1</b>|

![image](https://user-images.githubusercontent.com/59796115/173544026-34666402-3b2b-4774-8e86-973700e6da88.png)
|:--:|
| <b>Partie de 1vs1</b>|

![image](https://user-images.githubusercontent.com/59796115/173546024-f3cb91d6-aeb4-496b-b6c9-ee2c93331793.png)
|:--:|
| <b>Fin de Partie 1vs1</b>|

![image](https://user-images.githubusercontent.com/59796115/173542959-33362b10-09ef-4d19-8f6b-efa9841508cf.png)
|:--:|
| <b>Partie de Battle Royale</b>|
