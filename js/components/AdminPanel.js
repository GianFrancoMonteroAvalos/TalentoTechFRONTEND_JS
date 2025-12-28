/**
 * Componente AdminPanel
 * Panel de administración para gestionar pedidos
 */
class AdminPanel {
    constructor(orderService, emailService, uiService) {
        this.orderService = orderService;
        this.emailService = emailService;
        this.uiService = uiService;
        this.ordersContainer = null;
        this.currentFilter = 'all';
    }

    /**
     * Inicializa el componente
     */
    init() {
        this.ordersContainer = document.getElementById('orders-container');
        if (!this.ordersContainer) {
            console.error('Contenedor de pedidos no encontrado');
            return;
        }

        this.setupEventListeners();
        this.render();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Filtros de estado
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter = e.target.dataset.filter || 'all';
                this.updateFilterButtons();
                this.render();
            });
        });

        // Escuchar cambios en pedidos
        window.addEventListener('ordersChanged', () => {
            this.render();
        });

        // Delegación de eventos para botones de acción
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-update-status')) {
                this.handleUpdateStatus(e);
            }
            if (e.target.classList.contains('btn-confirm-payment')) {
                this.handleConfirmPayment(e);
            }
            if (e.target.classList.contains('btn-view-details')) {
                this.handleViewDetails(e);
            }
        });
    }

    /**
     * Actualiza los botones de filtro
     */
    updateFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.dataset.filter === this.currentFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Maneja la actualización de estado
     */
    async handleUpdateStatus(event) {
        const orderId = parseInt(event.target.dataset.orderId);
        const order = this.orderService.getOrderById(orderId);
        
        if (!order) {
            this.uiService.showAlert('Pedido no encontrado', 'danger');
            return;
        }

        const currentStatus = order.status; // Obtener el estado actual del pedido, no del dataset
        
        const statusOptions = {
            'pendiente': ['confirmado', 'cancelado'],
            'confirmado': ['en_preparacion', 'cancelado'],
            'en_preparacion': ['listo', 'cancelado'],
            'listo': ['entregado', 'cancelado'],
            'entregado': [],
            'cancelado': []
        };

        const availableStatuses = statusOptions[currentStatus] || [];
        
        if (availableStatuses.length === 0) {
            this.uiService.showAlert('Este pedido no puede cambiar de estado', 'warning');
            return;
        }

        const newStatus = await this.showStatusSelector(availableStatuses);
        if (!newStatus) return;

        // Si se cancela el pedido, mostrar advertencia
        if (newStatus === 'cancelado') {
            if (!confirm('¿Está seguro de cancelar este pedido? Esta acción no se puede deshacer.')) {
                return;
            }
        }

        const success = this.orderService.updateOrderStatus(orderId, newStatus);
        if (success) {
            const updatedOrder = this.orderService.getOrderById(orderId);
            // Enviar email de actualización solo si no está cancelado
            if (newStatus !== 'cancelado') {
                await this.emailService.sendStatusUpdate(updatedOrder, newStatus);
            }
            
            this.uiService.showAlert(`Estado actualizado a: ${this.orderService.getStatusLabel(newStatus)}`, 'success');
            this.render();
        } else {
            this.uiService.showAlert('Error al actualizar el estado', 'danger');
        }
    }

    /**
     * Muestra selector de estado
     */
    showStatusSelector(availableStatuses) {
        return new Promise((resolve) => {
            const statusLabels = {
                'confirmado': 'Confirmado',
                'en_preparacion': 'En Preparación',
                'listo': 'Listo para Retirar',
                'entregado': 'Entregado',
                'cancelado': 'Cancelado'
            };

            const options = availableStatuses.map(status => 
                `<option value="${status}">${statusLabels[status]}</option>`
            ).join('');

            // Crear el modal directamente con el HTML
            const modal = document.createElement('div');
            modal.className = 'modal fade show';
            modal.style.display = 'block';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            modal.setAttribute('role', 'dialog');
            modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content" style="background: rgba(255, 255, 255, 0.95); color: #000;">
                        <div class="modal-header">
                            <h5 class="modal-title">Cambiar Estado del Pedido</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <label class="form-label">Selecciona el nuevo estado:</label>
                            <select class="form-select" id="status-select" required>
                                <option value="">Seleccionar estado...</option>
                                ${options}
                            </select>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="cancel-status-btn">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="confirm-status-btn">Confirmar</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Obtener referencias a los elementos después de insertarlos en el DOM
            const statusSelect = modal.querySelector('#status-select');
            const confirmBtn = modal.querySelector('#confirm-status-btn');
            const cancelBtn = modal.querySelector('#cancel-status-btn');
            const closeBtn = modal.querySelector('.btn-close');

            // Función para cerrar el modal y resolver
            const closeModal = (result = null) => {
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }
                resolve(result);
            };

            // Event listener para confirmar
            confirmBtn.addEventListener('click', () => {
                const selectedStatus = statusSelect.value;
                if (!selectedStatus) {
                    alert('Por favor selecciona un estado');
                    return;
                }
                closeModal(selectedStatus);
            });

            // Event listeners para cancelar
            cancelBtn.addEventListener('click', () => closeModal(null));
            closeBtn.addEventListener('click', () => closeModal(null));
            
            // Cerrar al hacer click fuera del modal
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(null);
                }
            });

            // Enfocar el select
            setTimeout(() => statusSelect.focus(), 100);
        });
    }

    /**
     * Maneja la confirmación de pago
     */
    async handleConfirmPayment(event) {
        const orderId = parseInt(event.target.dataset.orderId);
        const order = this.orderService.getOrderById(orderId);
        
        // Verificar que el pedido no esté cancelado
        if (order && order.status === 'cancelado') {
            this.uiService.showAlert('No se puede confirmar el pago de un pedido cancelado', 'warning');
            return;
        }

        if (!confirm('¿Confirmar el pago de este pedido?')) {
            return;
        }

        const success = this.orderService.updatePaymentStatus(orderId, 'confirmado');
        if (success) {
            const updatedOrder = this.orderService.getOrderById(orderId);
            // Enviar email de confirmación de pago solo si el pedido no está cancelado
            if (updatedOrder.status !== 'cancelado') {
                await this.emailService.sendPaymentConfirmation(updatedOrder);
            }
            
            this.uiService.showAlert('Pago confirmado y email enviado', 'success');
            this.render();
        } else {
            this.uiService.showAlert('Error al confirmar el pago. Verifica que el pedido no esté cancelado.', 'danger');
        }
    }

    /**
     * Maneja la visualización de detalles
     */
    handleViewDetails(event) {
        const orderId = parseInt(event.target.dataset.orderId);
        const order = this.orderService.getOrderById(orderId);
        
        if (!order) return;

        const itemsHtml = order.items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.cantidad}</td>
                <td>$${this.formatPrice(item.amount)}</td>
                <td>$${this.formatPrice(item.amount * item.cantidad)}</td>
            </tr>
        `).join('');

        const modalHtml = `
            <div class="modal fade show" style="display: block;">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalles del Pedido ${order.orderNumber}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <strong>Cliente:</strong> ${order.customerName || 'N/A'}<br>
                                    <strong>Email:</strong> ${order.customerEmail}<br>
                                    ${order.customerPhone ? `<strong>Teléfono:</strong> ${order.customerPhone}<br>` : ''}
                                    ${order.customerAddress ? `<strong>Dirección:</strong> ${order.customerAddress}<br>` : ''}
                                    <strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleString('es-AR')}
                                </div>
                                <div class="col-md-6">
                                    <strong>Estado:</strong> ${this.orderService.getStatusLabel(order.status)}<br>
                                    <strong>Pago:</strong> ${this.orderService.getPaymentStatusLabel(order.paymentStatus)}<br>
                                    <strong>Total:</strong> $${this.formatPrice(order.total)}
                                </div>
                            </div>
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unit.</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHtml}
                                </tbody>
                            </table>
                            ${order.shippingAddress ? `<p><strong>Dirección:</strong> ${order.shippingAddress}</p>` : ''}
                            ${order.notes ? `<p><strong>Notas:</strong> ${order.notes}</p>` : ''}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHtml;
        document.body.appendChild(modalDiv);

        modalDiv.querySelector('.btn-close, .btn-secondary').addEventListener('click', () => {
            document.body.removeChild(modalDiv);
        });
    }

    /**
     * Renderiza el panel
     */
    render() {
        let orders = this.orderService.getAllOrders();
        
        if (this.currentFilter !== 'all') {
            orders = orders.filter(order => order.status === this.currentFilter);
        }

        if (orders.length === 0) {
            this.ordersContainer.innerHTML = `
                <div class="alert alert-info">
                    <h5>No hay pedidos</h5>
                    <p>No se encontraron pedidos con los filtros seleccionados.</p>
                </div>
            `;
            return;
        }

        this.ordersContainer.innerHTML = orders.map(order => this.renderOrderCard(order)).join('');
    }

    /**
     * Renderiza una tarjeta de pedido
     */
    renderOrderCard(order) {
        const statusBadgeClass = {
            'pendiente': 'warning',
            'confirmado': 'info',
            'en_preparacion': 'primary',
            'listo': 'success',
            'entregado': 'success',
            'cancelado': 'danger'
        }[order.status] || 'secondary';

        const paymentBadgeClass = {
            'pendiente': 'warning',
            'confirmado': 'success',
            'rechazado': 'danger'
        }[order.paymentStatus] || 'secondary';

        const canUpdateStatus = order.status !== 'entregado' && order.status !== 'cancelado';
        // Solo permitir confirmar pago si el pago está pendiente Y el pedido NO está cancelado
        const canConfirmPayment = order.paymentStatus === 'pendiente' && order.status !== 'cancelado';

        return `
            <div class="card mb-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-0">Pedido ${order.orderNumber}</h5>
                        <small class="text-muted">${new Date(order.createdAt).toLocaleString('es-AR')}</small>
                    </div>
                    <div>
                        <span class="badge bg-${statusBadgeClass} me-2">${this.orderService.getStatusLabel(order.status)}</span>
                        <span class="badge bg-${paymentBadgeClass}">Pago: ${this.orderService.getPaymentStatusLabel(order.paymentStatus)}</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Cliente:</strong> ${order.customerName || 'N/A'}</p>
                            <p><strong>Email:</strong> ${order.customerEmail}</p>
                            ${order.customerPhone ? `<p><strong>Teléfono:</strong> ${order.customerPhone}</p>` : ''}
                            ${order.customerAddress ? `<p><strong>Dirección:</strong> ${order.customerAddress}</p>` : ''}
                            <p><strong>Items:</strong> ${order.items.length} producto(s)</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Subtotal:</strong> $${this.formatPrice(order.subtotal)}</p>
                            <p><strong>Envío:</strong> ${order.shippingCost === 0 ? 'Gratis' : `$${this.formatPrice(order.shippingCost)}`}</p>
                            <p><strong>Total:</strong> $${this.formatPrice(order.total)}</p>
                        </div>
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-sm btn-info btn-view-details me-2" data-order-id="${order.id}">
                            Ver Detalles
                        </button>
                        ${canConfirmPayment ? `
                            <button class="btn btn-sm btn-success btn-confirm-payment me-2" data-order-id="${order.id}">
                                Confirmar Pago
                            </button>
                        ` : ''}
                        ${canUpdateStatus ? `
                            <button class="btn btn-sm btn-primary btn-update-status" 
                                    data-order-id="${order.id}" 
                                    data-current-status="${order.status}">
                                Cambiar Estado
                            </button>
                        ` : ''}
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
    module.exports = AdminPanel;
}

