/**
 * Servicio para gestionar el carrito de compras
 * Maneja el almacenamiento en localStorage y operaciones del carrito
 */
class CartService {
    constructor() {
        this.storageKey = 'carrito';
        this.cart = this.loadCart();
    }

    /**
     * Carga el carrito desde localStorage
     * @returns {Array} Array de productos en el carrito
     */
    loadCart() {
        try {
            const cartData = localStorage.getItem(this.storageKey);
            const cart = cartData ? JSON.parse(cartData) : [];
            // Asegurar que todos los productos tengan cantidad
            return cart.map(item => ({
                ...item,
                cantidad: item.cantidad || 1
            }));
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            return [];
        }
    }

    /**
     * Guarda el carrito en localStorage
     */
    saveCart() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
            this.notifyCartChange();
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
        }
    }

    /**
     * Obtiene todos los productos del carrito
     * @returns {Array} Array de productos en el carrito
     */
    getCart() {
        return this.cart;
    }

    /**
     * Agrega un producto al carrito
     * @param {Object} product - Producto a agregar
     * @param {number} quantity - Cantidad (default: 1)
     * @returns {boolean} true si se agregó correctamente
     */
    addProduct(product, quantity = 1) {
        if (!product || !product.id) {
            console.error('Producto inválido');
            return false;
        }

        const existingProduct = this.cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.cantidad = (existingProduct.cantidad || 1) + quantity;
        } else {
            this.cart.push({
                ...product,
                cantidad: quantity
            });
        }

        this.saveCart();
        return true;
    }

    /**
     * Actualiza la cantidad de un producto en el carrito
     * @param {number} productId - ID del producto
     * @param {number} quantity - Nueva cantidad
     * @returns {boolean} true si se actualizó correctamente
     */
    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            return this.removeProduct(productId);
        }

        const product = this.cart.find(item => item.id === productId);
        if (product) {
            product.cantidad = quantity;
            this.saveCart();
            return true;
        }
        return false;
    }

    /**
     * Elimina un producto del carrito
     * @param {number} productId - ID del producto a eliminar
     * @returns {boolean} true si se eliminó correctamente
     */
    removeProduct(productId) {
        const initialLength = this.cart.length;
        this.cart = this.cart.filter(item => item.id !== productId);
        
        if (this.cart.length !== initialLength) {
            this.saveCart();
            return true;
        }
        return false;
    }

    /**
     * Limpia todo el carrito
     */
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    /**
     * Obtiene el total de items en el carrito
     * @returns {number} Total de items
     */
    getTotalItems() {
        return this.cart.reduce((total, item) => total + (item.cantidad || 1), 0);
    }

    /**
     * Calcula el total del carrito
     * @returns {number} Total en pesos
     */
    getTotal() {
        return this.cart.reduce((total, item) => {
            const price = parseFloat(item.amount) || 0;
            const quantity = item.cantidad || 1;
            return total + (price * quantity);
        }, 0);
    }

    /**
     * Notifica cambios en el carrito a los listeners
     */
    notifyCartChange() {
        const event = new CustomEvent('cartChanged', {
            detail: {
                cart: this.cart,
                totalItems: this.getTotalItems(),
                total: this.getTotal()
            }
        });
        window.dispatchEvent(event);
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartService;
}

