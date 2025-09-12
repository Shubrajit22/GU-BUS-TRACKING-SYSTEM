import { useState } from "react";
import DriverPage from "./pages/DriverPage"
import ClientPage from "./pages/ClientPage"


export default function App() {
  const [currentRoute, setCurrentRoute] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  
  const routes = [
    { 
      id: "bus101", 
      name: "Bus 101", 
      route: "High Court - Dharapur Route",
      status: "Active",
      passengers: 0,
      color: "blue"
    },
    { 
      id: "bus202", 
      name: "Bus 202", 
      route: "Basistha Chariali - AT-7 Boys Hostel Route",
      status: "Active", 
      passengers: 0,
      color: "green"
    },

  ];

  const handleNavigation = (view, route = null) => {
    setCurrentView(view);
    setCurrentRoute(route);
  };

  const renderHome = () => (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-12 lg:mb-16">
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-4">
            Bus Tracking System
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Real-time bus tracking for drivers and passengers. Stay connected, stay informed.
          </p>
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 lg:mb-16">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
            {routes.filter(r => r.status === 'Active').length}
          </div>
          <div className="text-sm sm:text-base text-gray-600">Active Routes</div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
            {routes.reduce((sum, r) => sum + r.passengers, 0)}
          </div>
          <div className="text-sm sm:text-base text-gray-600">Total Passengers</div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">24/7</div>
          <div className="text-sm sm:text-base text-gray-600">Service</div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">
            <span className="text-sm">~</span>2min
          </div>
          <div className="text-sm sm:text-base text-gray-600">Avg Update</div>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {routes.map((route) => (
          <div
            key={route.id}
            className="group bg-white/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${
              route.color === 'blue' ? 'from-blue-50 to-blue-100' :
              route.color === 'green' ? 'from-green-50 to-green-100' :
              route.color === 'red' ? 'from-red-50 to-red-100' :
              'from-purple-50 to-purple-100'
            } opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-3xl`}></div>
            
            <div className="relative z-10">
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  route.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <div className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    route.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  {route.status}
                </div>
                <div className="text-sm text-gray-500">
                  {route.passengers} 👥
                </div>
              </div>

              {/* Bus Info */}
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 group-hover:text-gray-900">
                  {route.name}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4">
                  {route.route}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleNavigation('driver', route)}
                  disabled={route.status === 'Offline'}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                    route.status === 'Active'
                      ? `${route.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
                          route.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
                          route.color === 'red' ? 'bg-red-500 hover:bg-red-600' :
                          'bg-purple-500 hover:bg-purple-600'
                        } text-white shadow-lg hover:shadow-xl`
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  🚌 Driver Mode
                </button>
                <button
                  onClick={() => handleNavigation('client', route)}
                  disabled={route.status === 'Offline'}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                    route.status === 'Active'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  📱 Track Bus
                </button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className={`absolute -top-4 -right-4 w-20 h-20 ${
              route.color === 'blue' ? 'bg-blue-200' :
              route.color === 'green' ? 'bg-green-200' :
              route.color === 'red' ? 'bg-red-200' :
              'bg-purple-200'
            } rounded-full opacity-20 group-hover:scale-110 transition-transform duration-500`}></div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 lg:mt-20 text-center">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-6">
            Our support team is available 24/7 to assist with any tracking issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              📞 Contact Support
            </button>
            <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
              📖 User Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    if (currentView === 'driver') {
      return (
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => handleNavigation('home')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              ← Back to Routes
            </button>
          </div>
          <DriverPage />
        </div>
      );
    }
    
    if (currentView === 'client') {
      return (
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => handleNavigation('home')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              ← Back to Routes
            </button>
          </div>
          <ClientPage />
        </div>
      );
    }
    
    return renderHome();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-300/20 to-blue-300/20 rounded-full blur-3xl"></div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        {renderPage()}
      </div>

      {/* Mobile-friendly floating elements */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-20">
        <button className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center">
          💬
        </button>
      </div>
    </div>
  );
}