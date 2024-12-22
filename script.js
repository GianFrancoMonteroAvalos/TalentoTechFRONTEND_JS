// Generar un array de productos en formato JSON
function generarProductos() {
    return [
        {
            "id": 1,
            "name": "Top Crop Bloom Fertilizante Floración 250ml",
            "description": "Top Bloom de Top Crop es un fertilizante de floración capaz de sorprenderte con cosechas voluminosas y una explosión de grandes cogollos repletos de resina y de sabor. Top Bloom es rico en fósforo y potasio, macronutrientes necesarios para el desarrollo de grandes racimos florales.",
            "amount": 16402,
            "offer": 10,
            "images": [
                "https://http2.mlstatic.com/D_NQ_NP_924209-MLU75592046705_042024-O.webp",
                "https://http2.mlstatic.com/D_NQ_NP_628153-MLU72597795659_102023-O.webp",
                "https://http2.mlstatic.com/D_NQ_NP_963057-MLU75455028027_032024-O.webp"
            ]
        },
        {
            "id": 2,
            "name": "Papel Para Armar Raw Black Connoisseur Tips 1/14 Sedas",
            "description": "Producto: Sedas Raw Black connoisseur 1/14 + filtros tips. Especificaciones: Peso: 0.12 kg. Medidas: 8 cm × 2.5 cm × 1 cm. 50 papeles y 50 tips. Incluye filtros tips y sedas. Tamaño (standard) 1 1/4.",
            "amount": 4500,
            "offer": 5,
            "images": [
                "https://http2.mlstatic.com/D_NQ_NP_816530-MLA52925908152_122022-O.webp"
            ]
        },
        {
            "id": 3,
            "name": "Growtech Led Cultivo Indoor 200w Panel Full Spectrum",
            "description": "Genera menos temperatura/calor, sólido y fuerte, seguridad en conexiones, ahorro de espacio y energía. Recomendado para sistemas de cultivo tipo 'Scrog', 'SOG' o 'supper cropping'.",
            "amount": 161174.7,
            "offer": 0,
            "images": [
                "https://http2.mlstatic.com/D_NQ_NP_773993-MLU78441734014_082024-O.webp",
                "https://http2.mlstatic.com/D_NQ_NP_934988-MLU78441907728_082024-O.webp",
                "https://http2.mlstatic.com/D_NQ_NP_879511-MLA74370081567_022024-O.webp"
            ]
        },
        {
            "id": 4,
            "name": "Growtech Led Cultivo Indoor 600w Panel Full Spectrum",
            "description": "Potencia de 600W reales, cobertura hasta 120x120cm, espectro 380-840nm. Recomendado para etapas de vegetación y floración con distancias óptimas a las plantas.",
            "amount": 481386,
            "offer": 5,
            "images": ["https://http2.mlstatic.com/D_NQ_NP_870737-MLU74245243600_022024-O.webp",
                "https://http2.mlstatic.com/D_NQ_NP_864061-MLU74245223844_022024-O.webp",
                "https://http2.mlstatic.com/D_NQ_NP_848184-MLU74245302950_022024-O.webp"

            ]
        },
        {
            "id": 5,
            "name": "Carpa De Cultivos Indoor 100x100x200cm Bella Vita Lite Tela Mylar",
            "description": "Carpa ideal para cultivos en interiores. Dimensiones: 80x80x160cm, material Mylar premium con reflectividad del 97%, estructura de metal y conectores reforzados. Incluye instrucciones de montaje.",
            "amount": 179999.1,
            "offer": 0,
            "images": [
                "https://http2.mlstatic.com/D_NQ_NP_601269-MLA81329158531_122024-O.webp",
                "https://http2.mlstatic.com/D_NQ_NP_853650-MLA81061462192_122024-O.webp",
                "https://http2.mlstatic.com/D_NQ_NP_968779-MLA81061679354_122024-O.webp"
            ]
        }
    ];    
}

// Renderizar productos como artículos dentro de la sección de productos
function renderizarProductos(productos) {
    const productosGrid = document.getElementById('productos-grid');
    productosGrid.innerHTML = ''; // Limpiar el contenedor antes de renderizar

    productos.forEach(producto => {
        const productoCard = document.createElement('article');
        productoCard.classList.add('producto'); // Mantener la clase para que el CSS aplique

        productoCard.innerHTML = `
            <img src="${producto.images[0] || 'https://via.placeholder.com/150'}" alt="${producto.name}" loading="lazy">
            <h4>${producto.name}</h4>
            <p class="precio">$${producto.amount}</p>
            <button class="btn-descripcion" data-id="${producto.id}">Ver Descripción</button>
            <button class="btn-carrito" data-id="${producto.id}">Añadir al Carrito</button>
        `;

        productosGrid.appendChild(productoCard);
    });

    // Añadir eventos a los botones dinámicamente
    document.querySelectorAll('.btn-descripcion').forEach(boton => {
        boton.addEventListener('click', mostrarDescripcion);
    });

    document.querySelectorAll('.btn-carrito').forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
}

// Mostrar descripción ampliada dentro de la tarjeta del producto
function mostrarDescripcion(event) {
    const idProducto = event.target.dataset.id;
    const producto = productos.find(p => p.id == idProducto);

    const card = event.target.closest('.producto');
    if (!card.querySelector('p.descripcion')) { // Evitar duplicar la descripción
        const descripcionParrafo = document.createElement('p');
        descripcionParrafo.textContent = producto.description;
        descripcionParrafo.classList.add('descripcion');
        card.appendChild(descripcionParrafo);
    }
}

// Inicializar carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para agregar productos al carrito
function agregarAlCarrito(event) {
    const idProducto = event.target.dataset.id;
    const producto = productos.find(p => p.id == idProducto);

    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));

    alert(`${producto.name} ha sido añadido al carrito.`);
}

// Mostrar modal con información
function mostrarModal(titulo, descripcion) {
    document.getElementById('modalTitulo').innerText = titulo;
    document.getElementById('modalTexto').innerText = descripcion;
    document.getElementById('modalDescripcion').style.display = 'flex';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modalDescripcion').style.display = 'none';
}

// Cerrar el modal al hacer clic fuera de él
window.onclick = function (event) {
    const modal = document.getElementById('modalDescripcion');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Inicializar productos y renderizarlos
const productos = generarProductos();
renderizarProductos(productos);
