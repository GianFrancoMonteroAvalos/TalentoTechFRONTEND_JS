/**
 * Componente OrderTracking
 * Muestra el seguimiento de un pedido
 */
class OrderTracking {
    constructor(orderService, uiService) {
        this.orderService = orderService;
        this.uiService = uiService;
        this.trackingContainer = null;
    }

    /**
     * Inicializa el componente
     */
    init() {
        this.trackingContainer = document.getElementById('tracking-container');
        if (!this.trackingContainer) {
            console.error('Contenedor de seguimiento no encontrado');
            return;
        }

        // Obtener número de pedido de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const orderNumber = urlParams.get('order');

        if (orderNumber) {
            this.loadOrder(orderNumber);
        } else {
            this.showOrderForm();
        }
    }

    /**
     * Muestra el formulario para buscar pedido
     */
    showOrderForm() {
        this.trackingContainer.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="mb-0">Seguimiento de Pedido</h4>
                        </div>
                        <div class="card-body">
                            <form id="order-search-form">
                                <div class="mb-3">
                                    <label for="order-number" class="form-label">Número de Pedido</label>
                                    <input type="text" 
                                           class="form-control" 
                                           id="order-number" 
                                           placeholder="#653" 
                                           required>
                                    <small class="form-text text-muted">Ingresa el número de pedido que recibiste por email</small>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Buscar Pedido</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('order-search-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const orderNumber = document.getElementById('order-number').value.trim();
            if (orderNumber) {
                window.location.href = `seguimiento.html?order=${orderNumber}`;
            }
        });
    }

    /**
     * Carga y muestra un pedido
     */
    loadOrder(orderNumber) {
        const order = this.orderService.getOrderByNumber(orderNumber);

        if (!order) {
            this.trackingContainer.innerHTML = `
                <div class="alert alert-danger">
                    <h5>Pedido no encontrado</h5>
                    <p>No se encontró un pedido con el número ${orderNumber}</p>
                    <a href="seguimiento.html" class="btn btn-primary">Buscar otro pedido</a>
                </div>
            `;
            return;
        }

        this.renderOrder(order);
    }

    /**
     * Renderiza el pedido
     */
    renderOrder(order) {
        const statusSteps = [
            { key: 'pendiente', label: 'Pendiente', icon: 'clock' },
            { key: 'confirmado', label: 'Confirmado', icon: 'check-circle' },
            { key: 'en_preparacion', label: 'En Preparación', icon: 'cog' },
            { key: 'listo', label: 'Listo para Retirar', icon: 'box' },
            { key: 'entregado', label: 'Entregado', icon: 'check-double' }
        ];

        const currentStepIndex = statusSteps.findIndex(step => step.key === order.status);
        const isCanceled = order.status === 'cancelado';

        const itemsHtml = order.items.map(item => `
            <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                <div>
                    <strong>${item.cantidad} x ${item.name}</strong>
                </div>
                <div>
                    $${this.formatPrice(item.amount * item.cantidad)}
                </div>
            </div>
        `).join('');

        this.trackingContainer.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="card mb-4">
                        <div class="card-header bg-primary text-white">
                            <h4 class="mb-0">Orden: ${order.orderNumber}</h4>
                        </div>
                        <div class="card-body">
                            ${isCanceled ? `
                                <div class="alert alert-danger">
                                    <h5>Pedido Cancelado</h5>
                                    <p>Este pedido ha sido cancelado.</p>
                                </div>
                            ` : `
                                <div class="mb-4">
                                    <h5>Estado del Pedido</h5>
                                    <div class="progress mb-3" style="height: 30px;">
                                        <div class="progress-bar progress-bar-striped progress-bar-animated" 
                                             role="progressbar" 
                                             style="width: ${((currentStepIndex + 1) / statusSteps.length) * 100}%">
                                            ${this.orderService.getStatusLabel(order.status)}
                                        </div>
                                    </div>
                                    <div class="row">
                                        ${statusSteps.map((step, index) => {
                                            const isActive = index <= currentStepIndex;
                                            const isCurrent = index === currentStepIndex;
                                            return `
                                                <div class="col text-center">
                                                    <div class="mb-2">
                                                        <i class="fas fa-${step.icon} fa-2x ${isActive ? 'text-success' : 'text-muted'}"></i>
                                                    </div>
                                                    <small class="d-block ${isActive ? 'fw-bold' : ''}">${step.label}</small>
                                                    ${isCurrent ? '<span class="badge bg-success">Actual</span>' : ''}
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>
                            `}

                            <div class="row">
                                <div class="col-md-6">
                                    <h5>Información del Pedido</h5>
                                    <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleString('es-AR')}</p>
                                    <p><strong>Cliente:</strong> ${order.customerName || 'N/A'}</p>
                                    <p><strong>Email:</strong> ${order.customerEmail}</p>
                                    ${order.customerPhone ? `<p><strong>Teléfono:</strong> ${order.customerPhone}</p>` : ''}
                                    ${order.customerAddress ? `<p><strong>Dirección:</strong> ${order.customerAddress}</p>` : ''}
                                    <p><strong>Estado de Pago:</strong> 
                                        <span class="badge bg-${order.paymentStatus === 'confirmado' ? 'success' : 'warning'}">
                                            ${this.orderService.getPaymentStatusLabel(order.paymentStatus)}
                                        </span>
                                    </p>
                                </div>
                                <div class="col-md-6">
                                    <h5>Resumen</h5>
                                    ${itemsHtml}
                                    <div class="mt-3 pt-2 border-top">
                                        <div class="d-flex justify-content-between">
                                            <span>Subtotal:</span>
                                            <span>$${this.formatPrice(order.subtotal)}</span>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <span>Envío:</span>
                                            <span>${order.shippingCost === 0 ? 'Gratis' : `$${this.formatPrice(order.shippingCost)}`}</span>
                                        </div>
                                        <div class="d-flex justify-content-between fw-bold fs-5 mt-2">
                                            <span>Total:</span>
                                            <span>$${this.formatPrice(order.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            ${order.shippingAddress ? `
                                <div class="mt-4">
                                    <h5>Dirección de Retiro</h5>
                                    <p class="mb-0">${order.shippingAddress}</p>
                                </div>
                            ` : ''}

                            ${order.paymentStatus === 'pendiente' ? `
                                <div class="alert alert-info mt-4">
                                    <h6>Pago Pendiente</h6>
                                    <p class="mb-0">Estamos esperando la confirmación del pago, que puede demorar hasta 72hs hábiles. Te enviaremos un email cuando se confirme.</p>
                                </div>
                            ` : ''}

                            ${order.paymentStatus === 'confirmado' && order.status === 'listo' ? `
                                <div class="alert alert-success mt-4">
                                    <h6>¡Tu pedido está listo!</h6>
                                    <p class="mb-0">Puedes retirar tu pedido en la dirección indicada.</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="text-center">
                        <a href="index.html" class="btn btn-primary">Seguir comprando</a>
                        <a href="seguimiento.html" class="btn btn-secondary">Buscar otro pedido</a>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Formatea el precio
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
    module.exports = OrderTracking;
}

