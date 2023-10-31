# API Gateway Proof of Concept (POC) README

## Table of Contents
- [Introduction](#introduction)
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Introduction
This README provides information on a Proof of Concept (POC) for an API Gateway that serves as a central access point for three distinct services in a microservices architecture: a server, two apps, and a login app. The API Gateway is responsible for routing requests and authenticating users to ensure secure access to the services.

## Overview
The API Gateway POC is designed to demonstrate a simplified authentication and routing mechanism for managing access to multiple applications through a single entry point. The components of this POC include:

1. **API Gateway Server:** The central entry point that manages requests and routes them to the appropriate service.

2. **App1:** The first application that users can access via `/app1/home`.

3. **App2:** The second application that users can access via `/app2/dashboard`.

4. **Login App:** The application responsible for authenticating users before granting access to App1 and App2 at `/login/login`.

## Prerequisites
Before you can use the API Gateway POC, ensure you have the following prerequisites in place:

- Node.js and npm installed (Node.js v14+ recommended)
- Redis installed and running
- Knowledge of API Gateway and reverse proxy concepts
- Familiarity with basic routing and authentication principles

## Getting Started
Follow these steps to set up and run the API Gateway POC:

1. Clone the repository:
   ```shell
   git clone https://github.com/UTTAMGUPTA2712/API-gateway-POC.git
   ```

2. Navigate to the project directory:
   ```shell
   cd API-gateway-POC
   ```

3. Dependencies for the API Gateway, App1, App2, and Login App will automactically be installed on start up:

4. Start the API Gateway server:
   ```shell
   npm start
   ```

5. Access the API Gateway at `http://localhost:8080` and log in with your credentials via the Login App.

## Usage
After starting the API Gateway server and configuring the applications, you can use the API Gateway to access App1 and App2. The login app will authenticate users before granting access to these services.

## Authentication
The POC demonstrates a basic authentication mechanism through the Login App. You can extend this authentication to include your preferred identity provider or Single Sign-On (SSO) solution.

## Endpoints
The API Gateway POC defines the following endpoints:

- `https://localhost:8080/`: The API Gateway entry point.

- `https://localhost:3005/app1/home`: Access App1 through the API Gateway.

- `https://localhost:3006/app2/dashboard`: Access App2 through the API Gateway.

- `https://localhost:3004/login/login`: Access the Login App to authenticate and obtain access to App1 and App2.

## Troubleshooting
If you encounter issues or need assistance with this POC, please refer to the project's issue tracker or contact the project maintainers.

## Contributing
Contributions to this POC are welcome. Feel free to submit issues, feature requests, or pull requests. See the [CONTRIBUTING](CONTRIBUTING.md) file for more details.

## License
This API Gateway POC is provided under the [MIT License](LICENSE). You are free to use and modify it as needed for your projects.

Thank you for using the API Gateway POC. Enjoy exploring and extending this concept for your microservices architecture!

You can proceed with the setup without the need for configuration files. If you later find the need to add configuration, you can always document it in your README or create configuration files as required.