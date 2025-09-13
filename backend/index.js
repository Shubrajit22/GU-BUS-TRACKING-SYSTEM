// // server.js
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// app.use(cors());
// app.use(express.json());
// app.use(express.static('public'));

// // Bus Routes and Stops Data
// const routes = {
//   route1: {
//     name: "High Court - Dharapur Route",
//     stops: [
//       { id: 'high_court', name: 'High Court', lat: 26.1445, lng: 91.7362 },
//       { id: 'panbazar', name: 'Panbazar', lat: 26.1500, lng: 91.7400 },
//       { id: 'fancy_bazar', name: 'Fancy Bazar', lat: 26.1550, lng: 91.7450 },
//       { id: 'bharalumukh', name: 'Bharalumukh', lat: 26.1600, lng: 91.7500 },
//       { id: 'khanapara', name: 'Khanapara', lat: 26.1650, lng: 91.7550 },
//       { id: 'sarusajai', name: 'Sarusajai', lat: 26.1700, lng: 91.7600 },
//       { id: 'basistha', name: 'Basistha', lat: 26.1750, lng: 91.7650 },
//       { id: 'dharapur', name: 'Dharapur', lat: 26.1800, lng: 91.7700 }
//     ],
//     schedule: [
//       { departure: '07:45', arrival: '08:30', direction: 'forward' },
//       { departure: '08:00', arrival: '09:00', direction: 'forward' },
//       { departure: '09:30', arrival: '10:30', direction: 'forward' },
//       { departure: '10:30', arrival: '11:30', direction: 'forward' },
//       { departure: '14:30', arrival: '15:30', direction: 'forward' },
//       { departure: '16:00', arrival: '17:00', direction: 'forward' },
//       { departure: '18:00', arrival: '19:00', direction: 'forward' },
//       { departure: '19:00', arrival: '20:00', direction: 'forward' },
//       // Return journey
//       { departure: '08:45', arrival: '09:30', direction: 'backward' },
//       { departure: '09:00', arrival: '10:00', direction: 'backward' },
//       { departure: '10:30', arrival: '11:30', direction: 'backward' },
//       { departure: '15:00', arrival: '16:00', direction: 'backward' },
//       { departure: '17:00', arrival: '18:00', direction: 'backward' },
//       { departure: '17:15', arrival: '18:15', direction: 'backward' },
//       { departure: '19:00', arrival: '20:00', direction: 'backward' },
//       { departure: '20:00', arrival: '21:00', direction: 'backward' }
//     ]
//   },
//   route2: {
//     name: "Basistha Chariali - AT-7 Boys Hostel Route",
//     stops: [
//       { id: 'basistha_chariali', name: 'Basistha Chariali', lat: 26.1320, lng: 91.7890 },
//       { id: 'lokhora', name: 'Lokhora', lat: 26.1350, lng: 91.7920 },
//       { id: 'isbt_garchuk', name: 'ISBT Garchuk', lat: 26.1380, lng: 91.7950 },
//       { id: 'boragaon', name: 'Boragaon', lat: 26.1410, lng: 91.7980 },
//       { id: 'tetelia', name: 'Tetelia', lat: 26.1440, lng: 91.8010 },
//       { id: 'gst_house', name: 'GST House', lat: 26.1470, lng: 91.8040 },
//       { id: 'gu_main_gate', name: 'GU Main Gate', lat: 26.1500, lng: 91.8070 },
//       { id: 'at7_boys_hall', name: 'AT-7 Boys Hall', lat: 26.1530, lng: 91.8100 }
//     ],
//     schedule: [
//       { departure: '07:45', arrival: '08:30', direction: 'forward' },
//       { departure: '08:00', arrival: '09:00', direction: 'forward' },
//       { departure: '09:30', arrival: '10:30', direction: 'forward' },
//       { departure: '10:30', arrival: '11:30', direction: 'forward' },
//       { departure: '14:30', arrival: '15:30', direction: 'forward' },
//       { departure: '16:00', arrival: '17:00', direction: 'forward' },
//       { departure: '18:00', arrival: '19:00', direction: 'forward' },
//       { departure: '19:00', arrival: '20:00', direction: 'forward' },
//       // Return journey
//       { departure: '08:45', arrival: '09:30', direction: 'backward' },
//       { departure: '09:00', arrival: '10:00', direction: 'backward' },
//       { departure: '10:30', arrival: '11:30', direction: 'backward' },
//       { departure: '15:00', arrival: '16:00', direction: 'backward' },
//       { departure: '17:00', arrival: '18:00', direction: 'backward' },
//       { departure: '17:15', arrival: '18:15', direction: 'backward' },
//       { departure: '19:00', arrival: '20:00', direction: 'backward' },
//       { departure: '20:00', arrival: '21:00', direction: 'backward' }
//     ]
//   }
// };

// // In-memory storage for bus locations and status
// let busData = {
//   bus1: {
//     id: 'bus1',
//     route: 'route1',
//     currentLocation: { lat: 26.1445, lng: 91.7362 },
//     currentStop: 'high_court',
//     nextStop: 'panbazar',
//     direction: 'forward',
//     status: 'stopped', // 'running', 'stopped', 'delayed'
//     occupancy: 0,
//     lastUpdate: new Date(),
//     driver: null,
//     estimatedArrival: null
//   },
//   bus2: {
//     id: 'bus2',
//     route: 'route2',
//     currentLocation: { lat: 26.1320, lng: 91.7890 },
//     currentStop: 'basistha_chariali',
//     nextStop: 'lokhora',
//     direction: 'forward',
//     status: 'stopped',
//     occupancy: 0,
//     lastUpdate: new Date(),
//     driver: null,
//     estimatedArrival: null
//   }
// };

// // Connected users (passengers and drivers)
// let connectedUsers = new Map();

// // Utility functions
// function calculateDistance(lat1, lng1, lat2, lng2) {
//   const R = 6371; // Earth's radius in km
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLng = (lng2 - lng1) * Math.PI / 180;
//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//     Math.sin(dLng / 2) * Math.sin(dLng / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// function findNearestStop(routeId, lat, lng) {
//   const route = routes[routeId];
//   let nearestStop = null;
//   let minDistance = Infinity;

//   route.stops.forEach(stop => {
//     const distance = calculateDistance(lat, lng, stop.lat, stop.lng);
//     if (distance < minDistance) {
//       minDistance = distance;
//       nearestStop = stop;
//     }
//   });

//   return { stop: nearestStop, distance: minDistance };
// }

// function getNextStop(routeId, currentStopId, direction) {
//   const route = routes[routeId];
//   const currentIndex = route.stops.findIndex(stop => stop.id === currentStopId);
  
//   if (direction === 'forward') {
//     return currentIndex < route.stops.length - 1 ? route.stops[currentIndex + 1] : null;
//   } else {
//     return currentIndex > 0 ? route.stops[currentIndex - 1] : null;
//   }
// }

// function estimateArrivalTime(busId, targetStopId) {
//   const bus = busData[busId];
//   const route = routes[bus.route];
//   const targetStop = route.stops.find(stop => stop.id === targetStopId);
  
//   if (!targetStop) return null;

//   const distance = calculateDistance(
//     bus.currentLocation.lat,
//     bus.currentLocation.lng,
//     targetStop.lat,
//     targetStop.lng
//   );

//   // Assume average speed of 30 km/h in city
//   const estimatedTimeInHours = distance / 30;
//   const estimatedTimeInMinutes = estimatedTimeInHours * 60;
  
//   return new Date(Date.now() + estimatedTimeInMinutes * 60 * 1000);
// }

// // Socket.IO connection handling
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   // Handle user registration
//   socket.on('register', (data) => {
//     const { userType, busId, userId } = data;
//     connectedUsers.set(socket.id, { userType, busId, userId, socketId: socket.id });
    
//     if (userType === 'driver' && busId) {
//       busData[busId].driver = socket.id;
//       console.log(`Driver registered for ${busId}`);
//     }

//     // Send initial bus data to user
//     socket.emit('initial_data', {
//       routes,
//       buses: busData
//     });
//   });

//   // Handle location updates from drivers
//   socket.on('location_update', (data) => {
//     const user = connectedUsers.get(socket.id);
//     if (user && user.userType === 'driver' && user.busId) {
//       const { lat, lng, status, occupancy } = data;
//       const busId = user.busId;
      
//       // Update bus location
//       busData[busId].currentLocation = { lat, lng };
//       busData[busId].status = status || 'running';
//       busData[busId].occupancy = occupancy || busData[busId].occupancy;
//       busData[busId].lastUpdate = new Date();

//       // Find nearest stop
//       const nearest = findNearestStop(busData[busId].route, lat, lng);
//       if (nearest.distance < 0.1) { // Within 100 meters
//         busData[busId].currentStop = nearest.stop.id;
//         busData[busId].nextStop = getNextStop(
//           busData[busId].route,
//           nearest.stop.id,
//           busData[busId].direction
//         )?.id || null;
//       }

//       // Calculate estimated arrival times for all stops
//       const route = routes[busData[busId].route];
//       const estimations = {};
//       route.stops.forEach(stop => {
//         estimations[stop.id] = estimateArrivalTime(busId, stop.id);
//       });
//       busData[busId].estimatedArrivals = estimations;

//       // Broadcast update to all passengers
//       socket.broadcast.emit('bus_location_update', {
//         busId,
//         ...busData[busId]
//       });

//       console.log(`Location updated for ${busId}:`, { lat, lng, status });
//     }
//   });

//   // Handle route direction changes
//   socket.on('change_direction', (data) => {
//     const user = connectedUsers.get(socket.id);
//     if (user && user.userType === 'driver' && user.busId) {
//       const { direction } = data;
//       const busId = user.busId;
      
//       busData[busId].direction = direction;
//       busData[busId].nextStop = getNextStop(
//         busData[busId].route,
//         busData[busId].currentStop,
//         direction
//       )?.id || null;

//       // Broadcast direction change
//       io.emit('bus_direction_change', {
//         busId,
//         direction,
//         nextStop: busData[busId].nextStop
//       });
//     }
//   });

//   // Handle passenger queries
//   socket.on('get_bus_eta', (data) => {
//     const { busId, stopId } = data;
//     const eta = estimateArrivalTime(busId, stopId);
    
//     socket.emit('bus_eta_response', {
//       busId,
//       stopId,
//       estimatedArrival: eta,
//       currentStatus: busData[busId].status
//     });
//   });

//   // Handle emergency alerts
//   socket.on('emergency_alert', (data) => {
//     const user = connectedUsers.get(socket.id);
//     if (user && user.userType === 'driver' && user.busId) {
//       io.emit('emergency_alert', {
//         busId: user.busId,
//         message: data.message,
//         location: busData[user.busId].currentLocation,
//         timestamp: new Date()
//       });
//     }
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     const user = connectedUsers.get(socket.id);
//     if (user && user.userType === 'driver' && user.busId) {
//       busData[user.busId].driver = null;
//       busData[user.busId].status = 'offline';
//       io.emit('bus_offline', { busId: user.busId });
//     }
    
//     connectedUsers.delete(socket.id);
//     console.log('User disconnected:', socket.id);
//   });
// });

// // REST API endpoints
// app.get('/api/routes', (req, res) => {
//   res.json(routes);
// });

// app.get('/api/buses', (req, res) => {
//   res.json(busData);
// });

// app.get('/api/bus/:busId', (req, res) => {
//   const bus = busData[req.params.busId];
//   if (bus) {
//     res.json(bus);
//   } else {
//     res.status(404).json({ error: 'Bus not found' });
//   }
// });

// app.get('/api/schedule/:routeId', (req, res) => {
//   const route = routes[req.params.routeId];
//   if (route) {
//     res.json(route.schedule);
//   } else {
//     res.status(404).json({ error: 'Route not found' });
//   }
// });

// // Periodic updates for schedule adherence
// setInterval(() => {
//   const now = new Date();
//   const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
//   Object.values(busData).forEach(bus => {
//     const route = routes[bus.route];
//     const currentSchedule = route.schedule.find(schedule => 
//       schedule.departure <= currentTime && schedule.arrival >= currentTime
//     );
    
//     if (currentSchedule && bus.status === 'stopped') {
//       bus.status = 'scheduled';
//       io.emit('bus_status_update', {
//         busId: bus.id,
//         status: bus.status,
//         schedule: currentSchedule
//       });
//     }
//   });
// }, 60000); // Check every minute

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Bus tracking server running on port ${PORT}`);
//   console.log('Routes configured:');
//   console.log('- Route 1: High Court ↔ Dharapur');
//   console.log('- Route 2: Basistha Chariali ↔ AT-7 Boys Hostel');
// });

// module.exports = { app, server, io };

import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 5008 });
const allSockets = [];

wss.on("connection", (socket) => {
  console.log("A user connected...");

  socket.on("message", (msg) => {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(msg);
    } catch (error) {
      console.log("Invalid JSON received");
      return;
    }

    if (parsedMessage.type === "join") {
      // payload: { roomId: "bus101", role: "driver" or "client" }
      allSockets.push({
        socket: socket,
        room: parsedMessage.payload.roomId,
        role: parsedMessage.payload.role
      });
      console.log(
        `User joined room: ${parsedMessage.payload.roomId} as ${parsedMessage.payload.role}`
      );
    }

    if (parsedMessage.type === "location") {
      // Only driver can send location
      const sender = allSockets.find((user) => user.socket === socket);

      if (!sender || sender.role !== "driver") {
        socket.send("Error: Only driver can send location updates.");
        return;
      }

      const driverRoom = sender.room;

      // Broadcast to all clients in the same room
      for (const user of allSockets) {
        if (user.room === driverRoom && user.role === "client") {
          user.socket.send(
            JSON.stringify({
              type: "location_update",
              payload: parsedMessage.payload
            })
          );
        }
      }
    }
  });

  socket.on("close", () => {
    const index = allSockets.findIndex((user) => user.socket === socket);
    if (index !== -1) {
      console.log(`User left room: ${allSockets[index].room}`);
      allSockets.splice(index, 1);
    }
  });
});

console.log("✅ WebSocket Server running on ws://localhost:5008");




