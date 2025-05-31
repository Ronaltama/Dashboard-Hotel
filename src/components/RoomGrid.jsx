import React from "react";
import RoomCard from "./RoomCard";

const RoomGrid = ({ rooms, getDailyKwhDataForRoom }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
      {" "}
      {/* Gap lebih besar */}
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          getDailyKwhDataForRoom={getDailyKwhDataForRoom}
        />
      ))}
    </div>
  );
};

export default RoomGrid;
