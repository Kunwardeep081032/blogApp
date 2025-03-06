# WriteUp

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction
This is a MERN stack application developed as a college project. The app allows users to create, read, update, and delete blog posts. It also supports image uploads using Cloudinary.

## Features
- User authentication and authorization
- Create, read, update, and delete blog posts
- Image uploads using Cloudinary
- Responsive design
- Rich text editor for blog content

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/coolguy-codin-Rydham/writeUp
    ```
2. Navigate to the project directory:
    ```bash
    cd writeUp
    ```
3. Install server dependencies:
    ```bash
    cd server
    npm install
    ```
4. Install client dependencies:
    ```bash
    cd ../client
    npm install
    ```
5. Create a `.env` file in the `server` directory and add your environment variables:
    ```env
    DATABASE_URL=<your-mongodb-uri>
    PORT=<your-port>
    CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
    CLOUDINARY_API_KEY=<your-cloudinary-api-key>
    CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
    JWT_SECRET=<your-jwt-secret>
    ```
6. Create a `.env` file in the `client` directory and add your environment variables:
    ```env
    VITE_API_URL=http://localhost:<your-port>/api
    ```

## Usage
1. Start the server:
    ```bash
    cd server
    npm run dev
    ```
2. Start the client:
    ```bash
    cd ../client
    npm run dev
    ```
3. Open your browser and navigate to `http://localhost:5173`.

## Technologies Used
- MongoDB
- Express.js
- React.js
- Node.js
- Cloudinary
- Shadcn UI
- TipTap (Rich text editor)

## Folder Structure
```
writeUp
├── client
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── lib
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   └── package.json
└── server
    ├── src
    │   ├── config
    │   ├── controllers
    │   ├── middlewares
    │   ├── models
    │   ├── routes
    │   ├── utils
    │   └── validators
    ├── index.js
    ├── .env
    └── package.json
```


## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.