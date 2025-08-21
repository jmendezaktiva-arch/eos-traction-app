/**
 * js/main.js
 * El orquestador principal de la aplicación. Maneja el enrutamiento,
 * la carga de componentes y el estado inicial.
 */

import { renderComponent, setPageTitle, updateActiveNavLink, loadData } from './utils.js';

// Importa las funciones de renderizado de cada componente
import { renderDashboard } from './components/dashboard.js';
import { renderVision } from './components/vision.js'; // <-- IMPORTACIÓN REAL
// import { renderPeople } from './components/people.js';
// import { renderData } from './components/data.js';
// import { renderIssues } from './components/issues.js';
// import { renderProcess } from './components/process.js';
// import { renderTraction } from './components/traction.js';
import { renderSettings } from './components/settings.js';

// --- Mock Components (for now) ---
// Reemplazaremos estos con los archivos reales a medida que los construyamos.
// const renderVision = () => renderComponent('<div class="component-container"><h2 class="component-title">Visión</h2><p>Contenido del componente Visión (V/TO).</p></div>'); // <-- MOCK ELIMINADO
const renderPeople = () => renderComponent('<div class="component-container"><h2 class="component-title">Personas</h2><p>Contenido del componente Personas.</p></div>');
const renderData = () => renderComponent('<div class="component-container"><h2 class="component-title">Datos</h2><p>Contenido del componente Datos (Scorecard).</p></div>');
const renderIssues = () => renderComponent('<div class="component-container"><h2 class="component-title">Asuntos</h2><p>Contenido del componente Asuntos (Issues List).</p></div>');
const renderProcess = () => renderComponent('<div class="component-container"><h2 class="component-title">Procesos</h2><p>Contenido del componente Procesos.</p></div>');
const renderTraction = () => renderComponent('<div class="component-container"><h2 class="component-title">Tracción</h2><p>Contenido del componente Tracción (Rocks).</p></div>');


// --- Router ---
const routes = {
    '#/dashboard': { render: renderDashboard, title: 'Dashboard' },
    '#/vision': { render: renderVision, title: 'Visión' }, // <-- USA LA FUNCIÓN REAL
    '#/people': { render: renderPeople, title: 'Personas' },
    '#/data': { render: renderData, title: 'Datos' },
    '#/issues': { render: renderIssues, title: 'Asuntos' },
    '#/process': { render: renderProcess, title: 'Procesos' },
    '#/traction': { render: renderTraction, title: 'Tracción' },
    '#/settings': { render: renderSettings, title: 'Configuración' },
};

function router() {
    const companySettings = loadData('companySettings');
    let path = window.location.hash || '#/dashboard';

    // Forzar al usuario a la página de configuración si no hay datos de la empresa
    if (!companySettings || !companySettings.name) {
        path = '#/settings';
    }

    const route = routes[path];

    if (route) {
        route.render();
        setPageTitle(route.title);
        updateActiveNavLink(path);
    } else {
        // Si la ruta no existe, redirigir al dashboard
        window.location.hash = '#/dashboard';
    }
}

// --- App Initialization ---
function initializeApp() {
    // Cargar datos de la empresa y actualizar la UI
    const companySettings = loadData('companySettings');
    if (companySettings) {
        const nameNav = document.getElementById('company-name-nav');
        const logoNav = document.getElementById('company-logo-nav');
        if (nameNav) nameNav.textContent = companySettings.name || 'EOS App';
        if (logoNav && companySettings.logo) logoNav.src = companySettings.logo;
    }

    // Escuchar cambios en el hash de la URL para la navegación
    window.addEventListener('hashchange', router);
    
    // Cargar la vista inicial
    router();
}

// Iniciar la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initializeApp);
