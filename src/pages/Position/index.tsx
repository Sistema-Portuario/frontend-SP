import Layout from '../../components/Layout';
import { MdEdit } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import { useState } from 'react';
import type { FormEvent } from 'react';

export default function Positions() {
  const [open, setOpen] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [positionsList, setPositionsList] = useState([
    {
      nome: 'Cargo 1',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam laborum reprehenderit labore temporibus eius tenetur dolorem totam magni.',
    },
    {
      nome: 'Cargo 2',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam laborum reprehenderit labore temporibus eius tenetur dolorem totam magni.',
    },
    {
      nome: 'Cargo 3',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam laborum reprehenderit labore temporibus eius tenetur dolorem totam magni.',
    },
  ]);

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nome || !description) {
      setError('Todos os campos devem ser preenchidos.');
      setTimeout(() => setError(''), 4000);
      return;
    }

    setError('');
    setOpen(false);
    setSuccess(true);

    if (editingIndex !== null) {
      const updatedPositions = [...positionsList];
      updatedPositions[editingIndex] = { nome, description };
      setPositionsList(updatedPositions);
      setEditingIndex(null);
    } else {
      setPositionsList([...positionsList, { nome, description }]);
    }

    setNome('');
    setDescription('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Layout sidebar={true}>
      <div className="max-w-4xl min-w-4xl flex flex-col items-center gap-5 pt-8">
        <div className="w-full flex flex-col gap-8 items-start">
          <h1 className="text-3xl text-gray-950">
            Painel de Administrador - Gestão de Cargos
          </h1>

          <button
            className="bg-amber-300 text-sky-950 pl-5 pr-5 pt-1.5 pb-1.5 rounded-[5px] cursor-pointer hover:bg-amber-400 transition"
            onClick={() => {
              setNome('');
              setDescription('');
              setEditingIndex(null);
              setOpen(true);
            }}
          >
            Cadastrar Cargo
          </button>

          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-full max-w-sm rounded-none bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-center text-lg font-normal text-black">
                  {editingIndex !== null ? 'Editar Cargo' : 'Cadastrar Cargo'}
                </h2>

                <form onSubmit={handleSave} className="space-y-3">
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome do cargo"
                    className="w-full rounded-[5px] border border-[#C4C4C4] px-3 py-2 text-sm text-black placeholder-[#C4C4C4] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#C4C4C4]"
                  />

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição do cargo"
                    className="w-full h-28 rounded-[5px] border border-[#C4C4C4] px-3 py-2 text-sm text-black placeholder-[#C4C4C4] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#C4C4C4]"
                  ></textarea>

                  {error && (
                    <div className="rounded-[5px] bg-[#F1D821] px-4 py-2 text-sm text-black shadow">
                      {error}
                    </div>
                  )}

                  <div className="mt-4 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-[5px] border border-[#C4C4C4] bg-white px-6 py-2 font-normal text-black shadow hover:bg-gray-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="rounded-[5px] bg-[#F1D821] px-6 py-2 font-normal text-black shadow hover:opacity-90"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-full max-w-sm rounded-none bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-center text-lg font-normal text-black">
                  Confirmar Exclusão
                </h2>
                <p className="mb-4 text-center text-sm text-gray-700">
                  Tem certeza que deseja excluir este cargo?
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    className="rounded-[5px] border border-[#C4C4C4] bg-white px-6 py-2 font-normal text-black shadow hover:bg-gray-100"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="rounded-[5px] bg-red-500 px-6 py-2 font-normal text-white shadow hover:opacity-90"
                    onClick={() => {
                      if (deleteIndex !== null) {
                        setPositionsList(
                          positionsList.filter((_, i) => i !== deleteIndex)
                        );
                        setDeleteIndex(null);
                      }
                      setShowDeleteModal(false);
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="fixed bottom-4 right-4 z-50 rounded-[5px] bg-[#F1D821] px-6 py-3 text-black shadow-lg">
              {'\u2713'} Alterações salvas com sucesso!
            </div>
          )}
        </div>

        <div className="w-full min-w-[600px] rounded-[5px] overflow-x-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className=" w-30 border border-gray-200 px-4 py-2 text-left text-gray-700">
                  Nome
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">
                  Descrição
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {positionsList.map((position, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="border border-gray-200 px-4 py-2">
                    {position.nome}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {position.description}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <div className="flex justify-center items-center gap-5">
                      <button
                        className="text-blue-500 hover:text-blue-700 flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          setNome(position.nome);
                          setDescription(position.description);
                          setEditingIndex(index);
                          setOpen(true);
                        }}
                      >
                        <MdEdit color="black" size={20} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          setDeleteIndex(index);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FaTrashAlt size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
