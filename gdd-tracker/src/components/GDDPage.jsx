import React, { useState } from "react";

const GDDPage = () => {
  const [fruit, setFruit] = useState('');
  const [gddValue, setGddValue] = useState(null);

  const fruits = ["Durian", "Sugarcane", "Rice", "Mango"];  // เพิ่มรายชื่อผลไม้ที่ต้องการ

  const handleFruitChange = (e) => {
    setFruit(e.target.value);
  };

  const calculateGDD = () => {
    // การคำนวณ GDD เป็นตัวอย่าง
    if (fruit === "Durian") {
      setGddValue(1500);  // ค่า GDD สำหรับทุเรียน
    } else if (fruit === "Sugarcane") {
      setGddValue(1200);  // ค่า GDD สำหรับอ้อย
    } else if (fruit === "Rice") {
      setGddValue(1000);  // ค่า GDD สำหรับข้าว
    } else if (fruit === "Mango") {
      setGddValue(2000);  // ค่า GDD สำหรับมะม่วง
    } else {
      setGddValue(null);
    }
  };

  return (
    <div>
      <h1>Calculate Growing Degree Days (GDD)</h1>

      {/* Dropdown สำหรับเลือกผลไม้ */}
      <select value={fruit} onChange={handleFruitChange}>
        <option value="">Select a fruit</option>
        {fruits.map((fruit) => (
          <option key={fruit} value={fruit}>
            {fruit}
          </option>
        ))}
      </select>

      {/* ปุ่มคำนวณ GDD */}
      <button onClick={calculateGDD}>Calculate GDD</button>

      {gddValue !== null && (
        <div>
          <h2>GDD Value: {gddValue}</h2>
        </div>
      )}
    </div>
  );
};

export default GDDPage;
