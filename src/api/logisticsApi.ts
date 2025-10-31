import { getRequest } from './api';

export interface LogisticsStats {
  naviosChegaram: number;
  naviosSairam: number;
  containersNoPatio: number;
  caminhoesAtivos: number;
}

const API_URL = '/api/logistica/estatisticas';

export const getLogisticsStats = async (): Promise<LogisticsStats> => {
  
  return getRequest<LogisticsStats>(API_URL);

};