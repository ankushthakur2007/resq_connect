import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import EmergencyAlert from '../components/EmergencyAlert';
import EmergencyStats from '../components/EmergencyStats';

export default function Home() {
  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full h-[90vh] flex items-center justify-center bg-gradient-to-r from-slate-800 to-slate-600 text-white">
          <div className="absolute inset-0 z-0 opacity-40">
            <Image
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1974&auto=format&fit=crop"
              alt="Disaster scene"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <div className="z-10 max-w-4xl mx-auto text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Strength in Unity</h1>
            <p className="text-xl md:text-2xl mb-8">
              Join us in providing critical support and relief to those affected by disasters. 
              Together, we can make a difference in communities in need.
            </p>
            <Link href="/volunteer" className="btn-primary inline-block">
              Support Now
            </Link>
          </div>
        </section>

        {/* Emergency Stats Section */}
        <section className="w-full py-12 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Current Emergency Response</h2>
            <EmergencyStats />
          </div>
        </section>

        {/* Welcome Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Welcome to ResQconnect</h2>
            <p className="text-xl text-center text-gray-600 mb-10 max-w-3xl mx-auto">
              ResQconnect is dedicated to providing essential disaster relief to communities worldwide. 
              We focus on delivering swift and effective aid during times of crisis.
            </p>
            <div className="flex justify-center">
              <Link href="/about" className="btn-outline inline-block">
                Read More
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Our Mission to Serve</h2>
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <div className="aspect-square relative">
                  <Image
                    src="https://images.unsplash.com/photo-1584744826382-cbc74706c83d?q=80&w=2080&auto=format&fit=crop"
                    alt="Gas Mask - Emergency Response"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-3xl font-bold mb-4">Who We Are</h3>
                <p className="text-lg text-gray-700 mb-6">
                  ResQconnect is dedicated to providing essential disaster relief to communities worldwide. 
                  Our organization focuses on delivering swift and effective aid during times of crisis. 
                  By collaborating with local partners and responders, we ensure that help reaches those 
                  most in need, restoring hope and rebuilding lives.
                </p>
                <Link href="/about" className="btn-secondary inline-block">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Alert Section */}
        <section className="py-20 px-4 bg-red-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Report an Emergency</h2>
            <p className="text-xl text-center text-gray-600 mb-10 max-w-3xl mx-auto">
              If you are experiencing or witness an emergency situation, you can report it here. 
              Our team will respond as quickly as possible to provide assistance.
            </p>
            <EmergencyAlert />
          </div>
        </section>

        {/* Relief Projects Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Our Relief Projects</h2>
            <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
              Explore our ongoing relief projects and initiatives designed to address urgent needs in 
              disaster-affected regions. Your support can help us bring comfort and assistance to those 
              facing the aftermath of natural disasters and emergencies.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Emergency Aid */}
              <div className="card hover-lift">
                <div className="card-body">
                  <h3 className="text-2xl font-bold mb-2">Emergency Aid</h3>
                  <p className="text-gray-700 mb-4 font-medium">Immediate Assistance</p>
                  <p className="text-gray-600">
                    Our emergency aid focuses on providing quick and vital support to disaster-stricken areas. 
                    From medical supplies to shelter assistance, we act fast to save lives and alleviate suffering.
                  </p>
                </div>
              </div>
              
              {/* Reconstruction */}
              <div className="card hover-lift">
                <div className="card-body">
                  <h3 className="text-2xl font-bold mb-2">Reconstruction</h3>
                  <p className="text-gray-700 mb-4 font-medium">Rebuilding Hope</p>
                  <p className="text-gray-600">
                    The reconstruction projects aim to rebuild communities and infrastructures devastated by disasters. 
                    We work towards sustainable recovery, ensuring affected areas have the resources needed to bounce back stronger.
                  </p>
                </div>
              </div>
              
              {/* Community Resilience */}
              <div className="card hover-lift">
                <div className="card-body">
                  <h3 className="text-2xl font-bold mb-2">Community Resilience</h3>
                  <p className="text-gray-700 mb-4 font-medium">Building Back Better</p>
                  <p className="text-gray-600">
                    Community resilience initiatives focus on empowering locals to withstand and recover from disasters. 
                    By providing training, resources, and support, we help communities become more prepared and resilient.
                  </p>
                </div>
              </div>
              
              {/* Medical Assistance */}
              <div className="card hover-lift">
                <div className="card-body">
                  <h3 className="text-2xl font-bold mb-2">Medical Assistance</h3>
                  <p className="text-gray-700 mb-4 font-medium">Healthcare Support</p>
                  <p className="text-gray-600">
                    Our medical assistance projects target the health needs of communities during disasters. 
                    We provide emergency medical care, supplies, and mobile clinics to ensure the wellbeing of those affected.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-12">
              <Link href="/projects" className="btn-primary inline-block">
                Discover More
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
} 