# 🚀 AgileStream – Bug Tracking & Workflow Management System

AgileStream is a full-stack bug tracking and Agile workflow management application built using **Spring Boot and React**. It helps teams manage bugs efficiently, automate task assignment, and track progress using an interactive Kanban board.

---

## 🛠️ Tech Stack

* Frontend: React.js, Vite, HTML5, CSS
* Backend: Java 17, Spring Boot, Spring Security (JWT)
* Database: MySQL, Hibernate (JPA)
* Tools: Maven, Git, Postman

---

## ✨ Features

### 🔐 Authentication & Security

* Implemented secure login using **JWT (JSON Web Tokens)**
* Role-based access control for Admin, Developer, and Tester

### 📌 Bug Lifecycle Management

* Create, assign, update, and resolve bugs using REST APIs
* Backend built using Spring Boot with MVC architecture

### 🧠 Automated Bug Assignment (DSA)

* Implemented using **Java Priority Queue (Min-Heap)**
* Assigns high-priority bugs to the least-loaded developer
* Improves task distribution efficiency

### 📊 Kanban Board UI

* Drag-and-drop interface (Open → In Progress → Resolved)
* Real-time updates via API integration

### 🔗 Decoupled Architecture

* Frontend and backend communicate via REST APIs
* Enables easy scalability and independent development

---

## 📂 Project Structure

```bash
AgileStream/
│── frontend/        # React Application
│── backend/         # Spring Boot Application
│── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Run Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

Runs on: `http://localhost:5000`

---

### 2️⃣ Run Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Runs on: `http://localhost:5173`

---

## 🧪 Testing

* API testing using Postman
* UI testing using Selenium

---

## 🚀 Key Learnings

* Built RESTful APIs using Spring Boot
* Implemented JWT-based authentication and authorization
* Integrated MySQL using Hibernate/JPA
* Applied Data Structures (Priority Queue) in a real-world use case
* Developed a complete full-stack application

---

## 👩‍💻 Author
Bhakti Bhande
