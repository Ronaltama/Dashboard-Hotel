import React, { useState, useEffect } from "react";
import FloorList from "./components/FloorList";
import RoomGrid from "./components/RoomGrid";

function App() {
  const [selectedFloor, setSelectedFloor] = useState("floor1");
  const [hotelData, setHotelData] = useState({});

  const getDailyKwhDataForRoom = (roomId, date, range) => {
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
  };

  useEffect(() => {
    const fetchedHotelData = {
      floor1: [{ id: "101", room: "101", status: "Occupied" }],
    };
    setHotelData(fetchedHotelData);
    setSelectedFloor("floor1");
  }, []);

  const roomsOnSelectedFloor = hotelData[selectedFloor] || [];

  return (
    <div className="min-h-screen bg-blue-50 flex p-6 md:p-10">
      {" "}
      {/* Padding lebih besar */}
      {/* Sidebar Kiri: Daftar Lantai */}
      <div className="w-1/5 md:w-1/6 lg:w-1/5 xl:w-1/6 bg-white rounded-2xl shadow-xl flex flex-col p-6 mr-8 border border-blue-100">
        {" "}
        {/* Radius lebih besar, shadow lebih kuat, margin lebih besar */}
        <h1 className="text-xl md:text-2xl font-extrabold text-blue-700 mb-8 text-center">
          {" "}
          {/* Font lebih tebal, margin lebih besar */}
          iBright DASHBOARD
        </h1>
        <FloorList
          hotelData={hotelData}
          selectedFloor={selectedFloor}
          onSelectFloor={setSelectedFloor}
        />
      </div>
      {/* Konten Utama: Grid Kamar (Hanya akan menampilkan 1 kamar) */}
      <div className="flex-grow bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-blue-100">
        {" "}
        {/* Radius lebih besar, shadow lebih kuat, padding lebih besar */}
        <div className="flex items-center justify-between mb-10 pb-5 border-b border-blue-100">
          {" "}
          {/* Margin dan padding lebih besar, border lebih halus */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700">
            {" "}
            {/* Font lebih tebal */}
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
