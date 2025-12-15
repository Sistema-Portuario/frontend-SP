import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Ship,
  Package,
  Truck,
  MoreVertical,
  RefreshCw,
  AlertCircle,
  Settings,
  Activity,
} from 'lucide-react';
import Layout from '../../components/Layout';
import {
  getDashboardLogs,
  getGraphResponse,
  getLogisticsStats,
  type LogEntry,
  type LogisticsStats,
} from '../../api/logisticsApi';

interface ChartDataContainer {
  day: string;
  quantidade: number;
}

interface ChartDataCaminhao {
  day: string;
  ativos: number;
}

const AdminDashboard = () => {
  const [data, setData] = useState<LogisticsStats>({
    naviosChegados: 0,
    naviosSaidos: 0,
    containersPatio: 0,
    caminhoesAtivos: 0,
  });

  // ESTADOS PARA OS GRÁFICOS (Substituindo os arrays estáticos)
  const [containersData, setContainersData] = useState<ChartDataContainer[]>(
    []
  );
  const [caminhoesData, setCaminhoesData] = useState<ChartDataCaminhao[]>([]);

  const [logsList, setLogsList] = useState<LogEntry[]>([]);

  // Função auxiliar para definir ícone e cor baseado no texto do evento
  const getLogStyle = (evento: string) => {
    if (evento.toLowerCase().includes('navio')) {
      return {
        icon: <Ship className="w-4 h-4 text-blue-600" />,
        bg: 'bg-blue-100',
        dot: 'bg-blue-500',
      };
    }
    if (
      evento.toLowerCase().includes('contêiner') ||
      evento.toLowerCase().includes('conteiner')
    ) {
      return {
        icon: <Package className="w-4 h-4 text-purple-600" />,
        bg: 'bg-purple-100',
        dot: 'bg-purple-500',
      };
    }
    // Default
    return {
      icon: <Activity className="w-4 h-4 text-gray-600" />,
      bg: 'bg-gray-100',
      dot: 'bg-gray-400',
    };
  };

  // Função auxiliar para transformar "06/12" em "Sex"
  const formatDay = (dataStr: string) => {
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const [dia, mes] = dataStr.split('/');
    const currentYear = new Date().getFullYear();
    const dataObj = new Date(currentYear, Number(mes) - 1, Number(dia));
    return diasSemana[dataObj.getDay()];
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [showSettings, setShowSettings] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    // o certo é dentro do try, tá aqui só por efeito de teste e visualização
    setLastUpdate(new Date());

    try {
      const [apiData, graphData, logsData] = await Promise.all([
        getLogisticsStats(),
        getGraphResponse(),
        getDashboardLogs(),
      ]);

      setData(apiData);

      // PROCESSAMENTO DOS DADOS DOS GRÁFICOS
      if (graphData) {
        // Contêineres (API retorna 'total', gráfico espera 'quantidade')
        if (graphData.ocupacao_patio) {
          setContainersData(
            graphData.ocupacao_patio.map((item) => ({
              day: formatDay(item.data),
              quantidade: item.total, // <--- Mapeamento importante
            }))
          );
        }

        // Caminhões (API retorna 'total', gráfico espera 'ativos')
        if (graphData.caminhoes_ativos) {
          setCaminhoesData(
            graphData.caminhoes_ativos.map((item) => ({
              day: formatDay(item.data),
              ativos: item.total, // <--- Mapeamento importante
            }))
          );
        }
      }

      // ATUALIZAÇÃO DOS LOGS E STATUS
      if (logsData) {

        const normalizarTexto = (texto: string) => {
          return texto
            .toLowerCase() // Converte para minúsculo
            .normalize('NFD') // Decomposição canônica (separa 'ê' em 'e' + '^')
            .replace(/[\u0300-\u036f]/g, ''); // Remove os diacríticos (acentos)
        };

        const dadosFiltrados = logsData.logs.filter((item) => {
          // Limpa o evento atual para comparação segura
          const eventoLimpo = normalizarTexto(item.evento);

          return (
            eventoLimpo.includes('caminhoes') || eventoLimpo.includes('caminhao') || eventoLimpo.includes('conteiner') || eventoLimpo.includes('conteiners')
          );
        });

        setLogsList(dadosFiltrados);

      }
    } catch (error) {
      setError(
        'Falha na comunicação com o servidor. Verifique a conexão e tente novamente.'
      );
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados inicialmente
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-refresh configurável
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchDashboardData();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  return (
    <Layout sidebar={true} type="employee">
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="flex-shrink-0">
          {/* Header */}
          <div className="relative z-10 px-8 py-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Páginas</span>
                <span>/</span>
                <span className="font-medium text-gray-700">Dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  title="Configurações"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={fetchDashboardData}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  />
                  Atualizar
                </button>
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-1">
              Dashboard - Operador
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Acompanhamento em tempo real do sistema portuário
              </p>
              {lastUpdate && (
                <p className="text-xs text-gray-400">
                  Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-5">
          {/* Settings Panel */}
          {showSettings && (
            <div className="relative z-10 pb-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">
                  Configurações de Atualização
                </h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600">
                      Auto-atualizar:
                    </label>
                    <button
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        autoRefresh ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoRefresh ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                      {autoRefresh ? 'Ativado' : 'Desativado'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600">Intervalo:</label>
                    <select
                      value={refreshInterval}
                      onChange={(e) =>
                        setRefreshInterval(Number(e.target.value))
                      }
                      disabled={!autoRefresh}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value={10}>10 segundos</option>
                      <option value={30}>30 segundos</option>
                      <option value={60}>1 minuto</option>
                      <option value={300}>5 minutos</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Error Alert */}
          {error && (
            <div className="relative z-10 pb-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 text-sm">
                    Erro de Comunicação
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Stats Cards - Indicadores Principais */}
          {/* MODIFICADO: Ajustado para grid-cols-2 para preencher melhor o espaço */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Contêineres no Pátio */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-2">Carga para descarregar</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {data.containersPatio}
              </h3>
            </div>

            {/* Navios chegados */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-2">Navios Chegados</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {data.naviosChegados}
              </h3>
            </div>
          </div>

          {/* Charts Row - Visualizações Gráficas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Atividades Recentes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-1">
                    Log de Atualização
                  </h3>
                  <p className="text-xs text-gray-500">
                    Últimos dados recebidos pelo sistema
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mt-6 max-h-[300px] overflow-y-auto pr-2">
                {logsList.map((log, index) => {
                  const style = getLogStyle(log.evento);

                  return (
                    <div key={index} className="flex items-start gap-3">
                      {/* Bolinha Colorida Dinâmica */}
                      <div
                        className={`w-2 h-2 ${style.dot} rounded-full mt-1.5 flex-shrink-0`}
                      ></div>

                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {log.evento}:{' '}
                          <span className="font-normal text-gray-600">
                            {log.descricao}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400">
                          {/* Formatação de Data Relativa (ex: há 2 horas) */}
                          {formatDistanceToNow(new Date(log.data_hora), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {logsList.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    Nenhum log registrado hoje.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
