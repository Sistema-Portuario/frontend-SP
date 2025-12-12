import { getRequest } from './api';

export interface LogisticsStats {
  naviosChegados: number;
  naviosSaidos: number;
  containersPatio: number;
  caminhoesAtivos: number;
}

const API_URL = '/dashboard/kpis';

export const getLogisticsStats = async (): Promise<LogisticsStats> => {
  
  return getRequest<LogisticsStats>(API_URL);

};