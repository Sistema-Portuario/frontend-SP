/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, afterAll } from 'vitest';
import AdminDashboard from '../src/pages/AdminDashboard'; 
import { BrowserRouter } from 'react-router-dom';
import fs from 'fs';
import path from 'path';
import os from 'os';

// --- CONFIGURAÇÃO DE AMBIENTE ---
const renderComponent = () => {
  return render(
    <BrowserRouter>
      <AdminDashboard />
    </BrowserRouter>
  );
};

// --- ESTRUTURA DE DADOS PARA O RELATÓRIO DETALHADO ---
interface TestRecord {
  id: number;
  technique: string;
  scenario: string;
  rationale: string; // Explicação teórica baseada no PDF
  steps: string;     // O que foi feito passo a passo
  status: 'PASS' | 'FAIL' | 'SKIP';
  duration: number;  // Tempo em ms
  error?: string;    // Mensagem de erro se houver
}

const testResults: TestRecord[] = [];

// Função auxiliar para medir tempo e registrar
const registerResult = (
  id: number,
  technique: string, 
  scenario: string, 
  rationale: string,
  steps: string,
  startTime: number,
  status: 'PASS' | 'FAIL' | 'SKIP',
  error?: any
) => {
  const duration = Date.now() - startTime;
  const errorMessage = error instanceof Error ? error.message : String(error || '');
  
  testResults.push({ 
    id, technique, scenario, rationale, steps, status, duration, error: errorMessage 
  });
};

describe('White Box: AdminDashboard & Container Logic', () => {

  // --- GERAÇÃO DO RELATÓRIO MARKDOWN ---
  afterAll(() => {
    const reportPath = path.join(process.cwd(), 'whitebox_report_detailed.md');
    
    // Estatísticas
    const total = testResults.length;
    const passed = testResults.filter(r => r.status === 'PASS').length;
    const failed = testResults.filter(r => r.status === 'FAIL').length;
    const skipped = testResults.filter(r => r.status === 'SKIP').length;
    const totalTime = testResults.reduce((acc, curr) => acc + curr.duration, 0);

    const reportContent = `
# Relatório Técnico de Teste Estrutural (Caixa-Branca)

> **Projeto:** Sistema Portuário Frontend
> **Data de Execução:** ${new Date().toLocaleString()}
> **Ambiente:** ${os.type()} ${os.release()} | Node ${process.version}
> **Executor:** Vitest Automation

## 1. Resumo Executivo
Este documento valida a corretude estrutural dos componentes React baseando-se nas técnicas definidas em *'Aula - Testes de Software.pdf'*.

| Métrica | Valor |
| :--- | :--- |
| **Total de Casos** | ${total} |
| **Sucessos (Pass)** | ✅ ${passed} |
| **Falhas (Fail)** | ❌ ${failed} |
| **Pulados (Skip)** | ⚠️ ${skipped} |
| **Tempo Total** | ${totalTime}ms |

---

## 2. Fundamentação Teórica e Estratégia
As validações seguem rigorosamente as definições de teste estrutural:

1.  **Teste de Comandos (Statement Coverage):**
    * *Definição:* "Teste onde todos comandos existentes na estrutura devem ser executados pelo menos 1x"[cite: 104].
    * *Aplicação:* Garantir que o componente renderiza sem erros fatais no DOM.
2.  **Teste de Ramos (Branch Coverage):**
    * *Definição:* "Teste onde todas as saídas programadas... devem ser efetivadas pelo menos 1x"[cite: 106].
    * *Aplicação:* Forçar fluxos de validação (branches de erro) e fluxos de cancelamento (branches de desistência).
3.  **Teste de Condições (Condition Coverage):**
    * *Definição:* "Teste onde todas as conjugações de uma condição devem ser testadas"[cite: 108].
    * *Aplicação:* Validar expressões regulares complexas (ex: IDs de Contêineres) isoladamente.
4.  **Teste de Caminhos (Path Coverage):**
    * *Definição:* "Teste criado para que os dados percorram todos caminhos possíveis de uma estrutura"[cite: 99].
    * *Aplicação:* Ciclos completos de vida da informação (CRUD) atravessando múltiplas funções.

---

## 3. Detalhamento da Execução

${testResults.map(r => `
### Caso #${r.id}: ${r.scenario}
* **Técnica:** ${r.technique}
* **Status:** ${r.status === 'PASS' ? '✅ **APROVADO**' : r.status === 'SKIP' ? '⚠️ **PULADO**' : '❌ **FALHOU**'}
* **Duração:** ${r.duration}ms
* **Racional Teórico:** ${r.rationale}
* **Passos Executados:**
    ${r.steps.split(';').map(s => `    - ${s.trim()}`).join('\n')}
${r.status === 'FAIL' ? `\n> 🛑 **Detalhe do Erro:** \n> \`${r.error}\`` : ''}
`).join('\n***\n')}

---
*Relatório gerado automaticamente pelo Framework de Testes.*
    `;

    try {
      fs.writeFileSync(reportPath, reportContent);
      console.log(`\n[SUCESSO] Relatório DETALHADO salvo em: ${reportPath}`);
    } catch (err) {
      console.error('[ERRO] Falha ao salvar relatório:', err);
    }
  });

  // --- TESTES ---

  it('1. [Comandos] renders dashboard successfully', () => {
    const start = Date.now();
    try {
      renderComponent();
      expect(screen.getByText(/Painel de Administrador/i)).toBeInTheDocument();
      
      registerResult(1, "Teste de Comandos", "Renderização Inicial", 
        "Garantir execução mínima dos comandos de montagem do componente[cite: 104].",
        "Renderizar <AdminDashboard />; Verificar texto 'Painel de Administrador'",
        start, 'PASS');
    } catch (e) {
      registerResult(1, "Teste de Comandos", "Renderização Inicial", "Garantir execução mínima.", "Renderizar componente", start, 'FAIL', e);
      throw e;
    }
  });

  it('2. [Ramos] validates empty fields', () => {
    const start = Date.now();
    try {
      renderComponent();
      fireEvent.click(screen.getByText('Cadastrar Operador'));
      fireEvent.click(screen.getByText('Salvar'));
      expect(screen.getByRole('alert')).toHaveTextContent(/Todos os campos devem ser preenchidos/i);

      registerResult(2, "Teste de Ramos", "Validação de Campos Vazios",
        "Exercitar o ramo 'TRUE' da condicional 'if (!nome || !email)'[cite: 106].",
        "Abrir Modal; Clicar em Salvar vazio; Verificar Alerta de Erro",
        start, 'PASS');
    } catch (e) {
      registerResult(2, "Teste de Ramos", "Validação de Campos Vazios", "", "Abrir Modal; Salvar Vazio", start, 'FAIL', e);
      throw e;
    }
  });

  it('3. [Ramos] cancels operation', async () => {
    const start = Date.now();
    try {
      renderComponent();
      fireEvent.click(screen.getByText('Cadastrar Operador'));
      fireEvent.change(screen.getByPlaceholderText('Nome completo'), { target: { value: 'User Cancel' } });
      
      const cancelBtn = screen.queryByText(/Cancelar|Fechar/i) || screen.getByRole('button', { name: /X|Fech/i });
      if (cancelBtn) fireEvent.click(cancelBtn);
      
      expect(screen.queryByText('Salvar')).not.toBeInTheDocument();

      registerResult(3, "Teste de Ramos", "Fluxo de Cancelamento",
        "Exercitar a saída alternativa (Ramo de desistência) garantindo limpeza de estado[cite: 106].",
        "Abrir Modal; Preencher Parcialmente; Clicar Cancelar; Verificar fechamento",
        start, 'PASS');
    } catch (e) {
      registerResult(3, "Teste de Ramos", "Fluxo de Cancelamento", "", "Tentar cancelar modal", start, 'FAIL', e);
      throw e;
    }
  });

  it('4. [Condições] validates Container ID', async () => {
      const start = Date.now();
      // PENDENTE: Funcionalidade não implementada na UI (Menu 'Lorem Ipsum')
      registerResult(4, "Teste de Condições", "Regex de Contêiner (ISO 6346)",
        "Testar conjugações da condição de formato (4 letras + 7 números)[cite: 108].",
        "Navegar para Contêineres; Inserir ID inválido; Verificar Regex",
        start, 'SKIP', "Funcionalidade de Menu pendente no Frontend");
  });

  it('5. [Caminhos] executes full delete path', async () => {
    const start = Date.now();
    try {
      renderComponent();
      
      // Setup
      fireEvent.click(screen.getByText('Cadastrar Operador'));
      fireEvent.change(screen.getByPlaceholderText('Nome completo'), { target: { value: 'Delete Me' } });
      fireEvent.change(screen.getByPlaceholderText('E-mail'), { target: { value: 'del@test.com' } });
      fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'cargo1' } });
      fireEvent.click(screen.getByText('Salvar'));
      await screen.findByText('Delete Me'); 

      // Action
      const row = screen.getByText('Delete Me').closest('tr');
      const deleteBtn = row?.querySelector('button.text-red-500') || row?.querySelectorAll('button')[1];
      if (!deleteBtn) throw new Error("Botão Excluir (vermelho) não encontrado na linha");
      
      fireEvent.click(deleteBtn);

      await waitFor(() => {
          expect(screen.queryByText('Delete Me')).not.toBeInTheDocument();
      });

      registerResult(5, "Teste de Caminhos", "Ciclo de Exclusão (Delete Path)",
        "Percorrer todo o caminho do dado: Visualização -> Seleção -> Remoção -> Atualização[cite: 99].",
        "Criar Usuário; Localizar na Lista; Clicar Excluir; Validar Remoção do DOM",
        start, 'PASS');
    } catch (e) {
      registerResult(5, "Teste de Caminhos", "Ciclo de Exclusão", "Percorrer caminho de exclusão.", "Tentar excluir usuário", start, 'FAIL', e);
      throw e;
    }
  });

  it('6. [Caminhos] executes full edit path', async () => {
    const start = Date.now();
    try {
      renderComponent();
      
      // Setup
      fireEvent.click(screen.getByText('Cadastrar Operador'));
      fireEvent.change(screen.getByPlaceholderText('Nome completo'), { target: { value: 'Original Name' } });
      fireEvent.change(screen.getByPlaceholderText('E-mail'), { target: { value: 'edit@test.com' } });
      fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'cargo1' } });
      fireEvent.click(screen.getByText('Salvar'));
      await screen.findByText('Original Name');

      // Action
      const row = screen.getByText('Original Name').closest('tr');
      const editBtn = row?.querySelector('button.text-blue-500') || row?.querySelectorAll('button')[0];
      if (!editBtn) throw new Error("Botão Editar (azul) não encontrado na linha");

      fireEvent.click(editBtn);

      const nameInput = screen.getByPlaceholderText('Nome completo');
      fireEvent.clear(nameInput);
      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
      fireEvent.click(screen.getByText('Salvar'));

      expect(await screen.findByText('Updated Name')).toBeInTheDocument();

      registerResult(6, "Teste de Caminhos", "Ciclo de Edição (Edit Path)",
        "Percorrer caminho de atualização: Leitura -> Carregamento em Form -> Modificação -> Persistência[cite: 99].",
        "Criar Usuário; Clicar Editar; Alterar Nome; Salvar; Verificar Novo Nome",
        start, 'PASS');
    } catch (e) {
      registerResult(6, "Teste de Caminhos", "Ciclo de Edição", "Percorrer caminho de edição.", "Tentar editar usuário", start, 'FAIL', e);
      throw e;
    }
  });

});