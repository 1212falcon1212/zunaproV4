export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-xl font-bold">ZunaPro Admin</h1>
      </header>
      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Tenants</h3>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Tenants</h3>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-sm font-medium text-gray-500">Revenue (MRR)</h3>
            <p className="mt-2 text-3xl font-bold">$0</p>
          </div>
        </div>
      </main>
    </div>
  );
}
