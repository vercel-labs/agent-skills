---
name: gan-dev
description: Workflow GAN (Génération/Évaluation adversariale) pour implémenter une feature complète. Utilise une boucle Generator/Évaluateur inspirée des réseaux antagonistes génératifs : le générateur produit du code, l'évaluateur le critique sans concession jusqu'à ce qu'un score qualité soit atteint. Déclencher avec "/gan-dev" suivi de la description de feature.
---

# GAN Dev — Workflow Génération/Évaluation adversariale

Implémente une feature complète via une boucle Generator → Évaluateur. Le générateur produit du code, l'évaluateur joue l'avocat du diable et renvoie un feedback précis. La boucle s'arrête quand le score qualité atteint le seuil ou que le maximum d'itérations est atteint.

## Invocation

```
/gan-dev "description de la feature à implémenter"
/gan-dev "description" --seuil=8 --max=4
```

**Arguments optionnels :**
- `--seuil=N` : score d'acceptation sur 10 (défaut : 7)
- `--max=N` : nombre maximum d'itérations (défaut : 3)

## Protocole d'orchestration

### Étape 0 — Initialisation

Avant de lancer les agents, l'orchestrateur (Claude Code) :

1. Lit `CLAUDE.md` du projet courant pour extraire :
   - La commande de build (ex : `xcodebuild`, `bun run build`, `npm run build`)
   - La stack et les conventions de langue (commentaires, noms de variables)
   - Les pièges connus listés dans "Pièges connus" ou section équivalente
   - Les règles spécifiques ("Règles spécifiques", "Contraintes", etc.)

2. Si aucun CLAUDE.md trouvé : détecter la stack depuis les fichiers du projet
   (présence de `*.xcodeproj` → Swift/Xcode, `package.json` → Node/TS, `*.py` → Python, etc.)

3. Initialise les variables de session :
   ```
   ITERATION = 1
   SEUIL = 7 (ou valeur --seuil)
   MAX_ITER = 3 (ou valeur --max)
   FEEDBACK_PRECEDENT = null
   CODE_PRECEDENT = null
   ACCEPTE = false
   ```

---

### Étape 1 — GÉNÉRATEUR (sous-agent)

Spawn un sous-agent `general-purpose` avec le prompt suivant (adapté au contexte) :

```
Tu es un développeur expert en [STACK].
Répertoire de travail : [CWD]

CONTEXTE PROJET (extrait de CLAUDE.md) :
[conventions, pièges connus, règles spécifiques]

FEATURE À IMPLÉMENTER :
[description fournie par l'utilisateur]

[SI ITERATION > 1]
--- CRITIQUE DE L'ÉVALUATEUR (itération [N-1]) ---
Score obtenu : [SCORE]/10
[FEEDBACK_PRECEDENT]
--- FIN CRITIQUE ---
Tu dois corriger les problèmes identifiés. Ne pas ignorer un seul point de la critique.
[FIN SI]

INSTRUCTIONS :
- Lis les fichiers existants avant de modifier quoi que ce soit
- Implémente la feature de façon minimale et correcte
- Respecte strictement les conventions du projet
- Ne crée pas de fichiers superflus
- Ne modifie pas ce qui ne concerne pas la feature

SORTIE ATTENDUE :
Liste les fichiers modifiés/créés et décris les changements effectués.
```

Après que le sous-agent termine, **lire les fichiers modifiés** pour avoir le diff réel.

---

### Étape 2 — BUILD (vérification automatique)

Exécuter la commande de build détectée à l'étape 0 :
- Si build **échec** → score automatique = 0, ajouter l'erreur complète au feedback
- Si build **succès** → continuer vers l'évaluateur

Pour les projets sans build automatisable (ex : frontend sans CI local), passer directement à l'évaluateur.

---

### Étape 3 — ÉVALUATEUR (sous-agent adversarial)

Spawn un sous-agent `feature-dev:code-reviewer` avec le prompt suivant :

```
Tu es un évaluateur adversarial. Ton rôle est de REJETER le code si des critères ne sont pas satisfaits.
Sois strict, sans concession, sans bienveillance excessive.
Un score de 7/10 signifie que tu acceptes à contrecœur. 10/10 est réservé au code parfait.

FEATURE ÉVALUÉE : [description]
STACK : [STACK]
RÉSULTAT BUILD : [succès / erreur + log]

CRITÈRES D'ÉVALUATION (voir evaluateur.md pour le détail) :
[Coller le contenu de evaluateur.md ici, section CRITÈRES GÉNÉRIQUES]

CRITÈRES SPÉCIFIQUES AU PROJET (extraits de CLAUDE.md) :
[pièges connus, règles spécifiques, conventions]

CODE MODIFIÉ :
[contenu des fichiers modifiés — inclure les sections pertinentes]

Retourne EXACTEMENT ce JSON (sans markdown autour) :
{
  "score": <0-10>,
  "accepte": <true si score >= [SEUIL], false sinon>,
  "criteres": [
    { "nom": "...", "ok": true/false, "commentaire": "..." }
  ],
  "feedback_generateur": "<instructions précises et actionnables pour l'itération suivante — sois spécifique, cite les lignes ou patterns problématiques>"
}
```

Parser la réponse JSON. Si le JSON est malformé, relancer l'évaluateur une fois.

---

### Étape 4 — Décision de boucle

```
SI score >= SEUIL OU ITERATION >= MAX_ITER :
  ACCEPTE = (score >= SEUIL)
  → Aller à Étape 5 (fin)
SINON :
  ITERATION += 1
  FEEDBACK_PRECEDENT = feedback_generateur
  → Retourner à Étape 1 (nouvelle itération)
```

---

### Étape 5 — Conclusion

**Si accepté (score >= seuil) :**

Afficher le rapport final et proposer un commit conventionnel :
```
✅ Feature acceptée après [N] itération(s) — score [X]/10

Score par critère :
[liste des critères avec ✓/✗]

Proposer : git commit -m "feat: [description courte de la feature]"
```

**Si rejeté (max itérations atteint) :**

```
⚠️ Score insuffisant après [MAX_ITER] itérations — score final [X]/10

Problèmes persistants :
[critères encore en échec]

Options :
1. Continuer manuellement en appliquant le feedback ci-dessus
2. Relancer /gan-dev avec --max=[N+2] pour plus d'itérations
3. Reformuler la feature plus précisément
```

---

## Affichage en cours de boucle

À chaque itération, afficher un résumé compact :

```
🔄 Itération [N]/[MAX] — GÉNÉRATION...
🔄 Itération [N]/[MAX] — BUILD... [✓ succès | ✗ échec]
🔄 Itération [N]/[MAX] — ÉVALUATION... score [X]/10 [✓ accepté | → itération suivante]
```

---

## Notes d'adaptation par stack

| Stack détectée | Commande build | Critères additionnels |
|---|---|---|
| Swift / Xcode | `xcodebuild -project ... -scheme ... -destination 'platform=macOS' build` | RFC 5545 si ICS, App Sandbox si NSSavePanel |
| Node.js / TypeScript | `bun run build` ou `npm run build` | Pas de `any` TypeScript, ESM |
| Python | `python -m py_compile` ou tests unitaires | Type hints, pas de global mutable state |
| React / Next.js | `bun run build` | Server vs Client components, pas de useEffect pour du data fetching |

Si la commande build est absente du CLAUDE.md, détecter automatiquement depuis les fichiers du projet.

---

## Référence

Voir `evaluateur.md` pour le détail des critères d'évaluation génériques et leur pondération.
