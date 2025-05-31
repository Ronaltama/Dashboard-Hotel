import React from "react";
import DatePicker from "react-datepicker";

const CustomDatePicker = ({
  selectedDate,
  onDateChange,
  selectedRange,
  onSelectRange,
}) => {
  const renderCustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <div
      style={{
        margin: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
      }}
      className="bg-blue-50 p-3 rounded-lg shadow-inner" // Padding dan shadow lebih jelas
    >
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="p-2 mx-1 text-blue-600 hover:bg-blue-200 rounded-full transition-colors duration-200"
      >
        {"<"}
      </button>
      <select
        value={date.getFullYear()}
        onChange={({ target: { value } }) => changeYear(value)}
        className="mx-1 p-2 rounded-md bg-blue-100 text-blue-800 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-300" // Styling select
      >
        {Array.from(
          { length: 20 },
          (_, i) => new Date().getFullYear() - 10 + i
        ).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <select
        value={date.getMonth()}
        onChange={({ target: { value } }) => changeMonth(value)}
        className="mx-1 p-2 rounded-md bg-blue-100 text-blue-800 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-300" // Styling select
      >
        {[
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ].map((month, i) => (
          <option key={month} value={i}>
            {month}
          </option>
        ))}
      </select>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="p-2 mx-1 text-blue-600 hover:bg-blue-200 rounded-full transition-colors duration-200"
      >
        {">"}
      </button>

      {/* Selector Rentang Waktu di dalam header kalender */}
      <div className="flex bg-blue-200 rounded-lg p-0.5 mt-3 w-full justify-center shadow-sm">
        {" "}
        {/* Margin atas dan lebar penuh */}
        <button
          onClick={() => onSelectRange("daily")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 ${
            selectedRange === "daily"
              ? "bg-blue-500 text-white shadow-sm"
              : "text-blue-700 hover:bg-blue-300"
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => onSelectRange("weekly")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 ${
            selectedRange === "weekly"
              ? "bg-blue-500 text-white shadow-sm"
              : "text-blue-700 hover:bg-blue-300"
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => onSelectRange("monthly")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 ${
            selectedRange === "monthly"
              ? "bg-blue-500 text-white shadow-sm"
              : "text-blue-700 hover:bg-blue-300"
          }`}
        >
          Monthly
        </button>
      </div>
    </div>
  );

  let datePickerProps = {
    dateFormat: "dd/MM/yyyy",
    showMonthDropdown: false,
    showYearDropdown: false,
    dropdownMode: "select",
    renderCustomHeader: renderCustomHeader,
  };

  if (selectedRange === "monthly") {
    datePickerProps.dateFormat = "MM/yyyy";
    datePickerProps.showMonthYearPicker = true;
  } else if (selectedRange === "weekly") {
    datePickerProps.dateFormat = "MM/dd/yyyy";
    datePickerProps.showWeekNumbers = true;
    datePickerProps.showYearDropdown = true;
    datePickerProps.scrollableYearDropdown = true;
    datePickerProps.yearDropdownItemNumber = 15;
  }

  return (
    <div className="relative z-10">
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        className="border border-blue-300 rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200 w-full md:w-auto text-gray-700 font-medium text-sm"
        calendarClassName="shadow-xl rounded-lg border border-blue-200"
        dayClassName={(date) =>
          date.getDay() === 0 || date.getDay() === 6
            ? "text-red-500 font-semibold"
            : "text-gray-800"
        }
        popperPlacement="bottom-end"
        {...datePickerProps}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-blue-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default CustomDatePicker;
