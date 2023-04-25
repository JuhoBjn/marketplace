describe("The navigation element", () => {
  it("should allow unauthorized user to navigate to signup/login page", () => {
    cy.visit("/");
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/`);

    cy.get('[data-testid="authenticate-navlink"]').click();
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/authenticate`);
  });

  it("should allow unauthorized user to navigate from signup/login to listings page", () => {
    cy.visit("/authenticate");
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/authenticate`);

    cy.get('[data-testid="listings-navlink"]').click();
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/`);
  });

  it("should allow logged in user to navigate from listings page to own listings", () => {
    cy.signup(
      "Samwise",
      "Sample",
      "samwise@sample.com",
      "1793248650",
      "samwise12345"
    );
    cy.login("samwise@sample.com", "samwise12345");
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/`);

    cy.get('[data-testid="own-listings-navlink"]').click();
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/mylistings`);
  });

  it("should allow logged in user to navigate from own listings page to listings", () => {
    cy.signup(
      "Samwise",
      "Sample",
      "samwise@sample.com",
      "1793248650",
      "samwise12345"
    );
    cy.login("samwise@sample.com", "samwise12345");
    cy.visit("/mylistings");
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/mylistings`);

    cy.get('[data-testid="listings-navlink"]').click();
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/`);
  });
});
