import React, { useState, useEffect } from 'react';

// ฟังก์ชันคำนวณ GDD
const calculateGDD = (Tmax, Tmin, baseTemp = 10) => {
  return (Tmax + Tmin) / 2 - baseTemp;
};

const GDDCalculation = ({ latitude, longitude, flowerDate }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [gdd, setGdd] = useState(null);
  const [harvestDate, setHarvestDate] = useState(null);

  // ดึงข้อมูลสภาพอากาศจาก Open-Meteo API
  useEffect(() => {
    const fetchWeatherData = async () => {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,humidity_2m_max&timezone=Asia/Bangkok`);
      const data = await response.json();
      setWeatherData(data);
    };
    fetchWeatherData();
  }, [latitude, longitude]);

  // คำนวณ GDD และวันที่เก็บเกี่ยว
  useEffect(() => {
    if (weatherData) {
      const Tmax = weatherData.daily.temperature_2m_max[0]; // อุณหภูมิสูงสุดในวันแรก
      const Tmin = weatherData.daily.temperature_2m_min[0]; // อุณหภูมิต่ำสุดในวันแรก
      const calculatedGDD = calculateGDD(Tmax, Tmin);

      setGdd(calculatedGDD);

      // คำนวณวันที่เก็บเกี่ยวโดยการเพิ่มวันหลังจาก Flower Date
      const flowerDateObj = new Date(flowerDate);
      const harvestDayOffset = calculatedGDD >= 100 ? 30 : 50; // ใช้เกณฑ์ GDD มากกว่า 100 สำหรับทุเรียนอ่อนหรือแก่
      flowerDateObj.setDate(flowerDateObj.getDate() + harvestDayOffset);
      setHarvestDate(flowerDateObj.toLocaleDateString());
    }
  }, [weatherData, flowerDate]);

  if (!weatherData) {
    return <div>Loading weather data...</div>;
  }

  return (
    <div>
      <h2>GDD Calculation</h2>
      <p>Temperature Max: {weatherData.daily.temperature_2m_max[0]}°C</p>
      <p>Temperature Min: {weatherData.daily.temperature_2m_min[0]}°C</p>
      <p>Calculated GDD: {gdd}</p>
      <p>Predicted Harvest Date: {harvestDate}</p>
    </div>
  );
};

export default GDDCalculation;
