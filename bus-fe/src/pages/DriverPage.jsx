import { useEffect, useState, useRef } from "react";

export default function DriverPage() {
  // Mock routeId for demo - in real app, get from props or router
  const routeId = "route-123";
  
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [error, setError] = useState(null);
  
  const wsRef = useRef(null);
  const intervalRef = useRef(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket("ws://localhost:8080");

        wsRef.current.onopen = () => {
          console.log("Connected as Driver");
          setConnectionStatus('connected');
          setError(null);
          
          wsRef.current.send(
            JSON.stringify({
              type: "join",
              payload: { roomId: routeId, role: "driver" },
            })
          );
        };

        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
              case "passenger_joined":
                setPassengers(prev => [...prev.filter(p => p.id !== data.payload.id), data.payload]);
                break;
              case "passenger_left":
                setPassengers(prev => prev.filter(p => p.id !== data.payload.id));
                break;
              case "passengers_update":
                setPassengers(data.payload || []);
                break;
              default:
                console.log("Received:", data);
            }
          } catch (err) {
            console.error("Error parsing message:", err);
          }
        };

        wsRef.current.onclose = () => {
          setConnectionStatus('disconnected');
          console.log("WebSocket connection closed");
          
          // Attempt to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        wsRef.current.onerror = (error) => {
          console.error("WebSocket error:", error);
          setError("Connection error. Retrying...");
          setConnectionStatus('error');
        };
      } catch (err) {
        setError("Failed to connect to server");
        setConnectionStatus('error');
      }
    };

    const startLocationTracking = () => {
      if (!navigator.geolocation) {
        setError("Geolocation not supported");
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      };

      // Watch position for real-time updates
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed, heading } = position.coords;
          const timestamp = new Date().toISOString();
          
          const locationData = {
            lat: latitude,
            lng: longitude,
            accuracy,
            speed: speed || 0,
            heading: heading || 0,
            timestamp
          };

          setCurrentLocation(locationData);
          
          // Add to history (keep last 50 locations)
          setLocationHistory(prev => [
            ...prev.slice(-49),
            locationData
          ]);

          // Send location via WebSocket
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({
                type: "location",
                payload: locationData,
              })
            );
          }
        },
        (error) => {
          console.error("Location error:", error);
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setError("Location access denied. Please enable location permissions.");
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Location information unavailable.");
              break;
            case error.TIMEOUT:
              setError("Location request timeout.");
              break;
            default:
              setError("Unknown location error.");
              break;
          }
        },
        options
      );
    };

    connectWebSocket();
    startLocationTracking();

    return () => {
      // Cleanup
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [routeId]);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatLocation = (location) => {
    if (!location) return 'N/A';
    return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
  };

  const formatSpeed = (speed) => {
    if (!speed || speed < 0) return 'N/A';
    return `${(speed * 3.6).toFixed(1)} km/h`; // Convert m/s to km/h
  };

  const formatAccuracy = (accuracy) => {
    if (!accuracy) return 'N/A';
    return `±${accuracy.toFixed(0)}m`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Driver Dashboard
          </h1>
          <p className="text-gray-600 mb-4">Route ID: {routeId}</p>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className={`font-medium ${getConnectionStatusColor()}`}>
                {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
              </span>
            </div>
            
            {passengers.length > 0 && (
              <div className="text-sm text-gray-600">
                {passengers.length} passenger{passengers.length !== 1 ? 's' : ''} connected
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Location */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Location</h2>
            
            {currentLocation ? (
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Coordinates:</span>
                  <p className="font-mono text-lg">{formatLocation(currentLocation)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Speed:</span>
                    <p className="font-medium">{formatSpeed(currentLocation.speed)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Accuracy:</span>
                    <p className="font-medium">{formatAccuracy(currentLocation.accuracy)}</p>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">
                  Last updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Waiting for location data...</p>
            )}
          </div>

          {/* Passengers */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Connected Passengers ({passengers.length})
            </h2>
            
            {passengers.length > 0 ? (
              <div className="space-y-2">
                {passengers.map((passenger) => (
                  <div key={passenger.id} className="p-3 bg-gray-50 rounded border">
                    <div className="font-medium">Passenger {passenger.id}</div>
                    <div className="text-sm text-gray-600">
                      Connected: {new Date(passenger.joinedAt || Date.now()).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No passengers connected</p>
            )}
          </div>
        </div>

        {/* Location History */}
        {locationHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Location History</h2>
            
            <div className="max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {locationHistory.slice(-10).reverse().map((location, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-mono">{formatLocation(location)}</span>
                      <span className="text-gray-500">
                        {new Date(location.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {location.speed > 0 && (
                      <div className="text-xs text-gray-400 mt-1">
                        Speed: {formatSpeed(location.speed)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}