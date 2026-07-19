# Farm2Market API Documentation

**Base URL:** `http://localhost:3001` (For local development)
**Headers required for POST/PUT:** `Content-Type: application/json`

---

## 1. System Health
Verify the API is running.
- **Endpoint:** `GET /health`
- **Response:**
  ```json
  {
    "status": "ok",
    "timestamp": "2026-07-19T14:00:00.000Z"
  }
  ```

---

## 2. Farmers
Register a new farmer in the system.
- **Endpoint:** `POST /farmers`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "contact_info": "john@example.com"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "id": 1,
    "message": "Farmer created"
  }
  ```

---

## 3. Listings
Create a new crop listing for a farmer.
- **Endpoint:** `POST /listings`
- **Request Body:**
  ```json
  {
    "farmer_id": 1,
    "crop_type": "Wheat",
    "quantity": 500,
    "estimated_harvest_window": "August 2026"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "id": 15,
    "message": "Listing created"
  }
  ```

---

## 4. Warehouses
Register a new storage warehouse.
- **Endpoint:** `POST /warehouses`
- **Request Body:**
  ```json
  {
    "name": "Central Storage",
    "location": "Springfield",
    "capacity": 10000
  }
  ```
- **Success Response (201):**
  ```json
  {
    "id": 3,
    "message": "Warehouse created"
  }
  ```

---

## 5. Warehouse Availability
Check how much capacity a specific warehouse has remaining.
- **Endpoint:** `GET /warehouses/:id/availability`
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "warehouse_id": "3",
    "available_capacity": 9998,
    "total_capacity": 10000
  }
  ```

---

## 6. Pre-orders (Consumer Reservation)
Reserve a crop listing for a consumer.
- **Endpoint:** `POST /preorders`
- **Request Body:**
  ```json
  {
    "consumer_id": 2,
    "listing_id": 15
  }
  ```
- **Success Response (201):**
  ```json
  {
    "id": 1,
    "message": "Preorder created",
    "status": "reserved"
  }
  ```

---

## 7. Warehouse Bookings
Request space in a warehouse for a specific listing.
- **Endpoint:** `POST /bookings`
- **Request Body:**
  ```json
  {
    "warehouse_id": 3,
    "listing_id": 15
  }
  ```
- **Success Response (201):**
  ```json
  {
    "id": 5,
    "message": "Booking requested",
    "status": "requested"
  }
  ```

---

## 8. Update Booking Status
Update the status of an existing warehouse booking.
- **Endpoint:** `PUT /bookings/:id/status`
- **Request Body:**
  ```json
  {
    "status": "confirmed" 
  }
  ```
  *(Valid statuses: `"requested"`, `"confirmed"`, `"stored"`, `"released"`)*
- **Success Response (200):**
  ```json
  {
    "id": "5",
    "status": "confirmed",
    "message": "Booking status updated to confirmed"
  }
  ```

---

## 9. Generate AI Match
Generate an AI-driven match between a listing and a buyer.
- **Endpoint:** `POST /matches`
- **Request Body:**
  ```json
  {
    "listing_id": 15
  }
  ```
- **Success Response (201):**
  ```json
  {
    "id": 8,
    "message": "Match generated",
    "ai_data_id": "64b7f8e..."
  }
  ```
