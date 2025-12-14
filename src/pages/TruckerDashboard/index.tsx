import Layout from "../../components/Layout";

export default function TruckerDashboard() {
  return (
    <Layout sidebar={true} type="employee">
      <div className=" w-full h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">dashboard do caminhoneiro</h1>
      </div>
    </Layout>
  );
}
