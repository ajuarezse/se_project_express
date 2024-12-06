# WTWR (What to Wear?): Back End

This is the back-end portion of the WTWR project, a comprehensive application designed to assist users in selecting suitable attire based on real-time weather conditions. Now running on Google cloud services, it serves as the foundation for the application, handling data storage, retrieval, and processing. It leverages robust technologies to ensure efficient and reliable performance.

By integrating with a weather API, the backend fetches up-to-date weather information and uses it to recommend appropriate clothing options. It also provides features for user management, clothing item management, and a liking system, enhancing the overall user experience.

# Key Features:

- ✅ **User Management**: Manages user accounts, including creation, retrieval, and updates.

- 👗 **Clothing Item Management**: Creates, retrieves, and deletes clothing items.

- 👍 **Likes Functionality**: Allows users to like or unlike clothing items.

- 🚫 **Error Handling**: Provides informative error messages and handles exceptions gracefully.

- 🧪 **Testing**: Ensures code quality and reliability through automated testing.

- 📝**Request and Error Logging**: Middleware for logging requests and errors to enhance debugging and monitoring.

- 🔐**Secure Hosting**: Hosted on Google Cloud Services with HTTPS and SSL encryption for safe data transmission.

- ⚡**High Availablity**: Utilized PM2 and NGINX for smooth and continuous site operation.

- 🧪**Automated Tests**: Added tests to ensure reliable functionality and validate key features.

# Technologies Used:

- ⚡️ **Express.js**: Leverages component-based architecture for efficient development.

- 🐘 **Mongoose**: Interacts with MongoDB databases to store and retrieve data.

- 🔎 **ESLint**: Enforces code quality and consistency using linting rules.

- 💅 **Prettier**: Automates code formatting to maintain a consistent style.

- 📝 **Validator**: Validates user input to ensure data integrity.

- 💻 **JavaScript (ES6+)**: Core language used in the project.

- 🌐 **Google Cloud Services**: Hosting both the front-end and back-end with subdomains for easy navigation.

- 🚀 **PM2 and NGINX**: For process management and reverse proxy configuration.

- 🔒 **Certbot and SSL**: Ensuring secure communication with HTTPS.

- 🧹 **Celebrate & Joi Validators**: Middleware for inbound server data validation.

- 📝 **Winston & Express-Winston**: For structured request and error logging.

- 🧪 **Jest**: For creating and running automated tests to ensure stability and reliability.

## Links:

- The production server is accessible here: [api.wtwr.ftp.sh](https://api.wtwr.ftp.sh)

- Visit the live site here: [wtwr.ftp.sh](https://wtwr.ftp.sh)

- Checkout the front-end: [Front-End -- Github Repo](https://github.com/ajuarezse/se_project_react)

## Running the Project:

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

---

I plan to expand this project further, including weather cards that change with the current weather conditions for example.
