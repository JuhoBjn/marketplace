describe("The authentication page", () => {
  it("should display signup form on loading the authentication page", () => {
    cy.visit("/authenticate");

    cy.get('[data-testid="firstname-input"]').should("be.visible");
    cy.get('[data-testid="lastname-input"]').should("be.visible");
    cy.get('[data-testid="email-input"]').should("be.visible");
    cy.get('[data-testid="phone-input"]').should("be.visible");
    cy.get('[data-testid="password-input"]').should("be.visible");
    cy.get('[data-testid="auth-form__submit-button"]').should(
      "contain",
      "Sign up"
    );
    cy.get('[data-testid="toggle-signup-mode-button"]').should(
      "contain",
      "Change to login"
    );
  });

  it("should switch to login form on clicking 'Change to login' button", () => {
    cy.visit("/authenticate");

    cy.get('[data-testid="toggle-signup-mode-button"]').click();
    cy.get('[data-testid="email-input"]').should("be.visible");
    cy.get('[data-testid="password-input"]').should("be.visible");
    cy.get('[data-testid="auth-form__submit-button"]').should(
      "contain",
      "Log in"
    );
    cy.get('[data-testid="toggle-signup-mode-button"]').should(
      "contain",
      "Change to signup"
    );
  });

  it("should allow a user to sign up with valid credentials", () => {
    cy.visit("/authenticate");

    cy.get('[data-testid="firstname-input"]').type("Tina");
    cy.get('[data-testid="lastname-input"]').type("Tester");
    cy.get('[data-testid="email-input"]').type("tina@tester.com");
    cy.get('[data-testid="phone-input"]').type("1234567890");
    cy.get('[data-testid="password-input"]').type("Tina12345");
    cy.get('[data-testid="auth-form__submit-button"]').click();

    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/`);
  });

  it("should allow a user to log in with valid credentials", () => {
    cy.visit("/authenticate");

    cy.get('[data-testid="toggle-signup-mode-button"]').click();
    cy.get('[data-testid="auth-form__submit-button"]').should(
      "contain",
      "Log in"
    );
    cy.get('[data-testid="email-input"]').type("tina@tester.com");
    cy.get('[data-testid="password-input"]').type("Tina12345");
    cy.get('[data-testid="auth-form__submit-button"]').click();

    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/`);
  });

  it("should allow a logged in user to log out", () => {
    cy.login("tina@tester.com", "Tina12345");

    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/`);
    cy.contains("Marketplace").should("be.visible");

    cy.get(".navlinks > .button-container > .button").click();

    cy.get('[data-testid="authenticate-navlink"]').should("be.visible");
    cy.get('[data-testid="listings-navlink"]').should("be.visible");
    cy.get('[data-testid="own-listings-navlink"]').should("not.exist");
  });
});
