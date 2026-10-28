# Patient Dashboard (Tech.Care) – Skills Test

Static single-page site: HTML + CSS + vanilla JS, Chart.js for the blood-pressure graph.

## Run
Serve the folder over HTTP (fetch won't work reliably from file://):

    python3 -m http.server 8000     # then open http://localhost:8000

## Structure
- `index.html` – markup
- `css/styles.css` – design tokens + layout (CSS grid, responsive)
- `js/config.js` – API URL + credentials (Basic Auth header is built at runtime with `btoa`, not hard-coded)
- `js/api.js` – fetch layer
- `js/render.js` – DOM rendering (textContent only)
- `js/app.js` – bootstraps, draws Chart.js chart
- `vendor/chart.umd.js` – Chart.js 4.4.1 (unminified source of truth: https://www.chartjs.org)

Only Jessica Taylor's data is displayed.
