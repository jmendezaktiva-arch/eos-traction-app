/**
 * js/components/data.js
 * Lógica y UI para el Componente de Datos (Scorecard).
 */

import { renderComponent, saveData, loadData, generateUniqueId } from '../utils.js';

let state = {
    scorecard: [], // Array of { id, measurable, goal, owner, values: [] }
    weekCount: 13 // Number of weeks to display
};

// --- Event Listeners ---
function addDataEventListeners() {
    const componentContainer = document.getElementById('data-component');

    // Add/Remove Measurables
    componentContainer.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        if (button.id === 'add-measurable-btn') {
            state.scorecard.push({
                id: generateUniqueId(),
                measurable: '',
                owner: '',
                goal: '',
                values: Array(state.weekCount).fill('')
            });
            rerender();
        }
        
        if (button.dataset.action === 'remove-measurable') {
            const idToRemove = button.dataset.id;
            state.scorecard = state.scorecard.filter(item => item.id !== idToRemove);
            rerender();
        }
    });

    // Save Button
    const saveButton = document.getElementById('save-data-btn');
    saveButton.addEventListener('click', saveScorecardData);
}

// --- Data Handling ---
function saveScorecardData() {
    const scorecardData = [];
    document.querySelectorAll('.scorecard-row').forEach(row => {
        const id = row.dataset.id;
        const values = Array.from(row.querySelectorAll('.week-input')).map(input => input.value);

        scorecardData.push({
            id: id,
            measurable: row.querySelector('.measurable-input').value,
            owner: row.querySelector('.owner-input').value,
            goal: row.querySelector('.goal-input').value,
            values: values
        });
    });

    state.scorecard = scorecardData.filter(item => item.measurable); // Filter out empty rows
    saveData('scorecard', state.scorecard);

    // Visual feedback
    const saveButton = document.getElementById('save-data-btn');
    saveButton.textContent = '¡Guardado!';
    saveButton.classList.remove('btn-primary');
    saveButton.classList.add('bg-green-600');
    setTimeout(() => {
        saveButton.textContent = 'Guardar Scorecard';
        saveButton.classList.add('btn-primary');
        saveButton.classList.remove('bg-green-600');
    }, 2000);
}

// --- Rendering ---

function getWeekHeaders() {
    let headers = '';
    let currentDate = new Date();
    // Go to the beginning of the current week (assuming Sunday is the start)
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < state.weekCount; i++) {
        const weekDate = new Date(currentDate);
        weekDate.setDate(weekDate.getDate() + (i * 7));
        const month = weekDate.getMonth() + 1;
        const day = weekDate.getDate();
        headers += `<th class="p-2 border font-semibold text-xs sticky top-0 bg-gray-100">${month}/${day}</th>`;
    }
    return headers;
}

function renderScorecardTable() {
    const weekHeaders = getWeekHeaders();

    const rowsHtml = state.scorecard.map(item => `
        <tr class="scorecard-row" data-id="${item.id}">
            <td class="p-1 border sticky left-0 bg-white">
                <input type="text" class="form-input text-sm p-1 measurable-input" value="${item.measurable}" placeholder="Métrica">
            </td>
            <td class="p-1 border">
                <input type="text" class="form-input text-sm p-1 owner-input" value="${item.owner || ''}" placeholder="Responsable">
            </td>
            <td class="p-1 border">
                <input type="text" class="form-input text-sm p-1 goal-input" value="${item.goal || ''}" placeholder="Meta">
            </td>
            ${item.values.map((val, index) => {
                // Basic color coding: green if above goal, red if below
                const goal = parseFloat(item.goal);
                const value = parseFloat(val);
                let bgColor = '';
                if (!isNaN(goal) && !isNaN(value)) {
                    if (value >= goal) bgColor = 'bg-green-100';
                    else bgColor = 'bg-red-100';
                }
                return `<td class="p-1 border"><input type="text" class="form-input text-sm p-1 text-center week-input ${bgColor}" value="${val}"></td>`;
            }).join('')}
            <td class="p-1 border text-center">
                <button data-action="remove-measurable" data-id="${item.id}" class="p-1 text-gray-400 hover:text-red-600">
                    <i data-lucide="trash-2" class="h-4 w-4"></i>
                </button>
            </td>
        </tr>
    `).join('');

    return `
        <div class="overflow-x-auto">
            <table class="w-full border-collapse text-sm">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="p-2 border font-semibold sticky left-0 bg-gray-100 z-10">Métrica</th>
                        <th class="p-2 border font-semibold sticky top-0 bg-gray-100">Responsable</th>
                        <th class="p-2 border font-semibold sticky top-0 bg-gray-100">Meta</th>
                        ${weekHeaders}
                        <th class="p-2 border font-semibold sticky top-0 bg-gray-100"></th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>
    `;
}

function rerender() {
    const html = `
        <div id="data-component" class="component-container">
            <div class="flex justify-between items-start mb-4">
                 <div >
                    <h2 class="component-title mb-0 pb-0 border-b-0">Cuadro de Indicadores (Scorecard)</h2>
                    <p class="text-sm text-gray-500">Define 5-15 métricas semanales para tener el pulso de tu negocio.</p>
                 </div>
                 <button id="save-data-btn" class="btn-primary -mt-2">Guardar Scorecard</button>
            </div>
            
            ${renderScorecardTable()}

            <button id="add-measurable-btn" class="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold">
                <i data-lucide="plus-circle" class="h-4 w-4 mr-1"></i>
                Añadir Métrica
            </button>
        </div>
    `;
    renderComponent(html);
    addDataEventListeners();
    lucide.createIcons();
}

export function renderData() {
    const savedScorecard = loadData('scorecard');
    state.scorecard = savedScorecard || [{
        id: generateUniqueId(),
        measurable: 'Ingresos Semanales',
        owner: 'Finanzas',
        goal: '10000',
        values: Array(state.weekCount).fill('')
    }];
    rerender();
}
