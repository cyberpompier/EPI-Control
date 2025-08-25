export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Ici on entoure tout le contenu avec Layout
  return <Layout>{children}</Layout>;
}
