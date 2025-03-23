import React, { useState, useEffect } from 'react';

// ฟังก์ชันคำนวณ GDD
const calculateGDD = (Tmax, Tmin, baseTemp = 10) => {
  return (Tmax + Tmin) / 2 - baseTemp;
};
const calculateHarvestDate = () => {
    if (!date || !gddValue || !weatherData || !weatherData.daily) return null;
  
    let totalGDD = 0;
    let harvestDate = new Date(date);
  
    for (let i = 0; i < weatherData.daily.temperature_2m_max.length; i++) {
      const tMax = weatherData.daily.temperature_2m_max[i];
      const tMin = weatherData.daily.temperature_2m_min[i];
      const tBase = 10; // อุณหภูมิฐาน (สามารถเปลี่ยนตามชนิดผลไม้)
  
      const gdd = Math.max(((tMax + tMin) / 2) - tBase, 0);
      totalGDD += gdd;
  
      if (totalGDD >= gddValue) {
        harvestDate.setDate(harvestDate.getDate() + i);
        return harvestDate.toDateString();
      }
    }
    return "Not enough data to estimate harvest date";
  };
  

const GDDCalculation = ({ latitude, longitude, flowerDate }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [gdd, setGdd] = useState(null);
  const [harvestDate, setHarvestDate] = useState(null);

  // ดึงข้อมูลสภาพอากาศจาก Open-Meteo API
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,humidity_2m_max&timezone=Asia/Bangkok`
        );
        
        if (!response.ok) throw new Error("Failed to fetch weather data");
        
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeatherData({ daily: { temperature_2m_max: [0], temperature_2m_min: [0] } }); // ค่าเริ่มต้นถ้า fetch ล้มเหลว
      }
    };
    fetchWeatherData();
  }, [latitude, longitude]);

  // คำนวณ GDD และวันที่เก็บเกี่ยว
  useEffect(() => {
    if (weatherData?.daily?.temperature_2m_max && weatherData?.daily?.temperature_2m_min) {
      const Tmax = weatherData.daily.temperature_2m_max[0] ?? 0; // ถ้า undefined ให้เป็น 0
      const Tmin = weatherData.daily.temperature_2m_min[0] ?? 0;
      const calculatedGDD = calculateGDD(Tmax, Tmin);
      setGdd(calculatedGDD);

      if (flowerDate) { // ตรวจสอบว่า flowerDate มีค่าก่อน
        const flowerDateObj = new Date(flowerDate);
        const harvestDayOffset = calculatedGDD >= 100 ? 30 : 50;
        flowerDateObj.setDate(flowerDateObj.getDate() + harvestDayOffset);
        setHarvestDate(flowerDateObj.toLocaleDateString());
      }
    }
  }, [weatherData, flowerDate]);

  if (!weatherData) {
    return <div>Loading weather data...</div>;
  }

  return (
    <div>
      <h2>GDD Calculation</h2>
      <p>Temperature Max: {weatherData.daily.temperature_2m_max?.[0] || "No Data"}°C</p>
      <p>Temperature Min: {weatherData.daily.temperature_2m_min?.[0] || "No Data"}°C</p>
      <p>Calculated GDD: {gdd ?? "No Data"}</p>
      <p>Predicted Harvest Date: {harvestDate ?? "No Data"}</p>
    </div>
  );
};

export default GDDCalculation;
