"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { YotpoLoyaltyClient, YotpoApiError, GetActiveCampaignsParams, CreateUpdateCustomerPayload, FetchCustomerDetailsParams } from "../api/yotpo/client";

type Endpoint = "getActiveCampaigns" | "createOrUpdateCustomer" | "fetchCustomerDetails";

interface ApiRequestDetails {
  method: string;
  endpointPath: string;
  payloadSent: any;
}

export default function YotpoTesterPage() {
  const [guid, setGuid] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>("getActiveCampaigns");
  const [payloadInput, setPayloadInput] = useState<string>("");
  const [apiRequest, setApiRequest] = useState<ApiRequestDetails | null>(null);
  const [apiResponse, setApiResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  let yotpoClient: YotpoLoyaltyClient | null = null;

  const handleRunRequest = async () => {
    setError(null);
    setApiResponse(null);
    setApiRequest(null);

    if (!guid || !apiKey) {
      setError("GUID and API Key are required.");
      return;
    }

    try {
      yotpoClient = new YotpoLoyaltyClient(guid, apiKey);
    } catch (e: any) {
      setError(`Error instantiating client: ${e.message}`);
      return;
    }

    let parsedPayload: any;
    try {
      if (selectedEndpoint === "createOrUpdateCustomer" && payloadInput) {
        parsedPayload = JSON.parse(payloadInput);
      } else if ((selectedEndpoint === "getActiveCampaigns" || selectedEndpoint === "fetchCustomerDetails") && payloadInput) {
        // For GET requests, parse query string into an object or use as is if simple
        // For simplicity, this example assumes direct object for params if JSON, or string for simple cases
        try {
            parsedPayload = JSON.parse(payloadInput);
        } catch (jsonError) {
            // If not JSON, treat as a simple string for single param, or handle more complex query string parsing if needed
            // For fetchCustomerDetails, we might expect { email: "..." } or just the email string.
            // For getActiveCampaigns, it might be { platform: "..." } or empty.
            // This part might need refinement based on how params are structured for GET.
            if (selectedEndpoint === "fetchCustomerDetails" && !payloadInput.includes("=")) {
                 // Simple email string for fetchCustomerDetails
                parsedPayload = { customer_email: payloadInput };
            } else if (payloadInput) {
                // Attempt to parse as query string if it contains '='
                const params = new URLSearchParams(payloadInput);
                parsedPayload = Object.fromEntries(params.entries());
                // Convert boolean strings and numbers
                for (const key in parsedPayload) {
                    if (parsedPayload[key] === "true") parsedPayload[key] = true;
                    else if (parsedPayload[key] === "false") parsedPayload[key] = false;
                    else if (!isNaN(parseFloat(parsedPayload[key])) && isFinite(parsedPayload[key])) {
                         parsedPayload[key] = parseFloat(parsedPayload[key]);
                    }
                }
            } else {
                parsedPayload = undefined; // No payload for some GET requests
            }
        }
      }
    } catch (e: any) {
      setError(`Error parsing payload: ${e.message}`);
      return;
    }

    try {
      let response: any;
      let requestDetails: ApiRequestDetails = { method: "", endpointPath: "", payloadSent: parsedPayload };

      switch (selectedEndpoint) {
        case "getActiveCampaigns":
          requestDetails.method = "GET";
          requestDetails.endpointPath = "/campaigns";
          response = await yotpoClient.getActiveCampaigns(parsedPayload as GetActiveCampaignsParams);
          break;
        case "createOrUpdateCustomer":
          requestDetails.method = "POST";
          requestDetails.endpointPath = "/customers";
          if (!parsedPayload || typeof parsedPayload !== 'object' || !parsedPayload.email) {
            setError("Payload for createOrUpdateCustomer must be a JSON object with an 'email' field.");
            return;
          }
          response = await yotpoClient.createOrUpdateCustomer(parsedPayload as CreateUpdateCustomerPayload);
          break;
        case "fetchCustomerDetails":
          requestDetails.method = "GET";
          requestDetails.endpointPath = "/customers";
           if (!parsedPayload || (!parsedPayload.customer_email && !parsedPayload.customer_external_id)) {
            setError("For fetchCustomerDetails, provide email (e.g., test@example.com) or JSON `{\"customer_email\":\"test@example.com\"}` or `{\"customer_external_id\":\"id123\"}` in payload input.");
            return;
          }
          response = await yotpoClient.fetchCustomerDetails(parsedPayload as FetchCustomerDetailsParams);
          break;
        default:
          setError("Invalid endpoint selected.");
          return;
      }
      setApiRequest(requestDetails);
      setApiResponse(response);
    } catch (e: any) {
      if (e instanceof YotpoApiError) {
        setError(`API Error: ${e.message} (Status: ${e.responseStatus}) Body: ${JSON.stringify(e.responseBody, null, 2)}`);
        setApiRequest({ method: e.name, endpointPath: "N/A", payloadSent: e.responseBody?.config?.data });
      } else {
        setError(`Request Error: ${e.message}`);
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Yotpo Loyalty Client Playground</h1>

      <section style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
        <h2>Authentication</h2>
        <div>
          <label htmlFor="guid" style={{ marginRight: "10px" }}>GUID:</label>
          <input
            type="text"
            id="guid"
            value={guid}
            onChange={(e) => setGuid(e.target.value)}
            placeholder="Enter Yotpo GUID"
            style={{ width: "300px", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label htmlFor="apiKey" style={{ marginRight: "10px" }}>API Key:</label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter Yotpo API Key"
            style={{ width: "300px" }}
          />
        </div>
      </section>

      <section style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
        <h2>Endpoint Selection & Payload/Params</h2>
        <div>
          <label htmlFor="endpoint" style={{ marginRight: "10px" }}>Select Endpoint:</label>
          <select
            id="endpoint"
            value={selectedEndpoint}
            onChange={(e) => setSelectedEndpoint(e.target.value as Endpoint)}
            style={{ marginBottom: "10px", padding: "5px" }}
          >
            <option value="getActiveCampaigns">getActiveCampaigns (GET)</option>
            <option value="createOrUpdateCustomer">createOrUpdateCustomer (POST)</option>
            <option value="fetchCustomerDetails">fetchCustomerDetails (GET)</option>
          </select>
        </div>
        <div>
          <label htmlFor="payloadInput" style={{ display: "block", marginBottom: "5px" }}>
            Payload / Params Input:
            {selectedEndpoint === "createOrUpdateCustomer" && " (JSON expected, e.g., {\"email\":\"test@example.com\"})"}
            {selectedEndpoint === "fetchCustomerDetails" && " (e.g., test@example.com or {\"customer_email\":\"test@example.com\"} or {\"customer_external_id\":\"id123\"})"}
            {selectedEndpoint === "getActiveCampaigns" && " (Optional JSON/Query String, e.g., {\"platform\":\"shopify\"} or platform=shopify, or leave empty)"}
          </label>
          <textarea
            id="payloadInput"
            value={payloadInput}
            onChange={(e) => setPayloadInput(e.target.value)}
            rows={8}
            style={{ width: "100%", boxSizing: "border-box" }}
            placeholder={
              selectedEndpoint === "createOrUpdateCustomer" 
              ? '{\n  "email": "test@example.com",\n  "first_name": "Test",\n  "last_name": "User"\n}'
              : selectedEndpoint === "fetchCustomerDetails"
              ? '{\n  "customer_email": "test@example.com"\n}'
              : '{\n  "platform": "general"\n}'
            }
          />
        </div>
      </section>

      <button
        onClick={handleRunRequest}
        style={{ padding: "10px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
      >
        Run Request
      </button>

      {apiRequest && (
        <section style={{ marginTop: "20px", border: "1px solid #eee", padding: "10px", backgroundColor: "#f9f9f9" }}>
          <h3>Request Details:</h3>
          <pre>
            Method: {apiRequest.method}{"\n"}
            Endpoint Path: {apiRequest.endpointPath}{"\n"}
            Payload Sent: {JSON.stringify(apiRequest.payloadSent, null, 2)}
          </pre>
        </section>
      )}

      {apiResponse && (
        <section style={{ marginTop: "20px", border: "1px solid #dfd", padding: "10px", backgroundColor: "#efffef" }}>
          <h3>API Response:</h3>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </section>
      )}

      {error && (
        <section style={{ marginTop: "20px", border: "1px solid #fdd", padding: "10px", backgroundColor: "#fff0f0", color: "red" }}>
          <h3>Error:</h3>
          <pre>{error}</pre>
        </section>
      )}
    </div>
  );
}
