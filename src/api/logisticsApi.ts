import { getRequest } from './api';

export interface LogisticsStats {
  naviosChegados: number;
  naviosSaidos: number;
  containersPatio: number;
  caminhoesAtivos: number;
}

export interface GraficoNavio {
  data: string;
  chegadas: number;
  saidas: number;
}

export interface GraficoGenerico {
  data: string;
  total: number;
}

// A resposta completa da API de gráficos
export interface GraphResponse {
  movimentacao_navios: GraficoNavio[];
  ocupacao_patio: GraficoGenerico[];
  caminhoes_ativos: GraficoGenerico[];
}

export interface LogEntry {
  evento: string;
  descricao: string;
  data_hora: string;
}

export interface StatusOperacional {
  status: string;
  nivel: number;
}

export interface LogsResponse {
  status_operacional: StatusOperacional;
  logs: LogEntry[];
}

export const getLogisticsStats = async (): Promise<LogisticsStats> => {
  
  return getRequest<LogisticsStats>('/dashboard/kpis');

};

export const getGraphResponse = async (): Promise<GraphResponse> => {
  
  return getRequest<GraphResponse>('/dashboard/graficos');

};

export const getDashboardLogs = async (): Promise<LogsResponse> => {
  return getRequest<LogsResponse>('/dashboard/logs');
};