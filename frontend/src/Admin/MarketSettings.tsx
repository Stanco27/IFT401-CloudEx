import React, { useEffect, useState } from "react";

const API_BASE = "https://ift401-cloudex.onrender.com/";

const MarketSettings: React.FC = () => {
  const [openTime, setOpenTime] = useState("09:30");
  const [closeTime, setCloseTime] = useState("16:00");
  const [message, setMessage] = useState("");

  // Load current settings from backend
  useEffect(() => {
    fetch(`${API_BASE}/api/market_hours`)
      .then((res) => res.json())
      .then((data) => {
        if (data.open_time && data.close_time) {
          setOpenTime(data.open_time);
          setCloseTime(data.close_time);
        }
      })
      .catch(() => {
        setMessage("Could not load current market hours.");
      });
  }, []);

  const saveSettings = () => {
    setMessage("");

    fetch(`${API_BASE}/api/market_hours`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        open_time: openTime,
        close_time: closeTime,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setMessage("Updated successfully.");
      })
      .catch(() => {
        setMessage("There was an error saving settings.");
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Market Hours Settings</h2>

      <div style={{ marginBottom: 10 }}>
        <label>Open Time: </label>
        <input
          type="time"
          value={openTime}
          onChange={(e) => setOpenTime(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Close Time: </label>
        <input
          type="time"
          value={closeTime}
          onChange={(e) => setCloseTime(e.target.value)}
        />
      </div>

      <button onClick={saveSettings}>Save</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default MarketSettings;
