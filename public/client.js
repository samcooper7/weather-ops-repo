async function loadWeather() {
    try {
        const res = await fetch('/api/weather')
        const weather = await res.json()

        document.getElementById('weather').innerHTML = `
            <h2> ${weather.name} </h2>
            <p>Temperature: ${weather.main.temp}°C</p>
            <p>Condition: ${weather.weather[0].description} </p>
        `

    } catch (err) {
        document.getElementById('weather').innerHTML = '<p>Failed to load weather data</p>'
        console.log(err)
    }
}

async function loadChart() {
    try {
        // Gets the CSV information from the second route on app.js
        const res = await fetch('/api/weather-log')
        const { timestamps, temps } = await res.json()

        // Creates a graph/plot
        const trace = {
            x: timestamps,
            y: temps,
            type: 'scatter',
            mode: 'lines+markers',
            line: {
                color: 'black'
            }
        }

        // Design graph layout
        const layout = {
            title: 'Temperature Over Time',
            xaxis: { title: 'Date', type: 'data'},
            yaxis: { title: 'Temperature (C)' },
            legend: { orientation: 'h', x: 0, y: 1.1}
        }

        // Use Plotly that is being called in index.html
        Plotly.newPlot('chart', [trace], layout)
    } catch (err) {
        console.log('Failed to load chart', err)
    }
}

loadWeather()
loadChart()
