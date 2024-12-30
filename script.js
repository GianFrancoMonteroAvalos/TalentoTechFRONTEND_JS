// Declarar productos como una variable global
let productos = []; 

// Inicializar carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

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

    // Validar que productos sea un arreglo
    if (!Array.isArray(productos)) {
        console.error('La lista de productos no está cargada correctamente.');
        return;
    }

    const producto = productos.find(p => p.id == idProducto);

    if (!producto) {
        console.error('Producto no encontrado.');
        return;
    }

    const card = event.target.closest('.producto');
    if (!card.querySelector('p.descripcion')) { // Evitar duplicar la descripción
        const descripcionParrafo = document.createElement('p');
        descripcionParrafo.textContent = producto.description;
        descripcionParrafo.classList.add('descripcion');
        card.appendChild(descripcionParrafo);
    }
}

// Función para agregar productos al carrito
function agregarAlCarrito(event) {
    const idProducto = event.target.dataset.id;

    // Validar que productos sea un arreglo
    if (!Array.isArray(productos)) {
        console.error('La lista de productos no está cargada correctamente.');
        return;
    }

    const producto = productos.find(p => p.id == idProducto);

    if (!producto) {
        console.error('Producto no encontrado.');
        return;
    }

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

// Función para cargar productos desde un archivo JSON
async function cargarProductos() {
    try {
        const respuesta = await fetch('./productos.json'); // Ruta del archivo JSON
        productos = await respuesta.json(); // Asignar los productos al arreglo global
        renderizarProductos(productos); // Llamar a la función para renderizar los productos
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Llamar a cargarProductos al iniciar
cargarProductos();
// Función para mostrar alerta de Bootstrap
function mostrarAlerta(mensaje) {
    const alertContainer = document.getElementById('alert-container');
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-success alert-dismissible fade show';
    alerta.setAttribute('role', 'alert');
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertContainer.appendChild(alerta);

    // Eliminar la alerta después de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = carrito.length;
}

// Función para agregar productos al carrito
function agregarAlCarrito(event) {
    const idProducto = event.target.dataset.id;

    // Validar que productos sea un arreglo
    if (!Array.isArray(productos)) {
        console.error('La lista de productos no está cargada correctamente.');
        return;
    }

    const producto = productos.find(p => p.id == idProducto);

    if (!producto) {
        console.error('Producto no encontrado.');
        return;
    }

    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));

    mostrarAlerta(`${producto.name} ha sido añadido al carrito.`);
    actualizarContadorCarrito();
}

// Inicializar el contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);
