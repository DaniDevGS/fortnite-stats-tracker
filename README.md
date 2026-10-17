# Fortnite Stats Tracker

An interactive web application built with **Vanilla JavaScript** to search for and save real-time player statistics for Fortnite Battle Royale.

Final project developed as part of the **Academos** training program in collaboration with the **Cisco Networking Academy** program for the JavaScript Essentials 1 & 2 courses.


## Features

- **Real-Time Queries:** Connection to the public Fortnite API (`Fortnite-API.com`) to retrieve overall statistics.
- **Dynamic Avatars:** Random cosmetic skin selection using concurrent asynchronous calls.
- **Persistent Favorites List:** Save and remove players using `localStorage` with reactive rendering in a responsive grid layout.
- **Modern OOP with JavaScript:** Data modeling using the `FornitePlayer` class with helper methods for local date formatting and total played hours calculation.


## Built With

- **JavaScript (ES6+)**: Classes, `async/await`, `fetch`, `Promise.all`, and DOM manipulation.
- **HTML5 & CSS3**: Semantic structure, CSS Grid layout, and transitions.
- **Google Material Symbols**: Interactive icons supporting variable states (`bookmark`).
- **External API**: [Fortnite-API.com](https://fortnite-api.com/).


## Setup and Installation

No build tools or external dependencies required.

### 1. **Clone the repository:**
   ```bash
   git clone [https://github.com/DaniDevGS/fortnite-stats-tracker.git](https://github.com/DaniDevGS/fortnite-stats-tracker.git)
   cd fortnite-stats-tracker|
```

### 2. Get your API Key:

- Go to Fortnite-API.com and log in or sign up for free to generate your personal API Key.

### 3. Configure credentials:

- Duplicate or rename the JS/config.example.js file as JS/config.js.
- Open JS/config.js and replace "YOUR_API_KEY_HERE" with your key:

```javascript
const CONFIG = {
    FORTNITE_API_KEY: "YOUR_API_KEY_HERE"
};
```

### 4. Run the application:
Open the index.html file in your browser or use the Live Server extension in Visual Studio Code.
