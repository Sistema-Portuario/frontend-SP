import Layout from '../../components/Layout';
import { MdEdit } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import { useState } from "react";
import type { FormEvent } from "react";

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
};

export default function AdminDashboard() {
  const [open, setOpen] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [cargo, setCargo] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("Ativo");
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);



  const [usersList, setUsersList] = useState([
    { nome: 'Lorem ipsum', email: 'loremispsum@gmail.com', status: 'Ativo', cargo: 'cargo1' },
    { nome: 'Lorem ipsum', email: 'loremispsum@gmail.com', status: 'Ativo', cargo: 'cargo2' },
    { nome: 'Lorem ipsum', email: 'loremispsum@gmail.com', status: 'Ativo', cargo: 'cargo3' },
    { nome: 'Lorem ipsum', email: 'loremispsum@gmail.com', status: 'Ativo', cargo: 'cargo1' },
    { nome: 'Lorem ipsum', email: 'loremispsum@gmail.com', status: 'Ativo', cargo: 'cargo2' },
  ]);


  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nome || !email || !cargo) {
      setError("Todos os campos devem ser preenchidos.");
      setTimeout(() => setError(""), 5000);
      return;
    }

    if (!validateEmail(email)) {
      setError("Digite um e-mail válido.");
      setTimeout(() => setError(""), 5000);
      return;
    }

    setError("");
    setOpen(false);
    setSuccess(true);

    if (editingIndex !== null) {
      const updatedUsers = [...usersList];
      updatedUsers[editingIndex] = { ...updatedUsers[editingIndex], nome, email, cargo, status };

      setUsersList(updatedUsers);
      setEditingIndex(null);
    } else {
      setUsersList([...usersList, { nome, email, cargo, status }]);
    }

    setNome("");
    setEmail("");
    setCargo("");

    setTimeout(() => setSuccess(false), 3000);
  };

  const selectTextClass = cargo ? "text-black" : "text-[#C4C4C4]";
  return (
    <Layout sidebar={true}>
      <div className="max-w-4xl min-w-4xl flex flex-col items-center gap-5 pt-8">
        <div className="w-full flex flex-col gap-8 items-start">
          <h1 className="text-3xl text-gray-950">
            Painel de Administrador - Gestão de Operadores
          </h1>
          <button
            className="bg-amber-300 text-sky-950 pl-5 pr-5 pt-1.5 pb-1.5 rounded-[5px] cursor-pointer hover:bg-amber-400 transition"
            onClick={() => {
              setNome("");
              setEmail("");
              setCargo("");
              setStatus("Ativo");
              setEditingIndex(null);
              setOpen(true);
          }}>  Cadastrar Operador </button>
          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-full max-w-sm rounded-none bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-center text-lg font-normal text-black">
                  {editingIndex !== null ? "Editar Operador" : "Cadastrar Operador"}
                </h2>
                <form noValidate onSubmit={handleSave} className="space-y-3">
                  <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo"
                  className="w-full rounded-[5px] border border-[#C4C4C4] px-3 py-2 text-sm text-black placeholder-[#C4C4C4] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#C4C4C4] focus:border-[#C4C4C4]"/>
                  
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail"
                    className="w-full rounded-[5px] border border-[#C4C4C4] px-3 py-2 text-sm text-black placeholder-[#C4C4C4] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#C4C4C4] focus:border-[#C4C4C4]"/>
                  
                  <select value={cargo} onChange={(e) => setCargo(e.target.value)}
                  className={`w-full rounded-[5px] border border-[#C4C4C4] px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-[#C4C4C4] focus:border-[#C4C4C4] ${selectTextClass}`}>
                    <option value="">Cargo</option>
                    <option value="cargo1">Cargo 1</option>
                    <option value="cargo2">Cargo 2</option>
                    <option value="cargo3">Cargo 3</option>
                  </select>

                  <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-[5px] border border-[#C4C4C4] px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-[#C4C4C4] focus:border-[#C4C4C4]">
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>

                  {error && (
                    <div role="alert" className="rounded-[5px] bg-[#F1D821] px-4 py-2 text-sm text-black shadow"> {error} </div>
                  )}

                  <div className="mt-4 flex justify-center gap-3">
                    <button type="button" onClick={() => setOpen(false)}
                    className="rounded-[5px] border border-[#C4C4C4] bg-white px-6 py-2 font-normal text-black shadow hover:bg-gray-100">
                      Cancelar
                    </button>

                    <button type="submit"
                    className="rounded-[5px] bg-[#F1D821] px-6 py-2 font-normal text-black shadow hover:opacity-90">
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
              Tem certeza que deseja excluir este operador?
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="rounded-[5px] border border-[#C4C4C4] bg-white px-6 py-2 font-normal text-black shadow hover:bg-gray-100"
                onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button
                className="rounded-[5px] bg-red-500 px-6 py-2 font-normal text-white shadow hover:opacity-90"
                onClick={() => {
                  if (deleteIndex !== null) {
                    setUsersList(usersList.filter((_, i) => i !== deleteIndex));
                    setDeleteIndex(null);
                  }
                  setShowDeleteModal(false);
                }}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div role="status" className="fixed bottom-4 right-4 z-50 rounded-[5px] bg-[#F1D821] px-6 py-3 text-black shadow-lg">
          {"\u2713"} Alterações salvas com sucesso!
        </div>
      )}
        </div>
        <div className="w-full min-w-[600px] rounded-[5px] overflow-x-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className=" border border-gray-200 px-4 py-2 text-left text-gray-700">
                  Nome
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">
                  E-mail
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">
                  Status
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="border border-gray-200 px-4 py-2">
                    {user.nome}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {user.email}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {user.status}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <div className="flex justify-center items-center gap-5">
                      <button className="text-blue-500 hover:text-blue-700 flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          setNome(user.nome);
                          setEmail(user.email);
                          setCargo(user.cargo || "");
                          setStatus(user.status || "Ativo");
                          setEditingIndex(index);
                          setOpen(true);
                        }}><MdEdit color="black" size={20} />
                      </button>
                      <button
                          className="text-red-500 hover:text-red-700 flex items-center justify-center cursor-pointer"
                          onClick={() => {
                          setDeleteIndex(index);
                          setShowDeleteModal(true);
                        }}><FaTrashAlt size={20} />
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