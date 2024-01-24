# C3 Insets

## Project Overview

C3 Insets is a platform that serves organizations, streamlining the establishment and management of emission goals. The platform's user-friendly interface allows seamless onboarding of supply chain companies, where they can categorize emissions into scopes 1, 2, and 3. With dedicated user classes, the platform ensures efficient control over onboarding processes. The Supply Chain dashboard provides a centralized view for managing suppliers based on emission levels and monitoring abatement projects, offering organizations a holistic solution to collectively address and manage their carbon footprint.

## Tech Stack

**Client:** NextJS a React framework, HTML, Tailwind CSS, jQuery

**Server:** AdonjsJS a backend framework for Node.js

## Server Environment
- MySQL 8.0
- npm v9.5.1 for managing JavaScript dependencies (required for React)
- Nginx version nginx/1.18.0 as a web server (recommended)
- Node.js (v18.16.0 or later)
- yarn (1.22.19 or later)

## Installation Instructions
This project consists of two main sections:

**api:**  This is where the API code is set up to handle all APIs using adonisJS.

**Web:**  In this section, you'll find the Next.js code for the C3 Insets web app.

Let's now go through the installation steps for each directory separately.

### api

### Environment Variables

To run this project, you will need to add the following environment variables to your .env file. You can find variables with their values in this repository settings > secret and variables section.

`HOST`
`PORT`
`NODE_ENV`
`APP_KEY`
`DRIVE_DISK`
`DB_CONNECTION`
`MYSQL_HOST`
`MYSQL_PORT`
`MYSQL_USER`
`MYSQL_DB_NAME`
`MYSQL_PASSWORD`
`WEB_BASE_URL`
`APP_URL`
`CACHE_VIEWS`
`MAILCHIMP_API_KEY`
`MAILCHIMP_SERVER_PREFIX`
`MAILCHIMP_AUDIENCE_ID`

### Installation

Before you begin, make sure you have the following packages installed on your machine:

1. Database (MySQL)
2. Web Server (Nginx)
3. Node.js and npm


```bash
  git clone https://github.com/onearmbandit/C3Insets.git
  cd C3Insets
  cd api
  nvm use
  yarn install
  cp .env.example .env
```
After creating the .env file, add the mentioned environment variables along with their respective values. Additionally, set up the database and add the necessary configuration values to the .env file.

To build the project
```bash
  yarn build
```

### Run Locally

Start the server

```bash
  yarn dev
```
This command will start the development server to access APIs

```
http://localhost:8000
```

### Usage/Examples

- This section comprehensively addresses all the necessary APIs, incorporating server-side validations. To facilitate testing, we have provided a Postman collection and environment file within the codebase. This allows users to easily test and interact with the APIs using the Postman tool. 

### Features
- Expressive Routing
- Middleware Support
- Model-View-Controller (MVC) Architecture
- ORM (Object-Relational Mapping)
- Authentication
- Validation

### web (c3 insets web app)

### Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file. You can find variables with their values in this repository settings > secret and variables section.

`NEXT_PUBLIC_API_URL`

### Installation

Install with yarn

```bash
  cd web
  nvm use
  yarn install
  cp .env.local.example .env.local
```
After creating the .env file, add the mentioned environment variables along with their respective values.
To build the project
```bash
  yarn build
```
If you are setting the project on the server then you need to create virtual hosts and install the pm2 service. Below are PM2 commands:
In the web directory, open the package.json file and add 
```bash
"dev-web-start": "next start -p 3000",
```
in the scripts section and push the file to the server.

check port is available on the server via command
```bash
sudo netstat -ltnp | grep -w '3000'
```
For the first time on the server execute the below
```bash
pm2 start yarn --name "c3Insets-web" --interpreter bash -- dev-web-start
pm2 save
```
To delete pm2 service
```bash
pm2 delete process id
```
Every time after taking a pull on the server restart the PM2 service
```bash
pm2 restart c3Insets-web
pm2 save
```
### Run Locally
Install dependencies as mentioned above

Start the server

```bash
  yarn dev
```
Access the app through your web browser

```
http://localhost:3000
```
### Usage/Examples

Upon navigating to this URL, you will be automatically redirected to the C3 InSets login page. At this point, you have the option to either sign up or sign in using your email credentials, or alternatively, utilize Single Sign-On (SSO) for a streamlined authentication process. Upon successful login, the system will redirect you to the dashboard, providing immediate access to the platform's features and functionalities.

### Features
- Secure Authentication
- organizations
- Supply Chain
- Abatement Projects
- Profile
  
