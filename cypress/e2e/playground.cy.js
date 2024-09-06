/// <reference types="cypress" />

describe('Cypress Playground', () => {
  beforeEach(() => {
    const now = new Date(2024, 7, 11) // month is 0-indexed
    cy.clock(now)
    cy.visit('https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html')
  })
  it('Exibir banner promocional', () => {
    cy.get('#promotional-banner').should('be.visible')
  })
  const nomeTeste = "Fulando_de_Tal"

  it('Comando .click() para clique em botão', () => {
    cy.contains('button', 'Subscribe')
      .should('be.visible')
      .click()
    cy.get('#success').should('contain', "You've been successfully subscribed to our newsletter.")
  })

  it('Comando .type() para digitar em campos de texto', () => {
    cy.get('#signature-textarea').type(nomeTeste)
    cy.contains('#signature', nomeTeste).should('be.visible')
  })

  it('Marcando e desmarcando caixas de seleção', () => {
    cy.get('#signature-textarea-with-checkbox').type(nomeTeste)
    cy.get('#signature-checkbox').check()

    cy.contains('#signature-triggered-by-check', nomeTeste).should('be.visible')
    cy.wait(1000);

    cy.get('#signature-checkbox').uncheck()

    cy.get('#signature-triggered-by-check').should('not.be.visible')
  });

  it('Marcando inputs do tipo radio', () => {
    cy.contains('#on-off', 'ON').should('be.visible')

    cy.get('#off').check()
    cy.contains('#on-off', 'OFF').should('be.visible')
    cy.contains('#on-off', 'ON').should('not.exist')

    cy.wait(1000);

    cy.get('#on').check()
    cy.contains('#on-off', 'ON').should('be.visible')
    cy.contains('#on-off', 'OFF').should('not.exist')

  });

  it('Selecionando opções em campos de seleção suspensa ', () => {
    cy.contains('p', "You haven't selected a type yet.").should('be.visible')

    cy.get('#selection-type')
      .should('be.visible')
      .select(1)

    cy.contains('#select-selection', 'BASIC').should('be.visible')
    cy.wait(1000);

    cy.get('#selection-type').select('standard')

    cy.contains('#select-selection', 'STANDARD').should('be.visible')
    cy.wait(1000);

    cy.get('#selection-type').select('VIP')

    cy.contains('#select-selection', 'VIP').should('be.visible')

  });

  it('Selecionando múltiplas opções em campos do tipo select ', () => {
    cy.contains('p', "You haven't selected any fruit yet.").should('be.visible')

    cy.get('#fruit').select(['apple', 'banana', 'cherry'])
      .should('be.visible')

    cy.contains('p', "You've selected the following fruits: apple, banana, cherry")
      .should('be.visible')
  });

  it('Testando o upload de arquivos', () => {
    cy.get('#file-upload').selectFile('./cypress/fixtures/example.json')

    cy.contains(
      'p',
      'The following file has been selected for upload: example.json'
    ).should('be.visible')
  });

  it('Interceptando e aguardando requisições que ocorrem à nível de rede', () => {
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos/1')
      .as('getTodo')

    cy.contains('button', 'Get TODO').click()
    cy.wait('@getTodo')
      .its('response.statusCode')
      .should('be.equal', 200)

    cy.contains('li', 'TODO ID: 1').should('be.visible')
    cy.contains('li', 'Title: delectus aut autem').should('be.visible')
    cy.contains('li', 'Completed: false').should('be.visible')
    cy.contains('li', 'User ID: 1').should('be.visible')

  });

  it('Sobrescrevendo o resultado de uma requisição à nível de rede ', () => {
    const todo = require('../fixtures/todo')

    cy.intercept(
      'GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { fixture: 'todo' }
    ).as('getTodo')

    cy.contains('button', 'Get TODO').click()

    cy.wait('@getTodo')
      .its('response.statusCode')
      .should('be.equal', 200)

    cy.contains('li', `TODO ID: ${todo.id}`).should('be.visible')
    cy.contains('li', `Title: ${todo.title}`).should('be.visible')
    cy.contains('li', `Completed: ${todo.completed}`).should('be.visible')
    cy.contains('li', `User ID: ${todo.userId}`).should('be.visible')

  });

  it('Simulando uma falha na API ', () => {
    cy.intercept(
      'GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { statusCode: 500 }
    ).as('serverFailure')

    cy.contains('button', 'Get TODO').click()

    cy.wait('@serverFailure')
      .its('response.statusCode')
      .should('be.equal', 500)

    cy.contains(
      'span',
      'Oops, something went wrong. Refresh the page and try again.'
    ).should('be.visible')

  });

  it('Simulando uma falha na rede', () => {
    cy.intercept(
      'GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { forceNetworkError: true }
    ).as('networkError')

    cy.contains('button', 'Get TODO').click()

    cy.wait('@networkError')
    cy.contains(
      'span',
      'Oops, something went wrong. Check your internet connection, refresh the page, and try again.'
    ).should('be.visible')

  });

  it('Criando um simples teste de API com Cypress com request ', () => {
    cy.request(
      'GET',
      'https://jsonplaceholder.typicode.com/todos/1',
    )
      .its('status')
      .should('be.equal', 200)

  });

  it('Lidando com inputs do tipo range ', () => {
    cy.get('input[type="range"]').invoke('val', 4).trigger('change')
    cy.get('#level-paragraph')
      .contains("You're on level: 4")
      .should('be.visible')
  });

  //Lidando com inputs do tipo range usando um laço de repetição
  Cypress._.times(10, index => {
    it(`Selecionando ${index + 1} de 10`, () => {
      cy.get('#level')
        .invoke('val', index + 1)
        .trigger('change')

      cy.contains('p', `You're on level: ${index + 1}`)
        .should('be.visible')
    });

  })

  it('Lidando com inputs do tipo date', () => {
    cy.get('#date').type('2024-01-25').blur()
    cy.contains('p', "The date you've selected is:").should('be.visible')
  });

  it('Protegendo dados sensíveis com Cypress', () => {
    cy.get('#password').type(Cypress.env('password'), { log: false })

    cy.get('#show-password-checkbox').check()

    cy.get('#password-input input[type="password"]').should('not.exist')
    cy.get('#password-input input[type="text"]')
      .should('be.visible')
      .and('have.value', Cypress.env('password'), { log: false })

    cy.get('#show-password-checkbox').uncheck()
    cy.get('#password-input input[type="password"]').should('be.visible')
    cy.get('#password-input input[type="text"]').should('not.exist')
  });

  it('Contando itens com Cypress', () => {
    cy.get('#animals li').should('have.length', 5)

  });

  it('Congelando o relógio do navegador com Cypress', () => {
    cy.contains('p', 'Current date: 2024-08-11').should('be.visible')
  });

  it('Aprenda a usar o comando .then() do Cypress', () => {
    cy.get('#timestamp')
      .then(element => {
        const code = element[0].innerText

        cy.get('#code').type(code)
        cy.contains('button', 'Submit').click()

        cy.contains("Congrats! You've entered the correct code.").should('be.visible')
      })
  });
  it('Validando mensagem para digitar um codigo invalido', () => {
    cy.get('#code').type('1234567890')
    cy.contains('button', 'Submit').click()

    cy.contains("The provided code isn't correct. Please, try again.")
      .should('be.visible')
  });

  it('Testando a leitura de arquivos com Cypress', () => {
    cy.contains('a', 'Download a text file').click()

    cy.readFile('cypress/downloads/example.txt')
      .should('be.equal', 'Hello, World!')
  });
})