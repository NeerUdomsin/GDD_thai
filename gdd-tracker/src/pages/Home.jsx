import { useEffect, useState } from "react";
import { fetchWeatherData } from "../api/weather";
import { calculateGDD } from "../utils/gddCalculator";
import { Line } from "react-chartjs-2";

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [gddTotal, setGddTotal] = useState(0);
  const latitude = 14.0476;  // พิกัดสวนของคุณ
  const longitude = 101.3779;

  useEffect(() => {
    const getData = async () => {
      const data = await fetchWeatherData(latitude, longitude);
      setWeather(data);

      const gddSum = data.temperature_2m_max.map((tMax, i) =>
        calculateGDD(tMax, data.temperature_2m_min[i])
      ).reduce((a, b) => a + b, 0);

      setGddTotal(gddSum);
    };
    getData();
  }, []);

  if (!weather) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">ข้อมูล GDD และสภาพอากาศ</h1>
      <p>GDD สะสม: {gddTotal.toFixed(2)}</p>

      <Line data={{
        labels: weather.time,
        datasets: [{
          label: "อุณหภูมิสูงสุด",
          data: weather.temperature_2m_max,
          borderColor: "red",
          fill: false
        }]
      }} />
    </div>
  );
};

export default Home;
