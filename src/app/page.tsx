'use client'
import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Star,
  Menu,
  X,
  Cloud,
  Zap,
  BarChart3,
  CreditCard,
  Smartphone,
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
  PlayCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const router = useRouter();


  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Orders",
      description: "Process orders 3x faster with our intuitive interface designed for speed and accuracy.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Get instant insights into sales, inventory, and customer behavior with live dashboards.",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Multiple Payment Options",
      description: "Accept cash, cards, mobile payments, and digital wallets all in one unified system.",
      color: "from-green-400 to-teal-500"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Sync & Backup",
      description: "Your data is automatically synchronized and backed up across all devices securely.",
      color: "from-purple-400 to-pink-500"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Restaurants", icon: <Users className="w-6 h-6" /> },
    { number: "50M+", label: "Orders Processed", icon: <TrendingUp className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime", icon: <Shield className="w-6 h-6" /> },
    { number: "24/7", label: "Support", icon: <Smartphone className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Maria Rodriguez",
      role: "Owner, Taco Libre",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      content: "This POS system transformed our restaurant operations. Order processing is now seamless and our staff loves how intuitive it is.",
      rating: 5
    },
    {
      name: "James Chen",
      role: "Manager, Urban Bistro",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      content: "The analytics dashboard gives us insights we never had before. We have increased our efficiency by 40% since switching.",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Owner, Café Dreams",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      content: "Customer service is exceptional and the system is incredibly reliable. It has been a game-changer for our business.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToLogin = () => {
    router.push('/auth/login');
  };
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TicoTaco POS</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {['Features', 'Pricing', 'Testimonials', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-white/10 rounded-lg"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={goToLogin}
                className="text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors">
                Sign In
              </button>
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 transform hover:scale-105">
                Start Free Trial
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-lg border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['Features', 'Pricing', 'Testimonials', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium w-full text-left hover:bg-white/10 rounded-lg transition-colors"
                >
                  {item}
                </button>
              ))}
              <div className="pt-4 pb-2 border-t border-white/10 space-y-2">
                <button className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium w-full text-left">
                  Sign In
                </button>
                <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium w-full">
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-8 inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full px-6 py-2 backdrop-blur-sm border border-yellow-400/30">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">Trusted by 10,000+ restaurants</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Revolutionize Your
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Restaurant Operations
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The most intuitive POS system designed specifically for modern restaurants.
              Process orders faster, boost revenue, and delight customers with seamless experiences.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors">
                <div className="p-3 bg-white/10 rounded-full group-hover:bg-yellow-400/20 transition-colors">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <span className="text-lg font-medium">Watch Demo</span>
              </button>
            </div>

            {/* Hero Image/Dashboard Preview */}
            <div className="mt-16 relative">
              <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl border border-white/10 p-8 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-white text-sm opacity-75">TicoTaco POS Dashboard</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-yellow-400 text-2xl font-bold">$12,450</div>
                      <div className="text-gray-300 text-sm">Today&apos;s Revenue</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-green-400 text-2xl font-bold">147</div>
                      <div className="text-gray-300 text-sm">Orders Processed</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-blue-400 text-2xl font-bold">4.8★</div>
                      <div className="text-gray-300 text-sm">Customer Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-xl border border-yellow-400/30 group-hover:border-yellow-400/60 transition-colors">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Modern Restaurants
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to run your restaurant efficiently, from order management to analytics and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${activeFeature === index
                    ? 'bg-white/5 border-yellow-400/50 shadow-lg shadow-yellow-400/10'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white flex-shrink-0`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:pl-8">
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-xl p-6 min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${features[activeFeature].color} mb-4`}>
                      {React.cloneElement(features[activeFeature].icon, { size: 48, className: "text-white" })}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{features[activeFeature].title}</h3>
                    <p className="text-gray-300">{features[activeFeature].description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Loved by Restaurant Owners
            </h2>
            <p className="text-xl text-gray-300">See what our customers have to say about their experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">&quot;{testimonial.content}&quot;</p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of restaurants already using TicoTaco POS to streamline operations and boost revenue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
              <span>Start Your Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-gray-400">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TicoTaco POS</span>
            </div>
            <div className="text-gray-400 text-center md:text-left">
              © 2025 TicoTaco POS. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;