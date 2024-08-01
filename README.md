# Radar Simulator

Website Compliance Checker: a program to check if your website has a "Terms and Conditions" page or not.

## Setup and Run

### Prerequisites
#### Node.js
- Ensure you have Node.js installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).
- Recommended version: 20.14.0.
#### npm (Node Package Manager)
- The project uses npm for managing dependencies. Verify that npm is installed with your Node.js installation.

### Dependencies
- The project uses the following dependencies. 
```
"dependencies": {
    "express": "^4.19.2",
    "langdetect": "^0.2.1",
    "lodash": "^4.17.21",
    "nodemon": "^3.1.3",
    "puppeteer": "^22.11.1"
  }
```
### Installation
1. Clone the repository: `git clone https://github.com/chiarazetaa/radar-simulator.git`
2. Navigate to the server directory: `cd server`
3. Install dependencies: `npm install`

### Run the Application
1. Navigate to the server directory: `cd server`
2. Run the application using the command: `npm start`
3. Open your web browser and go to http://localhost:3000/

## Architecture
The application follows a simple client-server architecture:
#### Client (client/)
The client-side of the application is located in the "client" folder and consists of the following components:
- `index.html`: The main HTML file that serves as the entry point for the web application.
- `history.html`: A HTML file for the search history.
- `checkTerms.js`: The JavaScript file containing the client-side logic and interactions.
- `style.css`: The stylesheet defining the visual presentation of the web pages.
#### Server (server/)
The server-side of the application is located in the "server" folder:
- `app.js`: The main server file where the application is initialized and run using Node.js.
- `package.json` and `node_modules`: These files manage the project dependencies and configurations.
- `languageMapping.json`: This file is used to map the correct code of a language and its name (for example: EN = English).
- `termsConditionStrings.json`: This file contain a list of strings in different languages.
- `history.txt`: A file used to write and read the results of researches. 
- `test/`: The "test" folder contains automated tests for the application.

The application utilizes a basic client-server model where the client interacts with the server to perform various actions. The client-side handles the user interface and presentation, while the server-side manages the application's logic, data, and communication.

### Automated Tests
The "test" folder contains automated tests for the application. It's worth noting that this is my first attempt at implementing automated tests in a Node.js environment, and there might be some challenges to address. I'm eager to learn more about testing practices and improve the test suite over time.
### Technologies Used
The project uses the following technologies and Node.js libraries:
- Express: A web framework for Node.js that simplifies the creation of web applications.
- Langdetect: A language detection library for Node.js, used to identify the language of text content.
- Lodash: A utility library delivering various tools to manage Javascript code.
- Nodemon: A tool that helps develop Node.js applications by automatically restarting the server when file changes are detected.
- Puppeteer: A Node library that provides a high-level API over the headless Chrome browser, allowing you to automate tasks on websites, such as opening pages, clicking buttons, and extracting information.
### Performance Overview
Development Time: Approximately 4-5 hours.
Enhancements (if more time available):
- Implementation of automated testing practices.
- Addition of features for saving and removing elements from the search history.
- User options for saving or deleting past research.
### Contact Information
Chiara Zuffi
- Email: chiara.zuffi19@gmail.com
- GitHub: https://github.com/chiarazetaa
- LinkedIn: https://www.linkedin.com/in/zuffichiara/