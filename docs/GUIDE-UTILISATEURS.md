# Guide Utilisateurs — SafeLand Morocco
## Manuel d'Utilisation de la Plateforme

**Version 1.0 — Mars 2026**
**Public : Agents ANCFCC, Notaires, Juges, Proprietaires, Banques**

---

## Table des Matieres

1. [Introduction](#1-introduction)
2. [Prerequis et Installation](#2-prerequis-et-installation)
3. [Connexion et Authentification](#3-connexion-et-authentification)
4. [Dashboard](#4-dashboard)
5. [Module Proprietes](#5-module-proprietes)
6. [Module Escrow (Transactions)](#6-module-escrow)
7. [Module Fridda (Successions)](#7-module-fridda)
8. [Module Justice](#8-module-justice)
9. [Module Banque](#9-module-banque)
10. [Module Timelock](#10-module-timelock)
11. [Statistiques](#11-statistiques)
12. [Notifications](#12-notifications)
13. [FAQ](#13-faq)
14. [Glossaire](#14-glossaire)

---

## 1. Introduction

### 1.1 Qu'est-ce que SafeLand ?

SafeLand est une plateforme de securisation fonciere qui transforme les titres de propriete en NFT (jetons numeriques uniques) sur blockchain. Chaque titre foncier ANCFCC est represente par un NFT infalsifiable, tracable et automatise.

### 1.2 A Qui S'Adresse Ce Guide ?

| Profil | Modules Concernes |
|--------|-------------------|
| Agent ANCFCC | Proprietes, Statistiques |
| Notaire / Adoul | Proprietes, Escrow, Fridda |
| Juge / Magistrat | Justice |
| Proprietaire / MRE | Proprietes (consultation, Travel Lock) |
| Banque | Banque (scoring, hypotheques) |
| Administrateur | Timelock, tous les modules |

### 1.3 Langues Disponibles

La plateforme est disponible en 3 langues :
- **Francais** (par defaut)
- **English**
- **Arabe** (avec support RTL automatique)

Le changement de langue se fait via le selecteur en haut a droite de la barre de navigation.

---

## 2. Prerequis et Installation

### 2.1 Navigateur

- Google Chrome (recommande) ou Firefox
- Extension MetaMask installee (https://metamask.io)

### 2.2 MetaMask

MetaMask est un portefeuille (wallet) numerique qui vous permet de signer des transactions sur la blockchain.

**Installation :**
1. Allez sur https://metamask.io
2. Cliquez "Telecharger" et installez l'extension navigateur
3. Suivez les etapes de creation de compte
4. **IMPORTANT** : Sauvegardez votre phrase de recuperation (12 mots) dans un lieu sur. Ne la partagez JAMAIS.

### 2.3 Configuration Reseau

Pour se connecter au reseau SafeLand, MetaMask doit etre configure sur le bon reseau :

**Reseau de test (Sepolia) :**
- Nom : Sepolia Testnet
- RPC URL : (fourni par l'administrateur)
- Chain ID : 11155111
- Symbole : ETH

**Reseau de production (Polygon) :**
- Nom : Polygon PoS
- RPC URL : https://polygon-rpc.com
- Chain ID : 137
- Symbole : MATIC

### 2.4 Acces a la Plateforme

- **URL** : https://app.safeland.ma (production) ou http://localhost:3000 (dev)
- **Roles** : Votre role est attribue par un administrateur. Contactez votre superviseur si vous n'avez pas acces a un module.

---

## 3. Connexion et Authentification

### 3.1 Premiere Connexion

1. Ouvrez SafeLand dans votre navigateur
2. Cliquez **"Connecter Wallet"** en haut a droite
3. MetaMask s'ouvre automatiquement
4. Acceptez la connexion au site SafeLand
5. MetaMask vous demande de signer un message de verification (nonce)
6. Signez le message — cela prouve votre identite sans partager votre cle privee
7. Vous etes connecte. Votre adresse et votre role s'affichent dans la barre de navigation.

### 3.2 Changement de Reseau

Si vous changez de reseau dans MetaMask, la page se recharge automatiquement. Assurez-vous d'etre sur le bon reseau avant de lancer des operations.

### 3.3 Deconnexion

Cliquez sur votre adresse en haut a droite, puis **"Deconnecter"**. La session JWT expire automatiquement apres 7 jours d'inactivite.

---

## 4. Dashboard

Le Dashboard est la page d'accueil apres connexion. Il affiche :

- Votre role et votre adresse wallet
- Les modules accessibles selon votre role
- Des raccourcis vers les actions principales

**Navigation** : Utilisez la barre de navigation en haut pour acceder aux differents modules.

---

## 5. Module Proprietes

### 5.1 Consulter les Proprietes

**Accessible a** : Tous les roles

1. Allez dans **Proprietes**
2. La liste des proprietes enregistrees s'affiche
3. Cliquez sur un token ID pour voir les details :
   - Titre foncier, type, surface, ville
   - Proprietaire actuel
   - Historique des transactions
   - Charges actives (hypotheques, saisies, servitudes)
   - Statut (actif, gele, verrouille)

### 5.2 Rechercher une Propriete

1. Utilisez le champ de recherche **"Rechercher par ville"**
2. Saisissez le nom de la ville
3. Les resultats s'affichent instantanement

### 5.3 Creer un NFT Foncier

**Accessible a** : Agent ANCFCC uniquement

1. Cliquez **"Creer une propriete"**
2. Remplissez le formulaire :
   - **Adresse du proprietaire** : Adresse wallet Ethereum du proprietaire
   - **Titre foncier** : Numero officiel du titre ANCFCC
   - **Type** : Terrain, Villa, Appartement, Commerce, Ferme
   - **Surface** : En metres carres
   - **Ville** et **Quartier**
   - **GPS** : Latitude et longitude
   - **Lien document** : URL du document sur IPFS
   - **Hash du document** : Empreinte numerique du document
3. Cliquez **"Creer"**
4. MetaMask vous demande de signer la transaction
5. Confirmez dans MetaMask
6. Attendez la confirmation (quelques secondes)
7. Le NFT est cree. Une notification confirme l'operation.

### 5.4 Verrouiller / Deverrouiller (Travel Lock)

**Accessible a** : Proprietaire, Admin

Le Travel Lock empeche tout transfert du NFT. Ideal pour les MRE voulant proteger leur bien.

1. Allez dans les details d'une propriete
2. Cliquez **"Verrouiller"** (ou **"Deverrouiller"**)
3. Signez la transaction dans MetaMask
4. Le statut change immediatement

**Attention** : Tant que le Travel Lock est actif, aucune transaction (vente, transfert, escrow) n'est possible sur ce bien.

### 5.5 Ajouter / Retirer une Charge

**Accessible a** : Agent ANCFCC

1. Allez dans les details d'une propriete
2. Section **"Charges"**
3. Cliquez **"Ajouter une charge"**
4. Remplissez : type (hypotheque/saisie/servitude), creancier, description, hash du document
5. Signez et confirmez

**Comportement automatique** :
- Si une hypotheque ou saisie est ajoutee, le NFT est automatiquement verrouille (plus de transfert possible)
- Quand la derniere charge bloquante est retiree, le NFT est automatiquement deverrouille

---

## 6. Module Escrow

### 6.1 Vue d'Ensemble

Le module Escrow gere les transactions immobilieres en 4 etapes securisees avec repartition fiscale automatique.

### 6.2 Creer un Deal (Notaire)

1. Allez dans **Escrow**
2. Cliquez **"Creer un deal"**
3. Remplissez :
   - **Token ID** : Numero du NFT a vendre
   - **Vendeur** : Adresse wallet du vendeur
   - **Acheteur** : Adresse wallet de l'acheteur
   - **Prix de vente** : En ETH/MATIC
   - **Hash du document** : Empreinte de l'acte de vente
4. Signez et confirmez
5. Le deal est cree avec le statut **"Cree"**

### 6.3 Signer (Vendeur)

1. Le vendeur recoit une notification
2. Il ouvre le deal dans Escrow
3. Il clique **"Signer"**
4. Il confirme dans MetaMask
5. Le statut passe a **"Vendeur a signe"**

### 6.4 Deposer les Fonds (Acheteur)

1. L'acheteur recoit une notification
2. Il ouvre le deal dans Escrow
3. Il clique **"Deposer les fonds"**
4. Le montant exact est pre-rempli
5. Il confirme le paiement dans MetaMask
6. Les fonds sont bloques dans le smart contract (pas chez un tiers)
7. Le statut passe a **"Fonds deposes"**

### 6.5 Finaliser (Notaire)

1. Le notaire verifie que toutes les conditions sont remplies
2. Il clique **"Finaliser le deal"**
3. Le smart contract execute automatiquement :
   - 4% du prix → wallet DGI
   - 1% du prix → wallet ANCFCC
   - 95% du prix → wallet vendeur
   - Le NFT est transfere a l'acheteur
4. Le statut passe a **"Complete"**

### 6.6 Annuler un Deal

Un deal peut etre annule tant qu'il n'est pas finalise :
1. Le notaire clique **"Annuler le deal"**
2. Si des fonds ont ete deposes, l'acheteur est automatiquement rembourse
3. Le NFT reste au vendeur

---

## 7. Module Fridda

### 7.1 Vue d'Ensemble

Le module Fridda gere les successions immobilieres. Chaque succession est fractionnee en 24 parts conformes au droit successoral marocain.

### 7.2 Ouvrir une Succession (Notaire)

1. Allez dans **Fridda**
2. Cliquez **"Ouvrir une succession"**
3. Remplissez :
   - **Token ID** : NFT du bien concerne
   - **Proprietaire decede** : Adresse wallet
   - **Nombre total de parts** : 24 (recommande)
   - **CID acte de deces** : Hash du document sur IPFS
   - **CID document Fridda** : Hash du partage officiel
4. Signez et confirmez

### 7.3 Distribuer les Parts (Notaire)

1. Ouvrez le dossier de succession
2. Cliquez **"Distribuer les parts"**
3. Saisissez la liste des heritiers (adresses wallet) et leurs parts respectives
4. Exemple : Epouse = 3/24, Fils = 7/24, Fille = 7/24, Pere = 4/24, Mere = 3/24
5. Signez et confirmez
6. Chaque heritier recoit ses tokens ERC-1155

### 7.4 Finaliser la Succession (Notaire)

1. Verifiez que toutes les parts ont ete distribuees
2. Cliquez **"Finaliser"**
3. Le dossier est verrouille. Plus aucune modification n'est possible.

### 7.5 Creer une Proposition (Heritier)

Un heritier peut proposer une action sur le bien :

1. Allez dans le dossier de succession
2. Cliquez **"Creer une proposition"**
3. Choisissez le type :
   - **Vendre** : Proposer la vente du bien
   - **Louer** : Proposer la mise en location
   - **Renover** : Proposer des travaux
4. Remplissez la description et le quorum requis (ex: 50%)
5. Definissez la date limite du vote
6. Signez et confirmez

### 7.6 Voter (Heritier)

1. Ouvrez la proposition
2. Cliquez **"Pour"** ou **"Contre"**
3. Votre vote est pondere par le nombre de parts que vous detenez
4. Exemple : si vous avez 7 parts sur 24, votre vote compte pour 7

### 7.7 Executer une Proposition (Notaire)

1. Si le quorum est atteint et la date limite passee
2. Le notaire clique **"Executer"**
3. La proposition est marquee comme executee

---

## 8. Module Justice

### 8.1 Vue d'Ensemble

Le module Justice permet aux magistrats d'intervenir sur les titres fonciers via un protocole multi-signature.

### 8.2 Proposer une Action (Juge)

1. Allez dans **Justice**
2. Cliquez **"Proposer une action"**
3. Choisissez le type :
   - **Gel** : Geler un titre en litige
   - **Burn & Remint** : Annuler un titre frauduleux et le reecrire au proprietaire legitime
   - **Social Recovery** : Transferer un titre vers un nouveau wallet (perte de cles)
4. Remplissez les informations :
   - Token ID concerne
   - Hash du jugement (document IPFS)
   - Nouveau proprietaire (pour Burn & Remint / Recovery)
5. Signez et confirmez

### 8.3 Signer une Action (Juge)

Les actions judiciaires necessitent plusieurs signatures (multi-sig) :

1. Ouvrez l'action proposee
2. Verifiez les details (token, type, jugement)
3. Cliquez **"Signer"**
4. Confirmez dans MetaMask

Le nombre de signatures requises est configurable (par defaut : 2 juges).

### 8.4 Executer une Action (Juge)

1. Une fois le nombre de signatures requis atteint
2. Cliquez **"Executer"**
3. L'action est executee sur le NFT :
   - **Gel** : Le titre est marque comme gele. Plus aucune operation possible.
   - **Burn & Remint** : L'ancien titre est detruit, un nouveau est emis au proprietaire legitime.
   - **Social Recovery** : Le titre est transfere au nouveau wallet.

---

## 9. Module Banque

### 9.1 Vue d'Ensemble

Le module Banque permet aux etablissements bancaires de consulter et gerer les hypotheques.

### 9.2 Scoring de Liquidite

1. Allez dans **Banque**
2. Saisissez le Token ID du bien a evaluer
3. Le scoring affiche :
   - Nombre de charges actives
   - Historique des transactions
   - Statut (actif, gele, verrouille)
   - Score de liquidite (calcule automatiquement)

### 9.3 Inscrire une Hypotheque

1. Cliquez **"Inscrire une hypotheque"**
2. Remplissez : Token ID, montant, description
3. Signez et confirmez
4. Le NFT est automatiquement verrouille (pas de vente possible tant que l'hypotheque est active)

### 9.4 Mainlevee

1. Apres remboursement complet du pret
2. Cliquez **"Mainlevee"**
3. Signez et confirmez
4. L'hypotheque est retiree
5. Si c'etait la derniere charge bloquante, le NFT est automatiquement deverrouille

---

## 10. Module Timelock

### 10.1 Vue d'Ensemble

Le Timelock impose un delai obligatoire (1 a 30 jours) pour les operations administratives critiques. Cela garantit la transparence et permet la verification par les parties prenantes.

### 10.2 Planifier une Operation (Admin/Proposer)

1. Allez dans **Timelock**
2. Cliquez **"Planifier une operation"**
3. Remplissez :
   - **Cible** : Adresse du smart contract concerne
   - **Valeur** : Montant ETH/MATIC (0 pour les appels sans paiement)
   - **Donnees** : Calldata de la fonction a executer
   - **Delai** : Nombre de secondes (min 1 jour, max 30 jours)
   - **Description** : Explication de l'operation
4. Signez et confirmez

### 10.3 Executer une Operation

1. Apres l'expiration du delai
2. Pendant la grace period (14 jours)
3. Cliquez **"Executer"**
4. L'operation est executee sur le contrat cible

### 10.4 Annuler une Operation

1. Tant que l'operation n'est pas executee
2. Cliquez **"Annuler"**
3. L'operation est marquee comme annulee

---

## 11. Statistiques

La page Statistiques affiche les donnees globales du registre SafeLand :

- Nombre total de proprietes tokenisees
- Nombre total de transactions
- Nombre de charges actives
- Fraudes prevenues
- Interventions judiciaires

Ces donnees proviennent directement du smart contract SafeLandRegistry.

---

## 12. Notifications

### 12.1 Notifications Temps Reel

SafeLand envoie des notifications en temps reel via WebSocket :

- Propriete creee / transferee / gelee
- Deal cree / complete / annule
- Succession ouverte / finalisee
- Action judiciaire proposee / executee
- Operation Timelock planifiee / executee / annulee
- Alerte fraude

### 12.2 Cloche de Notification

L'icone cloche en haut a droite affiche les dernieres notifications. Cliquez dessus pour voir les details.

---

## 13. FAQ

### Questions Generales

**Q : Est-ce que mes donnees personnelles sont sur la blockchain ?**
R : Non. Seules les donnees fonciers essentielles sont on-chain (titre, surface, GPS). Vos donnees personnelles (CIN, nom) ne sont JAMAIS stockees en clair sur la blockchain.

**Q : Que se passe-t-il si je perds mon wallet MetaMask ?**
R : Utilisez votre phrase de recuperation de 12 mots pour restaurer votre wallet. Si vous avez perdu la phrase, un conservateur peut initier une Social Recovery via le module Justice.

**Q : Les transactions sont-elles reversibles ?**
R : Non, les transactions blockchain sont irreversibles. C'est pourquoi le module Escrow impose 4 etapes de validation et pourquoi le module Justice existe (Burn & Remint en cas de fraude averee).

**Q : Combien coute une transaction ?**
R : Sur Polygon (production), les frais de gas sont d'environ 0.01 USD par transaction. La fiscalite fonciere (4% DGI + 1% ANCFCC) est prelevee automatiquement lors des ventes via Escrow.

### Questions Techniques

**Q : MetaMask ne se connecte pas. Que faire ?**
R : Verifiez que vous etes sur le bon reseau (Polygon ou Sepolia). Rechargez la page. Si le probleme persiste, supprimez le cache et reconnectez-vous.

**Q : L'operation echoue avec "execution reverted". Que faire ?**
R : Cela signifie que le smart contract a refuse l'operation. Causes possibles : vous n'avez pas le bon role, le NFT est gele/verrouille, les conditions ne sont pas remplies (ex: fonds non deposes pour Escrow).

**Q : Comment changer de langue ?**
R : Cliquez sur le selecteur de langue en haut a droite (FR/EN/AR). Le choix est sauvegarde automatiquement.

---

## 14. Glossaire

| Terme | Definition |
|-------|-----------|
| NFT | Jeton numerique unique representant un titre foncier |
| Wallet | Portefeuille numerique (MetaMask) |
| MetaMask | Extension navigateur pour interagir avec la blockchain |
| Transaction | Operation enregistree sur la blockchain |
| Gas | Frais de transaction sur la blockchain |
| Smart Contract | Programme autonome execute sur la blockchain |
| Escrow | Sequestre : fonds bloques jusqu'a validation |
| Travel Lock | Verrouillage du titre par le proprietaire |
| Fridda | Module de succession fractionnee (24 parts) |
| Multi-sig | Plusieurs signatures requises pour une action |
| Timelock | Delai obligatoire avant execution d'une operation |
| IPFS | Stockage decentralise de documents |
| Hash | Empreinte numerique unique d'un document |
| ANCFCC | Agence Nationale de la Conservation Fonciere |
| DGI | Direction Generale des Impots |
| MRE | Marocains Residant a l'Etranger |

---

*TachyDigital SARL — Support : support@safeland.ma*
