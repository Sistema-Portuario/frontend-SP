import { apiClient, getRequest, deleteRequest } from './api';

export interface Cargo {
    id: string;
    nome: string;
    descricao: string | null; // Pode ser nulo
}

export const getCargos = (): Promise<Cargo[]> => {
    return getRequest<Cargo[]>('/cargos/');
};


const buildCargoQuery = (nome: string, description: string): string => {
    const params = new URLSearchParams();
    params.append('nome', nome);
    if (description) {
        params.append('descricao', description);
    }
    return params.toString();
};


export const createCargo = (nome: string, description: string): Promise<Cargo> => {
    const endpoint = `/cargos/?${buildCargoQuery(nome, description)}`;

    return apiClient<Cargo>(endpoint, {
        method: 'POST',

        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
};

export const updateCargo = (id: string, nome: string, description: string): Promise<Cargo> => {
    const endpoint = `/cargos/${id}?${buildCargoQuery(nome, description)}`;

    return apiClient<Cargo>(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
};

export const deleteCargo = (id: string): Promise<void> => {
    return deleteRequest<void>(`/cargos/${id}`);
};