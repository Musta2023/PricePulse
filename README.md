# PricePulse - Tracker de Prix Malin (MVP) 🚀

PricePulse est une application web permettant de suivre l'évolution du prix de produits e-commerce. L'application propose un tableau de bord moderne pour visualiser les tendances de prix simulées en temps réel.

Ce projet a été réalisé pour démontrer une maîtrise de l'architecture Full-Stack, de la sécurité JWT, de la containerisation et des tests automatisés.

---

## 🛠️ Stack Technique

- **Frontend :** React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, Lucide React.
- **Backend :** Node.js, Express, TypeScript, Prisma ORM.
- **Base de données :** PostgreSQL.
- **Sécurité :** JWT (JSON Web Tokens), Bcrypt (hachage).
- **Tests :** Jest (Unitaires & Intégration), Playwright (E2E).
- **Infrastructure :** Docker, Docker Compose, Nginx.

---

## 🚀 Lancement Rapide (Docker)

Le projet est entièrement containerisé. Lancez tout l'écosystème avec :

```bash
docker-compose up --build
```

**Accès aux services :**
- **Dashboard (Frontend) :** [http://localhost:8081](http://localhost:8081)
- **API (Backend) :** [http://localhost:3000](http://localhost:3000)
- **Base de données :** Port `5433` (externe) / `5432` (interne Docker).

**Compte de test (Seed automatique) :**
- **Email :** `default@user.com`
- **Mot de passe :** `password123`

---

## 🧪 Stratégie de Tests

La qualité logicielle est assurée par trois niveaux de tests :

### 1. Tests Unitaires (Back)
Vérification de la logique pure (calcul des variations de prix).
```bash
cd backend && npm test src/services/__tests__
```

### 2. Tests d'Intégration (API)
Validation des endpoints (Auth, CRUD) et de la communication DB.
```bash
cd backend && npm test src/__tests__
```

### 3. Tests End-to-End (E2E)
Scénario utilisateur complet (Inscription -> Tracking -> Login).
```bash
cd frontend
npx playwright install chromium
npm run test:e2e
```

---

## 🏗️ Choix d'Architecture

- **Sécurité :** Authentification JWT avec isolation des données (chaque utilisateur ne voit que ses produits).
- **Simulateur :** Worker intégré simulant ±5% de variation toutes les 30s (évite le blocage par anti-scraping).
- **Data-Fetching :** Polling intelligent avec React Query pour des mises à jour fluides sans rechargement.
- **DevOps :** Utilisation de builds multi-étapes dans Docker et Nginx comme Reverse Proxy pour gérer les ports proprement.

---

## 📬 Documentation API (Postman)

Une collection Postman simplifiée est disponible dans le fichier `PricePulse_Postman_Collection.json`. Voici les routes clés :
- `POST /api/auth/register` : Créer un compte.
- `POST /api/auth/login` : Obtenir un token.
- `GET /api/products` : Voir ses produits.
- `POST /api/products` : Ajouter un produit.

---

## 💡 Si j'avais deux semaines de plus...

- **Authentification avancée :** Ajout de la réinitialisation de mot de passe, de la connexion via réseaux sociaux (OAuth), et d'une gestion plus fine des rôles utilisateurs.
- **Scraping réel :** Remplacer le simulateur de prix par un véritable service de scraping (ex: Playwright/Puppeteer) pour récupérer les prix réels des sites e-commerce.
- **Visualisation de données :** Intégration de graphiques (ex: Recharts) pour visualiser l'historique des prix sur une période donnée au lieu de simples indicateurs de tendance.
- **Notifications :** Système d'alertes par email ou push lorsqu'un prix descend en dessous d'un certain seuil.
- **CI/CD :** Mise en place d'un pipeline complet (GitHub Actions) pour automatiser les tests et le déploiement sur une plateforme cloud (Vercel/Render).
