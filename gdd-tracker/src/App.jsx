import React, { useState, useEffect } from 'react';  // import React แค่ครั้งเดียว
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from './api/firebase';
import GDDPage from './components/GDDPage';  // นำเข้า GDDPage
import Dashboard from './components/Dashboard';  // สมมติว่าคุณมีหน้า Dashboard
import WeatherChart from "./components/WeatherChart";  // No need for .jsx extension



// ฟอร์มล็อกอิน
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // ไปยังหน้า Dashboard เมื่อเข้าสู่ระบบสำเร็จ
    } catch (error) {
      setError("Invalid credentials, please try again.");
      console.error(error.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  // ตรวจสอบสถานะผู้ใช้
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);  // อัพเดตสถานะผู้ใช้เมื่อมีการเปลี่ยนแปลง
    });

    return () => unsubscribe();  // การยกเลิกการติดตามเมื่อคอมโพเนนต์ถูกลบ
  }, []);

  return (
    <Router>
      <Routes>
        {/* หน้าแรก และหน้า Dashboard หากผู้ใช้ล็อกอิน */}
        <Route path="/" element={user ? <Dashboard /> : <Login />} />
        
        {/* หน้า GDD คำนวณ Growing Degree Days */}
        <Route path="/gdd" element={user ? <GDDPage /> : <Login />} />

        {/* routes อื่น ๆ */}
      </Routes>
    </Router>
  );
};

export default App;
