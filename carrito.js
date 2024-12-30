// Este código asume que los elementos de carrito y sus precios están correctamente cargados en el DOM.

document.addEventListener("DOMContentLoaded", function () {
    // Función para calcular el total
    function calcularTotal() {
        let total = 0;
        const filas = document.querySelectorAll('#cart-table tbody tr');  // Selecciona las filas del carrito

        filas.forEach(function (fila) {
            const cantidad = parseInt(fila.querySelector('.cantidad').textContent) || 0;  // Asegura que cantidad sea un número
            const precio = parseFloat(fila.querySelector('.precio').textContent.replace('$', '').trim()) || 0;  // Asegura que precio sea un número

            // Multiplica cantidad por precio y añade al total
            total += cantidad * precio;
        });

        // Actualiza el total en el HTML
        document.getElementById('total-amount').textContent = total.toFixed(2);  // Redondear a 2 decimales
    }

    // Llama a calcularTotal al cargar la página
    calcularTotal();
});



// Función para cargar el carrito desde localStorage
function cargarCarrito() {
    const carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : [];
}

// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
    let carrito = cargarCarrito();

    // Verificar si el producto ya está en el carrito (comparar por ID, no por nombre)
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        // Si el producto ya existe, aumentar la cantidad
        productoExistente.cantidad += producto.cantidad;
    } else {
        // Si no existe, agregarlo al carrito
        carrito.push(producto);
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar la vista del carrito
    mostrarCarrito();
}

// Función para mostrar los productos en el carrito
function mostrarCarrito() {
    const carrito = cargarCarrito();
    const tabla = document.getElementById('cart-table').getElementsByTagName('tbody')[0];
    tabla.innerHTML = ''; // Limpiamos la tabla antes de agregar los productos

    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach(producto => {
        if (!producto.amount || isNaN(producto.amount)) {
            producto.amount = 0; // Asignar 0 si el precio no está definido correctamente
        }

        const fila = tabla.insertRow();
        fila.innerHTML = `
            <td>
                <img src="${producto.images[0]}" alt="${producto.name}" class="producto-imagen">
                ${producto.name}
            </td>
            <td><input type="number" value="${producto.cantidad}" class="form-control cantidad" data-id="${producto.id}" min="1"></td>
            <td>$${(producto.amount * producto.cantidad).toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm eliminar" data-id="${producto.id}">Eliminar</button></td>
        `;
        
        total += producto.amount * producto.cantidad;
        cantidadTotal += producto.cantidad;
    });

    // Actualizamos el total y la cantidad total de productos
    document.getElementById('total-amount').textContent = total.toFixed(2);
    document.getElementById('cart-count').textContent = cantidadTotal;
}

// Evento para escuchar cambios en las cantidades
document.addEventListener('input', (event) => {
    if (event.target.classList.contains('cantidad')) {
        const id = parseInt(event.target.getAttribute('data-id'));
        const cantidad = parseInt(event.target.value);
        actualizarCantidad(id, cantidad);
    }
});

// Función para actualizar la cantidad de un producto en el carrito
function actualizarCantidad(id, cantidad) {
    let carrito = cargarCarrito();
    carrito = carrito.map(producto => {
        if (producto.id === id) {
            producto.cantidad = cantidad;
        }
        return producto;
    });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

// Evento para eliminar productos del carrito
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminar')) {
        const id = parseInt(event.target.getAttribute('data-id'));
        eliminarProducto(id);
    }
});

// Función para eliminar un producto del carrito
function eliminarProducto(id) {
    let carrito = cargarCarrito();
    carrito = carrito.filter(producto => producto.id !== id);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

// Llamar a la función para mostrar los productos del carrito cuando se carga la página
mostrarCarrito();
