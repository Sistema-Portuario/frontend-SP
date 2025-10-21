import Layout from "../../components/Layout";

export default function AdminDashboard() {
  return (
    <Layout sidebar={true}>
      <div className=" w-full h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
    </Layout>
  )
}
