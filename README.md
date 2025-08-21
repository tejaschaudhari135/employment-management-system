# Employee Management System

A full-stack web application for managing employees and departments with hierarchical management structure.

## Technology Stack
- Frontend: React.js + Tailwind CSS
- Backend: Spring Boot + Java REST APIs
- Database: PostgreSQL

## Project Structure
employee-management-system/
├── frontend/    - React.js application
├── backend/     - Spring Boot API server
├── database/    - SQL scripts and schema

## How to Run

### 
1. Setup Database
```bash
createdb employee_management
psql -d employee_management -f database/schema.sql

2. Start Backend
bashcd backend
mvn spring-boot:run
Backend will run at: http://localhost:8081 and http://localhost:8082

3. Start Frontend
bashcd frontend  
npm install
npm start
Frontend will run at: http://localhost:5173/


## Features

Add and manage employees
Create and manage departments
Employee-Manager hierarchy (CEO → Dept Heads → Employees)
Move employees between departments
View employees by department or manager