# Rubrique de l'évaluateur adversarial

Ce fichier définit les critères d'évaluation génériques utilisés par l'agent Évaluateur dans la boucle GAN Dev.

## Philosophie adversariale

L'évaluateur ne cherche pas à valider — il cherche à **rejeter**. Si un critère est douteux, il est marqué en échec. Un score de 7/10 signifie "acceptable malgré des imperfections". 10/10 est réservé au code exemplaire.

L'objectif n'est pas de bloquer indéfiniment mais de forcer le générateur à produire du code qui résiste à une critique sévère.

---

## CRITÈRES GÉNÉRIQUES

### C1 — Build propre (poids : bloquant)

Le code compile/s'exécute sans erreur.

- ✗ Erreur de compilation → score = 0, itération obligatoire
- ✗ Warning bloquant (Swift strict concurrency, TypeScript error en mode strict) → -2 points
- ✓ Build clean sans warning → critère satisfait

**Vérification :** résultat de la commande build fourni par l'orchestrateur.

---

### C2 — Périmètre minimal (poids : 2 points)

Le code modifie uniquement ce qui est nécessaire à la feature.

- ✗ Refactoring non demandé dans des fichiers non liés → -1
- ✗ Nouvelles dépendances externes non justifiées → -1
- ✗ Fonctionnalités "bonus" non demandées → -1
- ✗ Suppression de code sans raison liée à la feature → -1
- ✓ Modifications limitées au scope de la feature → +2

**Signal d'alarme :** si plus de 5 fichiers sont modifiés pour une feature simple, questionner la justification.

---

### C3 — Simplicité et lisibilité (poids : 2 points)

Le code est direct, sans sur-ingénierie.

- ✗ Abstraction créée pour un usage unique → -1
- ✗ Pattern complexe là où une solution simple suffit → -1
- ✗ Imbrication excessive (> 3 niveaux) → -1
- ✗ Variable, fonction ou classe dont le rôle n'est pas évident sans commentaire → -1
- ✓ Logique lisible sans effort → +2

**Référence :** "trois lignes similaires valent mieux qu'une abstraction prématurée"

---

### C4 — Conventions du projet (poids : 2 points)

Le code respecte les conventions établies dans CLAUDE.md et le reste du codebase.

Sous-critères évalués par l'évaluateur selon le projet :

- Langue des commentaires et noms de variables (fr/en selon CLAUDE.md)
- Style de nommage (camelCase, snake_case, PascalCase selon la stack)
- Cohérence avec les patterns déjà utilisés dans le projet
- Pas de mélange de styles dans un même fichier
- ✗ Commentaire dans la mauvaise langue → -1
- ✗ Convention de nommage incompatible avec le reste → -1
- ✓ Code indiscernable du style du projet → +2

---

### C5 — Sécurité basique (poids : 2 points)

Pas de vulnérabilité évidente.

- ✗ Secret ou credential en dur dans le code → score = 0 (bloquant absolu)
- ✗ Entrée utilisateur non validée avant utilisation → -2
- ✗ Chemin de fichier construit par concaténation de chaînes sans validation → -1
- ✗ Force unwrap Swift (`!`) sur une valeur potentiellement nil non garantie → -1
- ✓ Validation des entrées aux frontières du système → +1
- ✓ Gestion défensive des cas limites → +1

---

### C6 — Gestion des erreurs (poids : 2 points)

Les erreurs sont visibles et gérées, pas silencieuses.

- ✗ `catch { }` vide ou `catch { print(error) }` sans propagation ni feedback utilisateur → -2
- ✗ État d'erreur sans feedback visible (UI reste muette) → -1
- ✗ Crash potentiel sur cas attendu (réseau absent, fichier manquant) → -1
- ✓ État d'erreur observable (message, log, état machine) → +1
- ✓ Récupération gracieuse ou message d'erreur actionnable → +1

---

## PONDÉRATION

| Critère | Points max | Bloquant |
|---|---|---|
| C1 — Build propre | — | Oui (score = 0 si échec) |
| C2 — Périmètre minimal | 2 | Non |
| C3 — Simplicité | 2 | Non |
| C4 — Conventions | 2 | Non |
| C5 — Sécurité | 2 | Secret en dur = 0 |
| C6 — Erreurs | 2 | Non |
| **Total** | **10** | |

Score de base = somme des points obtenus.

Les critères spécifiques au projet (extraits de CLAUDE.md) peuvent modifier le score par bonus/malus selon leur criticité.

---

## FEEDBACK GÉNÉRATEUR — FORMAT ATTENDU

Le feedback doit être :
1. **Spécifique** : citer le fichier, la ligne ou le pattern exact
2. **Actionnable** : dire quoi faire, pas juste signaler le problème
3. **Priorisé** : commencer par les critères bloquants

Exemple de bon feedback :
```
- [C1/bloquant] ContentView.swift ligne 142 : 'touteLaJournee' n'est pas déclaré
  → Ajouter la propriété dans ICSOccurrence.swift
- [C3] ICSGenerator.swift : replierLigne() est réimplémentée deux fois (lignes 45 et 89)
  → Garder uniquement la version ligne 45, supprimer la duplication
- [C4] Commentaire ligne 78 en anglais "// Format date for ICS"
  → Traduire en français : "// Formater la date pour le format ICS"
```

Exemple de mauvais feedback (trop vague) :
```
- Le code pourrait être amélioré
- Certaines conventions ne sont pas respectées
```
