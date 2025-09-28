const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro desconhecido');
  }

  return response.json() as Promise<T>;
};

export const postRequest = async <T, U>(url: string, data: U): Promise<T> =>  {

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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