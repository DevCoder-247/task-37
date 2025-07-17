import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

function App() {
  const [category, setCategory] = useState('');
  const [value, setValue] = useState('');
  const [aggregatedData, setAggregatedData] = useState({
    groupByCategory: [],
    averageValue: 0,
    sortedByValue: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await axios.post(`${API}/api/data`, {
        category,
        value: Number(value),
      });
      setCategory('');
      setValue('');
      await fetchAggregatedData();
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to submit data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAggregatedData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/aggregate`);
      // Ensure response has expected structure
      setAggregatedData({
        groupByCategory: res.data.groupByCategory || [],
        averageValue: res.data.averageValue || 0,
        sortedByValue: res.data.sortedByValue || []
      });
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch aggregated data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAggregatedData();
  }, []);

  // Loading and error states
  if (loading && !aggregatedData.groupByCategory.length) {
    return <div style={containerStyle}>Loading data...</div>;
  }

  if (error) {
    return <div style={{...containerStyle, color: 'red'}}>{error}</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>MongoDB Aggregation Demo</h1>

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={inputStyle}
          disabled={loading}
        />
        <input
          type="number"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          style={inputStyle}
          disabled={loading}
        />
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Processing...' : 'Add Data'}
        </button>
      </form>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <Section title="Grouped by Category">
          <ul style={ulStyle}>
            {aggregatedData.groupByCategory.map((item, idx) => (
              <li key={idx} style={liStyle}>
                <strong>{item._id}</strong>: {item.count}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Average Value">
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            {aggregatedData.averageValue.toFixed(2)}
          </p>
        </Section>

        <Section title="Sorted by Value (Descending)">
          <ul style={ulStyle}>
            {aggregatedData.sortedByValue.map((item, idx) => (
              <li key={idx} style={liStyle}>
                <strong>{item.category}</strong>: {item.value}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

// Styles moved to constants for better organization
const containerStyle = {
  padding: '2rem',
  fontFamily: 'Segoe UI, sans-serif',
  backgroundColor: '#f5f7fa',
  minHeight: '100vh',
  color: '#333',
};

const headerStyle = {
  color: '#3b82f6', 
  fontSize: '2rem'
};

const formStyle = {
  marginTop: '1.5rem',
  marginBottom: '2rem',
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  alignItems: 'center',
};

const Section = ({ title, children }) => (
  <div style={{ background: '#fff', borderRadius: 8, padding: '1rem', boxShadow: '0 0 10px #e0e0e0' }}>
    <h2 style={{ color: '#1e40af', borderBottom: '1px solid #e5e7eb', paddingBottom: 6 }}>{title}</h2>
    {children}
  </div>
);

const inputStyle = {
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
  outlineColor: '#3b82f6',
};

const buttonStyle = {
  padding: '0.5rem 1.2rem',
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
};

const ulStyle = {
  listStyleType: 'none',
  paddingLeft: 0,
  marginTop: '0.5rem',
};

const liStyle = {
  padding: '0.25rem 0',
  fontSize: '1rem',
};


export default App;
