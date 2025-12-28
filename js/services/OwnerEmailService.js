/**
 * Servicio para enviar emails al dueño de la tienda
 * Usa EmailJS para envío de emails desde el frontend
 * Escalable y listo para producción
 */
class OwnerEmailService {
    constructor() {
        // Cargar configuración desde archivo externo si existe
        this.loadConfig();

        // Cargar EmailJS desde CDN si no está cargado
        this.loadEmailJS();
    }

    /**
     * Carga la configuración desde archivo externo o usa valores por defecto
     */
    loadConfig() {
        // Intentar cargar desde archivo de configuración externo
        if (window.EMAIL_CONFIG) {
            this.emailjsConfig = {
                serviceId: window.EMAIL_CONFIG.emailjs?.serviceId || 'YOUR_SERVICE_ID',
                templateId: window.EMAIL_CONFIG.emailjs?.templateId || 'YOUR_TEMPLATE_ID',
                publicKey: window.EMAIL_CONFIG.emailjs?.publicKey || 'YOUR_PUBLIC_KEY'
            };
            this.ownerEmail = window.EMAIL_CONFIG.ownerEmail || 'tu-email@gggrowshop.com';
            this.formspreeEndpoint = window.EMAIL_CONFIG.formspree?.endpoint || 'https://formspree.io/f/YOUR_FORM_ID';
        } else {
            // Valores por defecto (deben ser reemplazados)
            this.emailjsConfig = {
                serviceId: 'YOUR_SERVICE_ID', // Reemplazar con tu Service ID
                templateId: 'YOUR_TEMPLATE_ID', // Reemplazar con tu Template ID
                publicKey: 'YOUR_PUBLIC_KEY' // Reemplazar con tu Public Key
            };
            this.ownerEmail = 'tu-email@gggrowshop.com'; // Reemplazar con el email del dueño
            this.formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID'; // Reemplazar con tu Form ID
        }
    }

    /**
     * Carga la librería EmailJS desde CDN
     */
    loadEmailJS() {
        if (typeof emailjs === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
            script.onload = () => {
                // Inicializar EmailJS con la clave pública
                if (this.emailjsConfig.publicKey && this.emailjsConfig.publicKey !== 'YOUR_PUBLIC_KEY') {
                    emailjs.init(this.emailjsConfig.publicKey);
                }
            };
            document.head.appendChild(script);
        } else if (this.emailjsConfig.publicKey && this.emailjsConfig.publicKey !== 'YOUR_PUBLIC_KEY') {
            emailjs.init(this.emailjsConfig.publicKey);
        }
    }

    /**
     * Verifica si EmailJS está configurado correctamente
     * @returns {boolean}
     */
    isConfigured() {
        return this.emailjsConfig.serviceId !== 'YOUR_SERVICE_ID' &&
               this.emailjsConfig.templateId !== 'YOUR_TEMPLATE_ID' &&
               this.emailjsConfig.publicKey !== 'YOUR_PUBLIC_KEY' &&
               this.ownerEmail !== 'tu-email@gggrowshop.com';
    }

    /**
     * Envía un email al dueño con los detalles del pedido
     * @param {Object} orderData - Datos del pedido
     * @returns {Promise<Object>} Resultado del envío
     */
    async sendOrderToOwner(orderData) {
        // Si EmailJS no está configurado, usar Formspree como fallback
        if (!this.isConfigured()) {
            console.warn('EmailJS no configurado, usando Formspree como fallback');
            return await this.sendViaFormspree(orderData);
        }

        try {
            // Formatear items del pedido
            const itemsText = orderData.items.map((item, index) => {
                const subtotal = parseFloat(item.amount || 0) * (item.cantidad || 1);
                return `${index + 1}. ${item.name} - Cantidad: ${item.cantidad} - Precio unitario: $${this.formatPrice(item.amount)} - Subtotal: $${this.formatPrice(subtotal)}`;
            }).join('\n');

            // Preparar template parameters para EmailJS
            const templateParams = {
                to_email: this.ownerEmail,
                order_number: orderData.orderNumber || 'N/A',
                customer_name: orderData.customerName || 'N/A',
                customer_email: orderData.customerEmail || 'N/A',
                customer_phone: orderData.customerPhone || 'N/A',
                customer_address: orderData.customerAddress || 'No especificada',
                shipping_address: orderData.shippingAddress || 'No especificada',
                order_items: itemsText,
                items_count: orderData.items.length,
                subtotal: this.formatPrice(orderData.subtotal || 0),
                shipping_cost: orderData.shippingCost === 0 ? 'Gratis' : `$${this.formatPrice(orderData.shippingCost)}`,
                total: this.formatPrice(orderData.total || 0),
                notes: orderData.notes || 'Sin notas adicionales',
                order_date: new Date().toLocaleString('es-AR'),
                order_url: `${window.location.origin}/seguimiento.html?order=${orderData.orderNumber || ''}`
            };

            // Enviar email usando EmailJS
            const response = await emailjs.send(
                this.emailjsConfig.serviceId,
                this.emailjsConfig.templateId,
                templateParams
            );

            console.log('✅ Email enviado al dueño exitosamente:', response);
            return {
                success: true,
                method: 'emailjs',
                message: 'Email enviado correctamente'
            };

        } catch (error) {
            console.error('❌ Error al enviar email con EmailJS:', error);
            // Fallback a Formspree si EmailJS falla
            console.log('Intentando con Formspree como fallback...');
            return await this.sendViaFormspree(orderData);
        }
    }

    /**
     * Envía el pedido usando Formspree como fallback
     * @param {Object} orderData - Datos del pedido
     * @returns {Promise<Object>}
     */
    async sendViaFormspree(orderData) {
        // Formatear items del pedido
        const itemsText = orderData.items.map((item, index) => {
            const subtotal = parseFloat(item.amount || 0) * (item.cantidad || 1);
            return `${index + 1}. ${item.name}\n   Cantidad: ${item.cantidad}\n   Precio unitario: $${this.formatPrice(item.amount)}\n   Subtotal: $${this.formatPrice(subtotal)}`;
        }).join('\n\n');

        const message = `NUEVO PEDIDO - ${orderData.orderNumber || 'Sin número'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMACIÓN DEL CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre: ${orderData.customerName || 'N/A'}
Email: ${orderData.customerEmail || 'N/A'}
Teléfono/Celular: ${orderData.customerPhone || 'N/A'}
Dirección: ${orderData.customerAddress || 'No especificada'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETALLES DEL PEDIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Número de Pedido: ${orderData.orderNumber || 'N/A'}
Fecha: ${new Date().toLocaleString('es-AR')}

PRODUCTOS:
${itemsText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESUMEN FINANCIERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal: $${this.formatPrice(orderData.subtotal || 0)}
Costo de envío: ${orderData.shippingCost === 0 ? 'Gratis' : `$${this.formatPrice(orderData.shippingCost)}`}
TOTAL: $${this.formatPrice(orderData.total || 0)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMACIÓN ADICIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dirección de Retiro: ${orderData.shippingAddress || 'No especificada'}
Notas: ${orderData.notes || 'Sin notas adicionales'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Seguimiento: ${window.location.origin}/seguimiento.html?order=${orderData.orderNumber || ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        try {
            const response = await fetch(this.formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _subject: `Nuevo Pedido: ${orderData.orderNumber || 'Sin número'}`,
                    email: this.ownerEmail,
                    nombre: orderData.customerName || 'N/A',
                    telefono: orderData.customerPhone || 'N/A',
                    email_cliente: orderData.customerEmail || 'N/A',
                    mensaje: message
                })
            });

            if (response.ok) {
                console.log('✅ Email enviado al dueño vía Formspree');
                return {
                    success: true,
                    method: 'formspree',
                    message: 'Email enviado correctamente'
                };
            } else {
                throw new Error('Error en la respuesta de Formspree');
            }
        } catch (error) {
            console.error('❌ Error al enviar email con Formspree:', error);
            return {
                success: false,
                method: 'formspree',
                message: 'Error al enviar email',
                error: error.message
            };
        }
    }

    /**
     * Formatea el precio
     * @param {number} price - Precio
     * @returns {string} Precio formateado
     */
    formatPrice(price) {
        return new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    }

    /**
     * Configura las credenciales de EmailJS
     * @param {Object} config - Configuración {serviceId, templateId, publicKey, ownerEmail}
     */
    configure(config) {
        if (config.serviceId) this.emailjsConfig.serviceId = config.serviceId;
        if (config.templateId) this.emailjsConfig.templateId = config.templateId;
        if (config.publicKey) {
            this.emailjsConfig.publicKey = config.publicKey;
            if (typeof emailjs !== 'undefined') {
                emailjs.init(config.publicKey);
            }
        }
        if (config.ownerEmail) this.ownerEmail = config.ownerEmail;
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OwnerEmailService;
}

