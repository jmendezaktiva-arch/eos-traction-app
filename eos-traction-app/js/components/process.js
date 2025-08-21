/**
 * js/components/process.js
 * Lógica y UI para el Componente de Procesos (3-Step Process Documenter).
 */

import { renderComponent, saveData, loadData, generateUniqueId } from '../utils.js';

let state = {
    processes: [], // { id, name, steps: [{ id, description }] }
};

// --- Event Listeners ---
function addProcessEventListeners() {
    const componentContainer = document.getElementById('process-component');

    // Add new process
    document.getElementById('add-process-btn').addEventListener('click', () => {
        state.processes.push({
            id: generateUniqueId(),
            name: '',
            steps: [{ id: generateUniqueId(), description: '' }]
        });
        rerender();
    });

    // Handle clicks within the process list (add step, remove step/process)
    componentContainer.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        const action = button.dataset.action;
        const processId = button.dataset.processId;
        const stepId = button.dataset.stepId;

        if (action === 'add-step') {
            const process = state.processes.find(p => p.id === processId);
            if (process) {
                process.steps.push({ id: generateUniqueId(), description: '' });
                rerender();
            }
        }

        if (action === 'remove-step') {
            const process = state.processes.find(p => p.id === processId);
            if (process) {
                process.steps = process.steps.filter(s => s.id !== stepId);
                rerender();
            }
        }
        
        if (action === 'remove-process') {
            state.processes = state.processes.filter(p => p.id !== processId);
            rerender();
        }
    });

    // Save button
    document.getElementById('save-process-btn').addEventListener('click', saveProcessData);
}

// --- Data Handling ---
function saveProcessData() {
    const processesData = [];
    document.querySelectorAll('.process-card').forEach(card => {
        const processId = card.dataset.id;
        const processName = card.querySelector('.process-name-input').value;
        
        const steps = [];
        card.querySelectorAll('.step-textarea').forEach(textarea => {
            steps.push({
                id: textarea.dataset.id,
                description: textarea.value
            });
        });

        if (processName) { // Only save processes with a name
            processesData.push({
                id: processId,
                name: processName,
                steps: steps.filter(s => s.description) // Only save steps with content
            });
        }
    });

    state.processes = processesData;
    saveData('processes', state.processes);

    // Visual feedback
    const saveButton = document.getElementById('save-process-btn');
    saveButton.textContent = '¡Guardado!';
    saveButton.classList.remove('btn-primary');
    saveButton.classList.add('bg-green-600');
    setTimeout(() => {
        saveButton.textContent = 'Guardar Procesos';
        saveButton.classList.add('btn-primary');
        saveButton.classList.remove('bg-green-600');
    }, 2000);
}

// --- Rendering ---
function renderProcessCard(process) {
    const stepsHtml = process.steps.map(step => `
        <div class="flex items-start space-x-2" id="step-${step.id}">
            <span class="font-bold text-gray-500 mt-2">→</span>
            <textarea data-id="${step.id}" class="step-textarea form-input text-sm flex-grow" rows="2" placeholder="Describe este paso clave...">${step.description}</textarea>
            <button type="button" data-action="remove-step" data-process-id="${process.id}" data-step-id="${step.id}" class="p-2 text-gray-400 hover:text-red-600 mt-1">
                <i data-lucide="x" class="h-4 w-4"></i>
            </button>
        </div>
    `).join('');

    return `
        <div class="process-card bg-white p-6 rounded-xl border shadow-sm" data-id="${process.id}">
            <div class="flex justify-between items-center mb-4">
                <input type="text" class="process-name-input text-lg font-bold text-gray-800 w-full border-b-2 border-gray-200 focus:border-blue-500 outline-none" value="${process.name}" placeholder="Nombre del Proceso Medular (ej: Proceso de Ventas)">
                 <button type="button" data-action="remove-process" data-process-id="${process.id}" class="p-2 text-gray-400 hover:text-red-600">
                    <i data-lucide="trash-2" class="h-5 w-5"></i>
                </button>
            </div>
            <div class="steps-container space-y-3">
                ${stepsHtml}
            </div>
            <button type="button" data-action="add-step" data-process-id="${process.id}" class="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold">
                <i data-lucide="plus" class="h-4 w-4 mr-1"></i>
                Añadir Paso
            </button>
        </div>
    `;
}

function rerender() {
    const html = `
        <div id="process-component">
            <div class="flex justify-between items-start mb-6">
                 <div>
                    <h2 class="component-title mb-0 pb-0 border-b-0">Procesos Medulares</h2>
                    <p class="text-sm text-gray-500 max-w-2xl">Documenta el 20% de los pasos que producen el 80% de los resultados en tus procesos clave para crear consistencia y escalabilidad.</p>
                 </div>
                 <button id="save-process-btn" class="btn-primary flex-shrink-0">Guardar Procesos</button>
            </div>
            
            <div id="processes-list" class="space-y-6">
                ${state.processes.map(renderProcessCard).join('')}
            </div>

            <button id="add-process-btn" class="mt-6 btn-primary bg-gray-600 hover:bg-gray-700">
                Añadir Proceso Medular
            </button>
        </div>
    `;
    renderComponent(html);
    addProcessEventListeners();
    lucide.createIcons();
}

export function renderProcess() {
    state.processes = loadData('processes') || [
        { id: generateUniqueId(), name: 'Proceso de Ventas (Ejemplo)', steps: [{id: generateUniqueId(), description: '1. Prospecto Identificado' }, {id: generateUniqueId(), description: '2. Reunión de Descubrimiento' }] }
    ];
    rerender();
}
