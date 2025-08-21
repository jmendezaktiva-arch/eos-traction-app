/**
 * js/components/issues.js
 * Lógica y UI para el Componente de Asuntos (Issues List).
 */

import { renderComponent, saveData, loadData, generateUniqueId } from '../utils.js';

let state = {
    issues: [], // { id, description, status: 'open' | 'solved' }
};

// --- Event Listeners ---
function addIssuesEventListeners() {
    const componentContainer = document.getElementById('issues-component');
    const newIssueForm = document.getElementById('new-issue-form');

    // Add new issue
    newIssueForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.getElementById('new-issue-input');
        const description = input.value.trim();
        if (description) {
            state.issues.unshift({ id: generateUniqueId(), description, status: 'open' });
            input.value = '';
            saveAndRerender();
        }
    });

    // Handle clicks on issue list (solve, delete, reopen)
    componentContainer.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        const action = button.dataset.action;
        const issueId = button.dataset.id;

        if (action === 'solve') {
            const issue = state.issues.find(i => i.id === issueId);
            if (issue) issue.status = 'solved';
        }
        
        if (action === 'reopen') {
            const issue = state.issues.find(i => i.id === issueId);
            if (issue) issue.status = 'open';
        }

        if (action === 'delete') {
            state.issues = state.issues.filter(i => i.id !== issueId);
        }

        if (action) {
            saveAndRerender();
        }
    });
}

// --- Data Handling ---
function saveAndRerender() {
    saveData('issues', state.issues);
    rerender();
}

// --- Rendering ---
function renderIssueList(issues, title, isSolvedList = false) {
    const issuesHtml = issues.map(issue => `
        <li class="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
            <span class="text-gray-800 ${isSolvedList ? 'line-through text-gray-500' : ''}">${issue.description}</span>
            <div class="flex items-center space-x-2">
                ${isSolvedList ? `
                    <button data-action="reopen" data-id="${issue.id}" title="Re-abrir Asunto" class="p-1 text-gray-400 hover:text-blue-600">
                        <i data-lucide="rotate-cw" class="h-4 w-4"></i>
                    </button>
                ` : `
                    <button data-action="solve" data-id="${issue.id}" title="Marcar como Resuelto (IDS)" class="p-1 text-gray-400 hover:text-green-600">
                        <i data-lucide="check-circle-2" class="h-4 w-4"></i>
                    </button>
                `}
                <button data-action="delete" data-id="${issue.id}" title="Eliminar Asunto" class="p-1 text-gray-400 hover:text-red-600">
                    <i data-lucide="trash-2" class="h-4 w-4"></i>
                </button>
            </div>
        </li>
    `).join('');

    return `
        <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-4">${title} (${issues.length})</h3>
            ${issues.length > 0 ? `<ul class="space-y-2">${issuesHtml}</ul>` : '<p class="text-sm text-gray-500 italic">No hay asuntos en esta lista.</p>'}
        </div>
    `;
}

function rerender() {
    const openIssues = state.issues.filter(i => i.status === 'open');
    const solvedIssues = state.issues.filter(i => i.status === 'solved');

    const html = `
        <div id="issues-component" class="component-container">
            <h2 class="component-title">Lista de Asuntos</h2>
            
            <!-- Form to add new issue -->
            <form id="new-issue-form" class="mb-8 flex items-center space-x-2">
                <input id="new-issue-input" type="text" class="form-input flex-grow" placeholder="Añade un nuevo asunto, obstáculo u oportunidad..." required>
                <button type="submit" class="btn-primary flex-shrink-0">Añadir Asunto</button>
            </form>

            <!-- Issues Lists -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                ${renderIssueList(openIssues, 'Asuntos Abiertos (IDS)')}
                ${renderIssueList(solvedIssues, 'Asuntos Resueltos', true)}
            </div>
        </div>
    `;
    renderComponent(html);
    addIssuesEventListeners();
    lucide.createIcons();
}

export function renderIssues() {
    state.issues = loadData('issues') || [];
    rerender();
}
