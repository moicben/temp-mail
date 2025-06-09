# 📧 TempMail - Gestion d'emails temporaires

Une application moderne de gestion d'emails temporaires construite avec Next.js, Supabase et l'API TempMail. Interface Gmail-like avec mode sombre, authentification sécurisée et fonctionnalités avancées.

## ✨ Fonctionnalités

### 🔐 Authentification et sécurité
- ✅ Inscription et connexion sécurisées
- ✅ Support OAuth (Google, Facebook) - *en cours de configuration*
- ✅ Réinitialisation de mot de passe
- ✅ Vérification d'email
- ✅ Authentification à deux facteurs - *prochainement*

### 📬 Gestion d'emails temporaires
- ✅ Création d'adresses email temporaires illimitées
- ✅ Configuration de la durée d'expiration (1h, 1j, 1s)
- ✅ Suppression manuelle des adresses temporaires
- ✅ Expiration automatique

### 📨 Fonctionnalités email
- ✅ Boîte de réception unifiée
- ✅ Visualisation des emails en temps réel
- ✅ Recherche et filtrage des emails
- ✅ Marquage comme lu/non lu
- ⏳ Réponse et composition d'emails - *en développement*
- ⏳ Transfert vers email principal - *en développement*

### 🎨 Interface utilisateur
- ✅ Design responsive et moderne
- ✅ Mode sombre/clair
- ✅ Interface Gmail-like
- ✅ Notifications toast
- ⏳ Drag & drop pour organisation - *en développement*
- ✅ Animations fluides

### 🔔 Notifications
- ✅ Notifications en temps réel pour nouveaux emails
- ⏳ Règles de transfert personnalisées - *en développement*
- ⏳ Notifications push - *prochainement*

### 🛡️ Sécurité et confidentialité
- ✅ Chiffrement des données en base
- ✅ Politiques de sécurité RLS (Row Level Security)
- ✅ Suppression automatique des données expirées
- ✅ Aucun tracking utilisateur

### 🚀 Performance et évolutivité
- ✅ Optimisations de performance
- ✅ Mise en cache efficace
- ✅ Architecture scalable
- ✅ Support des montées en charge

### 🔗 API et intégrations
- ✅ API REST complète
- ✅ Intégration TempMail via RapidAPI
- ⏳ Webhooks pour notifications externes - *en développement*
- ⏳ SDK JavaScript - *prochainement*

### 📊 Analytics et rapports
- ✅ Statistiques d'usage de base
- ⏳ Rapports d'activité détaillés - *en développement*
- ⏳ Dashboard analytics - *prochainement*

### 📋 Conformité
- ✅ Conformité RGPD
- ✅ Export des données utilisateur
- ✅ Suppression des données sur demande
- ✅ Politique de confidentialité intégrée

## 🚀 Installation rapide

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Supabase
- Clé API RapidAPI (TempMail)

### 1. Cloner le projet
```bash
git clone <repository-url>
cd tempmail
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de l'environnement
Créez un fichier `.env.local` à la racine :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_publique_supabase

# RapidAPI TempMail
RAPIDAPI_KEY=votre_cle_rapidapi
RAPIDAPI_HOST=privatix-temp-mail-v1.p.rapidapi.com

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre_secret_nextauth

# OAuth (optionnel)
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret
FACEBOOK_CLIENT_ID=votre_facebook_client_id
FACEBOOK_CLIENT_SECRET=votre_facebook_client_secret
```

### 4. Configuration de la base de données
1. Allez dans votre projet Supabase
2. Ouvrez l'éditeur SQL
3. Exécutez le contenu du fichier `database-schema.sql`

### 5. Lancer l'application
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 🏗️ Architecture

### Structure du projet
```
tempmail/
├── app/                    # Pages Next.js (App Router)
│   ├── globals.css        # Styles globaux
│   ├── layout.js          # Layout principal
│   ├── page.js            # Page d'accueil
│   └── providers.js       # Providers React
├── components/            # Composants React
│   ├── ui/               # Composants UI réutilisables
│   ├── auth/             # Composants d'authentification
│   ├── dashboard/        # Composants du dashboard
│   └── email/            # Composants de gestion email
├── contexts/             # Contextes React
│   ├── ThemeContext.js   # Gestion du thème
│   ├── EmailContext.js   # Gestion des emails
│   └── UserContext.js    # Gestion utilisateur
├── lib/                  # Utilitaires et configurations
│   ├── supabase.js       # Configuration Supabase
│   └── tempmail-api.js   # API TempMail
├── utils/                # Fonctions utilitaires
└── hooks/                # Hooks React personnalisés
```

### Technologies utilisées
- **Frontend** : Next.js 14, React 18, Tailwind CSS
- **Backend** : Supabase (PostgreSQL, Auth, Real-time)
- **API Email** : TempMail via RapidAPI
- **Authentification** : NextAuth.js
- **Styling** : Tailwind CSS, CSS Modules
- **State Management** : React Context + useReducer
- **Notifications** : React Hot Toast
- **Icons** : React Icons (Heroicons)

## 📡 Configuration Supabase

### 1. Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez l'URL et la clé publique

### 2. Configurer l'authentification
1. Dans le dashboard Supabase, allez dans "Authentication"
2. Configurez les providers OAuth souhaités
3. Ajoutez votre URL de redirection : `http://localhost:3000/api/auth/callback/supabase`

### 3. Exécuter le schéma de base
1. Ouvrez l'éditeur SQL dans Supabase
2. Copiez-collez le contenu de `database-schema.sql`
3. Exécutez le script

## 🔑 Configuration RapidAPI

### 1. Obtenir une clé API
1. Allez sur [RapidAPI](https://rapidapi.com)
2. Recherchez "TempMail" ou "Privatix TempMail"
3. Souscrivez à l'API (plan gratuit disponible)
4. Notez votre clé API

### 2. Tester l'API
```javascript
// Test de base dans la console
const response = await fetch('https://privatix-temp-mail-v1.p.rapidapi.com/request/domains/format/json/', {
  headers: {
    'X-RapidAPI-Key': 'votre_cle_api',
    'X-RapidAPI-Host': 'privatix-temp-mail-v1.p.rapidapi.com'
  }
});
console.log(await response.json());
```

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Variables d'environnement de production
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RAPIDAPI_KEY=
RAPIDAPI_HOST=privatix-temp-mail-v1.p.rapidapi.com
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=
```

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification ESLint

# Base de données
npm run db:reset     # Réinitialiser la DB (à créer)
npm run db:seed      # Seeder la DB (à créer)
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📝 Roadmap

### V1.1 (Prochaine version)
- [ ] Composition et réponse aux emails
- [ ] Règles de transfert avancées
- [ ] Drag & drop pour organisation
- [ ] Notifications push

### V1.2
- [ ] API publique avec documentation
- [ ] Webhooks pour intégrations
- [ ] SDK JavaScript
- [ ] Application mobile

### V2.0
- [ ] Multi-domaines personnalisés
- [ ] Chiffrement end-to-end
- [ ] Collaboration d'équipe
- [ ] Intégrations tierces (Zapier, etc.)

## 🐛 Signaler un bug

Ouvrez une issue sur GitHub avec :
- Description détaillée du problème
- Étapes pour reproduire
- Screenshots si pertinent
- Informations sur l'environnement

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) pour le framework
- [Supabase](https://supabase.com/) pour le backend
- [TempMail API](https://rapidapi.com/Privatix/api/temp-mail) pour les emails temporaires
- [Tailwind CSS](https://tailwindcss.com/) pour les styles
- [Heroicons](https://heroicons.com/) pour les icônes

---

**Développé avec ❤️ pour protéger votre vie privée** 