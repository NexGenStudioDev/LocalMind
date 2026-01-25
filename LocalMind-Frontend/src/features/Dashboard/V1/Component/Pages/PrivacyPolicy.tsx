import React from 'react'
const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Privacy Policy
        </h1>

        <p className="text-gray-700 mb-4">
          At LocalMind, your privacy matters. This Privacy Policy explains what
          information we collect, how we use it, and your rights regarding your
          personal data.
        </p>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Information We Collect
          </h2>
          <p className="text-gray-700 text-sm">
            We do not collect, share, or sell personal information. LocalMind
            operates locally, on your device, without tracking or analytics.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Use of Data
          </h2>
          <p className="text-gray-700 text-sm">
            Any data you input is processed locally within the app and is never
            sent to external servers unless you explicitly configure integrations.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Contact Us
          </h2>
          <p className="text-gray-700 text-sm">
            For questions about this policy, email us at support@localmind.dev
          </p>
        </section>
      </div>

    </div>
  )
}

export default PrivacyPolicy
