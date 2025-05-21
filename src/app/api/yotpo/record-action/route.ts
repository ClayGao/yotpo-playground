import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { customer_email, action_name, properties, created_at } = await request.json();

    const apiKey = process.env.YOTPO_API_KEY;
    const guid = process.env.YOTPO_GUID;

    if (!apiKey || !guid) {
      console.error('Yotpo API key or GUID not configured in environment variables.');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    if (!customer_email || !action_name) {
      return NextResponse.json({ error: 'Missing required fields: customer_email and action_name' }, { status: 400 });
    }

    const yotpoApiUrl = 'https://loyalty.yotpo.com/api/v2/actions';

    const requestBody: any = {
      customer_email,
      action_name,
    };

    if (properties) {
      requestBody.properties = properties;
    }

    if (created_at) {
      // Validate created_at format if necessary, though Yotpo will likely do this
      requestBody.created_at = created_at;
    }
    
    // It's also common for Yotpo to require the guid in the body for some requests,
    // but for 'record action' it's typically header based.
    // If issues arise, consult Yotpo docs if 'guid' or 'api_key' are also needed in the body.
    // For now, we are assuming header-based auth is sufficient as per common practice.

    const response = await axios.post(yotpoApiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'X-Yotpo-Api-Key': apiKey,
        'X-Yotpo-GUID': guid,
      },
    });

    return NextResponse.json(response.data, { status: response.status });

  } catch (error: any) {
    console.error('Error proxying to Yotpo:', error.response?.data || error.message);
    
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json({ error: 'Error calling Yotpo API', details: error.response.data }, { status: error.response.status });
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
