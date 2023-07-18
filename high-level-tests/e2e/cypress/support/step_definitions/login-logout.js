// Given
Given(`je me connecte avec le compte {string}`, (email) => {
  cy.get('input[name="login"]').type(email);
  cy.get('input[name="password"]').type("pix123");
  cy.get("button[type=submit]").click();
});

// When
When("je suis connecté avec un compte dont le token expire bientôt", () => {
  cy.loginWithAlmostExpiredToken();
});

When(`j'attends {int} ms`, (duration) => {
  cy.wait(duration);
});

// Then
Then(`je suis redirigé vers la page d'accueil de {string}`, (firstName) => {
  cy.url().should("include", "/accueil");
  cy.get(".logged-user-name").should((userName) => {
    expect(userName.text()).to.contains(firstName);
  });
});

Then(`je suis redirigé vers le profil de {string}`, (firstName) => {
  cy.url().should("include", "/competences");
  cy.get(".logged-user-name").should((userName) => {
    expect(userName.text()).to.contains(firstName);
  });
  cy.get(".rounded-panel-title").should((title) => {
    expect(title.text()).to.contains("Vous avez 6 compétences à tester.");
  });
});

Then(`je suis redirigé vers le compte Orga de {string}`, (fullName) => {
  cy.url().should("include", "/campagnes");
  cy.get('[aria-label="Navigation principale"]').click();
  cy.contains(fullName).should("be.visible");
  cy.get(".list-campaigns-page").should((list) => {
    expect(list).to.exist;
  });
});

When(`je me déconnecte`, () => {
  cy.get(".logged-user-name__link").click();
  cy.get("ul.logged-user-menu__actions")
    .children()
    .children("[href*='deconnexion']")
    .click();
});

When(`je me déconnecte de Pix Orga`, () => {
  cy.get('[aria-label="Navigation principale"]').click();
  cy.contains("Se déconnecter").click();
});

Then(`je suis redirigé vers la page {string}`, (pathname) => {
  cy.url().should("include", pathname);
});

When(`j'accepte les CGU de Pix`, () => {
  cy.get("input[type=checkbox]").click();
});

When(`j'accepte les CGU de Pix Orga`, () => {
  cy.get("button").contains("J’accepte les conditions d’utilisation").click();
});
