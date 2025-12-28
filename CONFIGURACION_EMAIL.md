# Configuración de Email para Pedidos

Este documento explica cómo configurar el sistema de envío de emails al dueño cuando un cliente sin sesión completa un pedido.

## Opción 1: EmailJS (Recomendado - Escalable y Listo para Producción)

EmailJS es la mejor opción porque:
- ✅ Gratis hasta 200 emails/mes
- ✅ Escalable (planes desde $15/mes)
- ✅ No requiere backend
- ✅ Templates personalizables
- ✅ Funciona directamente desde el frontend
- ✅ Listo para producción

### Pasos para configurar EmailJS:

1. **Crear cuenta en EmailJS**
   - Ve a: https://www.emailjs.com/
   - Crea una cuenta gratuita

2. **Configurar un servicio de email**
   - En el dashboard, ve a "Email Services"
   - Conecta tu proveedor de email (Gmail, Outlook, etc.)
   - Copia el **Service ID**

3. **Crear un template de email**
   - Ve a "Email Templates"
   - Crea un nuevo template
   - Usa estas variables en el template:
     ```
     {{to_email}} - Email del dueño
     {{order_number}} - Número de pedido
     {{customer_name}} - Nombre del cliente
     {{customer_email}} - Email del cliente
     {{customer_phone}} - Teléfono del cliente
     {{customer_address}} - Dirección del cliente
     {{shipping_address}} - Dirección de retiro
     {{order_items}} - Lista de productos
     {{items_count}} - Cantidad de productos
     {{subtotal}} - Subtotal
     {{shipping_cost}} - Costo de envío
     {{total}} - Total
     {{notes}} - Notas del pedido
     {{order_date}} - Fecha del pedido
     {{order_url}} - URL de seguimiento
     ```
   - Copia el **Template ID**

4. **Obtener la Public Key**
   - Ve a "Account" > "General"
   - Copia tu **Public Key**

5. **Configurar en el código**
   - Abre `js/services/OwnerEmailService.js`
   - Reemplaza las siguientes líneas:
     ```javascript
     this.emailjsConfig = {
         serviceId: 'YOUR_SERVICE_ID', // ← Tu Service ID
         templateId: 'YOUR_TEMPLATE_ID', // ← Tu Template ID
         publicKey: 'YOUR_PUBLIC_KEY' // ← Tu Public Key
     };
     this.ownerEmail = 'tu-email@gggrowshop.com'; // ← Tu email
     ```

### Ejemplo de Template para EmailJS:

**Asunto:**
```
Nuevo Pedido: {{order_number}}
```

**Cuerpo (HTML):**
```html
<h2>Nuevo Pedido Recibido</h2>

<h3>Información del Cliente</h3>
<p><strong>Nombre:</strong> {{customer_name}}</p>
<p><strong>Email:</strong> {{customer_email}}</p>
<p><strong>Teléfono:</strong> {{customer_phone}}</p>
<p><strong>Dirección:</strong> {{customer_address}}</p>

<h3>Detalles del Pedido</h3>
<p><strong>Número de Pedido:</strong> {{order_number}}</p>
<p><strong>Fecha:</strong> {{order_date}}</p>

<h4>Productos:</h4>
<pre>{{order_items}}</pre>

<h3>Resumen Financiero</h3>
<p><strong>Subtotal:</strong> {{subtotal}}</p>
<p><strong>Envío:</strong> {{shipping_cost}}</p>
<p><strong>Total:</strong> {{total}}</p>

<p><strong>Dirección de Retiro:</strong> {{shipping_address}}</p>
<p><strong>Notas:</strong> {{notes}}</p>

<p><a href="{{order_url}}">Ver pedido completo</a></p>
```

---

## Opción 2: Formspree (Alternativa Simple)

Formspree es más simple pero menos escalable:
- ✅ Gratis hasta 50 envíos/mes
- ✅ Muy fácil de configurar
- ⚠️ Menos personalizable
- ⚠️ Menos escalable

### Pasos para configurar Formspree:

1. **Crear cuenta en Formspree**
   - Ve a: https://formspree.io/
   - Crea una cuenta gratuita

2. **Crear un nuevo formulario**
   - Crea un nuevo formulario
   - Copia el **Form ID** (ejemplo: `f/mrbgaklo`)

3. **Configurar en el código**
   - Abre `js/services/OwnerEmailService.js`
   - Busca la línea:
     ```javascript
     const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';
     ```
   - Reemplaza `YOUR_FORM_ID` con tu Form ID

4. **Configurar email del dueño**
   - En Formspree, configura el email donde recibirás los pedidos
   - O actualiza `this.ownerEmail` en el código

---

## Configuración Rápida (Solo cambiar valores)

Si ya tienes las credenciales, solo necesitas editar `js/services/OwnerEmailService.js`:

```javascript
// Línea ~15-20
this.emailjsConfig = {
    serviceId: 'service_xxxxx',      // ← Cambiar aquí
    templateId: 'template_xxxxx',    // ← Cambiar aquí
    publicKey: 'xxxxxxxxxxxxx'         // ← Cambiar aquí
};

// Línea ~23
this.ownerEmail = 'tu-email@gggrowshop.com'; // ← Cambiar aquí

// Si usas Formspree, línea ~180
const formspreeEndpoint = 'https://formspree.io/f/xxxxx'; // ← Cambiar aquí
```

---

## Prueba de Funcionamiento

1. Agrega productos al carrito
2. Completa el formulario de checkout (sin iniciar sesión)
3. Confirma el pedido
4. Deberías recibir un email con todos los detalles del pedido

---

## Notas Importantes

- **EmailJS es la opción recomendada** para producción
- El sistema usa EmailJS por defecto, y Formspree como fallback
- Si no configuras ninguno, el pedido se guarda pero no se envía email
- Los pedidos siempre se guardan en localStorage para seguimiento
- El email incluye: nombre, email, teléfono, dirección, productos, totales y notas

---

## Soporte

- EmailJS Docs: https://www.emailjs.com/docs/
- Formspree Docs: https://help.formspree.io/

