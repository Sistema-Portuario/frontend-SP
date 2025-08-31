import Layout from '../components/Layout';
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";


export default function AdminDashboard() {
  const users = [
    { nome: 'Lorem ipsum', email: 'loremispsum@gmail.com', status: 'Ativo' },
    { nome: 'Lorem ipsum', email: 'loremispsum@gmail.com', status: 'Ativo' },
    { nome: 'Lorem ipsum', email: 'loremispsum@gmail.com', status: 'Ativo' },
    { nome: 'Lorem ipsum', email: 'loremispsum@gmail.com', status: 'Ativo' },
    { nome: 'Lorem ipsum', email: 'loremispsum@gmail.com', status: 'Ativo' },
  ];

  return (
    <Layout sidebar={true}>
      <div className="max-w-4xl min-w-4xl flex flex-col items-center gap-5 pt-8">
        <div className="w-full flex flex-col gap-8 items-start">
          <h1 className="text-3xl text-gray-900">
            Painel de Administrador - Gestão de Operadores
          </h1>
          <button className="bg-amber-300 pl-5 pr-5 pt-1.5 pb-1.5 rounded-[5px] cursor-pointer hover:bg-amber-400 transition">
            Cadastrar Operador
          </button>
        </div>

        <div className="w-full min-w-[600px] rounded-[5px] overflow-x-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className=" border border-gray-200 px-4 py-2 text-left text-gray-700">Nome</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">E-mail</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">Status</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="border border-gray-200 px-4 py-2">{user.nome}</td>
                  <td className="border border-gray-200 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-200 px-4 py-2">{user.status}</td>
                  <td className="border border-gray-200 px-4 py-2">
                    <div className='flex justify-center items-center gap-5'>
                      <button className="text-blue-500 hover:text-blue-700 flex items-center justify-center cursor-pointer">
                        <MdEdit color='black' size={20}/>
                      </button>
                      <button className="text-red-500 hover:text-red-700 flex items-center justify-center cursor-pointer">
                        <FaTrashAlt size={20}/>
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
