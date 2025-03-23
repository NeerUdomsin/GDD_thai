import React, { useState, useEffect } from "react";

const apiKey = '30d4741c779ba94c470ca1f63045390a';
const fruits = { "Durian": 1500, "Sugarcane": 1200, "Rice": 1000, "Mango": 2000 };
const provinces = ["Bangkok", "Chiang Mai", "Phuket", "Prachin Buri"];

const fetchWeatherDataFromAPI = async (city) => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Failed to fetch weather data");
        }

        const data = await res.json();
        return {
            temperatureMax: data.main?.temp_max ?? 0,
            temperatureMin: data.main?.temp_min ?? 0,
            precipitation: data.clouds?.all ?? 0,
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
};

const calculateGDD = (Tmax, Tmin, baseTemp = 10) => Math.max((Tmax + Tmin) / 2 - baseTemp, 0);

const calculateHarvestDate = (floweringDate, gddValue, weatherData) => {
    if (!floweringDate || !gddValue || !weatherData) return "No Data";
    
    let totalGDD = 0;
    const gdd = calculateGDD(weatherData.temperatureMax, weatherData.temperatureMin);
    let harvestDate = new Date(floweringDate);

    while (totalGDD < gddValue) {
        totalGDD += gdd;
        harvestDate.setDate(harvestDate.getDate() + 1);
    }

    return harvestDate.toDateString();
};

const GDDPage = () => {
    const [fruit, setFruit] = useState('');
    const [gddValue, setGddValue] = useState(null);
    const [floweringDate, setFloweringDate] = useState('');
    const [province, setProvince] = useState('Bangkok');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [harvestDate, setHarvestDate] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            const data = await fetchWeatherDataFromAPI(province);
            setWeatherData(data);
            setLoading(false);
        };
        fetchWeather();
    }, [province]);

    const handleCalculateHarvestDate = async () => {
        // ตรวจสอบให้แน่ใจว่าทุกฟิลด์ถูกกรอกครบ
        if (!fruit || !floweringDate || !gddValue || !weatherData) {
            alert("Please ensure all fields are filled and weather data is valid.");
            return;
        }

        try {
            const calculatedHarvestDate = calculateHarvestDate(floweringDate, gddValue, weatherData);
            setHarvestDate(calculatedHarvestDate);
        } catch (error) {
            console.error("Error calculating harvest date:", error);
            alert("Error calculating harvest date.");
        }
    };

    return (
        <div>
            <h1>Calculate Growing Degree Days (GDD)</h1>

            <label>Flowering Date:</label>
            <input
                type="date"
                value={floweringDate}
                onChange={(e) => setFloweringDate(e.target.value)}
            />

            <label>Province:</label>
            <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
            >
                {provinces.map((prov) => (
                    <option key={prov} value={prov}>
                        {prov}
                    </option>
                ))}
            </select>

            <label>Fruit Type:</label>
            <select
                value={fruit}
                onChange={(e) => {
                    setFruit(e.target.value);
                    setGddValue(fruits[e.target.value] || null);
                }}
            >
                {Object.keys(fruits).map((fruit) => (
                    <option key={fruit} value={fruit}>
                        {fruit}
                    </option>
                ))}
            </select>

            <button onClick={handleCalculateHarvestDate}>
                Calculate Harvest Date
            </button>

            {loading ? (
                <p>Loading weather data...</p>
            ) : weatherData ? (
                <div>
                    <h3>Weather Data for {province}</h3>
                    <p>Max Temperature: {weatherData.temperatureMax}°C</p>
                    <p>Min Temperature: {weatherData.temperatureMin}°C</p>
                    <p>Cloud Cover: {weatherData.precipitation}%</p>
                </div>
            ) : (
                <p>No weather data available</p>
            )}

            {harvestDate && <h3>Estimated Harvest Date: {harvestDate}</h3>}
        </div>
    );
};

export default GDDPage;
