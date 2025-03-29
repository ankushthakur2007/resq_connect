import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-8 text-xl">The page you are looking for does not exist.</p>
      
      <div className="space-y-6">
        <div className="p-6 bg-red-50 rounded-lg max-w-md mx-auto">
          <p className="mb-4">This application is deployed on GitHub Pages which has limitations:</p>
          <ul className="text-left list-disc pl-5 mb-4">
            <li>API routes do not work</li>
            <li>Server-side rendering is disabled</li>
            <li>Database features are limited</li>
          </ul>
          <p>This is a static demo version of the application.</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Try these working pages:</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Home Page
            </Link>
            <Link 
              href="/test"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Test Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
