/**
 * js/components/vision.js
 * Lógica y UI para el Componente de Visión (V/TO).
 */

import { renderComponent, saveData, loadData, generateUniqueId } from '../utils.js';

// --- Event Listeners ---

/**
 * Añade todos los event listeners necesarios para la página de Visión.
 */
function addVisionEventListeners() {
    const vtoForm = document.getElementById('vto-form');
    
    // Manejar clics en botones para añadir/eliminar elementos de listas
    vtoForm.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;

        const action = target.dataset.action;
        const listId = target.dataset.list;

        if (action === 'add') {
            addListItem(listId);
        }
        if (action === 'remove') {
            const itemId = target.dataset.id;
            removeListItem(listId, itemId);
        }
    });

    // Manejar el guardado del formulario
    vtoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        saveVTO();
    });
}

/**
 * Añade un nuevo campo de entrada a una lista.
 * @param {string} listId - El ID del contenedor de la lista (ej: 'core-values-list').
 */
function addListItem(listId) {
    const listContainer = document.getElementById(listId);
    if (!listContainer) return;

    const uniqueId = generateUniqueId();
    const newItemHtml = `
        <div id="item-${uniqueId}" class="flex items-center space-x-2">
            <input type="text" class="form-input flex-grow" value="">
            <button type="button" data-action="remove" data-list="${listId}" data-id="${uniqueId}" class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                <i data-lucide="trash-2" class="h-5 w-5"></i>
            </button>
        </div>
    `;
    listContainer.insertAdjacentHTML('beforeend', newItemHtml);
    lucide.createIcons(); // Re-render icons
}

/**
 * Elimina un elemento de una lista.
 * @param {string} listId - El ID del contenedor de la lista.
 * @param {string} itemId - El ID único del elemento a eliminar.
 */
function removeListItem(listId, itemId) {
    const itemToRemove = document.getElementById(`item-${itemId}`);
    if (itemToRemove) {
        itemToRemove.remove();
    }
}


// --- Data Handling ---

/**
 * Recopila todos los datos del formulario V/TO y los guarda en localStorage.
 */
function saveVTO() {
    const vtoData = {
        coreValues: getListValues('core-values-list'),
        coreFocus: {
            passion: document.getElementById('core-focus-passion').value,
            niche: document.getElementById('core-focus-niche').value,
        },
        tenYearTarget: document.getElementById('ten-year-target').value,
        marketingStrategy: {
            targetMarket: document.getElementById('marketing-target-market').value,
            threeUniques: getListValues('marketing-three-uniques'),
        },
        threeYearPicture: {
            futureDate: document.getElementById('three-year-date').value,
            revenue: document.getElementById('three-year-revenue').value,
            profit: document.getElementById('three-year-profit').value,
            measurables: document.getElementById('three-year-measurables').value,
            looksLike: getListValues('three-year-looks-like'),
        },
        oneYearPlan: {
            futureDate: document.getElementById('one-year-date').value,
            revenue: document.getElementById('one-year-revenue').value,
            profit: document.getElementById('one-year-profit').value,
            measurables: document.getElementById('one-year-measurables').value,
            goals: getListValues('one-year-goals'),
        },
        rocks: getListValues('quarterly-rocks-list'),
        issues: getListValues('issues-list'),
    };

    saveData('vision', { vto: vtoData });
    
    // Feedback visual al usuario
    const saveButton = document.getElementById('save-vto-btn');
    saveButton.textContent = '¡Guardado!';
    saveButton.classList.remove('btn-primary');
    saveButton.classList.add('bg-green-600');
    setTimeout(() => {
        saveButton.textContent = 'Guardar Visión';
        saveButton.classList.add('btn-primary');
        saveButton.classList.remove('bg-green-600');
    }, 2000);
}

/**
 * Obtiene los valores de todos los inputs dentro de un contenedor de lista.
 * @param {string} listId - El ID del contenedor de la lista.
 * @returns {string[]} - Un array con los valores.
 */
function getListValues(listId) {
    const listContainer = document.getElementById(listId);
    if (!listContainer) return [];
    return Array.from(listContainer.querySelectorAll('input[type="text"]')).map(input => input.value).filter(Boolean);
}


// --- Rendering ---

/**
 * Genera el HTML para una lista editable.
 * @param {string} id - El ID para el contenedor de la lista.
 * @param {string[]} items - Array de strings para rellenar los inputs.
 * @returns {string} - El string de HTML para la lista.
 */
function renderEditableList(id, items = []) {
    const itemsHtml = items.map(item => {
        const uniqueId = generateUniqueId();
        return `
            <div id="item-${uniqueId}" class="flex items-center space-x-2">
                <input type="text" class="form-input flex-grow" value="${item}">
                <button type="button" data-action="remove" data-list="${id}" data-id="${uniqueId}" class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <i data-lucide="trash-2" class="h-5 w-5"></i>
                </button>
            </div>
        `;
    }).join('');

    return `
        <div id="${id}" class="space-y-2">
            ${itemsHtml}
        </div>
        <button type="button" data-action="add" data-list="${id}" class="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold">
            <i data-lucide="plus-circle" class="h-4 w-4 mr-1"></i>
            Añadir
        </button>
    `;
}

/**
 * Renderiza el componente de Visión (V/TO) en el DOM.
 */
export function renderVision() {
    const visionData = loadData('vision')?.vto || {};
    const { 
        coreValues, 
        coreFocus = {}, 
        tenYearTarget, 
        marketingStrategy = {}, 
        threeYearPicture = {},
        oneYearPlan = {},
        rocks,
        issues
    } = visionData;

    const html = `
        <div class="component-container">
            <h2 class="component-title">Organizador Visión/Tracción (V/TO)</h2>
            <form id="vto-form" class="space-y-8">
                
                <!-- 1. Valores Fundamentales -->
                <section>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2">1. Valores Fundamentales</h3>
                    <p class="text-sm text-gray-500 mb-4">Los principios guía de tu empresa (3-7 valores).</p>
                    ${renderEditableList('core-values-list', coreValues)}
                </section>

                <!-- 2. Enfoque Medular -->
                <section>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2">2. Enfoque Medular (Core Focus™)</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm text-gray-500 mb-1">Propósito/Causa/Pasión</label>
                            <input id="core-focus-passion" type="text" class="form-input" value="${coreFocus.passion || ''}">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-500 mb-1">Tu Nicho</label>
                            <input id="core-focus-niche" type="text" class="form-input" value="${coreFocus.niche || ''}">
                        </div>
                    </div>
                </section>

                <!-- 3. Meta a 10 Años -->
                <section>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2">3. Meta a 10 Años (10-Year Target™)</h3>
                     <p class="text-sm text-gray-500 mb-4">La gran meta audaz que unifica a la organización.</p>
                    <input id="ten-year-target" type="text" class="form-input" value="${tenYearTarget || ''}">
                </section>

                <!-- 4. Estrategia de Marketing -->
                <section>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2">4. Estrategia de Marketing</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-500 mb-1">Tu Mercado Objetivo (La Lista)</label>
                            <textarea id="marketing-target-market" class="form-input" rows="3">${marketingStrategy.targetMarket || ''}</textarea>
                        </div>
                         <div>
                            <label class="block text-sm text-gray-500 mb-1">Tus 3 Cualidades Únicas</label>
                            ${renderEditableList('marketing-three-uniques', marketingStrategy.threeUniques)}
                        </div>
                    </div>
                </section>

                <!-- 5. Panorama a 3 Años -->
                 <section>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2">5. Panorama a 3 Años (3-Year Picture™)</h3>
                     <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <input id="three-year-date" type="text" class="form-input" placeholder="Fecha Futura" value="${threeYearPicture.futureDate || ''}">
                        <input id="three-year-revenue" type="text" class="form-input" placeholder="Ingresos" value="${threeYearPicture.revenue || ''}">
                        <input id="three-year-profit" type="text" class="form-input" placeholder="Ganancia" value="${threeYearPicture.profit || ''}">
                        <input id="three-year-measurables" type="text" class="form-input" placeholder="Medibles Clave" value="${threeYearPicture.measurables || ''}">
                     </div>
                     <div>
                        <label class="block text-sm text-gray-500 mb-1">¿Cómo se verá la empresa? (viñetas)</label>
                        ${renderEditableList('three-year-looks-like', threeYearPicture.looksLike)}
                     </div>
                </section>
                
                <!-- 6. Panorama a 1 Año -->
                <section>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2">6. Panorama a 1 Año (1-Year Plan)</h3>
                     <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <input id="one-year-date" type="text" class="form-input" placeholder="Fecha Fin de Año" value="${oneYearPlan.futureDate || ''}">
                        <input id="one-year-revenue" type="text" class="form-input" placeholder="Ingresos" value="${oneYearPlan.revenue || ''}">
                        <input id="one-year-profit" type="text" class="form-input" placeholder="Ganancia" value="${oneYearPlan.profit || ''}">
                        <input id="one-year-measurables" type="text" class="form-input" placeholder="Medibles Clave" value="${oneYearPlan.measurables || ''}">
                     </div>
                     <div>
                        <label class="block text-sm text-gray-500 mb-1">Metas para el año (3-7 viñetas)</label>
                        ${renderEditableList('one-year-goals', oneYearPlan.goals)}
                     </div>
                </section>

                <!-- 7. Rocks Trimestrales -->
                <section>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2">7. Rocks Trimestrales</h3>
                    <p class="text-sm text-gray-500 mb-4">Las prioridades más importantes para los próximos 90 días.</p>
                    ${renderEditableList('quarterly-rocks-list', rocks)}
                </section>

                <!-- 8. Lista de Asuntos -->
                <section>
                    <h3 class="text-lg font-semibold text-gray-700 mb-2">8. Lista de Asuntos</h3>
                    <p class="text-sm text-gray-500 mb-4">Todos los obstáculos, problemas e ideas que se deben resolver.</p>
                    ${renderEditableList('issues-list', issues)}
                </section>

                <!-- Botón de Guardar -->
                <div class="mt-8 pt-5 border-t border-gray-200">
                    <div class="flex justify-end">
                        <button id="save-vto-btn" type="submit" class="btn-primary">
                            Guardar Visión
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;
    renderComponent(html);
    addVisionEventListeners();
    lucide.createIcons();
}
