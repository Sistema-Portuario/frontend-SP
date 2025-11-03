import { useState, useEffect } from 'react';
import {
  Ship,
  Package,
  Truck,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  RefreshCw,
  AlertCircle,
  Settings,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Layout from '../../components/Layout';
import { getLogisticsStats, type LogisticsStats } from '../../api/logisticsApi';

const AdminDashboard = () => {
  const [data, setData] = useState<LogisticsStats>({
    naviosChegados: 0,
    naviosSaidos: 0,
    containersPatio: 0,
    caminhoesAtivos: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [showSettings, setShowSettings] = useState(false);

  // Dados históricos para gráficos
  const [historicalNavios, setHistoricalNavios] = useState([
    { day: 'Seg', chegados: 15, saidos: 12 },
    { day: 'Ter', chegados: 18, saidos: 14 },
    { day: 'Qua', chegados: 22, saidos: 19 },
    { day: 'Qui', chegados: 20, saidos: 17 },
    { day: 'Sex', chegados: 25, saidos: 22 },
    { day: 'Sáb', chegados: 16, saidos: 15 },
    { day: 'Dom', chegados: 19, saidos: 16 },
  ]);

  const [historicalContainers, setHistoricalContainers] = useState([
    { day: 'Seg', quantidade: 520 },
    { day: 'Ter', quantidade: 580 },
    { day: 'Qua', quantidade: 550 },
    { day: 'Qui', quantidade: 620 },
    { day: 'Sex', quantidade: 590 },
    { day: 'Sáb', quantidade: 480 },
    { day: 'Dom', quantidade: 510 },
  ]);

  const [historicalCaminhoes, setHistoricalCaminhoes] = useState([
    { day: 'Seg', ativos: 35 },
    { day: 'Ter', ativos: 42 },
    { day: 'Qua', ativos: 38 },
    { day: 'Qui', ativos: 45 },
    { day: 'Sex', ativos: 40 },
    { day: 'Sáb', ativos: 28 },
    { day: 'Dom', ativos: 32 },
  ]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiData = await getLogisticsStats();

      setData(apiData);
      setLastUpdate(new Date());
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
    <Layout sidebar={true}>
      <div className="min-h-screen w-full overflow-auto">
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
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Configurações"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                />
                Atualizar
              </button>
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            Dashboard Operacional
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

        {/* Settings Panel */}
        {showSettings && (
          <div className="relative z-10 px-8 pb-4">
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
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
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
          <div className="relative z-10 px-8 pb-4">
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
                className="text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 px-8 py-4">
          {/* Stats Cards - Indicadores Principais */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Navios Chegados */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Ship className="w-6 h-6 text-white" />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-2">Navios Chegados</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {data.naviosChegados}
              </h3>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+12%</span>
                <span className="text-gray-400 ml-1">vs semana anterior</span>
              </div>
            </div>

            {/* Navios Saídos */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                  <Ship className="w-6 h-6 text-white transform scale-x-[-1]" />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-2">Navios Saídos</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {data.naviosSaidos}
              </h3>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+8%</span>
                <span className="text-gray-400 ml-1">vs semana anterior</span>
              </div>
            </div>

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
              <p className="text-sm text-gray-500 mb-2">Contêineres no Pátio</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {data.containersPatio}
              </h3>
              <div className="flex items-center text-sm">
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-red-500 font-medium">-3%</span>
                <span className="text-gray-400 ml-1">vs ontem</span>
              </div>
            </div>

            {/* Caminhões Ativos */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-2">Caminhões Ativos</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {data.caminhoesAtivos}
              </h3>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+15%</span>
                <span className="text-gray-400 ml-1">vs ontem</span>
              </div>
            </div>
          </div>

          {/* Charts Row - Visualizações Gráficas */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Movimentação de Navios */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-800 mb-1">
                Movimentação de Navios
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Chegadas e saídas semanais
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={historicalNavios}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="chegados"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Chegados"
                  />
                  <Bar
                    dataKey="saidos"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Saídos"
                  />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-400 mt-3">
                🕐 atualizado há {Math.floor(Math.random() * 10) + 1} min
              </p>
            </div>

            {/* Contêineres no Pátio */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-800 mb-1">
                Ocupação do Pátio
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Volume de contêineres armazenados
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={historicalContainers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="quantidade"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                    name="Contêineres"
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-400 mt-3">
                🕐 atualizado há {Math.floor(Math.random() * 5) + 1} min
              </p>
            </div>

            {/* Caminhões em Operação */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-800 mb-1">
                Caminhões em Operação
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Atividade de transporte semanal
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={historicalCaminhoes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ativos"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                    name="Ativos"
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-400 mt-3">🕐 atualizado agora</p>
            </div>
          </div>

          {/* Bottom Row - Resumo Operacional */}
          <div className="grid grid-cols-3 gap-6">
            {/* Status Operacional */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-gray-800">
                  Status Operacional
                </h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    Operação funcionando normalmente
                  </p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-green-600 h-1.5 rounded-full"
                      style={{ width: '95%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Atividades Recentes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-1">
                    Atividades Recentes
                  </h3>
                  <p className="text-xs text-gray-500">
                    Últimas operações registradas
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Navio MV Ocean Star atracado
                    </p>
                    <p className="text-xs text-gray-400">
                      Hoje às{' '}
                      {new Date().toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {data.containersPatio} contêineres processados
                    </p>
                    <p className="text-xs text-gray-400">
                      Hoje às{' '}
                      {new Date(Date.now() - 3600000).toLocaleTimeString(
                        'pt-BR',
                        { hour: '2-digit', minute: '2-digit' }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {data.caminhoesAtivos} caminhões em operação
                    </p>
                    <p className="text-xs text-gray-400">
                      Hoje às{' '}
                      {new Date(Date.now() - 7200000).toLocaleTimeString(
                        'pt-BR',
                        { hour: '2-digit', minute: '2-digit' }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
