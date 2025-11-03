import Layout from '../../components/Layout';
import { MdEdit } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';

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

  const API_URL = 'http://127.0.0.1:8000/cargos';

  const fetchCargos = async () => {
    try {
      const res = await fetch(`${API_URL}/`);
      const data = await res.json();
      setPositionsList(data);
    } catch {
      setError('Erro ao carregar cargos.');
    }
  };

  useEffect(() => {
    fetchCargos();
  }, []);

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nome) return setError('O nome é obrigatório.');

    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, descricao }),
        });
      } else {
        await fetch(`${API_URL}/?nome=${nome}&descricao=${descricao}`, {
          method: 'POST',
        });
      }
      setOpen(false);
      setNome('');
      setDescricao('');
      setEditingId(null);
      fetchCargos();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Erro ao salvar o cargo.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`${API_URL}/${deleteId}`, { method: 'DELETE' });
      setShowDeleteModal(false);
      fetchCargos();
    } catch {
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
      </div>
    </Layout>
  );
}
