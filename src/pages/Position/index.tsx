import Layout from '../../components/Layout';
import { MdEdit } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';

type ToastItem = { id: number; message: string; type?: 'success' | 'error' | 'info' };

export default function Positions() {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [positionsList, setPositionsList] = useState<any[]>([]);

  // Toast state
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const API_URL = 'http://127.0.0.1:8000/cargos';

  const addToast = (message: string, type: ToastItem['type'] = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((tt) => tt.id !== id));
    }, duration);
  };

  const fetchCargos = async () => {
    try {
      const res = await fetch(`${API_URL}/`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        addToast(data?.message || 'Erro ao carregar cargos.', 'error');
        setError('Erro ao carregar cargos.');
        return;
      }
      const data = await res.json();
      setPositionsList(data);
    } catch {
      setError('Erro ao carregar cargos.');
      addToast('Erro ao carregar cargos.', 'error');
    }
  };

  useEffect(() => {
    fetchCargos();
  }, []);

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!nome) {
      setError('O nome é obrigatório.');
      addToast('O nome é obrigatório.', 'error');
      return;
    }

    try {
      let res: Response;
      if (editingId) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, descricao }),
        });
      } else {
        // mantido como query params para compatibilidade com backend existente
        res = await fetch(`${API_URL}/?nome=${encodeURIComponent(nome)}&descricao=${encodeURIComponent(descricao)}`, {
          method: 'POST',
        });
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // fechar modal mesmo em erro e usar toast com mensagem do backend se houver
        setOpen(false);
        setEditingId(null);
        addToast(data?.message || 'Erro ao salvar o cargo.', 'error');
        return;
      }

      // sucesso
      setOpen(false);
      setNome('');
      setDescricao('');
      setEditingId(null);
      await fetchCargos();
      setSuccess(true);
      addToast(data?.message || 'Cargo salvo com sucesso.', 'success');
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setOpen(false);
      setEditingId(null);
      addToast('Erro ao salvar o cargo.', 'error');
      setError('Erro ao salvar o cargo.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${API_URL}/${deleteId}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      setShowDeleteModal(false);
      setDeleteId(null);
      if (!res.ok) {
        addToast(data?.message || 'Erro ao excluir cargo.', 'error');
        return;
      }
      await fetchCargos();
      addToast(data?.message || 'Cargo excluído com sucesso.', 'success');
    } catch {
      setShowDeleteModal(false);
      setDeleteId(null);
      addToast('Erro ao excluir cargo.', 'error');
      setError('Erro ao excluir cargo.');
    }
  };

  return (
    <Layout sidebar={true}>
      <div className="max-w-4xl flex flex-col items-center gap-5 pt-8">
        <h1 className="text-3xl text-gray-950">Painel de Administrador - Gestão de Cargos</h1>

        <button
          className="bg-amber-300 px-5 py-2 rounded hover:bg-amber-400"
          onClick={() => {
            setNome('');
            setDescricao('');
            setEditingId(null);
            setOpen(true);
          }}
        >
          Cadastrar Cargo
        </button>

        {open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="bg-white p-6 w-full max-w-sm shadow-lg">
              <h2 className="text-lg text-center mb-4">
                {editingId ? 'Editar Cargo' : 'Cadastrar Cargo'}
              </h2>
              <form onSubmit={handleSave} className="space-y-3">
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do cargo"
                  className="w-full border px-3 py-2"
                />
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descrição"
                  className="w-full border px-3 py-2 h-24"
                />
                {error && <div className="bg-yellow-300 p-2 text-sm">{error}</div>}
                <div className="flex justify-center gap-3 mt-3">
                  <button type="button" onClick={() => setOpen(false)} className="border px-6 py-2">
                    Cancelar
                  </button>
                  <button type="submit" className="bg-yellow-400 px-6 py-2">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="bg-white p-6 w-full max-w-sm shadow-lg">
              <h2 className="text-center mb-4">Confirmar Exclusão</h2>
              <div className="flex justify-center gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="border px-6 py-2">
                  Cancelar
                </button>
                <button onClick={handleDelete} className="bg-red-500 text-white px-6 py-2">
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="fixed bottom-4 right-4 bg-yellow-400 px-6 py-3 shadow">
            ✓ Operação realizada com sucesso!
          </div>
        )}

        <table className="w-full border mt-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Nome</th>
              <th className="border px-4 py-2 text-left">Descrição</th>
              <th className="border px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {positionsList.map((cargo) => (
              <tr key={cargo.id}>
                <td className="border px-4 py-2">{cargo.nome}</td>
                <td className="border px-4 py-2">{cargo.descricao}</td>
                <td className="border px-4 py-2 flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setEditingId(cargo.id);
                      setNome(cargo.nome);
                      setDescricao(cargo.descricao);
                      setOpen(true);
                    }}
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(cargo.id);
                      setShowDeleteModal(true);
                    }}
                  >
                    <FaTrashAlt size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Toast container */}
        <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`px-4 py-2 rounded shadow text-sm max-w-xs break-words ${
                t.type === 'success' ? 'bg-green-500 text-white' : t.type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-800 text-white'
              }`}
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
