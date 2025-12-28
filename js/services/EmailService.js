/**
 * Servicio para simular envío de emails
 * En producción esto se conectaría con un servicio de email real
 */
class EmailService {
    constructor() {
        this.sentEmails = this.loadSentEmails();
    }

    /**
     * Carga los emails enviados desde localStorage
     * @returns {Array} Array de emails
     */
    loadSentEmails() {
        try {
            const emailsData = localStorage.getItem('sent_emails');
            return emailsData ? JSON.parse(emailsData) : [];
        } catch (error) {
            console.error('Error al cargar emails:', error);
            return [];
        }
    }

    /**
     * Guarda los emails enviados en localStorage
     */
    saveSentEmails() {
        try {
            localStorage.setItem('sent_emails', JSON.stringify(this.sentEmails));
        } catch (error) {
            console.error('Error al guardar emails:', error);
        }
    }

    /**
     * Simula el envío de un email
     * @param {Object} emailData - Datos del email
     * @returns {Promise<Object>} Resultado del envío
     */
    async sendEmail(emailData) {
        return new Promise((resolve) => {
            // Simular delay de red
            setTimeout(() => {
                const email = {
                    id: Date.now(),
                    to: emailData.to,
                    subject: emailData.subject,
                    body: emailData.body,
                    sentAt: new Date().toISOString(),
                    type: emailData.type || 'general'
                };

                this.sentEmails.push(email);
                this.saveSentEmails();

                console.log('📧 Email enviado:', {
                    to: email.to,
                    subject: email.subject,
                    sentAt: email.sentAt
                });

                resolve({
                    success: true,
                    email: email
                });
            }, 500); // Simular 500ms de delay
        });
    }

    /**
     * Envía email de confirmación de pedido
     * @param {Object} order - Pedido
     * @returns {Promise<Object>}
     */
    async sendOrderConfirmation(order) {
        const itemsText = order.items.map(item => 
            `${item.cantidad} x ${item.name} por $${this.formatPrice(item.amount * item.cantidad)} cada uno.`
        ).join('\n');

        const body = `Gracias por comprar en GGGrowShop

Tu pedido: ${order.orderNumber}

${itemsText}

Costo de entrega: ${order.shippingCost === 0 ? 'Gratis' : `$${this.formatPrice(order.shippingCost)}`}
Total: $${this.formatPrice(order.total)}

Estamos esperando la confirmación del pago, que puede demorar hasta 72hs hábiles (esto puede variar dependiendo del medio de pago elegido. La validación del pago con tarjeta de crédito suele ser instantánea).

No te preocupes, te vamos a enviar un mensaje cuando esto suceda.

${order.shippingAddress ? `Dirección de retiro:\n${order.shippingAddress}` : ''}

Seguí el estado de tu pedido desde este link:
${window.location.origin}/seguimiento.html?order=${order.orderNumber}

Saludos,
GGGrowShop

***
Si no hiciste esta compra o simplemente estabas probando nuestro sitio, por favor desconsiderá este e-mail.`;

        return await this.sendEmail({
            to: order.customerEmail,
            subject: `Gracias por comprar en GGGrowShop - Pedido ${order.orderNumber}`,
            body: body,
            type: 'order_confirmation'
        });
    }

    /**
     * Envía email de confirmación de pago
     * @param {Object} order - Pedido
     * @returns {Promise<Object>}
     */
    async sendPaymentConfirmation(order) {
        const itemsText = order.items.map(item => 
            `${item.cantidad} x ${item.name}.`
        ).join('\n');

        const body = `Hola ${order.customerName || 'Cliente'}, ¡recibimos tu pago!

¡Excelente! Confirmamos el pago por tu compra en GGGrowShop.

Tu pedido ${order.orderNumber}

${itemsText}

${order.shippingAddress ? `Dirección de retiro:\n${order.shippingAddress}` : ''}

Seguí el estado de tu pedido desde este link:
${window.location.origin}/seguimiento.html?order=${order.orderNumber}

Saludos,
GGGrowShop`;

        return await this.sendEmail({
            to: order.customerEmail,
            subject: `Confirmación de pago de la orden ${order.orderNumber}`,
            body: body,
            type: 'payment_confirmation'
        });
    }

    /**
     * Envía email de actualización de estado
     * @param {Object} order - Pedido
     * @param {string} newStatus - Nuevo estado
     * @returns {Promise<Object>}
     */
    async sendStatusUpdate(order, newStatus) {
        const statusLabels = {
            'confirmado': 'confirmado',
            'en_preparacion': 'en preparación',
            'listo': 'listo para retirar',
            'entregado': 'entregado',
            'cancelado': 'cancelado'
        };

        const body = `Hola ${order.customerName || 'Cliente'},

El estado de tu pedido ${order.orderNumber} ha sido actualizado.

Nuevo estado: ${statusLabels[newStatus] || newStatus}

${order.shippingAddress ? `Dirección de retiro:\n${order.shippingAddress}` : ''}

Seguí el estado de tu pedido desde este link:
${window.location.origin}/seguimiento.html?order=${order.orderNumber}

Saludos,
GGGrowShop`;

        return await this.sendEmail({
            to: order.customerEmail,
            subject: `Actualización de pedido ${order.orderNumber}`,
            body: body,
            type: 'status_update'
        });
    }

    /**
     * Obtiene todos los emails enviados
     * @returns {Array}
     */
    getSentEmails() {
        return [...this.sentEmails].sort((a, b) => 
            new Date(b.sentAt) - new Date(a.sentAt)
        );
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
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}

