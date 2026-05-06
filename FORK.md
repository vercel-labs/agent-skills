# FORK — agent-skills

> Fichier propre à ce fork OnyxynO. **Ne pas commiter dans `vercel-labs/agent-skills`** (ne fait pas partie de l'upstream).

## Remotes

```
origin → https://github.com/vercel-labs/agent-skills   (upstream)
fork   → https://github.com/OnyxynO/agent-skills        (notre fork)
```

## Stratégie de sync

**Fréquence cible** : tous les 1-2 mois ou quand un skill upstream pertinent est annoncé.

```bash
git fetch origin
git checkout main
git merge origin/main      # ou rebase si historique propre
git push fork main
```

## Personnalisations locales (à protéger lors d'un sync)

Skills ajoutés ou modifiés par OnyxynO (à vérifier qu'ils ne sont pas écrasés/perdus) :

| Skill / fichier | Origine | Notes |
|---|---|---|
| `skills/gan-dev/` | OnyxynO (commit `7756c15`, `2467d28`) | Workflow GAN génération/évaluation adversariale |
| `FORK.md` | OnyxynO | Ce fichier |

**Avant tout merge upstream** :
1. `git diff origin/main..fork/main -- skills/gan-dev/` — vérifier qu'aucune modif upstream ne le touche
2. Si conflit sur un skill local → résoudre en faveur de notre version
3. Tester rapidement les skills locaux après merge

## Skills upstream que l'on consomme actuellement

Voir `README.md` pour la liste complète. Particulièrement utilisés :
- `react-best-practices`
- `web-design-guidelines`
- `composition-patterns`

Pas de modification locale sur ceux-ci → un merge fast-forward suffit.

## Contributions remontables

Si un skill local devient mature et générique : ouvrir une PR vers `vercel-labs/agent-skills` plutôt que de garder le fork divergent à long terme.
