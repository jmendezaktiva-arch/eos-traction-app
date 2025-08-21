/**
 * js/utils.js
 * Contiene funciones de ayuda reutilizables para toda la aplicación.
 */

// --- DOM Manipulation ---

/**
 * Renderiza contenido HTML dentro del contenedor principal de la aplicación.
 * @param {string} htmlContent - El string de HTML que se va a renderizar.
 */
export function renderComponent(htmlContent) {
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        appContainer.innerHTML = htmlContent;
    } else {
        console.error('El contenedor principal #app-container no fue encontrado.');
    }
}

/**
 * Actualiza el título principal de la página.
 * @param {string} title - El nuevo título a mostrar.
 */
export function setPageTitle(title) {
    const pageTitleElement = document.getElementById('page-title');
    if (pageTitleElement) {
        pageTitleElement.textContent = title;
    }
}

/**
 * Actualiza el estado activo del enlace de navegación.
 * @param {string} path - La ruta activa (ej: '#/vision').
 */
export function updateActiveNavLink(path) {
    document.querySelectorAll('.nav-link').forEach(link => {
        // Compara el href del enlace con la ruta actual
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}


// --- Local Storage Management ---

const APP_PREFIX = 'eos_traction_app_';

/**
 * Guarda datos en localStorage con un prefijo de la aplicación.
 * @param {string} key - La clave para almacenar los datos.
 * @param {any} data - Los datos a guardar (se convertirán a JSON).
 */
export function saveData(key, data) {
    try {
        localStorage.setItem(APP_PREFIX + key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error al guardar datos para la clave "${key}":`, error);
    }
}

/**
 * Carga datos desde localStorage.
 * @param {string} key - La clave de los datos a cargar.
 * @returns {any | null} - Los datos parseados o null si no existen o hay un error.
 */
export function loadData(key) {
    try {
        const data = localStorage.getItem(APP_PREFIX + key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error al cargar datos para la clave "${key}":`, error);
        return null;
    }
}

// --- Helper Functions ---

/**
 * Genera un ID único simple basado en la fecha y un número aleatorio.
 * @returns {string} Un ID único.
 */
export function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
