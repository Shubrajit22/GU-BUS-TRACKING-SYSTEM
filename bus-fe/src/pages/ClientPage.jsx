// import { useEffect, useState, useRef } from "react";
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Routes Data
// const routes = {
//   route1: {
//     name: "High Court - Dharapur Route",
//     color: "#3B82F6",
//     stops: [
//       { id: "high_court", name: "High Court", lat: 26.1445, lng: 91.7362 },
//       { id: "panbazar", name: "Panbazar", lat: 26.15, lng: 91.74 },
//       { id: "fancy_bazar", name: "Fancy Bazar", lat: 26.155, lng: 91.745 },
//       { id: "bharalumukh", name: "Bharalumukh", lat: 26.16, lng: 91.75 },
//       { id: "khanapara", name: "Khanapara", lat: 26.165, lng: 91.755 },
//       { id: "sarusajai", name: "Sarusajai", lat: 26.17, lng: 91.76 },
//       { id: "basistha", name: "Basistha", lat: 26.175, lng: 91.765 },
//       { id: "dharapur", name: "Dharapur", lat: 26.18, lng: 91.77 },
//     ],
//   },
//   route2: {
//     name: "Basistha Chariali - AT-7 Boys Hostel Route",
//     color: "#10B981",
//     stops: [
//       { id: "basistha_chariali", name: "Basistha Chariali", lat: 26.132, lng: 91.789 },
//       { id: "lokhora", name: "Lokhora", lat: 26.135, lng: 91.792 },
//       { id: "isbt_garchuk", name: "ISBT Garchuk", lat: 26.138, lng: 91.795 },
//       { id: "boragaon", name: "Boragaon", lat: 26.141, lng: 91.798 },
//       { id: "tetelia", name: "Tetelia", lat: 26.144, lng: 91.801 },
//       { id: "gst_house", name: "GST House", lat: 26.147, lng: 91.804 },
//       { id: "gu_main_gate", name: "GU Main Gate", lat: 26.15, lng: 91.807 },
//       { id: "at7_boys_hall", name: "AT-7 Boys Hall", lat: 26.153, lng: 91.81 },
//     ],
//   },
// };

// // Custom Icons
// const busIcon = new L.Icon({
//   iconUrl: "data:image/svg+xml;base64," + btoa(`
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1E40AF" width="32" height="32">
//       <path d="M8.5 15.5A1.5 1.5 0 1 1 7 14a1.5 1.5 0 0 1 1.5 1.5zm6 0A1.5 1.5 0 1 1 13 14a1.5 1.5 0 0 1 1.5 1.5zM18 9v1.5A1.5 1.5 0 0 1 16.5 12h-9A1.5 1.5 0 0 1 6 10.5V9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3zM2 19v1a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1v-1h13v1a1 1 0 0 0 1 1H21a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3z"/>
//     </svg>
//   `),
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

// const stopIcon = new L.Icon({
//   iconUrl: "data:image/svg+xml;base64," + btoa(`
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#DC2626" width="24" height="24">
//       <circle cx="12" cy="12" r="8" fill="#DC2626"/>
//       <circle cx="12" cy="12" r="4" fill="#FFFFFF"/>
//     </svg>
//   `),
//   iconSize: [24, 24],
//   iconAnchor: [12, 24],
//   popupAnchor: [0, -24],
// });

// const nextStopIcon = new L.Icon({
//   iconUrl: "data:image/svg+xml;base64=" + btoa(`
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#059669" width="28" height="28">
//       <circle cx="12" cy="12" r="10" fill="#059669"/>
//       <path d="M10 8l6 4-6 4V8z" fill="#FFFFFF"/>
//     </svg>
//   `),
//   iconSize: [28, 28],
//   iconAnchor: [14, 28],
//   popupAnchor: [0, -28],
// });

// // Utility functions
// function calculateDistance(lat1, lng1, lat2, lng2) {
//   return L.latLng(lat1, lng1).distanceTo([lat2, lng2]);
// }

// function getClosestStopIndex(currentLocation, stops) {
//   let closestIndex = 0;
//   let minDistance = Infinity;
//   stops.forEach((stop, i) => {
//     const dist = calculateDistance(currentLocation.lat, currentLocation.lng, stop.lat, stop.lng);
//     if (dist < minDistance) {
//       minDistance = dist;
//       closestIndex = i;
//     }
//   });
//   return closestIndex;
// }

// function calculateETA(distance, avgSpeed = 30) { // 30 km/h average speed
//   const timeInHours = distance / 1000 / avgSpeed;
//   const timeInMinutes = Math.ceil(timeInHours * 60);
//   return timeInMinutes;
// }

// function formatTime(date) {
//   return date.toLocaleTimeString('en-US', { 
//     hour: '2-digit', 
//     minute: '2-digit',
//     hour12: true 
//   });
// }

// // Map updater component
// function MapUpdater({ location }) {
//   const map = useMap();
//   useEffect(() => {
//     map.flyTo([location.lat, location.lng], 15, {
//       animate: true,
//       duration: 1.2,
//     });
//   }, [location, map]);
//   return null;
// }

// // Progress bar component
// function ProgressBar({ current, total }) {
//   const percentage = (current / total) * 100;
//   return (
//     <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
//       <div 
//         className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
//         style={{ width: `${percentage}%` }}
//       />
//     </div>
//   );
// }

// export default function EnhancedBusTracker() {
//   const routeId = "route1"; // You can make this dynamic
//   const currentRoute = routes[routeId];
  
//   const [location, setLocation] = useState({ 
//     lat: currentRoute.stops[0].lat, 
//     lng: currentRoute.stops[0].lng 
//   });
//   const [currentStopIndex, setCurrentStopIndex] = useState(0);
//   const [nextStop, setNextStop] = useState(currentRoute.stops[1]);
//   const [remainingPath, setRemainingPath] = useState(
//     currentRoute.stops.map(s => [s.lat, s.lng])
//   );
//   const [completedPath, setCompletedPath] = useState([[currentRoute.stops[0].lat, currentRoute.stops[0].lng]]);
//   const [eta, setEta] = useState(0);
//   const [isConnected, setIsConnected] = useState(false);
//   const [lastUpdate, setLastUpdate] = useState(new Date());
//   const markerRef = useRef(null);

//   useEffect(() => {
//     // Simulate WebSocket connection (replace with actual WebSocket)
//     const simulateMovement = () => {
//       const stops = currentRoute.stops;
//       let currentIndex = 0;
      
//       const interval = setInterval(() => {
//         if (currentIndex < stops.length - 1) {
//           // Simulate movement between stops
//           const current = stops[currentIndex];
//           const next = stops[currentIndex + 1];
          
//           // Linear interpolation for smooth movement
//           const progress = Math.random() * 0.3 + 0.1; // Random progress
//           const newLat = current.lat + (next.lat - current.lat) * progress;
//           const newLng = current.lng + (next.lng - current.lng) * progress;
          
//           const newLocation = { lat: newLat, lng: newLng };
//           setLocation(newLocation);
//           setLastUpdate(new Date());
          
//           // Update stop information
//           const closestIndex = getClosestStopIndex(newLocation, stops);
//           setCurrentStopIndex(closestIndex);
          
//           if (closestIndex < stops.length - 1) {
//             const nextStopData = stops[closestIndex + 1];
//             setNextStop(nextStopData);
            
//             // Calculate ETA
//             const distanceToNext = calculateDistance(
//               newLocation.lat, newLocation.lng,
//               nextStopData.lat, nextStopData.lng
//             );
//             setEta(calculateETA(distanceToNext));
            
//             // Update paths
//             const newRemainingPath = [
//               [newLocation.lat, newLocation.lng],
//               ...stops.slice(closestIndex + 1).map(s => [s.lat, s.lng])
//             ];
//             setRemainingPath(newRemainingPath);
            
//             const newCompletedPath = [
//               ...stops.slice(0, closestIndex + 1).map(s => [s.lat, s.lng]),
//               [newLocation.lat, newLocation.lng]
//             ];
//             setCompletedPath(newCompletedPath);
//           } else {
//             setNextStop(null);
//             setEta(0);
//             clearInterval(interval);
//           }
          
//           if (Math.random() > 0.7) { // Move to next stop occasionally
//             currentIndex++;
//           }
//         }
//       }, 2000);

//       setIsConnected(true);
//       return () => {
//         clearInterval(interval);
//         setIsConnected(false);
//       };
//     };

//     const cleanup = simulateMovement();
//     return cleanup;
//   }, [currentRoute.stops]);

//   const currentStopName = currentRoute.stops[currentStopIndex]?.name || "Unknown";
//   const totalStops = currentRoute.stops.length;

//   return (
//     <div className="relative w-full h-screen bg-gray-50">
//       {/* Enhanced Info Panel */}
//       <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] 
//                       bg-white/95 backdrop-blur-lg p-4 rounded-2xl shadow-2xl 
//                       w-[95%] max-w-md border border-gray-200">
        
//         {/* Route Header */}
//         <div className="text-center mb-3">
//           <h1 className="text-lg font-bold text-gray-800 mb-1">
//             {currentRoute.name}
//           </h1>
//           <div className="flex items-center justify-center space-x-2">
//             <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
//             <span className="text-sm text-gray-600">
//               {isConnected ? 'Live Tracking' : 'Disconnected'}
//             </span>
//           </div>
//         </div>

//         {/* Progress */}
//         <div className="mb-3">
//           <div className="flex justify-between text-sm text-gray-600 mb-1">
//             <span>Progress</span>
//             <span>{currentStopIndex + 1} of {totalStops} stops</span>
//           </div>
//           <ProgressBar current={currentStopIndex + 1} total={totalStops} />
//         </div>

//         {/* Current Location */}
//         <div className="bg-blue-50 rounded-xl p-3 mb-3">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-blue-600 font-medium">Current Location</p>
//               <p className="text-lg font-bold text-blue-800">{currentStopName}</p>
//             </div>
//             <div className="text-blue-600">
//               <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Next Stop Info */}
//         {nextStop && (
//           <div className="bg-green-50 rounded-xl p-3 mb-3">
//             <div className="flex items-center justify-between mb-2">
//               <div>
//                 <p className="text-sm text-green-600 font-medium">Next Stop</p>
//                 <p className="text-lg font-bold text-green-800">{nextStop.name}</p>
//               </div>
//               <div className="text-green-600">
//                 <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//               </div>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-green-700">ETA: ~{eta} min</span>
//               <span className="text-green-700">
//                 Arrival: {formatTime(new Date(Date.now() + eta * 60000))}
//               </span>
//             </div>
//           </div>
//         )}

//         {/* Route Completed */}
//         {!nextStop && (
//           <div className="bg-gray-50 rounded-xl p-3 mb-3 text-center">
//             <div className="text-gray-600 mb-2">
//               <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <p className="text-lg font-bold text-gray-800">Route Completed!</p>
//             <p className="text-sm text-gray-600">Bus has reached the final destination</p>
//           </div>
//         )}

//         {/* Last Update */}
//         <div className="text-center text-xs text-gray-500 border-t pt-2">
//           Last updated: {formatTime(lastUpdate)}
//         </div>
//       </div>

//       {/* Map Container */}
//       <MapContainer
//         center={[location.lat, location.lng]}
//         zoom={14}
//         className="w-full h-full"
//         style={{ background: "#f8fafc" }}
//       >
//         {/* Satellite/Street Tiles */}
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
//         />

//         {/* Completed Path (Green) */}
//         {completedPath.length > 1 && (
//           <Polyline
//             positions={completedPath}
//             color="#10B981"
//             weight={6}
//             opacity={0.8}
//             dashArray="0"
//           />
//         )}

//         {/* Remaining Path (Blue) */}
//         {remainingPath.length > 1 && (
//           <Polyline
//             positions={remainingPath}
//             color={currentRoute.color}
//             weight={5}
//             opacity={0.7}
//             dashArray="10, 5"
//           />
//         )}

//         {/* Bus Stops */}
//         {currentRoute.stops.map((stop, index) => (
//           <Marker
//             key={stop.id}
//             position={[stop.lat, stop.lng]}
//             icon={index === currentStopIndex + 1 ? nextStopIcon : stopIcon}
//           >
//             <Popup>
//               <div className="text-center">
//                 <h3 className="font-bold">{stop.name}</h3>
//                 <p className="text-sm text-gray-600">
//                   Stop {index + 1} of {totalStops}
//                 </p>
//                 {index === currentStopIndex + 1 && (
//                   <p className="text-green-600 font-medium">Next Stop</p>
//                 )}
//               </div>
//             </Popup>
//           </Marker>
//         ))}

//         {/* Live Bus Position */}
//         <Marker
//           position={[location.lat, location.lng]}
//           icon={busIcon}
//           ref={markerRef}
//         >
//           <Popup>
//             <div className="text-center">
//               <h3 className="font-bold">🚌 Live Bus Location</h3>
//               <p>{currentRoute.name}</p>
//               <p className="text-sm text-gray-600">
//                 {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
//               </p>
//               <p className="text-green-600 font-medium">
//                 Currently near: {currentStopName}
//               </p>
//             </div>
//           </Popup>
//         </Marker>

//         <MapUpdater location={location} />
//       </MapContainer>

//       {/* Mobile-friendly bottom panel for key info */}
//       <div className="absolute bottom-4 left-4 right-4 z-[1000] lg:hidden">
//         <div className="bg-white/95 backdrop-blur-lg rounded-xl p-3 shadow-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex-1">
//               <p className="text-sm text-gray-600">Next Stop</p>
//               <p className="font-bold text-gray-800">
//                 {nextStop ? nextStop.name : "Route Complete"}
//               </p>
//             </div>
//             {nextStop && (
//               <div className="text-right">
//                 <p className="text-sm text-gray-600">ETA</p>
//                 <p className="font-bold text-green-600">{eta} min</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Bus, MapPin } from "lucide-react";

const routes = {
  route1: {
    id: "route1",
    name: "Route 1 (High Court ↔ Dharapur)",
    stops: [
      "High Court",
      "Panbazar",
      "Fancy Bazar",
      "Bharalumukh",
      "Santipur",
      "Maligaon Chariali",
      "Guest House",
      "NAB",
      "Main Gate",
      "Satmile",
      "Forest School Gate",
      "Lankeshwar",
      "Dharapur",
    ],
    timetable: [
      { busId: 1, from: "High Court", to: "Dharapur", dep: "7:45", arr: "8:30" },
      { busId: 2, from: "High Court", to: "Dharapur", dep: "8:00", arr: "9:00" },
      { busId: 1, from: "Dharapur", to: "High Court", dep: "8:45", arr: "9:30" },
      // … add rest
    ],
  },
  route2: {
    id: "route2",
    name: "Route 2 (Basistha Chariali ↔ AT-7 Boys Hall)",
    stops: [
      "Basistha Chariali",
      "Lokhora",
      "ISBT",
      "Garchuk",
      "Boragaon",
      "Tetelia",
      "GST House",
      "NAB",
      "GU Main Gate",
      "AT-7 Boys Hall",
    ],
    timetable: [
      { busId: 1, from: "Basistha", to: "AT-7", dep: "7:45", arr: "8:30" },
      { busId: 2, from: "Basistha", to: "AT-7", dep: "8:00", arr: "9:00" },
      { busId: 1, from: "AT-7", to: "Basistha", dep: "8:45", arr: "9:30" },
      // … add rest
    ],
  },
};

export default function BusTracker() {
  const [busLocations, setBusLocations] = useState({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("✅ Connected to backend");

      // Join as client for both routes
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: "route1", role: "client" },
        })
      );
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: "route2", role: "client" },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "location_update") {
          setBusLocations((prev) => ({
            ...prev,
            [data.payload.busId]: data.payload,
          }));
        }
      } catch (err) {
        console.error("Invalid WS message", err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">🚍 Live Bus Tracking</h1>

      {Object.values(routes).map((route) => (
        <div
          key={route.id}
          className="bg-white shadow-lg rounded-2xl p-6 mb-8 w-full max-w-3xl"
        >
          <h2 className="text-xl font-semibold mb-4">{route.name}</h2>

          <div className="relative border-l-4 border-gray-300 ml-4">
            {route.stops.map((stop, idx) => {
              // Find active bus on this route
              const activeBus = Object.values(busLocations).find(
                (b) => b.routeId === route.id
              );

              // Simplified: backend must send stopIndex
              const isCurrentStop =
                activeBus && activeBus.stopIndex === idx;

              return (
                <div key={idx} className="mb-6 ml-4 relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center absolute -left-12 top-0 ${
                      isCurrentStop
                        ? "bg-red-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {isCurrentStop ? <Bus size={18} /> : <MapPin size={18} />}
                  </div>
                  <p
                    className={`text-lg ${
                      isCurrentStop ? "font-bold text-red-600" : "text-gray-700"
                    }`}
                  >
                    {stop}
                  </p>
                  <p className="text-sm text-gray-500">
                    ETA: {route.timetable[idx]?.arr || "--:--"}
                  </p>

                  {idx < route.stops.length - 1 && (
                    <div
                      className={`absolute left-[-2.2rem] top-8 w-1 h-10 ${
                        isCurrentStop ? "bg-red-500" : "bg-blue-400"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
