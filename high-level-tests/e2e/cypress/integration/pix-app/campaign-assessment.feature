#language: fr
Fonctionnalité: Campagne d'évaluation

  Contexte:
    Étant donné que les données de test sont chargées

  Scénario: Je passe un parcours prescrit
    Étant donné que je vais sur Pix
    Et je suis connecté à Pix en tant que "Daenerys Targaryen"
    Lorsque je vais sur la page d'accès à une campagne
    Et je saisis le code "NERA"
    Lorsque je clique sur "Accéder au parcours"
    Alors je vois la page de "presentation" de la campagne
    Et la page "Presentation campagne evaluation" est correctement affichée
    Lorsque je clique sur "Je commence"
    Et je saisis "khaleesi" dans le champ "Surnom"
    Et je clique sur "Continuer"
    Alors je vois la page de "didacticiel" de la campagne
    Lorsque je clique sur "Ignorer"
    Alors je vois l'épreuve "Quelle est la capitale de la Lettonie ?"
    Lorsque je clique sur "J'ai compris"
    Lorsque je saisis "Riga" dans le champ "Réponse :"
    Et je clique sur "Je valide"
    Alors je vois l'épreuve "Qui a dit « Toute méchanceté a sa source dans la faiblesse » ?"
    Lorsque je clique sur "Je passe"
    Et je clique sur "Voir mes résultats"
    Alors je vois un résultat global à 50%
    Alors je vois 2 résultats pour la compétence
    Alors je vois la formation recommandée ayant le titre "Comment gagner des pièces d'or"
    Lorsque je clique sur "J'envoie mes résultats"
    Alors je vois que j'ai envoyé les résultats
    Lorsque je clique sur "Continuez votre expérience Pix"
    Alors je vois le lien "Mes formations" dans la navigation

  Scénario: Je rejoins un parcours prescrit via l'URL sans être connecté
    Étant donné que je vais sur Pix
    Lorsque je vais sur la campagne "WALL" avec l'identifiant "khaleesi"
    Alors je vois la page de "presentation" de la campagne
    Lorsque je clique sur "Je commence"
    Et je clique sur "connectez-vous à votre compte"
    Et  je suis connecté à Pix en tant que "daenerys.targaryen@pix.fr"
    Alors je vois la page de "didacticiel" de la campagne
