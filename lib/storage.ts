// Sistema de almacenamiento local para el CRM

export interface CRMUser {
    id: string;
    account_number: string;
    password: string;
    role: 'admin' | 'client';
    company_name?: string;
    contact_name?: string;
    cedula?: string;
    activity_code?: string;
    email?: string;
    phone?: string;
    province?: string;
    canton?: string;
    district?: string;
    neighborhood?: string;
    created_at: string;
    created_by: string;
}

export interface Proforma {
    id: string;
    user_id: string;
    proforma_number: string;
    date: string;
    subtotal: number;
    iva: number;
    total: number;
    items: any[];
    comments: string;
    created_at: string;
}

// Inicializar datos por defecto
const initializeData = () => {
    if (!localStorage.getItem('crm_users')) {
        const defaultAdmin: CRMUser = {
            id: 'admin-001',
            account_number: 'admin',
            password: 'admin008',
            role: 'admin',
            contact_name: 'Administrador',
            created_at: new Date().toISOString(),
            created_by: 'system'
        };
        localStorage.setItem('crm_users', JSON.stringify([defaultAdmin]));
    }

    if (!localStorage.getItem('crm_proformas')) {
        localStorage.setItem('crm_proformas', JSON.stringify([]));
    }

    if (!localStorage.getItem('crm_next_account')) {
        localStorage.setItem('crm_next_account', '1');
    }
};

// Usuarios
export const getUsers = (): CRMUser[] => {
    initializeData();
    return JSON.parse(localStorage.getItem('crm_users') || '[]');
};

export const getUser = (accountNumber: string, password: string): CRMUser | null => {
    const users = getUsers();
    return users.find(u => u.account_number === accountNumber && u.password === password) || null;
};

export const getUserById = (id: string): CRMUser | null => {
    const users = getUsers();
    return users.find(u => u.id === id) || null;
};

export const getClients = (): CRMUser[] => {
    return getUsers().filter(u => u.role === 'client');
};

export const createUser = (userData: Partial<CRMUser>): CRMUser => {
    const users = getUsers();
    const nextAccount = localStorage.getItem('crm_next_account') || '1';

    const newUser: CRMUser = {
        id: `user-${Date.now()}`,
        account_number: nextAccount.padStart(3, '0'),
        password: 'Admin001',
        role: 'client',
        created_at: new Date().toISOString(),
        created_by: 'admin',
        ...userData
    };

    users.push(newUser);
    localStorage.setItem('crm_users', JSON.stringify(users));
    localStorage.setItem('crm_next_account', String(parseInt(nextAccount) + 1));

    return newUser;
};

export const updateUser = (id: string, updates: Partial<CRMUser>): CRMUser | null => {
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    localStorage.setItem('crm_users', JSON.stringify(users));

    return users[index];
};

// Proformas
export const getProformas = (): Proforma[] => {
    initializeData();
    return JSON.parse(localStorage.getItem('crm_proformas') || '[]');
};

export const getProformasByUser = (userId: string): Proforma[] => {
    return getProformas().filter(p => p.user_id === userId);
};

export const createProforma = (proformaData: Omit<Proforma, 'id' | 'created_at'>): Proforma => {
    const proformas = getProformas();

    const newProforma: Proforma = {
        id: `proforma-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...proformaData
    };

    proformas.push(newProforma);
    localStorage.setItem('crm_proformas', JSON.stringify(proformas));

    return newProforma;
};

export const getProformaById = (id: string): Proforma | null => {
    const proformas = getProformas();
    return proformas.find(p => p.id === id) || null;
};

// Autenticación simplificada
export const logout = () => {
    localStorage.removeItem('crm_authenticated');
    localStorage.removeItem('crm_session');
};

export const isAuthenticated = (): boolean => {
    return localStorage.getItem('crm_authenticated') === 'true';
};
