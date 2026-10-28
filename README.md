# Tech.Care Patient Dashboard

A single-page, responsive patient dashboard built from an Adobe XD template. It loads patient data from an API and shows the profile, blood pressure history, vital signs, diagnostic list and lab results for one patient (Jessica Taylor).

## Features

- Data fetched from a REST API with Basic Auth (the auth header is built at runtime, not hard-coded)
- Blood pressure line chart (systolic and diastolic, last 6 months) using Chart.js
- Vital signs cards: respiratory rate, temperature, heart rate
- Patient list, profile card, diagnostic list table and lab results
- Responsive layout using CSS Grid and Flexbox
- Safe rendering: API text is inserted with `textContent`, not `innerHTML`

## Tech Stack

- HTML5
- CSS3 (custom properties, Grid, Flexbox)
- Vanilla JavaScript (no framework)
- [Chart.js](https://www.chartjs.org/) 4.4.1 (included in `vendor/`)

## Project Structure

```
patient-dashboard/
├── index.html          # Page markup
├── css/
│   └── styles.css      # Design tokens, layout, responsive rules
├── js/
│   ├── config.js       # API URL and credentials
│   ├── api.js          # Fetch layer, builds the Basic Auth header
│   ├── render.js       # Turns data into DOM elements
│   └── app.js          # Entry point and chart setup
├── vendor/
│   └── chart.umd.js    # Chart.js
└── README.md
```

## Getting Started

1. Open `js/config.js` and check the API URL, username and password.
2. Serve the folder over HTTP, because `fetch` is unreliable from `file://`:
   - In VS Code, right-click `index.html` and choose **Open with Live Server**, or
   - run `python3 -m http.server 8000` and open `http://localhost:8000`.

## How It Works

1. `app.js` calls `PatientApi.fetchTargetPatient()`.
2. `api.js` sends a GET request with an `Authorization: Basic ...` header created using `btoa()`.
3. The response is filtered to the target patient, and the last 6 months of `diagnosis_history` are sorted in date order.
4. `render.js` fills each section of the page, and `app.js` draws the Chart.js graph.
5. If the request fails, an error message is shown on the page.

## Notes

- Only one patient's data is displayed, as per the brief.
- The search button, gear icon and "..." menus are visual only, as they have no interaction in the design.
- Source files are unminified.
