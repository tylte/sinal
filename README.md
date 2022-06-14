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


# Images du jeu

![image](https://user-images.githubusercontent.com/59796115/173543730-4ce48c50-3aa2-4753-8b70-96dcf7151ef0.png)
|:--:|
| <b>Lobby 1vs1</b>|


![image](https://user-images.githubusercontent.com/59796115/173544026-34666402-3b2b-4774-8e86-973700e6da88.png)
|:--:|
| <b>Partie de 1vs1</b>|


![image](https://user-images.githubusercontent.com/59796115/173546024-f3cb91d6-aeb4-496b-b6c9-ee2c93331793.png)
|:--:|
| <b>Fin de Partie 1vs1</b>|


![image](https://user-images.githubusercontent.com/59796115/173543201-87ac7e1e-5537-4101-b380-403704f56f75.png)
|:--:|
| <b>Lobby Battle Royale</b>|



![image](https://user-images.githubusercontent.com/59796115/173542959-33362b10-09ef-4d19-8f6b-efa9841508cf.png)
|:--:|
| <b>Partie de Battle Royale</b>|
