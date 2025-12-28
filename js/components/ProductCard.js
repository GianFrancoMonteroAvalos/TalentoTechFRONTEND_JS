/**
 * Componente ProductCard
 * Renderiza una tarjeta de producto
 */
class ProductCard {
    /**
     * Renderiza una tarjeta de producto
     * @param {Object} product - Objeto del producto
     * @param {Function} onAddToCart - Callback al agregar al carrito
     * @param {Function} onShowDescription - Callback al mostrar descripción
     * @returns {string} HTML de la tarjeta
     */
    static render(product, onAddToCart, onShowDescription) {
        const image = product.images && product.images[0] 
            ? product.images[0] 
            : 'https://via.placeholder.com/150';
        
        const price = this.formatPrice(product.amount);
        const hasOffer = product.offer && product.offer > 0;
        const offerPrice = hasOffer 
            ? this.formatPrice(product.amount * (1 - product.offer / 100))
            : null;

        return `
            <article class="producto" data-product-id="${product.id}">
                <img src="${image}" 
                     alt="${product.name}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/150'">
                <h4>${product.name}</h4>
                <div class="price-container">
                    ${hasOffer ? `
                        <p class="precio original-price">$${price}</p>
                        <p class="precio offer-price">$${offerPrice} <span class="offer-badge">-${product.offer}%</span></p>
                    ` : `
                        <p class="precio">$${price}</p>
                    `}
                </div>
                <button class="btn-descripcion" 
                        data-id="${product.id}" 
                        aria-label="Ver descripción de ${product.name}">
                    Ver Descripción
                </button>
                <button class="btn-carrito" 
                        data-id="${product.id}"
                        aria-label="Agregar ${product.name} al carrito">
                    Añadir al Carrito
                </button>
            </article>
        `;
    }

    /**
     * Formatea el precio con separadores de miles
     * @param {number} price - Precio a formatear
     * @returns {string} Precio formateado
     */
    static formatPrice(price) {
        return new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(price);
    }

    /**
     * Renderiza la descripción expandida en la tarjeta
     * @param {HTMLElement} cardElement - Elemento de la tarjeta
     * @param {string} description - Descripción del producto
     */
    static showDescription(cardElement, description) {
        // Eliminar descripción existente si hay
        const existingDesc = cardElement.querySelector('p.descripcion');
        if (existingDesc) {
            existingDesc.remove();
        }

        const descripcionParrafo = document.createElement('p');
        descripcionParrafo.textContent = description;
        descripcionParrafo.classList.add('descripcion');
        cardElement.appendChild(descripcionParrafo);
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductCard;
}




