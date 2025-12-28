/**
 * Componente ProductGrid
 * Renderiza una grilla de productos
 */
class ProductGrid {
    constructor(productService, cartService, uiService) {
        this.productService = productService;
        this.cartService = cartService;
        this.uiService = uiService;
        this.container = null;
    }

    /**
     * Inicializa el componente
     * @param {string|HTMLElement} containerSelector - Selector o elemento del contenedor
     */
    init(containerSelector) {
        if (typeof containerSelector === 'string') {
            this.container = document.querySelector(containerSelector);
        } else {
            this.container = containerSelector;
        }

        if (!this.container) {
            console.error('Contenedor de productos no encontrado');
            return;
        }

        this.setupEventListeners();
        this.loadProducts();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Delegación de eventos para botones dinámicos
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-carrito')) {
                this.handleAddToCart(e);
            } else if (e.target.classList.contains('btn-descripcion')) {
                this.handleShowDescription(e);
            }
        });
    }

    /**
     * Maneja el evento de agregar al carrito
     * @param {Event} event - Evento del click
     */
    handleAddToCart(event) {
        const productId = parseInt(event.target.dataset.id);
        const product = this.productService.getProductById(productId);

        if (product) {
            const added = this.cartService.addProduct(product, 1);
            if (added) {
                this.uiService.showAlert(`${product.name} ha sido añadido al carrito.`);
            }
        }
    }

    /**
     * Maneja el evento de mostrar descripción
     * @param {Event} event - Evento del click
     */
    handleShowDescription(event) {
        const productId = parseInt(event.target.dataset.id);
        const product = this.productService.getProductById(productId);

        if (product) {
            const card = event.target.closest('.producto');
            if (card) {
                ProductCard.showDescription(card, product.description);
            }
        }
    }

    /**
     * Carga y renderiza los productos
     */
    async loadProducts() {
        this.uiService.showLoading(this.container);
        
        try {
            await this.productService.loadProducts();
            const products = this.productService.getAllProducts();
            this.render(products);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            this.container.innerHTML = `
                <div class="error-message">
                    <p>Error al cargar los productos. Por favor, recarga la página.</p>
                </div>
            `;
        }
    }

    /**
     * Renderiza los productos en la grilla
     * @param {Array} products - Array de productos
     */
    render(products) {
        if (!products || products.length === 0) {
            this.container.innerHTML = `
                <div class="no-products">
                    <p>No hay productos disponibles.</p>
                </div>
            `;
            return;
        }

        this.container.innerHTML = products.map(product => 
            ProductCard.render(
                product,
                (product) => this.cartService.addProduct(product, 1),
                (product) => this.uiService.showModal(product.name, product.description)
            )
        ).join('');
    }

    /**
     * Filtra y renderiza productos
     * @param {Function} filterFn - Función de filtrado
     */
    filter(filterFn) {
        const products = this.productService.getAllProducts();
        const filtered = products.filter(filterFn);
        this.render(filtered);
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductGrid;
}




