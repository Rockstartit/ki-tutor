describe('KI-Tutor E2E Test', () => {

  beforeEach(() => {
    cy.intercept('POST', '/api/threads').as('createThread');
    cy.intercept('POST', '/api/threads/*').as('sendMessage');

    // Visit the page the app is hosted on
    cy.visit('http://localhost:3000/');
  });

    // Test if the KI-Tutor can create a new thread and send a welcome message
    it('should create a new thread on load and display a welcome message', () => {
        // Wait for a new thread to be created and the welcome message to be sent
        cy.wait('@createThread').its('response.statusCode').should('eq', 200);
        cy.wait('@sendMessage').its('response.statusCode').should('eq', 200);

        // Check if the message list contains the welcome message and no outgoing message
        cy.get('section.cs-message.cs-message--incoming').should('have.length', 1);
        cy.get('section.cs-message.cs-message--outgoing').should('have.length', 0);
    });

    // Test if the KI-Tutor can respond to a message and input is disabled while waiting for the response
    it('should allow sending a message, disable input and display response', () => {
        // Wait for a new thread to be created and the welcome message to be sent
        cy.wait('@createThread').its('response.statusCode').should('eq', 200);
        cy.wait('@sendMessage').its('response.statusCode').should('eq', 200);

        // Wait for the welcome message to be finished and input to be enabled
        cy.get('div.cs-typing-indicator').should('not.exist');
        cy.get('div.cs-message-input__content-editor').should('have.attr', 'contenteditable', 'true');

        // Send a message
        cy.get('div.cs-message-input__content-editor').type('Hallo KI-Tutor{enter}');

        // Check if the sent message is displayed
        cy.get('section.cs-message.cs-message--outgoing').should('have.length', 1);
        cy.get('section.cs-message.cs-message--outgoing').should('contain', 'Hallo KI-Tutor');

        // Typing indicator should be visible and input should be disabled
        cy.get('div.cs-typing-indicator').should('be.visible');
        cy.get('div.cs-message-input__content-editor').should('have.attr', 'contenteditable', 'false');

        // Wait for the response to be received
        cy.wait('@sendMessage').its('response.statusCode').should('eq', 200);

        // Check if the message list contains the welcome message and the response of the KI-Tutor
        cy.get('section.cs-message.cs-message--incoming').should('have.length', 2);

        // Typing indicator should be hidden and input should be enabled again
        cy.get('div.cs-typing-indicator').should('not.exist');
        cy.get('div.cs-message-input__content-editor').should('have.attr', 'contenteditable', 'true');

    });

});