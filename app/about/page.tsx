import Image from 'next/image';

export default function About() {
  return (
    <div>
      {/* Hero section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-slate-800 text-white">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/images/disaster-team.jpg"
            alt="Disaster response team"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">About ResQconnect</h1>
          <p className="text-xl">Committed to providing aid and support to those affected by disasters worldwide.</p>
        </div>
      </section>

      {/* Mission section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-6">
                ResQconnect is dedicated to providing essential disaster relief to communities worldwide. 
                Our mission is to respond swiftly and effectively to natural disasters and emergencies, 
                providing immediate aid and long-term support to affected communities.
              </p>
              <p className="text-gray-700">
                We believe in the power of collaboration and coordination. By bringing together technology, 
                resources, and dedicated volunteers, we can make a significant impact on communities in crisis. 
                Our platform connects those in need with those who can help, ensuring efficient and effective 
                disaster response.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/mission.jpg"
                alt="Our mission"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Compassion</h3>
              <p className="text-gray-600">
                We approach every situation with empathy and understanding, recognizing the profound impact 
                disasters have on individuals and communities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Swift Response</h3>
              <p className="text-gray-600">
                We prioritize quick action in times of crisis, understanding that immediate response can save 
                lives and reduce suffering.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Collaboration</h3>
              <p className="text-gray-600">
                We believe in the power of working together. By coordinating efforts with local communities, 
                organizations, and governments, we can achieve greater impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team member 1 */}
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/team-1.jpg"
                  alt="Team member"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="text-xl font-bold">Sarah Johnson</h3>
              <p className="text-gray-600 mb-3">Founder & CEO</p>
              <p className="text-gray-700 text-sm">
                With over 15 years of experience in disaster management, Sarah founded ResQconnect 
                to bridge the gap between emergency responders and those in need.
              </p>
            </div>
            
            {/* Team member 2 */}
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/team-2.jpg"
                  alt="Team member"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="text-xl font-bold">Michael Rodriguez</h3>
              <p className="text-gray-600 mb-3">Operations Director</p>
              <p className="text-gray-700 text-sm">
                Michael oversees our field operations, ensuring that aid is delivered efficiently 
                and effectively to those who need it most.
              </p>
            </div>
            
            {/* Team member 3 */}
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/team-3.jpg"
                  alt="Team member"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="text-xl font-bold">Aisha Patel</h3>
              <p className="text-gray-600 mb-3">Technology Lead</p>
              <p className="text-gray-700 text-sm">
                Aisha leads our tech team, developing innovative solutions to improve disaster 
                response coordination and communication.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 