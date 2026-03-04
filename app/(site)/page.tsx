export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          The Blockchain Operating System
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          NEAR is a blockchain operating system for the open web. Fast, scalable,
          and secure.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800">
            Get Started
          </button>
          <button className="border border-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-gray-50">
            Learn More
          </button>
        </div>
      </div>

      {/* Features section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Why NEAR?</h2>
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Fast</h3>
            <p className="text-gray-600">
              Process transactions in seconds, not minutes
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-2">Scalable</h3>
            <p className="text-gray-600">
              Sharding technology enables unlimited growth
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Secure</h3>
            <p className="text-gray-600">
              Proof of Stake with industry-leading security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
