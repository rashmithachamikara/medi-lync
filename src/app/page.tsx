import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-yellow-400 text-yellow-900 text-center py-3 font-semibold">
        🚧 Under Construction 🚧
      </div>
      <div className="flex items-center justify-center min-h-[calc(100vh-48px)]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Pharma Flow
          </h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Streamline Your Pharmacy Operations
            </h2>
            <p className="text-gray-600 mb-6">
              Pharma Flow helps pharmacies manage inventory, track prescriptions,
              and optimize daily operations with ease.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-gray-800">Inventory Management</h3>
                <p className="text-sm text-gray-600">Track medicines and supplies efficiently</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-gray-800">Prescription Tracking</h3>
                <p className="text-sm text-gray-600">Monitor patient prescriptions and history</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-gray-800">Reporting & Analytics</h3>
                <p className="text-sm text-gray-600">Generate insights for better decision making</p>
              </div>
            </div>
            
          </div>
          
            <div className="mt-6">
              <Link
                href="/support"
                className="inline-block bg-zinc-900 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Get Support
              </Link>
            </div>
        </div>
        
      </div>
    </div>
  );
}
