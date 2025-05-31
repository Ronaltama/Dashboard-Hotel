import React from "react";

const FloorList = ({ hotelData, selectedFloor, onSelectFloor }) => {
  const floors = Object.keys(hotelData).sort((a, b) => {
    return parseInt(a.replace("floor", "")) - parseInt(b.replace("floor", ""));
  });

  return (
    <nav className="flex-grow overflow-y-auto pr-2">
      <ul className="space-y-3">
        {" "}
        {/* Spasi lebih besar */}
        {floors.map((floorId) => (
          <li key={floorId}>
            <button
              onClick={() => onSelectFloor(floorId)}
              className={`block w-full text-left p-4 rounded-lg transition duration-200 ease-in-out font-medium text-lg /* Padding lebih besar, font lebih besar */
                ${
                  selectedFloor === floorId
                    ? "bg-blue-400 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`}
            >
              {floorId.replace("floor", "FLOOR ").toUpperCase()}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-10 text-center border-t pt-6 border-gray-100">
        {" "}
        {/* Margin & padding lebih besar */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 text-base">
          {" "}
          {/* Padding & font lebih besar */}
          Download Report
        </button>
      </div>
    </nav>
  );
};

export default FloorList;
