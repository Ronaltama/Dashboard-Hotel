import React, { useState, useEffect, useCallback } from "react";
import EnergyUsageChart from "./EnergyUsageChart";
import DatePicker from "./DatePicker";

const RoomCard = ({ room, getDailyKwhDataForRoom }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState("daily");
  const [dailyKwhData, setDailyKwhData] = useState([]);
  const [totalKwhToday, setTotalKwhToday] = useState(0);

  const memoizedGetKwhData = useCallback(
    () => getDailyKwhDataForRoom(room.id, selectedDate, selectedRange),
    [room.id, selectedDate, selectedRange, getDailyKwhDataForRoom]
  );

  useEffect(() => {
    const data = memoizedGetKwhData();
    setDailyKwhData(data);
    const sumKwh = data.reduce((sum, entry) => sum + entry.kwh, 0);
    setTotalKwhToday(sumKwh.toFixed(2));
  }, [memoizedGetKwhData]);

  const statusColorClass =
    room.status === "Occupied" ? "bg-green-500" : "bg-gray-400";
  const statusTextColorClass =
    room.status === "Occupied" ? "text-green-700" : "text-gray-600";

  let totalKwhLabel = "Total KWH Today:";
  if (selectedRange === "weekly") {
    totalKwhLabel = "Total KWH This Week:";
  } else if (selectedRange === "monthly") {
    totalKwhLabel = "Total KWH This Month:";
  }

  let chartTitle = "";
  if (selectedRange === "daily") {
    chartTitle = `Hourly Consumption on ${selectedDate.toLocaleDateString(
      "en-GB",
      { day: "2-digit", month: "short", year: "numeric" }
    )}`;
  } else if (selectedRange === "weekly") {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(
      selectedDate.getDate() -
        selectedDate.getDay() +
        (selectedDate.getDay() === 0 ? -6 : 1)
    );
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    chartTitle = `Weekly Consumption (${startOfWeek.toLocaleDateString(
      "en-GB",
      { day: "2-digit", month: "short" }
    )} - ${endOfWeek.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })})`;
  } else if (selectedRange === "monthly") {
    chartTitle = `Monthly Consumption for ${selectedDate.toLocaleDateString(
      "en-GB",
      { month: "long", year: "numeric" }
    )}`;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 flex flex-col h-full transition-shadow hover:shadow-xl">
      {" "}
      {/* Padding lebih besar, radius lebih besar, hover effect */}
      {/* Header Kamar & Status */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
        {" "}
        {/* Margin & padding lebih besar */}
        <h3 className="text-2xl font-bold text-gray-800">
          ROOM {room.room}
        </h3>{" "}
        {/* Font lebih besar */}
        <div className="flex items-center text-lg font-semibold">
          {" "}
          {/* Font lebih besar */}
          <div
            className={`w-5 h-5 rounded-full mr-2 ${statusColorClass}`}
          ></div>{" "}
          {/* Ukuran indikator lebih besar */}
          <span className={statusTextColorClass}>
            {room.status.toUpperCase()}
          </span>
        </div>
      </div>
      {/* Electricity Usage & Date Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        {" "}
        {/* Margin lebih besar */}
        <p className="text-xl font-semibold text-blue-600 mb-3 md:mb-0">
          Electricity Usage
        </p>{" "}
        {/* Font lebih besar */}
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedRange={selectedRange}
          onSelectRange={setSelectedRange}
        />
      </div>
      {/* Area Grafik */}
      <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-md flex-grow">
        {" "}
        {/* Padding lebih besar, shadow lebih jelas */}
        <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          {" "}
          {/* Font lebih besar */}
          {chartTitle}
        </h4>
        <EnergyUsageChart data={dailyKwhData} selectedRange={selectedRange} />
      </div>
      {/* Data Pemakaian Per Hari */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center px-4">
        {" "}
        {/* Margin & padding lebih besar */}
        <p className="text-xl font-bold text-blue-700">{totalKwhLabel}</p>{" "}
        {/* Font lebih besar */}
        <p className="text-3xl font-extrabold text-blue-600">
          {totalKwhToday} KWH
        </p>{" "}
        {/* Font lebih besar */}
      </div>
      {/* Tombol Download Data */}
      <div className="text-center mt-8">
        {" "}
        {/* Margin lebih besar */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 text-base">
          Download Data
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
