export const fetchWeatherData = async (city) => {
    const apiKey = '30d4741c779ba94c470ca1f63045390a';  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        console.log("Weather API Response:", data);

        if (data && data.main) {
            console.log(`Connected to OpenWeatherMap API for city: ${city}`);
        }

        return {
            city: data.name, // ชื่อเมือง
            temperature: data.main.temp,  // อุณหภูมิ ณ ปัจจุบัน (°C)
            temperatureMax: data.main.temp_max, // อุณหภูมิสูงสุดของวัน
            temperatureMin: data.main.temp_min // อุณหภูมิต่ำสุดของวัน
        };

    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
};
