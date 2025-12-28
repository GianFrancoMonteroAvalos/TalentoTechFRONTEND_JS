/**
 * Servicio para gestionar productos
 * Maneja la carga y obtención de productos desde el JSON
 */
class ProductService {
    constructor() {
        this.products = [];
        this.productsUrl = './productos.json';
    }

    /**
     * Carga los productos desde el archivo JSON
     * @returns {Promise<Array>} Array de productos
     */
    async loadProducts() {
        try {
            const response = await fetch(this.productsUrl);
            if (!response.ok) {
                throw new Error(`Error al cargar productos: ${response.status}`);
            }
            this.products = await response.json();
            return this.products;
        } catch (error) {
            console.error('Error al cargar productos:', error);
            return [];
        }
    }

    /**
     * Obtiene todos los productos
     * @returns {Array} Array de productos
     */
    getAllProducts() {
        return this.products;
    }

    /**
     * Busca un producto por ID
     * @param {number} id - ID del producto
     * @returns {Object|null} Producto encontrado o null
     */
    getProductById(id) {
        return this.products.find(p => p.id == id) || null;
    }

    /**
     * Filtra productos por categoría
     * @param {string} category - Categoría a filtrar
     * @returns {Array} Array de productos filtrados
     */
    getProductsByCategory(category) {
        // Por ahora retorna todos, pero se puede extender con categorías
        return this.products;
    }

    /**
     * Busca productos por término
     * @param {string} searchTerm - Término de búsqueda
     * @returns {Array} Array de productos encontrados
     */
    searchProducts(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term)
        );
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductService;
}

