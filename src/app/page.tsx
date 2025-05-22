import Link from 'next/link'; // Import Link for client-side navigation

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="text-center bg-white p-10 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Project Tools</h1>
        <p className="mb-6 text-lg text-gray-600">
          Explore available tools and testing environments for this project.
        </p>
        <Link
          href="/yotpo-tester"
          className="inline-block px-8 py-4 text-xl font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors shadow-sm hover:shadow-md"
        >
          Yotpo Loyalty API Playground
        </Link>
      </div>
    </main>
  );
}
