/**
 * Aplicación principal
 * Inicializa servicios y componentes
 */
class App {
    constructor() {
        this.productService = new ProductService();
        this.cartService = new CartService();
        this.uiService = new UIService();
        this.productGrid = null;
        this.cartTable = null;
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        // Configurar listeners globales
        this.setupGlobalListeners();
        
        // Actualizar contador del carrito
        this.updateCartCount();

        // Inicializar componentes según la página
        if (document.getElementById('productos-grid')) {
            this.initProductGrid();
        }

        if (document.getElementById('cart-table')) {
            this.initCartTable();
        }

        // Configurar cierre de modal
        this.setupModal();
    }

    /**
     * Configura listeners globales
     */
    setupGlobalListeners() {
        // Escuchar cambios en el carrito
        window.addEventListener('cartChanged', (event) => {
            this.updateCartCount();
        });
    }

    /**
     * Inicializa el grid de productos
     */
    initProductGrid() {
        this.productGrid = new ProductGrid(
            this.productService,
            this.cartService,
            this.uiService
        );
        this.productGrid.init('#productos-grid');
    }

    /**
     * Inicializa la tabla del carrito
     */
    initCartTable() {
        this.cartTable = new CartTable(
            this.cartService,
            this.uiService
        );
        this.cartTable.init();
    }

    /**
     * Actualiza el contador del carrito
     */
    updateCartCount() {
        const count = this.cartService.getTotalItems();
        this.uiService.updateCartCount(count);
    }

    /**
     * Configura el modal
     */
    setupModal() {
        const modal = document.getElementById('modalDescripcion');
        if (modal) {
            // Cerrar modal al hacer click fuera
            window.onclick = (event) => {
                if (event.target === modal) {
                    this.uiService.closeModal();
                }
            };
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
let appInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    appInstance = new App();
    appInstance.init();
    window.app = appInstance; // Hacer disponible globalmente
});

// Hacer disponible globalmente para funciones inline si es necesario
window.cerrarModal = function() {
    if (window.app && window.app.uiService) {
        window.app.uiService.closeModal();
    } else {
        const modal = document.getElementById('modalDescripcion');
        if (modal) {
            modal.style.display = 'none';
        }
    }
};

