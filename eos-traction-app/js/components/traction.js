/**
 * js/components/traction.js
 * Lógica y UI para el Componente de Tracción (Rocks).
 */

import { renderComponent, saveData, loadData, generateUniqueId } from '../utils.js';

let state = {
    rocks: [], // { id, description, owner, status: 'on-track' | 'off-track' | 'done' }
};

// --- Event Listeners ---
function addTractionEventListeners() {
    const componentContainer = document.getElementById('traction-component');
    const newRockForm = document.getElementById('new-rock-form');

    // Add new rock
    newRockForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const descriptionInput = document.getElementById('new-rock-description');
        const ownerInput = document.getElementById('new-rock-owner');
        
        const description = descriptionInput.value.trim();
        const owner = ownerInput.value.trim();

        if (description && owner) {
            state.rocks.unshift({ 
                id: generateUniqueId(), 
                description, 
                owner, 
                status: 'on-track' 
            });
            descriptionInput.value = '';
            ownerInput.value = '';
            saveAndRerender();
        }
    });

    // Handle clicks on the rocks list (change status, delete)
    componentContainer.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        const action = button.dataset.action;
        const rockId = button.dataset.id;
        const rock = state.rocks.find(r => r.id === rockId);

        if (!rock) return;

        if (action === 'toggle-status') {
            switch (rock.status) {
                case 'on-track':
                    rock.status = 'off-track';
                    break;
                case 'off-track':
                    rock.status = 'done';
                    break;
                case 'done':
                    rock.status = 'on-track';
                    break;
            }
        }

        if (action === 'delete') {
            state.rocks = state.rocks.filter(r => r.id !== rockId);
        }

        if (action) {
            saveAndRerender();
        }
    });
}

// --- Data Handling ---
function saveAndRerender() {
    saveData('rocks', state.rocks);
    rerender();
}

// --- Rendering ---
function getStatusInfo(status) {
    switch (status) {
        case 'on-track':
            return { text: 'En Curso', color: 'blue', icon: 'play-circle' };
        case 'off-track':
            return { text: 'Con Riesgo', color: 'yellow', icon: 'alert-triangle' };
        case 'done':
            return { text: 'Completada', color: 'green', icon: 'check-circle' };
        default:
            return { text: 'Indefinido', color: 'gray', icon: 'help-circle' };
    }
}

function renderRockList(rocks) {
    if (rocks.length === 0) {
        return '<p class="text-sm text-gray-500 italic mt-4">No hay Rocks definidas para este trimestre. ¡Añade la primera!</p>';
    }

    const rocksHtml = rocks.map(rock => {
        const status = getStatusInfo(rock.status);
        const statusColors = {
            blue: 'bg-blue-100 text-blue-800 border-blue-300',
            yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            green: 'bg-green-100 text-green-800 border-green-300',
            gray: 'bg-gray-100 text-gray-800 border-gray-300'
        };

        return `
            <div class="bg-white p-4 rounded-lg shadow-sm border flex flex-col md:flex-row md:items-center justify-between">
                <div class="flex-grow mb-4 md:mb-0">
                    <p class="text-gray-800 font-medium">${rock.description}</p>
                    <p class="text-sm text-gray-500">Responsable: <span class="font-semibold">${rock.owner}</span></p>
                </div>
                <div class="flex items-center space-x-2 flex-shrink-0">
                    <button data-action="toggle-status" data-id="${rock.id}" class="flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status.color]}">
                        <i data-lucide="${status.icon}" class="h-3 w-3 mr-1.5"></i>
                        ${status.text}
                    </button>
                    <button data-action="delete" data-id="${rock.id}" class="p-2 text-gray-400 hover:text-red-600">
                        <i data-lucide="trash-2" class="h-4 w-4"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    return `<div class="space-y-4 mt-6">${rocksHtml}</div>`;
}

function rerender() {
    const html = `
        <div id="traction-component" class="component-container">
            <h2 class="component-title">Tracción - Rocks Trimestrales</h2>
            <p class="text-sm text-gray-500 -mt-4 mb-6">Define las 3-7 prioridades más importantes que deben completarse en los próximos 90 días.</p>

            <form id="new-rock-form" class="bg-gray-50 p-4 rounded-lg border">
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div class="md:col-span-3">
                        <label for="new-rock-description" class="text-sm font-medium text-gray-700">Nueva Rock (Prioridad)</label>
                        <input id="new-rock-description" type="text" class="form-input mt-1" placeholder="Ej: Implementar nuevo software CRM" required>
                    </div>
                    <div>
                        <label for="new-rock-owner" class="text-sm font-medium text-gray-700">Responsable</label>
                        <input id="new-rock-owner" type="text" class="form-input mt-1" placeholder="Ej: Juan Pérez" required>
                    </div>
                    <div class="md:pt-6">
                        <button type="submit" class="btn-primary w-full">Añadir Rock</button>
                    </div>
                </div>
            </form>

            ${renderRockList(state.rocks)}
        </div>
    `;
    renderComponent(html);
    addTractionEventListeners();
    lucide.createIcons();
}

export function renderTraction() {
    state.rocks = loadData('rocks') || [];
    rerender();
}
