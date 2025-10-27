import React from 'react';

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Patel",
      role: "Clinical Psychologist",
      bio: "Specialized in cognitive behavioral therapy and digital mental health interventions.",
      avatar: "👩‍⚕️"
    },
    {
      name: "Yashvi Muchhala",
      role: "Product Designer",
      bio: "Passionate about creating intuitive and accessible mental health tools.",
      avatar: "👨‍💻"
    },
    {
      name: "Dr. Emily Watson",
      role: "Research Director",
      bio: "Focuses on evidence-based mental wellness practices and outcomes.",
      avatar: "🔬"
    },
    {
      name: "Tanish Tare",
      role: "AI Engineer",
      bio: "Develops compassionate AI systems for mental health support.",
      avatar: "🤖"
    }
  ];

  const features = [
    {
      icon: "🔒",
      title: "Completely Private",
      description: "Your data stays with you. We never share your personal information."
    },
    {
      icon: "📚",
      title: "Evidence-Based",
      description: "All tools are based on proven psychological principles and research."
    },
    {
      icon: "🌍",
      title: "Accessible to All",
      description: "Free tools available to everyone, regardless of background or circumstances."
    },
    {
      icon: "💝",
      title: "Compassionate Design",
      description: "Built with empathy and understanding at every step."
    }
  ];

  const stats = [
    { number: "50K+", label: "Users Supported" },
    { number: "24/7", label: "Available" },
    { number: "95%", label: "User Satisfaction" },
    { number: "100%", label: "Confidential" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">MindWell</span>
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
            Your compassionate companion on the journey to mental wellness. 
            We're here to make mental health support accessible, private, and effective for everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To democratize mental health support through technology that's both powerful and compassionate
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Why We Exist</h3>
                <p className="text-lg leading-relaxed">
                  Mental health care should be accessible to everyone, yet barriers like cost, stigma, 
                  and availability prevent millions from getting the support they need. MindWell bridges 
                  this gap with evidence-based tools that empower individuals to take control of their 
                  mental wellness journey.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Innovation Meets Empathy</h4>
                  <p className="text-gray-600">Combining cutting-edge technology with human-centered design</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🌱</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Growth Focused</h4>
                  <p className="text-gray-600">Tools designed to help you grow and maintain mental wellness</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🤝</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Community Driven</h4>
                  <p className="text-gray-600">Built with feedback from mental health professionals and users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-bold text-indigo-400">{stat.number}</div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <p className="text-xl text-gray-600">Designed with care, built with purpose</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">Passionate professionals dedicated to mental wellness</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-blue-50 rounded-2xl">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Evidence-Based</h3>
              <p className="text-gray-600">
                Every feature is grounded in psychological research and validated therapeutic approaches
              </p>
            </div>
            
            <div className="text-center p-8 bg-green-50 rounded-2xl">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy First</h3>
              <p className="text-gray-600">
                Your mental health data is sacred. We protect it with enterprise-grade security
              </p>
            </div>
            
            <div className="text-center p-8 bg-purple-50 rounded-2xl">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Compassionate</h3>
              <p className="text-gray-600">
                Built with empathy and understanding at the core of every interaction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Important Disclaimer</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              MindWell is designed to support mental wellness and provide tools for self-care. 
              However, it is <strong>not a substitute for professional medical advice, diagnosis, or treatment</strong>.
            </p>
            <p className="text-gray-600">
              Always seek the advice of qualified health providers with any questions about medical conditions. 
              If you're in crisis, please contact emergency services or a crisis helpline immediately.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Crisis Resources
              </button>
              <button className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Find a Therapist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Wellness Journey?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of others who are taking control of their mental health with MindWell
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors">
              Get Started Today
            </button>
            <button className="px-8 py-4 border border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;