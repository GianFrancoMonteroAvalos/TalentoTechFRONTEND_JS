# GGGrowShop - Tienda Online Modular

Tienda online de grow shop con arquitectura modular y escalable basada en componentes.

## 🏗️ Estructura del Proyecto

```
GGGrowShop/
├── css/
│   ├── components/          # Estilos modulares por componente
│   │   ├── header.css
│   │   ├── products.css
│   │   ├── modal.css
│   │   ├── footer.css
│   │   ├── cart.css
│   │   ├── bienvenida.css
│   │   ├── brands.css
│   │   └── contact.css
│   └── main.css            # Archivo principal que importa todos los componentes
├── js/
│   ├── services/           # Servicios (lógica de negocio)
│   │   ├── ProductService.js    # Gestión de productos
│   │   ├── CartService.js       # Gestión del carrito
│   │   └── UIService.js         # Gestión de UI y notificaciones
│   ├── components/         # Componentes reutilizables
│   │   ├── Header.js           # Componente de encabezado
│   │   ├── ProductCard.js      # Tarjeta de producto
│   │   ├── ProductGrid.js      # Grilla de productos
│   │   ├── CartTable.js        # Tabla del carrito
│   │   └── Footer.js           # Componente de pie de página
│   └── app.js             # Aplicación principal (inicialización)
├── images/                # Imágenes del proyecto
├── index.html             # Página principal
├── carrito.html           # Página del carrito
├── productos.json         # Base de datos de productos
└── README.md              # Este archivo

```

## 🚀 Características

### Arquitectura Modular
- **Servicios**: Lógica de negocio separada y reutilizable
- **Componentes**: UI modular y escalable
- **CSS Modular**: Estilos organizados por componente

### Funcionalidades
- ✅ Catálogo de productos dinámico
- ✅ Carrito de compras con localStorage
- ✅ Notificaciones de usuario
- ✅ Diseño responsive
- ✅ Componentes reutilizables
- ✅ Código escalable y mantenible

## 📦 Componentes Principales

### Servicios

#### ProductService
Gestiona la carga y obtención de productos desde el JSON.

```javascript
const productService = new ProductService();
await productService.loadProducts();
const products = productService.getAllProducts();
```

#### CartService
Gestiona el carrito de compras con persistencia en localStorage.

```javascript
const cartService = new CartService();
cartService.addProduct(product, quantity);
cartService.getTotal();
```

#### UIService
Gestiona notificaciones, modales y actualizaciones de UI.

```javascript
const uiService = new UIService();
uiService.showAlert('Producto agregado', 'success');
```

### Componentes

#### ProductCard
Renderiza una tarjeta de producto individual.

#### ProductGrid
Gestiona la grilla de productos con eventos y renderizado.

#### CartTable
Gestiona la tabla del carrito con actualización en tiempo real.

## 🚀 Inicio Rápido

### Ejecutar el servidor de desarrollo

1. **Abre una terminal** en la carpeta del proyecto

2. **Inicia el servidor**:
```bash
npm start
```

O directamente con Node.js:
```bash
node server.js
```

3. **Abre tu navegador** en:
   - http://localhost:3000
   - http://127.0.0.1:3000

4. **Para detener el servidor**: Presiona `Ctrl+C` en la terminal

### Requisitos
- Node.js instalado (versión 12 o superior)

## 🔧 Uso

### Agregar un nuevo componente

1. Crear el archivo en `js/components/NuevoComponente.js`
2. Exportar la clase o funciones necesarias
3. Importar en `app.js` si es necesario

### Agregar un nuevo servicio

1. Crear el archivo en `js/services/NuevoService.js`
2. Implementar la lógica de negocio
3. Usar en los componentes que lo necesiten

### Agregar estilos

1. Crear archivo en `css/components/nuevo-componente.css`
2. Importar en `css/main.css`

## 📝 Estructura de Datos

### Producto
```json
{
  "id": 1,
  "name": "Nombre del producto",
  "description": "Descripción del producto",
  "amount": 10000,
  "offer": 10,
  "images": ["url1", "url2"]
}
```

### Carrito
Los productos en el carrito incluyen una propiedad `cantidad` adicional:
```json
{
  "id": 1,
  "name": "Nombre del producto",
  "amount": 10000,
  "cantidad": 2
}
```

## 🎨 Personalización

### Colores principales
- **Primario**: `#632A81` (Violeta)
- **Secundario**: `#2CE6C2` (Turquesa)
- **Fondo**: Gradiente de `#0d0d0d` a `#212121`

### Fuentes
- **Principal**: Poppins, Roboto
- **Fallback**: sans-serif

## 🔄 Mejoras Futuras

- [ ] Sistema de categorías de productos
- [ ] Búsqueda de productos
- [ ] Filtros avanzados
- [ ] Paginación de productos
- [ ] Sistema de autenticación
- [ ] Panel de administración
- [ ] Integración con API backend
- [ ] Tests unitarios
- [ ] Optimización de imágenes
- [ ] PWA (Progressive Web App)

## 📄 Licencia

Este proyecto es privado y propiedad de GGGrowShop.

## 👨‍💻 Desarrollo

Para desarrollar nuevas funcionalidades:

1. Seguir la estructura modular existente
2. Mantener la separación de responsabilidades
3. Documentar funciones y clases
4. Usar nombres descriptivos
5. Mantener el código escalable

---

**Versión**: 2.0.0  
**Última actualización**: 2024

