import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

// This line creates the full path to a folder named 'data' inside your project directory
// We need this line to make sure your code always saves files in the right place (the data folder), no matter where the script is run from
const DATA_DIR = path.join(import.meta.dirname, 'data')
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR)
}

// This 2 lines makes a full file path to `data/weather.json` & `data/weather_log.csv`
const WEATHER_FILE = path.join(DATA_DIR, 'weather.json')
const LOG_FILE = path.join(DATA_DIR, 'weather_log.csv')

export async function fetchWeather() {
    const apiKey = process.env.WEATHER_API_KEY
    const city = process.env.CITY || 'London'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        const nowUTC = new Date().toISOString()

        // This line adds a new property `_last_updated_utc` to the weather data object
        data._last_updated_utc = nowUTC
        // This writes the data object to the JSON file (`weather.json`) as a formatted JSON string
        fs.writeFileSync(WEATHER_FILE, JSON.stringify(data, null, 2))

        // Defines the CSV header row for the log file, this is important for reading the file later and generating plots
        const header = 'timestamp,city,temperature,description\n'
        if (!fs.existsSync(LOG_FILE)) {
            fs.writeFileSync(LOG_FILE, header)
        } else {
            // Reads the entire CSV file, splits the file into lines, and take the first line [0]
            const firstLine = fs.readFileSync(LOG_FILE, 'utf8').split('\n')[0]
            if (firstLine !== 'timestamp,city,temperature,description') {
                fs.writeFileSync(LOG_FILE, header + fs.readFileSync(LOG_FILE, 'utf8'))
            }
        }

        // Creates a single line of CSV data representing the latest weather fetch, this line allows the CSV to accumulate data over time, which we can later use for plotting trends or analysis
        const logEntry = `${nowUTC},${city},${data.main.temp},${data.weather[0].description}\n`
        fs.appendFileSync(LOG_FILE, logEntry)

        console.log(`Weather data updated for ${city} at ${nowUTC}`)
    } catch (err) {
        console.log('Error fetching weather:', err)
    }

}

// This check is important because it controls when your code runs and keeps your project modular and safe
if (import.meta.url === `file://${process.argv[1]}`) {
    fetchWeather()
}
fetchWeather()