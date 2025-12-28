/**
 * Utilidades y funciones auxiliares
 */

/**
 * Formatea un precio con separadores de miles
 * @param {number} price - Precio a formatear
 * @param {string} currency - Símbolo de moneda (default: '$')
 * @param {number} decimals - Decimales a mostrar (default: 2)
 * @returns {string} Precio formateado
 */
export function formatPrice(price, currency = '$', decimals = 2) {
    return `${currency}${new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(price)}`;
}

/**
 * Valida si un email es válido
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Debounce function para limitar llamadas a funciones
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function para limitar llamadas a funciones
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Tiempo límite en ms
 * @returns {Function} Función con throttle
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Obtiene un parámetro de la URL
 * @param {string} name - Nombre del parámetro
 * @returns {string|null} Valor del parámetro o null
 */
export function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Scroll suave a un elemento
 * @param {string|HTMLElement} target - Selector o elemento objetivo
 * @param {number} offset - Offset adicional en píxeles
 */
export function smoothScrollTo(target, offset = 0) {
    const element = typeof target === 'string' 
        ? document.querySelector(target) 
        : target;
    
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatPrice,
        isValidEmail,
        debounce,
        throttle,
        getUrlParameter,
        smoothScrollTo
    };
}




