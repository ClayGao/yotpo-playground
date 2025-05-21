'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function YotpoTesterPage() {
  const [customerEmail, setCustomerEmail] = useState('');
  const [actionName, setActionName] = useState('');
  const [propertiesJson, setPropertiesJson] = useState(''); // For simplicity, properties as JSON string
  const [createdAt, setCreatedAt] = useState(''); // Optional ISO 8601 string
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setResponse(null);
    setError(null);

    let parsedProperties;
    if (propertiesJson.trim() !== '') {
      try {
        parsedProperties = JSON.parse(propertiesJson);
      } catch (e) {
        setError('Properties field is not valid JSON.');
        setIsLoading(false);
        return;
      }
    }

    try {
      const payload: any = {
        customer_email: customerEmail,
        action_name: actionName,
      };
      if (parsedProperties) {
        payload.properties = parsedProperties;
      }
      if (createdAt.trim() !== '') {
        payload.created_at = createdAt;
      }

      const result = await axios.post('/api/yotpo/record-action', payload);
      setResponse(result.data);
    } catch (err: any) {
      console.error('Error calling API route:', err.response?.data || err.message);
      setError(err.response?.data?.error || err.response?.data?.details || err.message || 'An unknown error occurred.');
      if (err.response?.data?.details) {
        setResponse(err.response.data.details); // Show Yotpo error details if available
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1>Yotpo "Record a Customer Action" Tester</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="customerEmail" style={{ display: 'block', marginBottom: '5px' }}>Customer Email (Required):</label>
          <input
            type="email"
            id="customerEmail"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="actionName" style={{ display: 'block', marginBottom: '5px' }}>Action Name (Required):</label>
          <input
            type="text"
            id="actionName"
            value={actionName}
            onChange={(e) => setActionName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="propertiesJson" style={{ display: 'block', marginBottom: '5px' }}>Properties (JSON format, e.g., {{"key": "value"}} ):</label>
          <textarea
            id="propertiesJson"
            value={propertiesJson}
            onChange={(e) => setPropertiesJson(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            placeholder='e.g., { "order_id": "123", "amount": 50 }'
          />
        </div>
        <div>
          <label htmlFor="createdAt" style={{ display: 'block', marginBottom: '5px' }}>Created At (Optional, ISO 8601 format, e.g., 2023-10-26T10:00:00Z):</label>
          <input
            type="text"
            id="createdAt"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            placeholder="YYYY-MM-DDTHH:MM:SSZ"
          />
        </div>
        <button type="submit" disabled={isLoading} style={{ padding: '10px 15px', backgroundColor: isLoading ? '#ccc' : '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {isLoading ? 'Sending...' : 'Record Action'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid red', color: 'red', backgroundColor: '#ffe0e0' }}>
          <h3>Error</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{typeof error === 'object' ? JSON.stringify(error, null, 2) : error}</pre>
        </div>
      )}

      {response && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid green', backgroundColor: '#e0ffe0' }}>
          <h3>Response</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
