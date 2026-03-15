# Declaration de Traitement de Donnees Personnelles
## Commission Nationale de Controle de la Protection des Donnees (CNDP)

**Responsable du traitement :** TachyDigital SARL
**Projet :** SafeLand — Plateforme de Securisation Fonciere par Blockchain
**Date :** Mars 2026
**Base legale :** Loi 09-08 relative a la protection des personnes physiques a l'egard du traitement des donnees a caractere personnel

---

## 1. Identification du Responsable du Traitement

| Champ | Valeur |
|-------|--------|
| Denomination | TachyDigital SARL |
| Siege social | [A completer] |
| N° RC | [A completer] |
| Representant legal | [A completer] |
| DPO (Delegue a la Protection des Donnees) | [A designer] |
| Email contact | dpo@tachydigital.ma |

---

## 2. Finalite du Traitement

Le traitement de donnees personnelles est effectue dans le cadre de la plateforme SafeLand pour :

1. **Authentification des utilisateurs** : Verification d'identite par signature cryptographique (MetaMask)
2. **Gestion des roles** : Attribution et controle des permissions (agent, notaire, juge, proprietaire, banque)
3. **Tracabilite des operations foncieres** : Enregistrement des mutations de propriete
4. **Notifications** : Communication en temps reel des evenements lies aux titres fonciers

---

## 3. Categories de Donnees Traitees

### 3.1 Donnees Collectees

| Categorie | Donnees | Stockage | Duree |
|-----------|---------|----------|-------|
| Identification blockchain | Adresse wallet Ethereum (publique) | Blockchain + SQLite | Permanent (on-chain) |
| Authentification | Nonce de connexion, token JWT | SQLite (backend) | 7 jours (JWT) |
| Role utilisateur | Role attribue (agent, notaire, etc.) | SQLite | Duree du contrat |
| Activite | Historique des operations effectuees | Logs backend | 12 mois |

### 3.2 Donnees NON Collectees

| Donnee | Justification |
|--------|--------------|
| Nom, prenom | Jamais stocke en clair. Hash uniquement dans les metadonnees NFT |
| CIN | Jamais stocke en clair. Hash uniquement |
| Adresse physique | Non requise pour le fonctionnement |
| Telephone, email | Non collectes |
| Donnees biometriques | Non collectees |
| Donnees bancaires | Non collectees (paiements via wallet crypto) |

### 3.3 Principe de Minimisation

SafeLand applique strictement le principe de minimisation des donnees (article 3 de la loi 09-08) :

- **On-chain** : Seules les donnees fonciers necessaires sont stockees (titre, surface, GPS, hashes de documents)
- **Off-chain** : Les donnees d'authentification minimales (adresse wallet, role, nonce)
- **Jamais en clair** : Les donnees personnelles sont hashees (SHA-256) ou chiffrees (AES-256)

---

## 4. Destinataires des Donnees

| Destinataire | Donnees Accessibles | Base Legale |
|-------------|---------------------|------------|
| Agents ANCFCC | Donnees fonciers, proprietaires (hashes) | Mission de service public |
| Notaires | Donnees des transactions en cours | Mandat professionnel |
| Juges | Donnees des litiges en cours | Autorite judiciaire |
| Proprietaires | Leurs propres donnees uniquement | Droit d'acces |
| Banques | Donnees fonciers (scoring) | Contrat |
| Administrateurs systeme | Logs techniques (pas de PII) | Administration |

**Aucun transfert de donnees hors du Maroc.** L'infrastructure est hebergee sur des serveurs situes au Maroc ou dans l'UE (avec garanties adequates).

---

## 5. Mesures de Securite

### 5.1 Securite Technique

| Mesure | Implementation |
|--------|---------------|
| Chiffrement au repos | AES-256 pour documents sensibles |
| Chiffrement en transit | TLS 1.3 (HTTPS) |
| Authentification | Signature cryptographique MetaMask + JWT |
| Controle d'acces | RBAC (Role-Based Access Control) on-chain et off-chain |
| Rate limiting | 100 requetes/15 min par IP |
| Headers securises | Helmet (CSP, HSTS, X-Frame-Options) |
| Logging | Journalisation des acces (sans PII) |

### 5.2 Securite Organisationnelle

- Formation du personnel a la protection des donnees
- Politique de mots de passe et de cles cryptographiques
- Procedures de reponse aux incidents
- Audits de securite reguliers (interne + externe)
- Designation d'un DPO

### 5.3 Immuabilite Blockchain

Les donnees enregistrees sur la blockchain sont **immuables par conception**. Cela garantit :
- Impossibilite de modification retroactive
- Tracabilite complete de chaque operation
- Preuve d'integrite des enregistrements

En contrepartie, le **droit a l'effacement** (article 8 de la loi 09-08) est assure par :
- Stockage des PII uniquement sous forme de hash (irreversible)
- Possibilite de supprimer les donnees off-chain (SQLite, IPFS)
- L'adresse wallet seule ne constitue pas une donnee personnelle identifiante

---

## 6. Droits des Personnes Concernees

Conformement a la loi 09-08, les personnes concernees disposent des droits suivants :

| Droit | Mise en oeuvre |
|-------|---------------|
| Droit d'acces (art. 7) | Consultation de ses propres donnees via le frontend |
| Droit de rectification (art. 8) | Demande aupres du DPO pour donnees off-chain |
| Droit d'opposition (art. 9) | Demande aupres du DPO |
| Droit a l'information (art. 5) | Politique de confidentialite publique |

**Exercice des droits :** Les demandes sont adressees a dpo@tachydigital.ma et traitees dans un delai de 30 jours.

---

## 7. Duree de Conservation

| Donnee | Duree | Justification |
|--------|-------|---------------|
| Donnees on-chain (hashes) | Permanent | Immuabilite blockchain, exigence legale fonciere |
| JWT tokens | 7 jours | Expiration automatique |
| Nonces d'authentification | 24 heures | Usage unique |
| Logs backend | 12 mois | Tracabilite operationnelle |
| Documents IPFS | Selon besoin | Depinning possible |

---

## 8. Analyse d'Impact (AIPD)

### 8.1 Risques Identifies

| Risque | Probabilite | Impact | Mitigation |
|--------|-------------|--------|------------|
| Acces non autorise aux donnees | Faible | Eleve | RBAC + JWT + MetaMask |
| Fuite de donnees | Faible | Eleve | Chiffrement + minimisation |
| Correlation d'identite via wallet | Moyen | Moyen | Pas de lien wallet-identite en clair |
| Perte de cles cryptographiques | Moyen | Eleve | Social Recovery via module Justice |

### 8.2 Conclusion

Le traitement presente un **risque residu faible** grace aux mesures de securite implementees et au principe de minimisation stricte des donnees personnelles.

---

## 9. Engagement du Responsable

Je soussigne, [nom], en qualite de representant legal de TachyDigital SARL, m'engage a :

1. Respecter les dispositions de la loi 09-08
2. Mettre en oeuvre les mesures de securite decrites ci-dessus
3. Informer la CNDP de toute violation de donnees dans un delai de 72 heures
4. Cooperer avec la CNDP pour toute demande d'information ou de controle

**Fait a [ville], le [date]**

Signature : ___________________________
Nom : ___________________________
Qualite : Gerant, TachyDigital SARL
