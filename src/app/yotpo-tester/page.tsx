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
  const yotpoGuid = process.env.NEXT_PUBLIC_YOTPO_GUID;
  const yotpoApiKey = process.env.NEXT_PUBLIC_YOTPO_API_KEY;

  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>("getActiveCampaigns");
  const [payloadInput, setPayloadInput] = useState<string>("");
  const [apiRequest, setApiRequest] = useState<ApiRequestDetails | null>(null);
  const [apiResponse, setApiResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const areEnvVarsSet = yotpoGuid && yotpoApiKey;
  let yotpoClient: YotpoLoyaltyClient | null = null;

  if (areEnvVarsSet) {
    try {
      yotpoClient = new YotpoLoyaltyClient(yotpoGuid, yotpoApiKey);
    } catch (e: any) {
      // This error will be caught and displayed when trying to run a request if client is null
      console.error("Error instantiating Yotpo client with ENV vars:", e);
    }
  }

  const handleRunRequest = async () => {
    setError(null);
    setApiResponse(null);
    setApiRequest(null);

    if (!areEnvVarsSet || !yotpoClient) {
      setError(
        "Yotpo GUID and API Key are not configured in environment variables. " +
        "Please create a .env.local file with NEXT_PUBLIC_YOTPO_GUID and NEXT_PUBLIC_YOTPO_API_KEY, then restart the server."
      );
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
          response = await yotpoClient!.getActiveCampaigns(parsedPayload as GetActiveCampaignsParams);
          break;
        case "createOrUpdateCustomer":
          requestDetails.method = "POST";
          requestDetails.endpointPath = "/customers";
          if (!parsedPayload || typeof parsedPayload !== 'object' || !parsedPayload.email) {
            setError("Payload for createOrUpdateCustomer must be a JSON object with an 'email' field.");
            return;
          }
          response = await yotpoClient!.createOrUpdateCustomer(parsedPayload as CreateUpdateCustomerPayload);
          break;
        case "fetchCustomerDetails":
          requestDetails.method = "GET";
          requestDetails.endpointPath = "/customers";
           if (!parsedPayload || (!parsedPayload.customer_email && !parsedPayload.customer_external_id)) {
            setError("For fetchCustomerDetails, provide email (e.g., test@example.com) or JSON `{\"customer_email\":\"test@example.com\"}` or `{\"customer_external_id\":\"id123\"}` in payload input.");
            return;
          }
          response = await yotpoClient!.fetchCustomerDetails(parsedPayload as FetchCustomerDetailsParams);
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

      <section style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px", backgroundColor: areEnvVarsSet ? "#e6ffed" : "#ffebee" }}>
        <h2>Authentication Status</h2>
        {areEnvVarsSet ? (
          <p style={{ color: "green" }}>
            Using GUID: {yotpoGuid!.substring(0, 4)}... and API Key: {yotpoApiKey!.substring(0, 4)}... from .env.local
          </p>
        ) : (
          <div style={{ color: "red" }}>
            <p><strong>Yotpo GUID and API Key are not configured.</strong></p>
            <p>Please create a <code>.env.local</code> file in the project root with the following content:</p>
            <pre style={{ backgroundColor: "#f0f0f0", padding: "10px", borderRadius: "4px", marginTop: "10px" }}>
              {`NEXT_PUBLIC_YOTPO_GUID=your_actual_guid\nNEXT_PUBLIC_YOTPO_API_KEY=your_actual_api_key`}
            </pre>
            <p style={{ marginTop: "10px" }}>
              After creating or updating the <code>.env.local</code> file, you must restart your Next.js development server for the changes to take effect.
            </p>
          </div>
        )}
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
        disabled={!areEnvVarsSet}
        style={{ 
          padding: "10px 15px", 
          backgroundColor: areEnvVarsSet ? "#007bff" : "#cccccc", 
          color: "white", 
          border: "none", 
          borderRadius: "4px", 
          cursor: areEnvVarsSet ? "pointer" : "not-allowed" 
        }}
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
