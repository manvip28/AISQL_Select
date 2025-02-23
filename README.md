# AI SQL Generator

## Problem Statement
In large-scale databases, users often struggle to retrieve relevant information due to complex schemas and the need for precise SQL queries. Many users, especially those without SQL expertise, find it challenging to extract data efficiently. This project aims to solve this issue by developing an AI-powered system that dynamically selects the most relevant table from a database schema based on a user's natural language query. By leveraging LangChain and the Gemini API, the system converts natural language queries into optimized SQL statements, streamlining the data retrieval process for users.

## Overview
This project is a full-stack application built using React for the frontend, Node.js for the backend, and Flask for handling AI-powered queries using LangChain and Google Generative AI.

## Tech Stack
- **Frontend:** React (Created using Create React App)
- **Backend:** Node.js, Flask
- **AI Integration:** LangChain, Google Generative AI, Gemini API
- **Debugging:** ChatGPT

## Project Structure
```
fsd/
├── src/
│   ├── App.js
│   ├── QueryForm.js
│   ├── QueryForm.css
├── server.js
├── server.py
```

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js
- Python 3.x
- pip (Python package manager)

### Setup

#### 1. Clone the repository
```sh
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

#### 2. Install frontend dependencies
```sh
cd fsd
npm install
```

#### 3. Install backend dependencies
Navigate to the Flask server directory and install the required Python modules.
```sh
pip install flask langchain langchain_google_genai
```

## Usage

### Running the Backend
```sh
python server.py
```
This will start the Flask server.

### Running the Node.js Server
```sh
node server.js
```

### Running the Frontend
```sh
npm start
```
This will start the React development server.

## Query Processing
1. The user inputs a query in natural language through the frontend.
2. The query is sent to the backend, where it is processed using the Gemini API.
3. The Gemini API converts the natural language query into an SQL query.
4. The generated SQL query is executed on the database.
5. The results are formatted into a table and sent back to the frontend for display.

## API Integration
The backend uses LangChain, Google Generative AI, and the Gemini API to process user queries dynamically.

## Note
In `server.py`, replace `[API_KEY]` with your own Gemini API Key.

## Outputs
<img width="1035" alt="image" src="https://github.com/user-attachments/assets/1227c8ef-3c03-44e4-badd-573776d92bf6" />
<img width="1043" alt="image" src="https://github.com/user-attachments/assets/9b99c011-acd4-4d3f-96d3-d2e335cf71a4" />


