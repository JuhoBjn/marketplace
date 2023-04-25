describe("The own listings pages", () => {
  it("should allow a logged in user to create a listing", () => {
    // Sign up a test user and log in with it. Navigate to user's own listings page and verify correct url.
    cy.signup("Thomas", "Test", "thomas@test.com", "4697312580", "thomas12345");
    cy.login("thomas@test.com", "thomas12345");
    cy.get('[data-testid="own-listings-navlink"]').click();
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/mylistings`);

    // Create a new listing.
    cy.contains("New listing").click();
    cy.get('[data-testid="title-input"]').type("Test");
    cy.get('[data-testid="description-input"]').type(
      "Selling this test badge."
    );
    cy.get('[data-testid="price-input"]').clear();
    cy.get('[data-testid="price-input"]').type("29.99");
    cy.get('[data-testid="picture-url-input"]').type(
      "https://freesvg.org/img/Test-fixed.png"
    );
    cy.contains("Create listing").click();

    // Check that the listing was created.
    cy.get(".card").last().should("contain", "Thomas Test");
  });

  it("should not allow a user to create a listing when not logged in", () => {
    // Navigate to the own listings page and verify the address.
    cy.visit("/mylistings");
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/mylistings`);

    // Check if the new listing button exists.
    cy.contains("New listing").should("not.exist");
  });

  it("should allow a user to expand a listing", () => {
    // Navigate to the own listings page and verify the address.
    cy.visit("/mylistings");
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/mylistings`);

    // Check if the user can see a listing.
    cy.get(".card").first().click();
    cy.get(".modal").should("be.visible");
  });

  it("should allow a logged in user to edit their own listing", () => {
    // Sign up a test user and log in with it.
    cy.signup("Thomas", "Test", "thomas@test.com", "4697312580", "thomas12345");
    cy.login("thomas@test.com", "thomas12345");
    // Navigate to the own listings page and verify the correct address.
    cy.get('[data-testid="own-listings-navlink"]').click();
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/mylistings`);

    // Create a new listing to edit.
    cy.contains("New listing").click();
    cy.get('[data-testid="title-input"]').type("Testing sign");
    cy.get('[data-testid="description-input"]').type(
      "Selling this leftover testing sign."
    );
    cy.get('[data-testid="price-input"]').type("26");
    cy.get('[data-testid="picture-url-input"]').type(
      "https://www.picpedia.org/highway-signs/images/testing.jpg"
    );
    cy.contains("Create listing").click();

    // Navigate to the new listing, open it and click edit.
    cy.get(".card").last().should("contain", "Thomas Test");
    cy.get(".card").last().click();
    cy.contains("Edit").click();

    // Make changes to the listing info and submit the update.
    cy.get('[data-testid="title-input"]').clear();
    cy.get('[data-testid="title-input"]').type("Testing");
    cy.get('[data-testid="description-input"]').clear();
    cy.get('[data-testid="description-input"]').type(
      "I have this sign and I can't figure out any use for it."
    );
    cy.get('[data-testid="price-input"]').clear();
    cy.get('[data-testid="price-input"]').type("30");
    cy.contains("Update listing").click();

    // Check that the listing was updated by checking for the newly set price.
    cy.get(".card").last().should("contain", "30");
  });

  it("should allow a logged in user to delete their own listing", () => {
    // Create a test user and log in with it.
    cy.signup("Thomas", "Test", "thomas@test.com", "4697312580", "thomas12345");
    cy.login("thomas@test.com", "thomas12345");
    // Navigate to the own listings page and verify the correct address.
    cy.get('[data-testid="own-listings-navlink"]').click();
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/mylistings`);

    // Create a new listing to delete.
    cy.contains("New listing").click();
    cy.get('[data-testid="title-input"]').type("Delete me");
    cy.get('[data-testid="description-input"]').type(
      "This is a listing to be deleted."
    );
    cy.get('[data-testid="price-input"]').type("234");
    cy.get('[data-testid="picture-url-input"]').type(
      "https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-260nw-338250266.jpg"
    );
    cy.contains("Create listing").click();

    // Navigate to the new listing and open it.
    cy.get(".card").last().should("contain", "Thomas Test");
    cy.get(".card").last().click();

    // Click delete, check the confirmation modal is shown and confirm the delete.
    cy.contains("button", "Delete").click();
    cy.get('[data-testid="confirm-delete__p"]').should(
      "contain",
      "Are you sure you want to delete the listing?"
    );
    cy.contains("Delete listing").click();

    // Confirm that the listing was deleted.
    cy.get(".card").last().should("not.equal", "Delete me");
  });
});
