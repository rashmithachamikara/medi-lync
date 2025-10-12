export default function Support() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-yellow-400 text-yellow-900 text-center py-3 font-semibold">
        🚧 Under Construction 🚧
      </div>
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
            Support Center
          </h1>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              How can we help you?
            </h2>
            <p className="text-gray-600 mb-6">
              Get support for Pharma Flow - your pharmacy management solution.
              Find answers to common questions or contact our support team.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Contact Support
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-20">Email:</span>
                    <span className="text-gray-600">support@pharmaflow.com</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-20">Phone:</span>
                    <span className="text-gray-600">1-800-PHARMA-1</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-20">Hours:</span>
                    <span className="text-gray-600">Mon-Fri 9AM-6PM EST</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Quick Support
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-800">System Issues</div>
                    <div className="text-sm text-gray-600">Report technical problems</div>
                  </button>
                  <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-800">Account Help</div>
                    <div className="text-sm text-gray-600">Login and account issues</div>
                  </button>
                  <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-gray-800">Training</div>
                    <div className="text-sm text-gray-600">Learn how to use Pharma Flow</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  How do I reset my password?
                </h3>
                <p className="text-gray-600">
                  Click &quot;Forgot Password&quot; on the login page and follow the instructions sent to your email.
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  How do I add new inventory items?
                </h3>
                <p className="text-gray-600">
                  Navigate to the Inventory section and click &quot;Add Item&quot; to enter new medicine or supply details.
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Can I export reports?
                </h3>
                <p className="text-gray-600">
                  Yes, go to Reports section and select your desired report format (PDF, Excel, or CSV).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  How do I contact technical support?
                </h3>
                <p className="text-gray-600">
                  Use the contact information above or submit a ticket through our support portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}