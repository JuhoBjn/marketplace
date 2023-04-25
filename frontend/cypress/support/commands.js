// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add(
  "signup",
  (firstname, lastname, email, phone, password) => {
    cy.visit("/authenticate");

    cy.get('[data-testid="firstname-input"]').type(firstname);
    cy.get('[data-testid="lastname-input"]').type(lastname);
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="phone-input"]').type(phone);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="auth-form__submit-button"]').click();

    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/`);
  }
);

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/authenticate");

  cy.get('[data-testid="toggle-signup-mode-button"]').click();
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="auth-form__submit-button"]').click();

  cy.url().should("be.equal", `${Cypress.config("baseUrl")}/`);
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
