/// <reference types="cypress" />

const testData = require('../fixtures/frontend_data.json');

interface TestResult {
  suite: string; id: string; scenario: string; keyword: string; status: 'PASS' | 'FAIL'; error?: string;
}

const results: TestResult[] = [];

describe('AutoTest Framework (Black Box) - Operadores', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  after(() => {
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    
    const report = `
# Relatório Final de Teste Funcional
**Data:** ${new Date().toLocaleString()}
**Referência:** AutoTest Framework (PDF)

| Status | Qtd |
| :--- | :--- |
| ✅ Passou | ${passed} |
| ❌ Falhou | ${failed} |

## Matriz de Execução
${results.map(r => `- **${r.id}** [${r.keyword}]: ${r.status} ${r.error ? `(${r.error})` : ''}`).join('\n')}
    `;
    cy.writeFile('blackbox_report.md', report);
  });

  testData.forEach((suite: any) => {
    context(`Suite: ${suite.suite}`, () => {
      suite.cases.forEach((data: any) => {
        it(`${data.id}: ${data.desc}`, () => {
          
          let testStatus: 'PASS' | 'FAIL' = 'PASS';
          cy.on('fail', (err) => {
            testStatus = 'FAIL';
            results.push({ suite: suite.suite, id: data.id, scenario: data.desc, keyword: data.action, status: 'FAIL', error: err.message });
            throw err;
          });

          // --- HELPER: ENSURE USER EXISTS (State Persistence) ---
          if (data.action === 'edit_user' || data.action === 'delete_user') {
            cy.get('body').then($body => {
              if ($body.find(`tr:contains("${data.target_user}")`).length === 0) {
                 cy.log(`Restoring state: Creating '${data.target_user}'...`);
                 cy.contains('button', /Cadastrar Operador/i).click();
                 cy.get('input[placeholder="Nome completo"]').type(data.target_user);
                 cy.get('input[placeholder="E-mail"]').type('temp@test.com');
                 cy.get('select').eq(0).select('cargo1');
                 cy.contains('button', 'Salvar').click();
                 
                 // CRITICAL FIX: Wait for success toast to disappear so it doesn't block clicks
                 cy.contains('Alterações salvas').should('not.exist'); 
              }
            });
          }

          // --- KEYWORD INTERPRETER ---

          if (data.action === 'open_modal') {
            cy.contains('button', /Cadastrar Operador/i).click();
          }

          if (data.action === 'submit_form') {
            cy.get('body').then($body => {
              if ($body.find('form').length === 0) cy.contains('button', /Cadastrar Operador/i).click();
            });

            if (data.input_nome !== undefined) {
               if(data.input_nome === "") cy.get('input[placeholder="Nome completo"]').clear();
               else cy.get('input[placeholder="Nome completo"]').clear().type(data.input_nome);
            }
            if (data.input_email) cy.get('input[placeholder="E-mail"]').clear().type(data.input_email);
            if (data.input_cargo) cy.get('select').eq(0).select(data.input_cargo);
            
            cy.contains('button', 'Salvar').click();
          }

          if (data.action === 'edit_user') {
            cy.contains('tr', data.target_user).within(() => {
               cy.get('button.text-blue-500').click({ force: true });
            });
            if (data.input_nome) cy.get('input[placeholder="Nome completo"]').clear().type(data.input_nome);
            cy.contains('button', 'Salvar').click();
          }

          if (data.action === 'delete_user') {
            // 1. Find the row
            cy.contains('tr', data.target_user).within(() => {
               // 2. Click DELETE (Force true to click through any overlapping toast)
               cy.get('button.text-red-500').click({ force: true });
            });

            // 3. Verify Modal Text
            if (data.expect_text) {
               // Look for text in the whole body (modal is usually outside the table)
               cy.get('body').contains(data.expect_text).should('be.visible');
            }

            // 4. Confirm Deletion
            if (data.confirm_delete) {
               cy.get('.bg-red-500').contains('Excluir').click();
            }
          }

          // --- ASSERTIONS ---
          if (data.expect_text && data.action !== 'delete_user') {
             cy.contains(data.expect_text, { timeout: 8000 }).should('be.visible');
          }
          if (data.expect_error) cy.contains(data.expect_error).should('be.visible');

          cy.then(() => {
             if (testStatus === 'PASS') {
               results.push({ suite: suite.suite, id: data.id, scenario: data.desc, keyword: data.action, status: 'PASS' });
             }
          });

        });
      });
    });
  });
});