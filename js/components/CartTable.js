/**
 * Componente CartTable
 * Renderiza la tabla del carrito de compras
 */
class CartTable {
    constructor(cartService, uiService) {
        this.cartService = cartService;
        this.uiService = uiService;
        this.tableBody = null;
        this.totalElement = null;
    }

    /**
     * Inicializa el componente
     */
    init() {
        const table = document.getElementById('cart-table');
        if (table) {
            this.tableBody = table.getElementsByTagName('tbody')[0];
        }
        
        this.totalElement = document.getElementById('total-amount');
        
        this.setupEventListeners();
        this.render();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Delegación de eventos para botones y inputs dinámicos
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('eliminar')) {
                this.handleRemoveProduct(e);
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('cantidad')) {
                this.handleQuantityChange(e);
            }
        });

        // Escuchar cambios en el carrito
        window.addEventListener('cartChanged', () => {
            this.render();
        });
    }

    /**
     * Maneja el evento de eliminar producto
     * @param {Event} event - Evento del click
     */
    handleRemoveProduct(event) {
        const productId = parseInt(event.target.dataset.id);
        const product = this.cartService.getCart().find(p => p.id === productId);
        
        if (product && confirm(`¿Eliminar ${product.name} del carrito?`)) {
            this.cartService.removeProduct(productId);
            this.uiService.showAlert(`${product.name} eliminado del carrito`, 'info');
        }
    }

    /**
     * Maneja el cambio de cantidad
     * @param {Event} event - Evento del input
     */
    handleQuantityChange(event) {
        const productId = parseInt(event.target.dataset.id);
        const quantity = parseInt(event.target.value) || 1;
        
        if (quantity < 1) {
            event.target.value = 1;
            return;
        }

        this.cartService.updateQuantity(productId, quantity);
    }

    /**
     * Renderiza la tabla del carrito
     */
    render() {
        if (!this.tableBody) {
            console.error('Tabla del carrito no encontrada');
            return;
        }

        const cart = this.cartService.getCart();
        
        if (cart.length === 0) {
            this.tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">
                        <p>Tu carrito está vacío.</p>
                        <a href="index.html" class="btn btn-primary">Seguir comprando</a>
                    </td>
                </tr>
            `;
            this.updateTotal(0);
            return;
        }

        this.tableBody.innerHTML = cart.map(product => {
            const image = product.images && product.images[0] 
                ? product.images[0] 
                : 'https://via.placeholder.com/50';
            const quantity = product.cantidad || 1;
            const price = parseFloat(product.amount) || 0;
            const subtotal = price * quantity;

            return `
                <tr>
                    <td>
                        <img src="${image}" 
                             alt="${product.name}" 
                             class="producto-imagen"
                             onerror="this.src='https://via.placeholder.com/50'">
                        ${product.name}
                    </td>
                    <td>
                        <input type="number" 
                               value="${quantity}" 
                               class="form-control cantidad" 
                               data-id="${product.id}" 
                               min="1"
                               style="width: 80px;">
                    </td>
                    <td class="precio">$${this.formatPrice(subtotal)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm eliminar" 
                                data-id="${product.id}"
                                aria-label="Eliminar ${product.name}">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        this.updateTotal(this.cartService.getTotal());
    }

    /**
     * Actualiza el total mostrado
     * @param {number} total - Total a mostrar
     */
    updateTotal(total) {
        if (this.totalElement) {
            this.totalElement.textContent = this.formatPrice(total);
        }
    }

    /**
     * Formatea el precio con separadores de miles
     * @param {number} price - Precio a formatear
     * @returns {string} Precio formateado
     */
    formatPrice(price) {
        return new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartTable;
}




