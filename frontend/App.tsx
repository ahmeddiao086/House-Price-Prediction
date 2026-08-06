import { useState } from 'react';
import './index.css';
import locationsList from './locations.json';

function App() {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initialFormState = {
    location: locationsList[0] || 'Mumbai',
    carpet_area_sqft: "", 
    floor_num: "",        
    bathroom: "",         
    balcony: "",          
    furnishing: 'Semi-Furnished',
    transaction: 'Resale',
    ownership: 'Freehold',
    facing: 'East'
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setPrice(null);
    setError("");
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
    <div className="page-wrapper">
      {/* Header */}
      <header className="top-nav">
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span>House Price Predictor</span>
        </div>
        <div className="nav-links">
          <a href="#" className="active">Predict</a>
          <a href="#">About</a>
          <a href="#">How it works</a>
          <a href="#">Dataset</a>
          <button className="theme-toggle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="app-card">
          
          {/* Left Panel - Hero Section */}
          <div className="hero-panel">
            <div className="hero-text">
              <h1>Predict the Price<br/>of Your House</h1>
              <p>Our machine learning model analyzes key features of the property to estimate its market price.</p>
            </div>
            
            {/* Floating Widget */}
            <div className="floating-widget">
              <div className="widget-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              </div>
              <div className="widget-text">
                <strong>Accurate Predictions</strong>
                <span>Powered by Machine Learning</span>
                <span>Trained on real estate data</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Form Section */}
          <div className="form-panel">
            <div className="form-header">
              <h2>Enter House Details</h2>
              <p>Fill in the details below to get an estimated price</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-grid">
                
                <div className="input-group">
                  <label>Area (sq ft)</label>
                  <input name="carpet_area_sqft" type="number" step="0.1" value={formData.carpet_area_sqft} onChange={handleChange} placeholder="e.g. 1500" required />
                </div>

                <div className="input-group">
                  <label>Bathrooms</label>
                  <input name="bathroom" type="number" value={formData.bathroom} onChange={handleChange} placeholder="e.g. 2" required />
                </div>

                <div className="input-group">
                  <label>Balconies</label>
                  <input name="balcony" type="number" value={formData.balcony} onChange={handleChange} placeholder="e.g. 1" required />
                </div>

                <div className="input-group">
                  <label>Floor Number</label>
                  <input name="floor_num" type="number" value={formData.floor_num} onChange={handleChange} placeholder="e.g. 3" required />
                </div>

                <div className="input-group">
                  <label>Location</label>
                  <select name="location" value={formData.location} onChange={handleChange}>
                    {locationsList.map((loc: string) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Furnishing</label>
                  <select name="furnishing" value={formData.furnishing} onChange={handleChange}>
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Transaction</label>
                  <select name="transaction" value={formData.transaction} onChange={handleChange}>
                    <option value="New Property">New Property</option>
                    <option value="Resale">Resale</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Ownership</label>
                  <select name="ownership" value={formData.ownership} onChange={handleChange}>
                    <option value="Freehold">Freehold</option>
                    <option value="Leasehold">Leasehold</option>
                    <option value="Co-operative Society">Co-operative Society</option>
                    <option value="Power of Attorney">Power of Attorney</option>
                  </select>
                </div>

                <div className="input-group full-width">
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
              </div>

              <div className="form-actions">
                <button type="button" className="btn-reset" onClick={handleReset}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                  Reset
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                  {loading ? "Calculating..." : "Predict Price"}
                </button>
              </div>
            </form>

            {error && <p className="error-text">{error}</p>}

            {/* Result Box */}
            <div className="result-box">
              <div className="result-left">
                <div className="result-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </div>
                <div className="result-labels">
                  <strong>Estimated Price</strong>
                  <span>{price !== null ? "Based on current market data" : "Fill the form and click predict"}</span>
                </div>
              </div>
              <div className="result-value">
                {price !== null ? `₹ ${(price / 100000).toFixed(2)} Lac` : "$ --,---"}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg></div>
            <div>
              <strong>ML Powered</strong>
              <p>Trained using scikit-learn pipeline and real data</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
            <div>
              <strong>Reliable & Fast</strong>
              <p>Get predictions in seconds with high accuracy</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg></div>
            <div>
              <strong>Easy to Use</strong>
              <p>Simple form with essential property features</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
            <div>
              <strong>Secure</strong>
              <p>Your data is processed securely and not stored</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="footer">
        © 2026 House Price Predictor. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
