import React from 'react'

const TermsConditions: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Terms & Conditions
        </h1>

        <p className="text-gray-700 mb-4">
          These Terms & Conditions govern your use of the LocalMind platform.
          By accessing or using LocalMind, you agree to be bound by these terms.
        </p>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Use License
          </h2>
          <p className="text-gray-700 text-sm">
            You are granted a limited, non-exclusive, non-transferable license to
            use LocalMind for personal or internal use only.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Limitations
          </h2>
          <p className="text-gray-700 text-sm">
            LocalMind is provided “as-is.” We are not liable for any damages
            arising from the use of the platform.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Governing Law
          </h2>
          <p className="text-gray-700 text-sm">
            These Terms are governed by the laws of the applicable jurisdiction
            where LocalMind is operated.
          </p>
        </section>
      </div>

    </div>
  )
}

export default TermsConditions
