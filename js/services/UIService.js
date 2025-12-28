/**
 * Servicio para gestionar la UI y notificaciones
 */
class UIService {
    constructor() {
        this.alertContainer = null;
        this.initAlertContainer();
    }

    /**
     * Inicializa el contenedor de alertas si existe
     */
    initAlertContainer() {
        this.alertContainer = document.getElementById('alert-container');
        if (!this.alertContainer) {
            // Crear contenedor si no existe
            this.alertContainer = document.createElement('div');
            this.alertContainer.id = 'alert-container';
            this.alertContainer.className = 'position-fixed top-0 start-50 translate-middle-x mt-3';
            this.alertContainer.style.zIndex = '1050';
            document.body.appendChild(this.alertContainer);
        }
    }

    /**
     * Muestra una alerta de Bootstrap
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de alerta (success, danger, warning, info)
     * @param {number} duration - Duración en milisegundos (default: 3000)
     */
    showAlert(message, type = 'success', duration = 3000) {
        if (!this.alertContainer) {
            this.initAlertContainer();
        }

        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.setAttribute('role', 'alert');
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        this.alertContainer.appendChild(alert);

        // Eliminar la alerta después de la duración especificada
        setTimeout(() => {
            alert.remove();
        }, duration);
    }

    /**
     * Muestra un modal
     * @param {string} title - Título del modal
     * @param {string} content - Contenido del modal
     */
    showModal(title, content) {
        const modal = document.getElementById('modalDescripcion');
        if (modal) {
            const modalTitle = document.getElementById('modalTitulo');
            const modalText = document.getElementById('modalTexto');
            
            if (modalTitle) modalTitle.textContent = title;
            if (modalText) modalText.textContent = content;
            
            modal.style.display = 'flex';
        }
    }

    /**
     * Cierra el modal
     */
    closeModal() {
        const modal = document.getElementById('modalDescripcion');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Actualiza el contador del carrito en el header
     * @param {number} count - Cantidad de items
     */
    updateCartCount(count) {
        const cartCountElements = document.querySelectorAll('#cart-count');
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    }

    /**
     * Muestra un loading spinner
     * @param {HTMLElement} container - Contenedor donde mostrar el loading
     */
    showLoading(container) {
        if (!container) return;
        
        container.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="min-height: 200px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>
        `;
    }

    /**
     * Oculta el loading
     * @param {HTMLElement} container - Contenedor donde ocultar el loading
     */
    hideLoading(container) {
        // El loading se oculta automáticamente cuando se reemplaza el contenido
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIService;
}




