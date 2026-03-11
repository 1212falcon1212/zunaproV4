export default function TenantsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-xl font-bold">ZunaPro Admin</h1>
      </header>
      <main className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Tenants</h2>
        </div>
        <div className="rounded-lg border bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Plan</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Created</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No tenants yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
