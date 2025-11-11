const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMsg = 'Erro desconhecido';
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch (e) {
      errorMsg = response.statusText;
    }
    throw new Error(errorMsg);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json() as Promise<T>;
  }

  return null as T;
};

export const postRequest = async <T, U>(url: string, data: U): Promise<T> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<T>(response);

  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Erro desconhecido');
  }
};

const BASE_URL = 'http://127.0.0.1:8000';

const getToken = (): string | null => {
  return window.localStorage.getItem('token');
};

export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  // Adiciona o token de autenticação se existir
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  // Define 'Accept' para garantir que queremos JSON de volta
  if (!headers.has('Accept')) {
    headers.append('Accept', 'application/json');
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Reutiliza a lógica de tratamento de resposta/erro
    return await handleResponse<T>(response);

  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Um erro desconhecido ocorreu na requisição.');
  }
};

export const getRequest = <T>(endpoint: string): Promise<T> => {
  return apiClient<T>(endpoint, { method: 'GET' });
};

export const postJsonRequest = <T, U>(endpoint: string, data: U): Promise<T> => {
  return apiClient<T>(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const putJsonRequest = <T, U>(endpoint: string, data: U): Promise<T> => {
  return apiClient<T>(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const deleteRequest = <T>(endpoint: string): Promise<T> => {
  return apiClient<T>(endpoint, { method: 'DELETE' });
};