/**
 * js/components/settings.js
 * Lógica y UI para el componente de Configuración de la empresa.
 */

import { renderComponent, saveData, loadData } from '../utils.js';

/**
 * Añade los event listeners al formulario de configuración.
 */
function addSettingsEventListeners() {
    const settingsForm = document.getElementById('settings-form');
    const logoInput = document.getElementById('company-logo-input');
    const logoPreview = document.getElementById('logo-preview');

    // Previsualizar el logo cuando el usuario selecciona un archivo
    logoInput.addEventListener('change', () => {
        const file = logoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                logoPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Manejar el envío del formulario
    settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const companyName = document.getElementById('company-name').value;
        const logoFile = logoInput.files[0];
        const currentSettings = loadData('companySettings') || {};

        const settingsToSave = {
            name: companyName,
            logo: currentSettings.logo // Mantener el logo existente si no se sube uno nuevo
        };

        const saveAndUpdate = () => {
            saveData('companySettings', settingsToSave);
            updateUIAfterSave(settingsToSave);
            // Redirigir al dashboard después de guardar
            window.location.hash = '#/dashboard';
        };

        if (logoFile) {
            // Si hay un nuevo logo, convertirlo a Base64 y luego guardar
            const reader = new FileReader();
            reader.onloadend = () => {
                settingsToSave.logo = reader.result;
                saveAndUpdate();
            };
            reader.readAsDataURL(logoFile);
        } else {
            // Si no hay nuevo logo, guardar directamente
            saveAndUpdate();
        }
    });
}

/**
 * Actualiza la UI (navegación) después de guardar la configuración.
 * @param {object} settings - Los datos de configuración guardados.
 */
function updateUIAfterSave(settings) {
    const nameNav = document.getElementById('company-name-nav');
    const logoNav = document.getElementById('company-logo-nav');
    if (nameNav) nameNav.textContent = settings.name;
    if (logoNav && settings.logo) logoNav.src = settings.logo;
    
    // Opcional: Mostrar un mensaje de éxito temporal
    const saveButton = document.getElementById('save-settings-btn');
    saveButton.textContent = 'Guardado!';
    saveButton.classList.remove('btn-primary');
    saveButton.classList.add('bg-green-600', 'hover:bg-green-700');
    setTimeout(() => {
        saveButton.textContent = 'Guardar Cambios';
        saveButton.classList.add('btn-primary');
        saveButton.classList.remove('bg-green-600', 'hover:bg-green-700');
    }, 2000);
}


/**
 * Renderiza el componente de Configuración en el DOM.
 */
export function renderSettings() {
    const currentSettings = loadData('companySettings') || { name: '', logo: './assets/logo-placeholder.png' };

    const html = `
        <div class="component-container max-w-2xl mx-auto">
            <h2 class="component-title">Configuración de la Empresa</h2>
            <form id="settings-form">
                <div class="space-y-6">
                    <!-- Nombre de la Empresa -->
                    <div>
                        <label for="company-name" class="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
                        <input type="text" id="company-name" class="form-input" value="${currentSettings.name}" required>
                    </div>

                    <!-- Logotipo de la Empresa -->
                    <div>
                        <label for="company-logo" class="block text-sm font-medium text-gray-700 mb-1">Logotipo</label>
                        <div class="mt-1 flex items-center space-x-4">
                            <img id="logo-preview" src="${currentSettings.logo}" alt="Vista previa del logo" class="h-16 w-16 rounded-full object-cover bg-gray-100">
                            <label for="company-logo-input" class="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <span>Cambiar</span>
                                <input id="company-logo-input" name="company-logo" type="file" class="sr-only" accept="image/png, image/jpeg, image/svg+xml">
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Botón de Guardar -->
                <div class="mt-8 pt-5 border-t border-gray-200">
                    <div class="flex justify-end">
                        <button id="save-settings-btn" type="submit" class="btn-primary">
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;
    renderComponent(html);
    addSettingsEventListeners(); // Añadir los manejadores de eventos después de renderizar
}
