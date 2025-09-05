import React, { useState } from "react";
import "./App.css";

async function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  // Function to extract features from URL
  const extractFeatures = (url) => {
    try {
      const parsed = new URL(url);

      // 1. NumDots = count of "." in the hostname
      const NumDots = (parsed.hostname.match(/\./g) || []).length;

      // 2. UrlLength = total length of the URL string
      const UrlLength = url.length;

      // 3. AtSymbol = check if "@" exists in URL
      const AtSymbol = url.includes("@") ? 1 : 0;

      // 4. NoHttps = check if protocol is NOT https
      const NoHttps = parsed.protocol === "https:" ? 0 : 1;

      // 5. IpAddress = check if hostname looks like an IP address
      const IpAddress = /^\d{1,3}(\.\d{1,3}){3}$/.test(parsed.hostname) ? 1 : 0;

      return { NumDots, UrlLength, AtSymbol, NoHttps, IpAddress };
    } catch (err) {
      console.error("Invalid URL:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputData={url: url};
    const features = extractFeatures(url);

    if (!features) {
      alert("Please enter a valid URL");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(features),
      });
      const data = await response.json();
      setResult(data.prediction);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="App" style={{ padding: "20px" }}>
      <h2>Phishing URL Detector</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Paste a URL (e.g. https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "400px" }}
        />
        <br />
        <button type="submit" style={{ marginTop: "10px" }}>
          Check
        </button>
      </form>

      {result && (
        <h3>
          Prediction:{" "}
          <span style={{ color: result === "phishing" ? "red" : "green" }}>
            {result}
          </span>
        </h3>
      )}
    </div>
  );
  const response = await fetch("https://phishing-back-end.onrender.com/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(inputData),
});
}

export default App;