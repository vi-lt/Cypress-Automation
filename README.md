# Cypress-Automation
This project uses Cypress and JavaScript to automate tasks. The test script will have an allure report once it has finished running.

//How to get element
//by ID =  cy.get('#')
//by Class = cy.get('.')
//By tag element = cy.get('input') or cy.get('button') or cy.get('div')
//By attribute = cy.get('input[class="user_email"]') or cy.get('input[name="user_login"]')
// Get element from elements = cy.get('').eq(2)
// Contains = cy.get('a').contains('Sign In');
//----------------------------------------------------------------------------------------
//<ul id="parent">
//<li class="first"></li>
//<li class="second"></li>
//</ul >
// Get children element from parent element = cy.get(‘#parent’).find(‘li’)
////Get element i in select option = cy.get('select').select(i)
