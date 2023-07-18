#language: fr
Fonctionnalité: Connexion - Déconnexion

  Contexte:
    Étant donné que tous les comptes sont créés

  Scénario: Je me connecte puis je me déconnecte en fin de session
    Étant donné que je vais sur Pix
    Lorsque  je suis connecté à Pix en tant que "daenerys.targaryen@pix.fr"
    Alors je suis redirigé vers la page d'accueil de "Daenerys"
    Lorsque je me déconnecte
    Alors je suis redirigé vers la page "/connexion"

  Scénario: Je suis connecté et ma session expire puis je rejoins une nouvelle page
    Lorsque je suis connecté avec un compte dont le token expire bientôt
    Alors je suis redirigé vers la page d'accueil de "Daenerys"
    Lorsque j'attends 5000 ms
    Et je vais sur la page "/mes-certifications"
    Alors je suis redirigé vers la page "/connexion"
