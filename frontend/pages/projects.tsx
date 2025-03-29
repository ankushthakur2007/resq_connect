import Image from 'next/image';
import Link from 'next/link';

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "Emergency Aid Distribution",
      location: "Southern California, USA",
      image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop",
      description: "Providing emergency supplies and assistance to communities affected by the recent wildfires in Southern California.",
      status: "Active",
      impact: "3,500+ individuals assisted"
    },
    {
      id: 2,
      title: "Medical Relief Camp",
      location: "Northern Philippines",
      image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=2070&auto=format&fit=crop",
      description: "Setting up medical camps to provide healthcare to communities impacted by the typhoon season in the northern regions.",
      status: "Active",
      impact: "2,100+ patients treated"
    },
    {
      id: 3,
      title: "Community Reconstruction",
      location: "Gujarat, India",
      image: "https://images.unsplash.com/photo-1503595855261-9418f48a991a?q=80&w=2070&auto=format&fit=crop",
      description: "Rebuilding essential infrastructure and housing for villages damaged by the recent floods in Gujarat.",
      status: "Active",
      impact: "15 villages, 450+ homes"
    },
    {
      id: 4,
      title: "Earthquake Response",
      location: "Central Mexico",
      image: "https://images.unsplash.com/photo-1579612638375-4482e2a078aa?q=80&w=2070&auto=format&fit=crop",
      description: "Providing emergency response and coordination for areas affected by the 6.4 magnitude earthquake in central Mexico.",
      status: "Active",
      impact: "1,200+ families supported"
    }
  ];

  return (
    <div>
      {/* Hero section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-slate-800 text-white">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1469571486292-b53601010376?q=80&w=2070&auto=format&fit=crop"
            alt="Disaster relief projects"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Our Relief Projects</h1>
          <p className="text-xl">
            Explore our ongoing initiatives providing critical support to communities affected by disasters worldwide.
          </p>
        </div>
      </section>

      {/* Current projects section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Current Relief Efforts</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            These are our active projects where we're making a difference right now. 
            Your support can help us extend our reach and impact.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                    {project.status}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-500 mb-4">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {project.location}
                  </p>
                  <p className="text-gray-700 mb-6">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {project.impact}
                    </span>
                    <Link href={`/projects/${project.id}`} className="text-red-600 hover:text-red-800 font-medium">
                      Learn More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact section */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center">Our Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-red-600 mb-4">12,000+</div>
              <p className="text-gray-700">People Assisted</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-red-600 mb-4">28</div>
              <p className="text-gray-700">Active Projects</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-red-600 mb-4">15</div>
              <p className="text-gray-700">Countries Served</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-red-600 mb-4">5,200+</div>
              <p className="text-gray-700">Volunteers Mobilized</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get involved section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get Involved</h2>
          <p className="text-xl text-gray-600 mb-10">
            There are many ways you can contribute to our mission and help communities in need.
            Whether through donations, volunteering, or spreading awareness, your support makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/volunteer" className="bg-red-600 hover:bg-red-700 transition-colors px-8 py-3 text-lg rounded-md font-medium text-white">
              Volunteer Now
            </Link>
            <Link href="/donate" className="bg-slate-800 hover:bg-slate-700 transition-colors px-8 py-3 text-lg rounded-md font-medium text-white">
              Donate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 