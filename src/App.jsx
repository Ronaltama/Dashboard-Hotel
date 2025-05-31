import React, { useState, useEffect, useCallback } from "react";
import FloorList from "./components/FloorList";
import RoomGrid from "./components/RoomGrid";
import LoginPage from "./components/LoginPage"; // Import komponen login

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // NEW: State autentikasi
  const [selectedFloor, setSelectedFloor] = useState("floor1");
  const [hotelData, setHotelData] = useState({});

  // NEW: Cek status autentikasi saat aplikasi dimuat
  useEffect(() => {
    // Di aplikasi nyata, Anda akan memeriksa token di localStorage
    const token = localStorage.getItem("authToken");
    if (token) {
      // Anda bisa melakukan validasi token di sini jika diperlukan (misal: cek kedaluwarsa)
      setIsAuthenticated(true);
    }
  }, []);

  // Fungsi autentikasi yang akan dipanggil dari LoginPage
  // *** PENTING: Ini adalah simulasi, di dunia nyata Anda akan panggil API backend ***
  const handleLogin = async (username, password) => {
    // Contoh sederhana: username 'admin', password 'password123'
    if (username === "admin" && password === "password123") {
      const dummyToken = "your_dummy_jwt_token_here_12345";
      localStorage.setItem("authToken", dummyToken); // Simpan token
      setIsAuthenticated(true);
      return { success: true };
    } else {
      return { success: false, message: "Invalid credentials" };
    }

    // Contoh bagaimana Anda akan memanggil API nyata:
    /*
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login API error:", error);
      return { success: false, message: "Network error. Please try again." };
    }
    */
  };

  // NEW: Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Hapus token
    setIsAuthenticated(false);
    setSelectedFloor("floor1"); // Reset ke default
  };

  const getDailyKwhDataForRoom = useCallback((roomId, date, range) => {
    // Logika data dummy
    const seed =
      parseInt(roomId) +
      date.getDate() +
      date.getMonth() * 30 +
      date.getFullYear() * 365;
    const getRandom = (s) => {
      const x = Math.sin(s++) * 10000;
      return x - Math.floor(x);
    };

    let currentSeed = seed;
    let data = [];

    if (range === "daily") {
      const baseKwhForDaily = (parseInt(roomId.slice(-2)) % 10) * 5 + 100;
      data = Array.from({ length: 24 }, (_, i) => {
        currentSeed += 1;
        const hourEffect = Math.sin((i / 24) * Math.PI * 2 - Math.PI / 2) * 40;
        const randomFactor = (getRandom(currentSeed) * 2 - 1) * 15;
        const kwh = Math.max(0, baseKwhForDaily + hourEffect + randomFactor);
        return {
          label: `${String(i).padStart(2, "0")}:00`,
          kwh: parseFloat(kwh.toFixed(2)),
        };
      });
    } else if (range === "weekly") {
      const daysInWeek = 7;
      const baseKwhForWeekly = (parseInt(roomId.slice(-2)) % 10) * 20 + 700;
      const today = new Date(date);
      const startOfWeek = new Date(
        today.setDate(
          today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
        )
      );

      data = Array.from({ length: daysInWeek }, (_, i) => {
        currentSeed += 1;
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        const randomFactor = (getRandom(currentSeed) * 2 - 1) * 50;
        const kwh = Math.max(
          0,
          baseKwhForWeekly + randomFactor + Math.sin((i / 2) * Math.PI) * 100
        );
        return {
          label: currentDay.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          }),
          kwh: parseFloat(kwh.toFixed(2)),
        };
      });
    } else if (range === "monthly") {
      const daysInMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();
      const baseKwhForMonthly = (parseInt(roomId.slice(-2)) % 10) * 100 + 2000;

      data = Array.from({ length: daysInMonth }, (_, i) => {
        currentSeed += 1;
        const currentDay = i + 1;
        const randomFactor = (getRandom(currentSeed) * 2 - 1) * 150;
        const kwh = Math.max(
          0,
          baseKwhForMonthly + randomFactor + Math.sin((i / 15) * Math.PI) * 300
        );
        return { label: `${currentDay}`, kwh: parseFloat(kwh.toFixed(2)) };
      });
    }
    return data;
  }, []); // useCallback untuk fungsi ini

  useEffect(() => {
    // Data untuk 1 lantai, 1 kamar
    const fetchedHotelData = {
      floor1: [{ id: "101", room: "101", status: "Occupied" }],
    };
    setHotelData(fetchedHotelData);
    setSelectedFloor("floor1");
  }, []);

  const roomsOnSelectedFloor = hotelData[selectedFloor] || [];

  // Conditional rendering: tampilkan Login Page jika belum autentikasi
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  // Tampilkan Dashboard jika sudah autentikasi
  return (
    <div className="min-h-screen bg-blue-50 flex p-6 md:p-10">
      {/* Sidebar Kiri: Daftar Lantai */}
      <div className="w-1/5 md:w-1/6 lg:w-1/5 xl:w-1/6 bg-white rounded-2xl shadow-xl flex flex-col p-6 mr-8 border border-blue-100">
        <h1 className="text-xl md:text-2xl font-extrabold text-blue-700 mb-8 text-center">
          iBright DASHBOARD
        </h1>
        <FloorList
          hotelData={hotelData}
          selectedFloor={selectedFloor}
          onSelectFloor={setSelectedFloor}
        />
        {/* Tombol Logout di sidebar */}
        <div className="mt-auto pt-6 border-t border-gray-100 text-center">
          {" "}
          {/* mt-auto untuk dorong ke bawah */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Konten Utama: Grid Kamar (Hanya akan menampilkan 1 kamar) */}
      <div className="flex-grow bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-blue-100">
        <div className="flex items-center justify-between mb-10 pb-5 border-b border-blue-100">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700">
            FLOOR {selectedFloor.replace("floor", "")}
          </h2>
        </div>

        {roomsOnSelectedFloor.length > 0 ? (
          <RoomGrid
            rooms={roomsOnSelectedFloor}
            getDailyKwhDataForRoom={getDailyKwhDataForRoom}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-blue-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m8-16v4m0 0l-2 2m2-2l2 2"
              />
            </svg>
            <p className="text-xl font-semibold text-gray-700">
              No rooms available for this floor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
