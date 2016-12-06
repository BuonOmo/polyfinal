# polyfinal
Récupère les dates des examens finaux à Polytechnique montreal


## Concept

Polyfinal permet aux étudiants de Polytechnique Montréal d’accéder rapidement et facilement aux dates de leurs finaux. Il est aussi possible d’enregistrer ceux-ci dans le `localStorage` du navigateur grâce à la fonction de sauvegarde, ou de les exporter au format ICS afin de les importer dans un autre calendrier.

La **recherche** des cours fonctionne ainsi : tout agglomerat de chiffres et lettres (minuscules ou majuscules) forment un terme de recherche qui permet de filtrer selon les sigle des cours. Il est possible de mettre plusieurs termes dans la barre de recherche tant qu’ils sont séparés par autre chose qu’une lettre ou un chiffre (virgule, espace, tiret...).

## Developpement

Le dossier lib est une série de hardlink permettant de garder l’avantage des node_modules et d’avoir les dépendances pour la gh-page (qui n’installe pas les node_modules). Il en est de même pour les fonts, qui sont celles de bootstrap. et du CSS de bootstrap.

Le projet est fait pour fonctionner dès que l’on accède à l’index. Donc l’unique commande nécessaire pour ce site est :

```sh
firefox index.html
```

Le site marche aussi sur Google Chrome mais n’est pas testé sur d’autre navigateurs.
