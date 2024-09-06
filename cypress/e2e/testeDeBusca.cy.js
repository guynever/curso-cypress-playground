///Esse é um arquivo de teste a parte, onde meu objetivo foi praticar com o campo de busca

/// <reference types="cypress" />

describe('Teste de busca no site duckduckgo', () => {
    const searchTerm = 'cypress.io'

    beforeEach(() => {
        cy.intercept(
            'GET',
            `**?t=h_&q=cypress.io**`
        ).as('getSearchResults')

        cy.visit('https://duckduckgo.com/')

        cy.get('form input[type="text"]')
            .as('searchField')
            .should('be.visible')
    })

    it('Pesquisando e apertando ENTER', () => {
        cy.get('@searchField')
            .type(`${searchTerm}{enter}`);
    
        cy.wait('@getSearchResults');
        
        cy.get('.react-results--main').should('be.visible')
        .should('contain', 'cypress')
    })

    it('Pesquisando e clicando na lupa de pesquisa', () => {
        cy.get('@searchField')
          .type(searchTerm)
          cy.get('.searchbox_searchButton__F5Bwq')
          .click()
    
        cy.wait('@getSearchResults')

        cy.get('.react-results--main').should('be.visible')
        .should('contain', 'cypress')
      })

      it('Digita e envia o formulário diretamente', () => {
        cy.get('@searchField')
          .type(searchTerm)
        cy.get('form').submit()
    
        cy.wait('@getSearchResults')

        cy.get('.react-results--main').should('be.visible')
        .should('contain', 'cypress')
        
      })


})
