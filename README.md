# Exam App - Système de Gestion des Examens en Ligne 🎓💻

Exam App est une application web métier robuste conçue pour automatiser, sécuriser et moderniser la gestion et le suivi statistique des examens au sein des établissements universitaires. Ce projet a été développé dans le cadre de mon Projet de Fin d'Études (PFE) à la **Faculté des Sciences et Techniques (FST) de Settat**.

## 🛠️ Architecture & Technologies

L'application repose sur une **architecture totalement découplée (SPA / API)** pour garantir une fluidité maximale, une séparation des responsabilités et une scalabilité optimale du système.

*   **Frontend :** React, JavaScript, Bootstrap 5.3.3 (Interface dynamique et responsive design).
*   **Backend (API RESTful) :** Framework Laravel, PHP.
*   **Base de Données :** MySQL (Gérée via HeidiSQL sous l'environnement Laragon).

---

## 🔒 Fonctionnalités Principales & Sécurité

### 👥 Gestion des Rôles (Multi-authentification)
L'accès aux ressources est strictement sectorisé et sécurisé de bout en bout grâce à **Laravel Sanctum** :
*   **Espace Enseignant :** Conception dynamique d'épreuves (QCM), configuration des questions, gestion des choix multiples et définition d'un temps limite (minuteur).
*   **Espace Étudiant :** Passation des examens en temps réel, traitement instantané des réponses par l'algorithme backend, et affichage immédiat de la note calculée avec sa mention correspondante.

### ⚙️ Optimisation des Performances (Backend)
*   **Résolution du problème des requêtes N+1 :** Utilisation systématique du mécanisme d'**Eager Loading** (`with()`) de l'ORM Eloquent de Laravel pour minimiser les accès à la base de données lors du chargement des relations complexes.
*   **Sécurisation des Données :** Implémentation du hachage irréversible des mots de passe via l'algorithme **Bcrypt**, protection native contre les injections SQL (via PDO) et les failles XSS.

---

## 🚀 Installation et Configuration en Local

### Prérequis
*   Laragon (ou tout autre environnement incluant PHP et MySQL).
*   Node.js & NPM.
*   Composer.

### 1. Cloner le projet
```bash
git clone [https://github.com/tu-usuario/SGEL.git](https://github.com/tu-usuario/SGEL.git)

# Entrer dans le répertoire de l'API
cd sgel-backend

# Installer les dépendances PHP
composer install

# Configurer le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans le fichier .env et lancer les migrations
php artisan migrate

# Entrer dans le répertoire frontend
cd ../sgel-frontend

# Installer les dépendances Node.js
npm install

# Lancer le serveur de développement local
npm run dev

---