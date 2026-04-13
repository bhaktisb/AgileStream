# 🚀 AgileStream: Issue Manager & DSA Balancer

**AgileStream** is a highly scalable, full-stack Software Engineering pipeline and bug tracking application. Originally designed as a straightforward bug logger, it has evolved into a robust Agile Management tool showcasing Decoupled Architecture, advanced JWT Security, and an implementation of pure Data Structures & Algorithms (Priority Queues) to automate developer workflows.

---

## 🔥 Key Innovations & Features

### 1. Intelligent Algorithmic Bug-Routing (Custom DSA Implementation)
Unlike standard bug trackers that rely on manual assignment, AgileStream acts as an "intelligent coordinator." 
- It intercepts newly logged critical bugs and structures them in a custom **Java Priority Queue (Min-Heap)**.
- It dynamically evaluates which developer holds the fewest active tickets.
- It algorithmically auto-assigns the highest priority bug to the least burdened developer in O(log n) time, converting theoretical DSA into a practical pipeline automation tool.

### 2. Interactive Agile Kanban Board
The frontend features a stunning Glassmorphism aesthetic with a functional, drag-and-drop Kanban interface. Developers and Testers can drag tickets from **Open** to **In Progress** to **Resolved**, automatically syncing state modifications through the underlying Headless API. 

### 3. Bulletproof Cryptographic Security (JWT)
AgileStream completely decentralizes security scope using stateless sessions. It relies on a rigorous backend JWT-Filter mechanism wrapping **HS256 encryption cryptography**. Tokens securely dictate strict Role-Based Access Controls (RBAC) separating Admins, Developers, and Testers without relying on server-side memory bloat.

### 4. Headless API Design
Operating on a clean Microservice-like model, the backend is a fully encapsulated RESTful API. The React frontend and Java backend are entirely decoupled, meaning a native mobile application could be integrated tomorrow without altering a single line of Java logic.

---

## 🛠️ Technology Stack
- **Frontend Layer:** React.js, Vite, Chart.js, HTML5 Drag-and-Drop, Modern CSS (Glassmorphism & Flexbox).
- **Backend Architecture:** Java 17, Spring Boot, Spring Security (JWT / JJWT).
- **Database Layer:** MySQL mapped via Hibernate / Spring Data JPA.
- **Build & DevOps:** Maven, npm.

---

## 🚀 Setup Instructions

Because the Frontend and Backend are decoupled, they run on distinct developmental servers. 

### 1. Starting the Java Backend (API)
Ensure you have MySQL running and your database schema established.
```bash
# Navigate to the Java Spring Boot Backend directory
# Note: Name may vary depending on what you named your master backend folder
cd Backend-Folder

# Ensure dependencies are installed and boot the server
.\mvnw.cmd spring-boot:run
```
*The API will establish a secure connection via Port `5000`.*

### 2. Starting the React Frontend (UI)
```bash
# Navigate to the React Client directory
cd client

# Install any uninstalled node modules
npm install

# Start the Vite Hot-Reloading Developmental Server
npm run dev
```
*The user interface will become securely accessible at `http://localhost:5173`.*