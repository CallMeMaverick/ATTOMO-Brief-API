# ATTOMO Brief API

[**Client repo**](https://github.com/CallMeMaverick/ATTOMO-Brief-Client)

This project is a part of the ATTOMO Digital test and is designed to showcase full-stack development skills by building a real-world accommodation booking platform. The platform provides functionalities for administrators, and registered users, enabling them to manage and book accommodations seamlessly.


## 🔎 Project Overview

The platform is built using the MERN stack, which includes MongoDB, Express, React, and Node.js, along with integration of Next.js for server-side rendering and enhanced performance. Styling is implemented using Tailwind CSS. Below is a brief overview of the key features and technologies used in this project:


### 💡 Key Features

- **Roles and Authentication:**
  - Admin: Manages accommodations and user bookings, can add, edit, delete accommodations, and manage user profiles.
  - User (Registered): Can register, login, book accommodations, manage their profile, and view booking details.

- **Accommodation Management:**
  - Admins can add, edit, and delete accommodations.
  - Users can book accommodations, and view availability.

### ⚙️ Technologies Used

- **Backend:**
  - **Node.js** and **Express**: For building the RESTful API.
  - **MongoDB**: For database management to store user, accommodation, and booking data.
- [**Frontend**](https://github.com/CallMeMaverick/ATTOMO-Brief-Client):**
  - **React**: For building the dynamic and interactive user interface.
  - **Next.js**: For server-side rendering and improving performance and SEO.
  - **Tailwind CSS**: For styling and ensuring a responsive design.
- **Authentication:**
  - [**JWT**](https://jwt.io/) Email and password-based authentication for user registration and login.
- **Deployment:**
  - Backend part is deployed on [fly.io](https://fly.io/).
  - Frontend part is deployed on [Vercel](https://github.com/vercel).

## 🛫 Getting Started

To get started with the project, clone the repository and follow the installation instructions provided in the subsequent sections. This README will guide you through the setup and usage of the platform.

## 👨🏻‍🎓 Installation

To set up the project locally, follow these steps:

### Prerequisites

- Node.js (v14.x or later)
- MongoDB (either installed locally or accessible via a cloud service like MongoDB Atlas)
- Git

### Backend Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/CallMeMaverick/ATTOMO-Brief-API.git
   cd ATTOMO-Brief-API
   ```

2. Install Backend Dependencies:
   ```bash
   npm install
   ```
3. Configure .env variables  
   ```bash
   PORT=your-port
   MONGO_STRING=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRES=jwt-expiration
   ```
5. Start the Server:
   ```bash
   npm start
   ```

## 🤝 Contributing
If you'd like to contribute to this project, please open an issue first. This allows for discussion and planning before any code is written. Once the issue is discussed and approved, you can proceed with the following steps:

1. **Fork the Repository:**
   Fork this repository to your own GitHub account and clone it to your local machine.

2. **Create a Feature Branch:**
   Create a new branch from `main` for your feature or bug fix.
   ```bash
   git checkout -b feature/name
   ```

3. **Start cooking!**

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
