/**
 * js/components/dashboard.js
 * Lógica y UI para el Dashboard principal.
 */

import { renderComponent, loadData } from '../utils.js';

/**
 * Calcula el puntaje de completitud para un componente específico.
 * @param {string} componentName - El nombre del componente (ej: 'vision', 'people').
 * @returns {number} - Un porcentaje de 0 a 100.
 */
function calculateComponentScore(componentName) {
    const data = loadData(componentName);
    if (!data) return 0;

    switch (componentName) {
        case 'vision':
            // El V/TO tiene 8 secciones. Damos 12.5% por cada una que no esté vacía.
            const visionSections = ['coreValues', 'coreFocus', 'tenYearTarget', 'marketingStrategy', 'threeYearPicture', 'oneYearPlan', 'rocks', 'issues'];
            let visionScore = 0;
            if (data.vto) {
                visionSections.forEach(section => {
                    if (data.vto[section] && ( (Array.isArray(data.vto[section]) && data.vto[section].length > 0) || (typeof data.vto[section] === 'object' && Object.keys(data.vto[section]).length > 0) || (typeof data.vto[section] === 'string' && data.vto[section] !== ''))) {
                       visionScore += 12.5;
                    }
                });
            }
            return Math.min(100, Math.round(visionScore));
        
        case 'people':
            // 50% por el Accountability Chart, 50% si hay al menos una persona analizada.
            let peopleScore = 0;
            if (data.accountabilityChart && data.accountabilityChart.length > 0 && data.accountabilityChart.some(r => r.role || r.name)) peopleScore += 50;
            if (data.peopleAnalyzer && data.peopleAnalyzer.length > 0 && data.peopleAnalyzer.some(p => p.name)) peopleScore += 50;
            return peopleScore;

        case 'data':
            // 20% por cada métrica definida en el Scorecard, hasta un máximo de 5 (100%).
            const scorecard = data; // data is the scorecard array itself
            if (Array.isArray(scorecard)) {
                return Math.min(100, scorecard.length * 20);
            }
            return 0;

        case 'issues':
            // Puntuación basada en la proporción de asuntos resueltos.
            const issues = data; // data is the issues array
            if (Array.isArray(issues) && issues.length > 0) {
                const solvedCount = issues.filter(i => i.status === 'solved').length;
                return Math.round((solvedCount / issues.length) * 100);
            }
            return issues.length === 0 ? 100 : 0; // 100% si no hay asuntos.

        case 'processes':
            // 25% por cada proceso documentado, hasta un máximo de 4 (100%).
            const processes = data; // data is the processes array
            if (Array.isArray(processes)) {
                return Math.min(100, processes.length * 25);
            }
            return 0;

        case 'traction':
            // 25% por cada Rock definida, hasta un máximo de 4 (100%).
            const rocks = data; // data is the rocks array
            if (Array.isArray(rocks)) {
                return Math.min(100, rocks.length * 25);
            }
            return 0;

        default:
            return 0;
    }
}

/**
 * Genera el HTML para una tarjeta de componente individual.
 * @param {object} component - Objeto con la info del componente.
 * @returns {string} - El string de HTML para la tarjeta.
 */
function createComponentCard({ id, title, icon, description, score, link }) {
    const scoreColor = score > 79 ? 'bg-green-500' : score > 49 ? 'bg-yellow-500' : 'bg-red-500';
    return `
        <div class="component-container transform hover:-translate-y-1 transition-transform duration-200">
            <a href="${link}" class="block">
                <div class="flex items-center mb-4">
                    <i data-lucide="${icon}" class="h-8 w-8 text-blue-600 mr-4"></i>
                    <h3 class="text-xl font-bold text-gray-800">${title}</h3>
                </div>
                <p class="text-gray-600 text-sm mb-4 h-10">${description}</p>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="${scoreColor} h-2.5 rounded-full" style="width: ${score}%"></div>
                </div>
                <div class="text-right text-sm font-semibold text-gray-700 mt-2">${score}% Completo</div>
            </a>
        </div>
    `;
}

/**
 * Renderiza el componente del Dashboard en el DOM.
 */
export function renderDashboard() {
    const components = [
        { id: 'vision', title: 'Visión', icon: 'eye', description: 'Define quién eres, a dónde vas y cómo llegarás allí.', link: '#/vision' },
        { id: 'people', title: 'Personas', icon: 'users', description: 'Asegura tener a las personas correctas en los puestos correctos.', link: '#/people' },
        { id: 'data', title: 'Datos', icon: 'bar-chart-3', description: 'Mide tus actividades y obtén un pulso absoluto de tu negocio.', link: '#/data' },
        { id: 'issues', title: 'Asuntos', icon: 'alert-triangle', description: 'Fortalece tu habilidad para identificar y resolver problemas.', link: '#/issues' },
        { id: 'process', title: 'Procesos', icon: 'recycle', description: 'Sistema y documenta tu manera de hacer negocios.', link: '#/process' },
        { id: 'traction', title: 'Tracción', icon: 'target', description: 'Ejecuta con disciplina y rendición de cuentas para hacer realidad la visión.', link: '#/traction' },
    ];

    // Calcula el puntaje para cada componente
    components.forEach(c => c.score = calculateComponentScore(c.id));
    
    const overallScore = Math.round(components.reduce((sum, c) => sum + c.score, 0) / components.length);

    const html = `
        <div>
            <div class="mb-8 p-6 bg-white rounded-xl shadow-md">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Progreso General de EOS</h2>
                <p class="text-gray-600 mb-4">Tu progreso total en la implementación de los Seis Componentes Clave.</p>
                <div class="w-full bg-gray-200 rounded-full h-4">
                    <div class="bg-blue-600 h-4 rounded-full text-center text-white text-xs font-bold" style="width: ${overallScore}%">${overallScore}%</div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${components.map(createComponentCard).join('')}
            </div>
        </div>
    `;

    renderComponent(html);
    // Re-inicializar los íconos de Lucide después de renderizar
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
