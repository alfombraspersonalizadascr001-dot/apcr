export type OrderStatus = 'received' | 'design' | 'production' | 'quality' | 'ready' | 'delivered';

export interface OrderData {
    id: string;
    client: string;
    status: OrderStatus;
    product: string;
    estimatedDelivery: string;
}

const MOCK_DB: Record<string, OrderData> = {
    '1001': { id: '1001', client: 'Coca-Cola FEMSA', status: 'production', product: 'Alfombras de Entrada (x4)', estimatedDelivery: '2 días' },
    '1002': { id: '1002', client: 'Hotel Marriot', status: 'design', product: 'Alfombra Lobby Principal', estimatedDelivery: '5 días' },
    '1003': { id: '1003', client: 'BAC Credomatic', status: 'quality', product: 'Alfombras Sucursal VIP', estimatedDelivery: 'Mañana' },
    '1004': { id: '1004', client: 'Intel Costa Rica', status: 'ready', product: 'Alfombras Anti-Fatiga', estimatedDelivery: 'Listo para retiro' },
};

export async function getOrder(id: string): Promise<OrderData | null> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_DB[id] || null);
        }, 800); // Simulate network latency
    });
}
