/**
 * Componente Header
 * Renderiza el encabezado de la página con navegación y carrito
 */
class Header {
    constructor() {
        this.navItems = [
            { text: 'SEMILLAS', href: '#' },
            { text: 'VAPORIZADORES', href: '#' },
            { text: 'INDOOR', href: '#' },
            { text: 'PARAFERNALIA', href: '#' },
            { text: 'CULTIVO', href: '#' }
        ];
    }

    /**
     * Renderiza el header
     * @param {Object} options - Opciones de configuración
     * @param {string} options.bannerText - Texto del banner
     * @param {boolean} options.showHomeLink - Mostrar link al home
     * @returns {string} HTML del header
     */
    render(options = {}) {
        const {
            bannerText = 'HASTA 3 Y 6 CUOTAS SIN INTERÉS. ENVÍOS A TODO EL PAÍS.',
            showHomeLink = false
        } = options;

        const homeLink = showHomeLink 
            ? `<a href="index.html" class="no-link"><h1>GGGrowShop</h1></a>`
            : `<h1>GGGrowShop</h1>`;

        return `
            <header>
                <div class="banner">
                    <p id="scrolling-text">${bannerText}</p>
                </div>
                ${homeLink}
                <div class="cart-icon position-absolute top-0 end-0 p-4">
                    <a href="carrito.html" class="position-relative">
                        <img src="https://img.icons8.com/?size=100&id=Ot2P5D5MPltM&format=png&color=FFFFFF" 
                             alt="Carrito" 
                             style="width: 40px; height: 40px;">
                        <span id="cart-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>
                    </a>
                </div>
                <nav>
                    <div class="nav-links">
                        <ul>
                            ${this.navItems.map(item => `
                                <li><a href="${item.href}">${item.text}</a></li>
                            `).join('')}
                        </ul>
                    </div>
                </nav>
            </header>
        `;
    }

    /**
     * Actualiza el contador del carrito
     * @param {number} count - Cantidad de items
     */
    updateCartCount(count) {
        const cartCountElements = document.querySelectorAll('#cart-count');
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Header;
}




