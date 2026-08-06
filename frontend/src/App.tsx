// frontend/src/App.tsx
import { useState } from 'react';
import './index.css';

// Importing the locations list to build the dropdown
import locationsList from './locations.json';

function App() {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initial state with empty strings for numeric fields so placeholders appear
  const [formData, setFormData] = useState({
    location: locationsList[0] || 'Mumbai',
    carpet_area_sqft: "", 
    floor_num: "",        
    bathroom: "",         
    balcony: "",          
    furnishing: 'Semi-Furnished',
    transaction: 'Resale',
    ownership: 'Freehold',
    facing: 'East'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrice(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We convert the string states to strict numbers before sending
        body: JSON.stringify({
          ...formData,
          carpet_area_sqft: Number(formData.carpet_area_sqft),
          floor_num: Number(formData.floor_num),
          bathroom: Number(formData.bathroom),
          balcony: Number(formData.balcony)
        })
      });

      if (!response.ok) throw new Error("Failed to connect to the server.");

      const data = await response.json();
      setPrice(data.predicted_price);
    } catch (err) {
      setError("Oops! Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="apple-card">
        <h1>House Price Predictor</h1>
        
        <form onSubmit={handleSubmit}>
          
          {/* 1. Location */}
          <div className="form-group">
            <label>Location</label>
            <select name="location" value={formData.location} onChange={handleChange}>
              {locationsList.map((loc: string) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* 2. Carpet Area */}
          <div className="form-group">
            <label>Carpet Area (SqFt)</label>
            <input 
              name="carpet_area_sqft" 
              type="number" 
              step="0.1" 
              value={formData.carpet_area_sqft} 
              onChange={handleChange} 
              placeholder="Type carpet area (e.g., 1250)" 
              required 
            />
          </div>

          {/* 3. Floor Number */}
          <div className="form-group">
            <label>Floor Number</label>
            <input 
              name="floor_num" 
              type="number" 
              value={formData.floor_num} 
              onChange={handleChange} 
              placeholder="Type floor number (e.g., 3)" 
              required 
            />
          </div>

          {/* 4. Bathrooms */}
          <div className="form-group">
            <label>Bathrooms</label>
            <input 
              name="bathroom" 
              type="number" 
              value={formData.bathroom} 
              onChange={handleChange} 
              placeholder="Type number of bathrooms" 
              required 
            />
          </div>

          {/* 5. Balconies */}
          <div className="form-group">
            <label>Balconies</label>
            <input 
              name="balcony" 
              type="number" 
              value={formData.balcony} 
              onChange={handleChange} 
              placeholder="Type number of balconies" 
              required 
            />
          </div>

          {/* 6. Furnishing */}
          <div className="form-group">
            <label>Furnishing</label>
            <select name="furnishing" value={formData.furnishing} onChange={handleChange}>
              <option value="Furnished">Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* 7. Transaction */}
          <div className="form-group">
            <label>Transaction</label>
            <select name="transaction" value={formData.transaction} onChange={handleChange}>
              <option value="New Property">New Property</option>
              <option value="Resale">Resale</option>
            </select>
          </div>

          {/* 8. Ownership */}
          <div className="form-group">
            <label>Ownership</label>
            <select name="ownership" value={formData.ownership} onChange={handleChange}>
              <option value="Freehold">Freehold</option>
              <option value="Leasehold">Leasehold</option>
              <option value="Co-operative Society">Co-operative Society</option>
              <option value="Power of Attorney">Power of Attorney</option>
            </select>
          </div>

          {/* 9. Facing */}
          <div className="form-group">
            <label>Facing</label>
            <select name="facing" value={formData.facing} onChange={handleChange}>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="North-East">North-East</option>
              <option value="North-West">North-West</option>
              <option value="South-East">South-East</option>
              <option value="South-West">South-West</option>
            </select>
          </div>

          <button type="submit" className="apple-button" disabled={loading}>
            {loading ? "Calculating..." : "Predict Price"}
          </button>
        </form>

        {/* Error State */}
        {error && <p style={{ color: "red", textAlign: "center", marginTop: "16px" }}>{error}</p>}

        {/* Loading/Result State */}
        {price !== null && (
          <div className="result-box">
            <label>Estimated Value</label>
            <div className="result-price">
              ₹ {(price / 100000).toFixed(2)} Lac
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;