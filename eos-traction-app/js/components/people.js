/**
 * js/components/people.js
 * Lógica y UI para el Componente de Personas (Accountability Chart & People Analyzer).
 */

import { renderComponent, saveData, loadData, generateUniqueId } from '../utils.js';

// --- State Management ---
let state = {
    accountabilityChart: [],
    peopleAnalyzer: [],
    coreValues: [],
    activeTab: 'accountability' // 'accountability' or 'analyzer'
};

// --- Event Listeners ---
function addPeopleEventListeners() {
    const componentContainer = document.getElementById('people-component');
    
    // Tab switching
    componentContainer.addEventListener('click', (event) => {
        const tabButton = event.target.closest('.tab-button');
        if (tabButton) {
            state.activeTab = tabButton.dataset.tab;
            rerender();
        }
    });

    // Save button
    const saveButton = document.getElementById('save-people-btn');
    saveButton.addEventListener('click', savePeopleData);
    
    // Add Person to Analyzer
    const addPersonButton = document.getElementById('add-person-btn');
    if(addPersonButton) {
        addPersonButton.addEventListener('click', () => {
             state.peopleAnalyzer.push({ id: generateUniqueId(), name: '', values: {}, gwc: {} });
             rerender();
        });
    }
}

// --- Data Handling ---
function savePeopleData() {
    // Save Accountability Chart data (simple example, can be expanded)
    const accountabilityData = [];
    document.querySelectorAll('.role-card').forEach(card => {
        accountabilityData.push({
            role: card.querySelector('.role-name').value,
            name: card.querySelector('.person-name').value
        });
    });
    state.accountabilityChart = accountabilityData;

    // Save People Analyzer data
    const analyzerData = [];
    document.querySelectorAll('.analyzer-row').forEach(row => {
        const personId = row.dataset.id;
        const personName = row.querySelector('.person-name-analyzer').value;
        
        const values = {};
        state.coreValues.forEach((value, index) => {
            const rating = row.querySelector(`input[name="value-${personId}-${index}"]:checked`);
            if(rating) values[value] = rating.value;
        });

        const gwc = {
            getsIt: row.querySelector(`input[name="gwc-g-${personId}"]:checked`)?.value === 'yes',
            wantsIt: row.querySelector(`input[name="gwc-w-${personId}"]:checked`)?.value === 'yes',
            capacity: row.querySelector(`input[name="gwc-c-${personId}"]:checked`)?.value === 'yes',
        };
        analyzerData.push({ id: personId, name: personName, values, gwc });
    });
    state.peopleAnalyzer = analyzerData.filter(p => p.name); // Remove empty rows

    saveData('people', { accountabilityChart: state.accountabilityChart, peopleAnalyzer: state.peopleAnalyzer });

    // Visual feedback
    const saveButton = document.getElementById('save-people-btn');
    saveButton.textContent = '¡Guardado!';
    saveButton.classList.remove('btn-primary');
    saveButton.classList.add('bg-green-600');
    setTimeout(() => {
        saveButton.textContent = 'Guardar Cambios';
        saveButton.classList.add('btn-primary');
        saveButton.classList.remove('bg-green-600');
    }, 2000);
}


// --- Rendering ---

function renderAccountabilityChart() {
    // This is a simplified version. A real one would be recursive and more complex.
    return `
        <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Organigrama de Rendición de Cuentas</h3>
            <p class="text-sm text-gray-500 mb-4">Define la estructura correcta para tu empresa. ¿Quién es responsable de qué?</p>
            <div id="chart-container" class="space-y-4">
                <!-- Example Card -->
                <div class="role-card bg-gray-50 p-4 rounded-lg border">
                    <input type="text" class="role-name text-md font-bold w-full border-b mb-2 pb-1" placeholder="Nombre del Rol (ej: Integrador)">
                    <textarea class="text-xs text-gray-600 w-full h-20 p-1 border rounded" placeholder="• Liderar, gestionar y responsabilizar...&#10;• Armonizar funciones principales...&#10;• Eliminar obstáculos..."></textarea>
                    <input type="text" class="person-name text-sm font-semibold w-full mt-2 p-1 border rounded" placeholder="Nombre de la Persona">
                </div>
                 <div class="role-card bg-gray-50 p-4 rounded-lg border">
                    <input type="text" class="role-name text-md font-bold w-full border-b mb-2 pb-1" placeholder="Nombre del Rol (ej: Ventas & Mktg)">
                    <textarea class="text-xs text-gray-600 w-full h-20 p-1 border rounded" placeholder="• Generar negocio...&#10;• Mensaje de marketing...&#10;• Proceso de ventas..."></textarea>
                    <input type="text" class="person-name text-sm font-semibold w-full mt-2 p-1 border rounded" placeholder="Nombre de la Persona">
                </div>
            </div>
            <button class="mt-4 text-sm text-blue-600 hover:text-blue-800 font-semibold">Añadir Rol (funcionalidad futura)</button>
        </div>
    `;
}

function renderPeopleAnalyzer() {
    const headers = [...state.coreValues, 'Lo Comprende', 'Lo Desea', 'Capacidad'];
    
    const renderRows = () => state.peopleAnalyzer.map(person => `
        <tr class="analyzer-row" data-id="${person.id}">
            <td class="p-2 border"><input class="form-input person-name-analyzer" type="text" value="${person.name || ''}" placeholder="Nombre del empleado"></td>
            ${state.coreValues.map((value, index) => `
                <td class="p-2 border text-center">
                    <select class="form-input text-sm p-1">
                        <option value="+" ${person.values[value] === '+' ? 'selected' : ''}>+</option>
                        <option value="+/-" ${person.values[value] === '+/-' ? 'selected' : ''}>+/-</option>
                        <option value="-" ${person.values[value] === '-' ? 'selected' : ''}>-</option>
                    </select>
                </td>
            `).join('')}
            <td class="p-2 border text-center"><input type="checkbox" name="gwc-g-${person.id}" value="yes" ${person.gwc.getsIt ? 'checked' : ''}></td>
            <td class="p-2 border text-center"><input type="checkbox" name="gwc-w-${person.id}" value="yes" ${person.gwc.wantsIt ? 'checked' : ''}></td>
            <td class="p-2 border text-center"><input type="checkbox" name="gwc-c-${person.id}" value="yes" ${person.gwc.capacity ? 'checked' : ''}></td>
        </tr>
    `).join('');

    return `
        <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Analizador de Personas</h3>
            <p class="text-sm text-gray-500 mb-4">Evalúa si tienes a las personas correctas en base a tus Valores y GWC (Comprende, Desea, Capacidad).</p>
            <div class="overflow-x-auto">
                <table class="w-full border-collapse text-sm">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="p-2 border font-semibold">Persona</th>
                            ${state.coreValues.map(v => `<th class="p-2 border font-semibold truncate" title="${v}">${v}</th>`).join('')}
                            <th class="p-2 border font-semibold">C</th>
                            <th class="p-2 border font-semibold">D</th>
                            <th class="p-2 border font-semibold">C</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${renderRows()}
                    </tbody>
                </table>
            </div>
            <button id="add-person-btn" class="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold">
                <i data-lucide="plus-circle" class="h-4 w-4 mr-1"></i>
                Añadir Persona
            </button>
        </div>
    `;
}

function rerender() {
    const activeTab = state.activeTab;
    const accountabilityTabClass = activeTab === 'accountability' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
    const analyzerTabClass = activeTab === 'analyzer' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

    const html = `
        <div id="people-component" class="component-container">
            <div class="flex justify-between items-start">
                 <h2 class="component-title mb-0 pb-0 border-b-0">Componente de Personas</h2>
                 <button id="save-people-btn" class="btn-primary -mt-2">Guardar Cambios</button>
            </div>

            <!-- Tabs -->
            <div class="border-b border-gray-200 mb-6">
                <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                    <button data-tab="accountability" class="tab-button whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${accountabilityTabClass}">
                        Org. de Rendición de Cuentas
                    </button>
                    <button data-tab="analyzer" class="tab-button whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${analyzerTabClass}">
                        Analizador de Personas
                    </button>
                </nav>
            </div>

            <!-- Tab Content -->
            <div id="people-tab-content">
                ${activeTab === 'accountability' ? renderAccountabilityChart() : renderPeopleAnalyzer()}
            </div>
        </div>
    `;
    renderComponent(html);
    addPeopleEventListeners();
    lucide.createIcons();
}

export function renderPeople() {
    // Cargar datos necesarios
    const visionData = loadData('vision');
    const peopleData = loadData('people');
    
    state.coreValues = visionData?.vto?.coreValues || ['Valor 1', 'Valor 2', 'Valor 3']; // Default values if none are set
    state.accountabilityChart = peopleData?.accountabilityChart || [];
    state.peopleAnalyzer = peopleData?.peopleAnalyzer || [{ id: generateUniqueId(), name: '', values: {}, gwc: {} }];
    
    rerender();
}
