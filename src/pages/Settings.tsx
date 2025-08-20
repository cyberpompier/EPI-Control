import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet';

export default function Settings() {
  return (
    <Layout>
      <Helmet>
        <title>Paramètres | EPI Control</title>
      </Helmet>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="mt-4">Cette page est en cours de construction.</p>
      </div>
    </Layout>
  );
}