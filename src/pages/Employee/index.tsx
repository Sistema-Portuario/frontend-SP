import Layout from "../../components/Layout";

export default function Employee() {
  return (
    <Layout sidebar={true} type="employee">
      <div className=" w-full h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">Pagina do funcionário</h1>
      </div>
    </Layout>
  )
}