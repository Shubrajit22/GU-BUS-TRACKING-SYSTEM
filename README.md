# 🚌 WebSocket Bus Tracking Server – Postman Test Cases

This server allows **drivers** to share live bus locations and **clients** to subscribe in real-time.  
We will test it using **Postman WebSocket feature**.

---

## 📌 Postman Test Cases

> ⚠️ Steps: In Postman, click **New → WebSocket Request**, enter `ws://localhost:8080`, then send the test payloads below.

---
##✅ 1. Driver Joins Room
**Payload**

{
  "type": "join",
  "payload": { "roomId": "bus101", "role": "driver" }
}

##✅ 2. Client Joins Room

{
  "type": "join",
  "payload": { "roomId": "bus101", "role": "client" }
}
##✅ 3. Driver Sends Location Update

Payload (driver)

{
  "type": "location",
  "payload": { "lat": 26.1445, "lng": 91.7362 }
}


-Expected Result

Every client in the same room receives:

{
  "type": "location_update",
  "payload": { "lat": 26.1445, "lng": 91.7362 }
}
❌ 4. Client Tries to Send Location Update

Payload (client)

{
  "type": "location",
  "payload": { "lat": 26.1500, "lng": 91.7420 }
}


-Expected Result

Client receives:

Error: Only driver can send location updates.

❌ 5. Invalid JSON

Payload

not-a-json


Expected Result

Server logs: Invalid JSON received

No crash should occur.

##✅ 6. Multiple Clients in Same Room

Steps

-Join driver and 2 clients in bus202.

-Driver sends:

{
  "type": "location",
  "payload": { "lat": 26.2000, "lng": 91.8000 }
}


-Expected Result

-Both clients receive the same location_update.

##✅ 7. Client in Another Room Should Not Receive Updates

Steps

Driver joins bus303.

Client A joins bus303.

Client B joins bus404.

Driver sends location.

Expected Result

-Client A ✅ receives update.

-Client B ❌ does not receive anything.

##✅ 8. User Disconnects

Steps

Client joins bus101.

Disconnect the WebSocket tab in Postman.

Expected Result

Server logs: User left room: bus101
