/**
 * Servicio para gestionar pedidos/órdenes
 * Maneja creación, actualización y seguimiento de pedidos
 */
class OrderService {
    constructor() {
        this.storageKey = 'orders';
        this.orders = this.loadOrders();
        this.nextOrderId = this.getNextOrderId();
    }

    /**
     * Carga los pedidos desde localStorage
     * @returns {Array} Array de pedidos
     */
    loadOrders() {
        try {
            const ordersData = localStorage.getItem(this.storageKey);
            return ordersData ? JSON.parse(ordersData) : [];
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            return [];
        }
    }

    /**
     * Guarda los pedidos en localStorage
     */
    saveOrders() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.orders));
        } catch (error) {
            console.error('Error al guardar pedidos:', error);
        }
    }

    /**
     * Obtiene el siguiente ID de pedido
     * @returns {number}
     */
    getNextOrderId() {
        if (this.orders.length === 0) return 1;
        const maxId = Math.max(...this.orders.map(order => order.id));
        return maxId + 1;
    }

    /**
     * Crea un nuevo pedido
     * @param {Object} orderData - Datos del pedido
     * @returns {Object} Pedido creado
     */
    createOrder(orderData) {
        const order = {
            id: this.nextOrderId++,
            orderNumber: `#${String(this.nextOrderId - 1).padStart(3, '0')}`,
            customerEmail: orderData.email || '',
            customerName: orderData.name || '',
            customerPhone: orderData.phone || '',
            customerAddress: orderData.address || '',
            items: orderData.items || [],
            subtotal: orderData.subtotal || 0,
            shippingCost: orderData.shippingCost || 0,
            total: orderData.total || 0,
            status: 'pendiente', // pendiente, confirmado, en_preparacion, listo, entregado, cancelado
            paymentStatus: 'pendiente', // pendiente, confirmado, rechazado
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            shippingAddress: orderData.shippingAddress || '',
            notes: orderData.notes || ''
        };

        this.orders.push(order);
        this.saveOrders();

        // Notificar cambio
        this.notifyOrderChange();

        return order;
    }

    /**
     * Obtiene un pedido por ID
     * @param {number} orderId - ID del pedido
     * @returns {Object|null} Pedido o null
     */
    getOrderById(orderId) {
        return this.orders.find(order => order.id === orderId) || null;
    }

    /**
     * Obtiene un pedido por número de orden
     * @param {string} orderNumber - Número de orden (ej: "#653")
     * @returns {Object|null} Pedido o null
     */
    getOrderByNumber(orderNumber) {
        return this.orders.find(order => order.orderNumber === orderNumber) || null;
    }

    /**
     * Obtiene todos los pedidos
     * @param {string} filterStatus - Filtrar por estado (opcional)
     * @returns {Array} Array de pedidos
     */
    getAllOrders(filterStatus = null) {
        if (filterStatus) {
            return this.orders.filter(order => order.status === filterStatus);
        }
        return [...this.orders].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    /**
     * Obtiene pedidos de un cliente por email
     * @param {string} email - Email del cliente
     * @returns {Array} Array de pedidos del cliente
     */
    getOrdersByCustomer(email) {
        return this.orders
            .filter(order => order.customerEmail === email)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    /**
     * Actualiza el estado de un pedido
     * @param {number} orderId - ID del pedido
     * @param {string} status - Nuevo estado
     * @returns {boolean} true si se actualizó correctamente
     */
    updateOrderStatus(orderId, status) {
        const order = this.getOrderById(orderId);
        if (!order) return false;

        const validStatuses = ['pendiente', 'confirmado', 'en_preparacion', 'listo', 'entregado', 'cancelado'];
        if (!validStatuses.includes(status)) {
            console.error('Estado inválido:', status);
            return false;
        }

        // Si se cancela el pedido, también rechazar el pago si está pendiente
        if (status === 'cancelado' && order.paymentStatus === 'pendiente') {
            order.paymentStatus = 'rechazado';
        }

        order.status = status;
        order.updatedAt = new Date().toISOString();
        this.saveOrders();
        this.notifyOrderChange();

        return true;
    }

    /**
     * Actualiza el estado de pago de un pedido
     * @param {number} orderId - ID del pedido
     * @param {string} paymentStatus - Nuevo estado de pago
     * @returns {boolean} true si se actualizó correctamente
     */
    updatePaymentStatus(orderId, paymentStatus) {
        const order = this.getOrderById(orderId);
        if (!order) return false;

        // No permitir confirmar pago si el pedido está cancelado
        if (order.status === 'cancelado' && paymentStatus === 'confirmado') {
            console.error('No se puede confirmar el pago de un pedido cancelado');
            return false;
        }

        const validStatuses = ['pendiente', 'confirmado', 'rechazado'];
        if (!validStatuses.includes(paymentStatus)) {
            console.error('Estado de pago inválido:', paymentStatus);
            return false;
        }

        order.paymentStatus = paymentStatus;
        
        // Solo actualizar el estado del pedido automáticamente si:
        // 1. El pago se confirma
        // 2. El pedido está en estado pendiente
        // 3. El pedido NO está cancelado
        if (paymentStatus === 'confirmado' && order.status === 'pendiente' && order.status !== 'cancelado') {
            order.status = 'confirmado';
        }

        order.updatedAt = new Date().toISOString();
        this.saveOrders();
        this.notifyOrderChange();

        return true;
    }

    /**
     * Obtiene el estado en español
     * @param {string} status - Estado en inglés
     * @returns {string} Estado en español
     */
    getStatusLabel(status) {
        const labels = {
            'pendiente': 'Pendiente',
            'confirmado': 'Confirmado',
            'en_preparacion': 'En Preparación',
            'listo': 'Listo para Retirar',
            'entregado': 'Entregado',
            'cancelado': 'Cancelado'
        };
        return labels[status] || status;
    }

    /**
     * Obtiene el estado de pago en español
     * @param {string} paymentStatus - Estado de pago
     * @returns {string} Estado en español
     */
    getPaymentStatusLabel(paymentStatus) {
        const labels = {
            'pendiente': 'Pendiente',
            'confirmado': 'Confirmado',
            'rechazado': 'Rechazado'
        };
        return labels[paymentStatus] || paymentStatus;
    }

    /**
     * Notifica cambios en los pedidos
     */
    notifyOrderChange() {
        const event = new CustomEvent('ordersChanged', {
            detail: {
                orders: this.orders
            }
        });
        window.dispatchEvent(event);
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrderService;
}

