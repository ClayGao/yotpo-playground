/**
 * Custom error class for Yotpo API-specific errors.
 * Contains additional information about the HTTP response if available.
 */
export class YotpoApiError extends Error {
  public readonly responseStatus?: number;
  public readonly responseBody?: any;

  constructor(message: string, responseStatus?: number, responseBody?: any) {
    super(message);
    this.name = "YotpoApiError";
    this.responseStatus = responseStatus;
    this.responseBody = responseBody;
  }
}

// --- API Payload and Parameter Interfaces ---

// Actions API
/**
 * Payload for recording a customer action.
 * @see {@link YotpoLoyaltyClient.recordCustomerAction}
 */
export interface RecordActionPayload {
  customer_email: string;
  action_name: string;
  created_at?: string; // ISO 8601 format date string
  amount?: number;
  order_id?: string;
  extra_data?: Record<string, any>;
  idempotency_key?: string;
}

/**
 * Payload for adjusting a customer's points.
 * @see {@link YotpoLoyaltyClient.adjustCustomerPoints}
 */
export interface AdjustPointsPayload {
  customer_external_id?: string;
  customer_email?: string;
  points: number;
  reason?: string;
  idempotency_key?: string;
}

/**
 * Payload for removing a customer from an action-based VIP tier.
 * @see {@link YotpoLoyaltyClient.removeCustomerFromActionVipTier}
 */
export interface RemoveFromVipTierPayload {
  customer_external_id?: string;
  customer_email?: string;
  vip_tier_id: number;
}

// Customers API
/**
 * Payload for creating or updating a customer.
 * @see {@link YotpoLoyaltyClient.createOrUpdateCustomer}
 */
export interface CreateUpdateCustomerPayload {
  email: string;
  first_name?: string;
  last_name?: string;
  external_id?: string;
  tags?: string; // Comma-separated string
  custom_fields?: Record<string, any>;
  opt_in_marketing?: "subscribed" | "not_subscribed";
  birthday?: string; // YYYY-MM-DD
  anniversary?: string; // YYYY-MM-DD
  points_balance?: number;
  vip_tier_id?: number;
  send_welcome_email?: boolean;
}

/**
 * Payload for setting a customer's birthday.
 * @see {@link YotpoLoyaltyClient.setCustomerBirthday}
 */
export interface SetBirthdayPayload {
  customer_email?: string;
  customer_external_id?: string;
  date: string; // YYYY-MM-DD
  send_birthday_email?: boolean;
}

/**
 * Payload for setting a customer's anniversary.
 * @see {@link YotpoLoyaltyClient.setCustomerAnniversary}
 */
export interface SetAnniversaryPayload {
  customer_email?: string;
  customer_external_id?: string;
  date: string; // YYYY-MM-DD
  send_anniversary_email?: boolean;
}

/**
 * Parameters for getting a customer's anniversary.
 * @see {@link YotpoLoyaltyClient.getCustomerAnniversary}
 */
export interface GetAnniversaryParams {
  customer_email?: string;
  customer_external_id?: string;
}

/**
 * Parameters for removing a customer's anniversary.
 * @see {@link YotpoLoyaltyClient.removeCustomerAnniversary}
 */
export interface RemoveAnniversaryParams {
  customer_email?: string;
  customer_external_id?: string;
}

/**
 * Parameters for fetching customer details.
 * @see {@link YotpoLoyaltyClient.fetchCustomerDetails}
 */
export interface FetchCustomerDetailsParams {
  customer_email?: string;
  customer_external_id?: string;
  country_iso_code?: string;
  with_history?: boolean;
  with_points_history?: boolean;
  with_referral_code?: boolean;
}

/**
 * Parameters for fetching customer details by Yotpo ID.
 * @see {@link YotpoLoyaltyClient.fetchCustomerDetailsById}
 */
export interface FetchCustomerDetailsByIdParams {
  with_history?: boolean;
  with_points_history?: boolean;
  with_referral_code?: boolean;
}

/**
 * Parameters for fetching recently updated customers.
 * @see {@link YotpoLoyaltyClient.fetchRecentlyUpdatedCustomers}
 */
export interface FetchRecentCustomersParams {
  since_id?: number;
  since_updated_at?: string; // ISO 8601 format date string
  page?: number;
  per_page?: number; // Max 250
}

// Point Redemptions API
/**
 * Payload for creating a redemption.
 * @see {@link YotpoLoyaltyClient.createRedemption}
 */
export interface CreateRedemptionPayload {
  customer_email?: string;
  customer_external_id?: string;
  redemption_option_id: number;
  points_to_redeem?: number;
  external_order_id?: string;
  idempotency_key?: string;
}

/**
 * Payload for approving a redemption cancellation.
 * @see {@link YotpoLoyaltyClient.approveRedemptionCancellation}
 */
export interface ApproveCancellationPayload {
  customer_email?: string;
  customer_external_id?: string;
  redemption_id: string;
}

// Redemption Options API
/**
 * Payload for uploading coupon codes to a redemption option.
 * @see {@link YotpoLoyaltyClient.uploadCouponCodes}
 */
export interface UploadCouponsPayload {
  redemption_option_id: number;
  coupon_codes: string[];
}

/**
 * Parameters for fetching active redemption options.
 * @see {@link YotpoLoyaltyClient.getActiveRedemptionOptions}
 */
export interface GetActiveRedemptionOptionsParams {
  customer_id?: number;
  customer_external_id?: string;
  customer_email?: string;
  vip_tier_id?: number;
  currency_iso_code?: string;
  include_referral_reward_options?: boolean;
  excluded_tags?: string[];
}

/**
 * Parameters for fetching redemption code data.
 * @see {@link YotpoLoyaltyClient.getRedemptionCodeData}
 */
export interface GetRedemptionCodeDataParams {
  redemption_id: string;
  customer_id?: number;
  customer_email?: string;
}

// Referrals API
/**
 * Payload for identifying a referrer.
 * @see {@link YotpoLoyaltyClient.identifyReferrer}
 */
export interface IdentifyReferrerPayload {
  customer_email: string;
  referral_code: string;
}

/**
 * Payload for sending referral emails.
 * @see {@link YotpoLoyaltyClient.sendReferralEmails}
 */
export interface SendReferralEmailsPayload {
  customer_email: string;
  recipient_emails: string[];
  referral_code?: string;
  first_name?: string;
  last_name?: string;
  email_template_id?: string;
}

// Campaigns API
/**
 * Represents the platform for which a campaign is targeted.
 */
export type CampaignPlatform =
  | "general"
  | "shopify"
  | "bigcommerce"
  | "magento"
  | "magento_2"
  | "custom_platform"
  | "other";

/**
 * Parameters for fetching active campaigns.
 * @see {@link YotpoLoyaltyClient.getActiveCampaigns}
 */
export interface GetActiveCampaignsParams {
  customer_id?: number;
  customer_external_id?: string;
  customer_email?: string;
  platform?: CampaignPlatform;
}

// Orders API
/**
 * Represents a shipping address for an order.
 */
export interface ShippingAddress {
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zip?: string;
  country_code?: string; // ISO 3166-1 alpha-2
}

/**
 * Represents a line item in an order.
 */
export interface LineItem {
  external_product_id: string;
  title: string;
  price_cents: number;
  quantity: number;
  sku?: string;
  url?: string;
  image_url?: string;
}

/**
 * Payload for creating an order.
 * @see {@link YotpoLoyaltyClient.createOrder}
 */
export interface CreateOrderPayload {
  customer_email?: string;
  customer_external_id?: string;
  order_id: string;
  total_amount_cents: number;
  currency_code: string;
  coupon_code?: string;
  idempotency_key?: string;
  created_at?: string; // ISO 8601 date-time
  financial_state?: "paid" | "pending" | "refunded" | string;
  fulfillment_state?: "fulfilled" | "unfulfilled" | "partial" | string;
  total_discounts_cents?: number;
  total_tax_cents?: number;
  total_shipping_cents?: number;
  shipping_address?: ShippingAddress;
  line_items?: LineItem[];
  extra_data?: Record<string, any>;
}

// Refunds API
/**
 * Represents a line item in a refund.
 */
export interface RefundLineItem {
  external_product_id: string;
  quantity: number;
  total_amount_cents: number;
}

/**
 * Payload for creating a refund.
 * @see {@link YotpoLoyaltyClient.createRefund}
 */
export interface CreateRefundPayload {
  customer_email?: string;
  customer_external_id?: string;
  order_id: string;
  refund_id: string;
  total_amount_cents: number;
  currency_code: string;
  idempotency_key?: string;
  created_at?: string; // ISO 8601 date-time
  line_items?: RefundLineItem[];
  extra_data?: Record<string, any>;
}

// VIP Tiers API
/**
 * Parameters for fetching VIP tiers.
 * @see {@link YotpoLoyaltyClient.getVipTiers}
 */
export interface GetVipTiersParams {
  customer_id?: number;
  customer_external_id?: string;
  customer_email?: string;
  details?: boolean;
}

// Privacy API
/**
 * Parameters for checking if data exists for a user (for privacy purposes).
 * @see {@link YotpoLoyaltyClient.checkDataExists}
 */
export interface PrivacyCheckParams {
  email: string;
}

/**
 * Parameters for requesting user data (for privacy purposes).
 * @see {@link YotpoLoyaltyClient.getUserData}
 */
export interface PrivacyRequestParams {
  email: string;
  customer_external_id?: string;
}


/**
 * YotpoLoyaltyClient provides methods to interact with the Yotpo Loyalty API.
 * It handles request construction, authentication, and basic error handling.
 */
export class YotpoLoyaltyClient {
  private readonly baseUrl = "https://loyalty.yotpo.com/api/v2";
  private readonly guid: string;
  private readonly apiKey: string;

  /**
   * Creates an instance of the YotpoLoyaltyClient.
   * @param guid - Your Yotpo Loyalty GUID.
   * @param apiKey - Your Yotpo Loyalty API Key.
   */
  constructor(guid: string, apiKey: string) {
    if (!guid) {
      throw new Error("Yotpo Loyalty GUID is required.");
    }
    if (!apiKey) {
      throw new Error("Yotpo Loyalty API Key is required.");
    }
    this.guid = guid;
    this.apiKey = apiKey;
  }

  /**
   * Private method to handle all API requests.
   * @param method - HTTP method (GET, POST, PUT, DELETE).
   * @param endpoint - API endpoint path (e.g., "/customers").
   * @param data - Optional payload for POST/PUT requests.
   * @param queryParams - Optional query parameters for GET/DELETE requests.
   * @returns A promise that resolves with the API response.
   * @template T - The expected type of the API response.
   * @throws {YotpoApiError} For API errors or network issues.
   */
  private async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    data?: unknown,
    queryParams?: Record<string, string | number | boolean | undefined | string[]>
  ): Promise<T> {
    let url = `${this.baseUrl}${endpoint}`;
    if (queryParams) {
      const params = new URLSearchParams();
      for (const key in queryParams) {
        const value = queryParams[key];
        if (value !== undefined) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const headers = {
      "Content-Type": "application/json",
      "x-guid": this.guid,
      "x-api-key": this.apiKey,
    };

    const options: RequestInit = { method, headers };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => response.text());
        throw new YotpoApiError(
          `API request failed with status ${response.status}: ${
            typeof errorData === "string" ? errorData : JSON.stringify(errorData)
          }`,
          response.status,
          errorData
        );
      }
      const responseText = await response.text();
      if (!responseText) {
        return null as T;
      }
      return JSON.parse(responseText) as T;
    } catch (error) {
      if (error instanceof YotpoApiError) {
        throw error;
      }
      throw new YotpoApiError(
        `Network or other error during API request: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // --- Customers API Endpoints ---

  /**
   * Creates a new customer or updates an existing one based on email or external_id.
   * @param payload - The customer data, `email` is required.
   * @returns A promise that resolves with the API response.
   * @throws {YotpoApiError} If `email` is missing.
   */
  public async createOrUpdateCustomer(payload: CreateUpdateCustomerPayload): Promise<any> {
    if (!payload.email) {
      throw new YotpoApiError("Email is required to create or update a customer.");
    }
    return this.request<any>("POST", "/customers", payload);
  }

  /**
   * Sets a customer's birthday.
   * Requires either `customer_email` or `customer_external_id`.
   * @param payload - The birthday details, including the `date` and customer identifier.
   * @returns A promise that resolves with the API response.
   * @throws {YotpoApiError} If required fields are missing.
   */
  public async setCustomerBirthday(payload: SetBirthdayPayload): Promise<any> {
    if (!payload.customer_email && !payload.customer_external_id) {
      throw new YotpoApiError("Either customer_email or customer_external_id is required to set a birthday.");
    }
    if (!payload.date) {
      throw new YotpoApiError("Date (YYYY-MM-DD) is required to set a birthday.");
    }
    return this.request<any>("POST", "/customers/birthday", payload);
  }

  /**
   * Sets or updates a customer's anniversary.
   * Requires either `customer_email` or `customer_external_id`.
   * @param payload - The anniversary details, including the `date` and customer identifier.
   * @returns A promise that resolves with the API response.
   * @throws {YotpoApiError} If required fields are missing.
   */
  public async setCustomerAnniversary(payload: SetAnniversaryPayload): Promise<any> {
    if (!payload.customer_email && !payload.customer_external_id) {
      throw new YotpoApiError("Either customer_email or customer_external_id is required to set an anniversary.");
    }
    if (!payload.date) {
      throw new YotpoApiError("Date (YYYY-MM-DD) is required to set an anniversary.");
    }
    return this.request<any>("POST", "/customers/anniversary", payload);
  }

  /**
   * Gets a customer's anniversary.
   * Requires either `customer_email` or `customer_external_id`.
   * @param params - Parameters to identify the customer.
   * @returns A promise that resolves with the API response containing anniversary data.
   * @throws {YotpoApiError} If a customer identifier is missing.
   */
  public async getCustomerAnniversary(params: GetAnniversaryParams): Promise<any> {
    if (!params.customer_email && !params.customer_external_id) {
      throw new YotpoApiError("Either customer_email or customer_external_id is required to get an anniversary.");
    }
    return this.request<any>("GET", "/customers/anniversary", undefined, params);
  }

  /**
   * Removes a customer's anniversary.
   * Requires either `customer_email` or `customer_external_id`.
   * @param params - Parameters to identify the customer.
   * @returns A promise that resolves with the API response (likely null or a success message).
   * @throws {YotpoApiError} If a customer identifier is missing.
   */
  public async removeCustomerAnniversary(params: RemoveAnniversaryParams): Promise<any> {
    if (!params.customer_email && !params.customer_external_id) {
      throw new YotpoApiError("Either customer_email or customer_external_id is required to remove an anniversary.");
    }
    return this.request<any>("DELETE", "/customers/anniversary", undefined, params);
  }

  /**
   * Fetches customer details by email or external_id.
   * Requires either `customer_email` or `customer_external_id`.
   * @param params - Parameters to identify the customer and control optional response data fields.
   * @returns A promise that resolves with the customer details.
   * @throws {YotpoApiError} If a customer identifier is missing.
   */
  public async fetchCustomerDetails(params: FetchCustomerDetailsParams): Promise<any> {
    if (!params.customer_email && !params.customer_external_id) {
      throw new YotpoApiError("Either customer_email or customer_external_id is required to fetch customer details.");
    }
    return this.request<any>("GET", "/customers", undefined, params);
  }

  /**
   * Fetches customer details by Yotpo customer ID.
   * @param customerId - The Yotpo customer ID (numeric).
   * @param params - Optional parameters to control optional response data fields.
   * @returns A promise that resolves with the customer details.
   * @throws {YotpoApiError} If `customerId` is invalid.
   */
  public async fetchCustomerDetailsById(
    customerId: number,
    params?: FetchCustomerDetailsByIdParams
  ): Promise<any> {
    if (!customerId || typeof customerId !== "number") {
      throw new YotpoApiError("Valid numeric customerId is required to fetch customer details by ID.");
    }
    return this.request<any>( "GET", `/customers/${customerId}`, undefined, params );
  }

  /**
   * Fetches all recently updated customers.
   * @param params - Optional parameters for pagination (e.g., `page`, `per_page`) and filtering (e.g., `since_id`, `since_updated_at`).
   * @returns A promise that resolves with a list of recently updated customers.
   */
  public async fetchRecentlyUpdatedCustomers( params?: FetchRecentCustomersParams ): Promise<any> {
    return this.request<any>("GET", "/customers/recent", undefined, params);
  }

  // --- Actions API Endpoints ---

  /**
   * Records a specific action performed by a customer.
   * @param payload - The data for recording the customer action, including `customer_email` and `action_name`.
   * @returns A promise that resolves with the API response.
   * @throws {YotpoApiError} If required fields are missing.
   */
  public async recordCustomerAction(payload: RecordActionPayload): Promise<any> {
    if (!payload.customer_email) {
      throw new YotpoApiError("customer_email is required for recording an action.");
    }
    if (!payload.action_name) {
      throw new YotpoApiError("action_name is required for recording an action.");
    }
    return this.request<any>("POST", "/actions", payload);
  }

  /**
   * Adjusts a customer's point balance.
   * Requires either `customer_external_id` or `customer_email`.
   * @param payload - The data for adjusting the customer's points, including the `points` value.
   * @returns A promise that resolves with the API response.
   * @throws {YotpoApiError} If required fields are missing or invalid.
   */
  public async adjustCustomerPoints(payload: AdjustPointsPayload): Promise<any> {
    if (!payload.customer_external_id && !payload.customer_email) {
      throw new YotpoApiError("Either customer_external_id or customer_email is required to adjust points.");
    }
    if (typeof payload.points !== 'number') {
      throw new YotpoApiError("Points (number) is required to adjust points.");
    }
    return this.request<any>("POST", "/actions/customer_adjust_points", payload);
  }

  /**
   * Removes a customer from an action-based VIP tier.
   * Requires either `customer_external_id` or `customer_email`.
   * @param payload - The data for removing the customer from the VIP tier, including `vip_tier_id`.
   * @returns A promise that resolves with the API response (likely null or a success message).
   * @throws {YotpoApiError} If required fields are missing or invalid.
   */
  public async removeCustomerFromActionVipTier(payload: RemoveFromVipTierPayload): Promise<any> {
    if (!payload.customer_external_id && !payload.customer_email) {
      throw new YotpoApiError("Either customer_external_id or customer_email is required to remove from VIP tier.");
    }
    if (typeof payload.vip_tier_id !== 'number') {
        throw new YotpoApiError("vip_tier_id (number) is required to remove from VIP tier.");
    }
    return this.request<any>("PUT", "/actions/remove_customer_from_vip_tier", payload);
  }

  // --- Point Redemptions API Endpoints ---

  /**
   * Creates a redemption for a customer.
   * Requires either `customer_email` or `customer_external_id`.
   * @param payload - The data for creating the redemption, including `redemption_option_id`.
   * @returns A promise that resolves with the API response.
   * @throws {YotpoApiError} If required fields are missing or invalid.
   */
  public async createRedemption(payload: CreateRedemptionPayload): Promise<any> {
    if (!payload.customer_email && !payload.customer_external_id) {
      throw new YotpoApiError("Either customer_email or customer_external_id is required to create a redemption.");
    }
    if (!payload.redemption_option_id || typeof payload.redemption_option_id !== 'number') {
      throw new YotpoApiError("redemption_option_id (number) is required to create a redemption.");
    }
    return this.request<any>("POST", "/redemptions", payload);
  }

  /**
   * Approves the cancellation of a previously created redemption.
   * Requires either `customer_email` or `customer_external_id`.
   * @param payload - The data for approving the redemption cancellation, including `redemption_id`.
   * @returns A promise that resolves with the API response.
   * @throws {YotpoApiError} If required fields are missing or invalid.
   */
  public async approveRedemptionCancellation(payload: ApproveCancellationPayload): Promise<any> {
    if (!payload.customer_email && !payload.customer_external_id) {
      throw new YotpoApiError("Either customer_email or customer_external_id is required to approve cancellation.");
    }
    if (!payload.redemption_id || typeof payload.redemption_id !== 'string') {
      throw new YotpoApiError("redemption_id (string) is required to approve cancellation.");
    }
    return this.request<any>("POST", "/redemptions/approve_cancellation", payload);
  }

  // --- Redemption Options API Endpoints ---

  /**
   * Uploads coupon codes for a specific redemption option.
   * @param payload - The data for uploading coupon codes, including `redemption_option_id` and `coupon_codes`.
   * @returns A promise that resolves with the API response.
   * @throws {YotpoApiError} If required fields are missing or invalid.
   */
  public async uploadCouponCodes(payload: UploadCouponsPayload): Promise<any> {
    if (!payload.redemption_option_id || typeof payload.redemption_option_id !== 'number') {
      throw new YotpoApiError("redemption_option_id (number) is required for uploading coupon codes.");
    }
    if (!Array.isArray(payload.coupon_codes) || payload.coupon_codes.length === 0) {
      throw new YotpoApiError("coupon_codes (array of strings) must be provided and non-empty for uploading.");
    }
    return this.request<any>("POST", "/redemption_options/coupons", payload);
  }

  /**
   * Gets active redemption options.
   * Optionally filtered by customer identifiers, VIP tier, currency, or tags.
   * @param params - Optional parameters to filter redemption options.
   * @returns A promise that resolves with a list of active redemption options.
   */
  public async getActiveRedemptionOptions(params?: GetActiveRedemptionOptionsParams): Promise<any> {
    return this.request<any>("GET", "/redemption_options", undefined, params);
  }

  /**
   * Gets the actual code or data for a specific redemption instance.
   * Requires `redemption_id` and one of `customer_id` or `customer_email`.
   * @param params - Parameters to identify the redemption and customer.
   * @returns A promise that resolves with the redemption code data.
   * @throws {YotpoApiError} If required fields are missing or invalid.
   */
  public async getRedemptionCodeData(params: GetRedemptionCodeDataParams): Promise<any> {
    if (!params.redemption_id || typeof params.redemption_id !== 'string') {
      throw new YotpoApiError("redemption_id (string) is required to get redemption code data.");
    }
    if (!params.customer_id && !params.customer_email) {
      throw new YotpoApiError("Either customer_id or customer_email is required to get redemption code data.");
    }
    if (params.customer_id && typeof params.customer_id !== 'number') {
        throw new YotpoApiError("customer_id must be a number if provided for redemption code data.");
    }
    if (params.customer_email && typeof params.customer_email !== 'string') {
        throw new YotpoApiError("customer_email must be a string if provided for redemption code data.");
    }
    return this.request<any>("GET", "/redemption_options/code_data", undefined, params);
  }

  // --- Referrals API Endpoints ---

  /**
   * Identifies the referrer for a customer.
   * @param payload - The data for identifying the referrer, including the friend's `customer_email` and advocate's `referral_code`.
   * @returns A promise that resolves with the API response.
   * @throws {YotpoApiError} If required fields are missing or invalid.
   */
  public async identifyReferrer(payload: IdentifyReferrerPayload): Promise<any> {
    if (!payload.customer_email || typeof payload.customer_email !== 'string') {
      throw new YotpoApiError("customer_email (string) of the friend is required to identify referrer.");
    }
    if (!payload.referral_code || typeof payload.referral_code !== 'string') {
      throw new YotpoApiError("referral_code (string) of the advocate is required to identify referrer.");
    }
    return this.request<any>("POST", "/referrals/identify_referrer", payload);
  }

  /**
   * Sends referral emails from an advocate to specified recipients.
   * @param payload - The data for sending referral emails, including advocate's `customer_email` and `recipient_emails`.
   * @returns A promise that resolves with the API response.
   * @throws {YotpoApiError} If required fields are missing or invalid.
   */
  public async sendReferralEmails(payload: SendReferralEmailsPayload): Promise<any> {
    if (!payload.customer_email || typeof payload.customer_email !== 'string') {
      throw new YotpoApiError("customer_email (string) of the advocate is required to send referral emails.");
    }
    if (!Array.isArray(payload.recipient_emails) || payload.recipient_emails.length === 0) {
      throw new YotpoApiError("recipient_emails (array of strings) must be provided and non-empty to send referral emails.");
    }
    return this.request<any>("POST", "/referrals/send_emails", payload);
  }

  // --- Campaigns API Endpoints ---

  /**
   * Gets active campaigns.
   * Optionally filtered by customer identifiers or platform.
   * @param params - Optional parameters to filter active campaigns.
   * @returns A promise that resolves with a list of active campaigns.
   * @throws {YotpoApiError} If provided filter parameters have incorrect types.
   */
  public async getActiveCampaigns(params?: GetActiveCampaignsParams): Promise<any> {
    if (params?.customer_id && typeof params.customer_id !== 'number') {
      throw new YotpoApiError("customer_id must be a number if provided for getActiveCampaigns.");
    }
    if (params?.customer_external_id && typeof params.customer_external_id !== 'string') {
      throw new YotpoApiError("customer_external_id must be a string if provided for getActiveCampaigns.");
    }
    if (params?.customer_email && typeof params.customer_email !== 'string') {
      throw new YotpoApiError("customer_email must be a string if provided for getActiveCampaigns.");
    }
    if (params?.platform && typeof params.platform !== 'string') {
      throw new YotpoApiError("platform must be a string if provided for getActiveCampaigns.");
    }
    return this.request<any>("GET", "/campaigns", undefined, params);
  }

  // --- Orders API Endpoints ---

  /**
   * Creates an order.
   * Requires either `customer_email` or `customer_external_id`.
   * @param payload - The data for creating the order, including `order_id`, `total_amount_cents`, and `currency_code`.
   * @returns A promise that resolves with the API response.
   * @throws {YotpoApiError} If required fields are missing or invalid.
   */
  public async createOrder(payload: CreateOrderPayload): Promise<any> {
    if (!payload.customer_email && !payload.customer_external_id) {
      throw new YotpoApiError("Either customer_email or customer_external_id is required to create an order.");
    }
    if (!payload.order_id || typeof payload.order_id !== 'string') {
      throw new YotpoApiError("order_id (string) is required to create an order.");
    }
    if (typeof payload.total_amount_cents !== 'number') {
      throw new YotpoApiError("total_amount_cents (number) is required to create an order.");
    }
    if (!payload.currency_code || typeof payload.currency_code !== 'string') {
      throw new YotpoApiError("currency_code (string) is required to create an order.");
    }

    // Optional fields basic type validation
    if (payload.coupon_code !== undefined && typeof payload.coupon_code !== 'string') {
      throw new YotpoApiError("If provided, coupon_code must be a string for creating an order.");
    }
    if (payload.created_at !== undefined && typeof payload.created_at !== 'string') {
      throw new YotpoApiError("If provided, created_at must be a string (ISO 8601 format) for creating an order.");
    }
    if (payload.total_discounts_cents !== undefined && typeof payload.total_discounts_cents !== 'number') {
      throw new YotpoApiError("If provided, total_discounts_cents must be a number for creating an order.");
    }
    if (payload.line_items !== undefined && !Array.isArray(payload.line_items)) {
      throw new YotpoApiError("If provided, line_items must be an array for creating an order.");
    }

    return this.request<any>("POST", "/orders", payload);
  }

  // --- Refunds API Endpoints ---

  /**
   * Creates a refund record.
   * Requires either `customer_email` or `customer_external_id`.
   * @param payload - The data for creating the refund, including `order_id`, `refund_id`, `total_amount_cents`, and `currency_code`.
   * @returns A promise that resolves with the API response.
   * @throws {YotpoApiError} If required fields are missing or invalid.
   */
  public async createRefund(payload: CreateRefundPayload): Promise<any> {
    if (!payload.customer_email && !payload.customer_external_id) {
      throw new YotpoApiError("Either customer_email or customer_external_id is required for a refund.");
    }
    if (!payload.order_id || typeof payload.order_id !== 'string') {
      throw new YotpoApiError("order_id (string) is required for a refund.");
    }
    if (!payload.refund_id || typeof payload.refund_id !== 'string') {
      throw new YotpoApiError("refund_id (string) is required for a refund.");
    }
    if (typeof payload.total_amount_cents !== 'number') {
      throw new YotpoApiError("total_amount_cents (number) is required for a refund.");
    }
    if (!payload.currency_code || typeof payload.currency_code !== 'string') {
      throw new YotpoApiError("currency_code (string) is required for a refund.");
    }

    // Optional fields validation
    if (payload.created_at !== undefined && typeof payload.created_at !== 'string') {
      throw new YotpoApiError("If provided, created_at must be a string (ISO 8601 format) for a refund.");
    }
    if (payload.line_items !== undefined && !Array.isArray(payload.line_items)) {
      throw new YotpoApiError("If provided, line_items must be an array for a refund.");
    } else if (payload.line_items) {
      for (const item of payload.line_items) {
        if (!item.external_product_id || typeof item.external_product_id !== 'string') {
          throw new YotpoApiError("Each refund line_item must have an external_product_id (string).");
        }
        if (typeof item.quantity !== 'number' || item.quantity <= 0) {
          throw new YotpoApiError("Each refund line_item must have a quantity (positive number).");
        }
        if (typeof item.total_amount_cents !== 'number') {
          throw new YotpoApiError("Each refund line_item must have total_amount_cents (number).");
        }
      }
    }
    return this.request<any>("POST", "/refunds", payload);
  }

  // --- VIP Tiers API Endpoints ---

  /**
   * Fetches VIP tiers.
   * Can be filtered by customer to see their applicable/achieved tiers,
   * or called without customer parameters to list all available VIP tiers.
   * @param params - Optional parameters to filter VIP tiers or request more details.
   * @returns A promise that resolves with a list of VIP tiers.
   * @throws {YotpoApiError} If provided filter parameters have incorrect types.
   */
  public async getVipTiers(params?: GetVipTiersParams): Promise<any> {
    if (params?.customer_id && typeof params.customer_id !== 'number') {
      throw new YotpoApiError("customer_id must be a number if provided for getVipTiers.");
    }
    if (params?.customer_external_id && typeof params.customer_external_id !== 'string') {
      throw new YotpoApiError("customer_external_id must be a string if provided for getVipTiers.");
    }
    if (params?.customer_email && typeof params.customer_email !== 'string') {
      throw new YotpoApiError("customer_email must be a string if provided for getVipTiers.");
    }
    if (params?.details && typeof params.details !== 'boolean') {
      throw new YotpoApiError("details must be a boolean if provided for getVipTiers.");
    }
    return this.request<any>("GET", "/vip_tiers", undefined, params);
  }

  // --- Privacy API Endpoints ---

  /**
   * Checks if data exists for a given email, for privacy regulation compliance.
   * @param params - Parameters containing the email to check.
   * @returns A promise that resolves with the API response (likely indicating data existence).
   * @throws {YotpoApiError} If email is missing or invalid.
   */
  public async checkDataExists(params: PrivacyCheckParams): Promise<any> {
    if (!params.email || typeof params.email !== 'string') {
      throw new YotpoApiError("Email (string) is required for checking data existence.");
    }
    return this.request<any>("GET", "/privacy/data_exists", undefined, params);
  }

  /**
   * Retrieves user data for a given email (and optionally external ID), for privacy regulation compliance.
   * @param params - Parameters containing the email (and optionally customer_external_id) to fetch data for.
   * @returns A promise that resolves with the user's data.
   * @throws {YotpoApiError} If email is missing or identifiers are invalid.
   */
  public async getUserData(params: PrivacyRequestParams): Promise<any> {
    if (!params.email || typeof params.email !== 'string') {
      throw new YotpoApiError("Email (string) is required for fetching user data.");
    }
    if (params.customer_external_id && typeof params.customer_external_id !== 'string') {
      throw new YotpoApiError("customer_external_id must be a string if provided for fetching user data.");
    }
    return this.request<any>("GET", "/privacy/user_data", undefined, params);
  }
}

/*
// Example of how to instantiate and use the client:

const client = new YotpoLoyaltyClient("YOUR_GUID", "YOUR_API_KEY"); // Replace with actual GUID and API Key

// --- Customer Examples ---

// Example: Create or Update Customer
const customerPayload: CreateUpdateCustomerPayload = {
  email: "newcustomer@example.com",
  first_name: "New",
  last_name: "Customer",
  external_id: "NEWCUST001",
  tags: "tag1,tag2",
  custom_fields: { loyalty_level: "gold" },
  opt_in_marketing: "subscribed",
  birthday: "1990-01-15",
  send_welcome_email: true,
};
// client.createOrUpdateCustomer(customerPayload)
//   .then(data => console.log("Customer created/updated:", data))
//   .catch(error => {
//     console.error("Error creating/updating customer:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Set Customer Birthday
const birthdayPayload: SetBirthdayPayload = {
  customer_email: "newcustomer@example.com",
  date: "1990-01-20", // Corrected birthday
  send_birthday_email: true,
};
// client.setCustomerBirthday(birthdayPayload)
//   .then(data => console.log("Customer birthday set:", data))
//   .catch(error => {
//     console.error("Error setting birthday:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Set Customer Anniversary
const anniversaryPayload: SetAnniversaryPayload = {
  customer_external_id: "NEWCUST001",
  date: "2023-05-10",
  send_anniversary_email: false,
};
// client.setCustomerAnniversary(anniversaryPayload)
//   .then(data => console.log("Customer anniversary set:", data))
//   .catch(error => {
//     console.error("Error setting anniversary:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Get Customer Anniversary
const getAnniversaryParams: GetAnniversaryParams = {
  customer_email: "newcustomer@example.com",
};
// client.getCustomerAnniversary(getAnniversaryParams)
//   .then(data => console.log("Customer anniversary:", data))
//   .catch(error => {
//     console.error("Error getting anniversary:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Fetch Customer Details
const fetchDetailsParams: FetchCustomerDetailsParams = {
  customer_email: "newcustomer@example.com",
  with_history: true,
  with_points_history: true,
  with_referral_code: true,
};
// client.fetchCustomerDetails(fetchDetailsParams)
//   .then(data => console.log("Customer details:", data))
//   .catch(error => {
//     console.error("Error fetching customer details:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Fetch Customer Details by Yotpo ID (assuming customerId 12345 exists)
// const yotpoCustomerId = 12345; // Replace with an actual ID after creation/retrieval
// client.fetchCustomerDetailsById(yotpoCustomerId, { with_referral_code: true })
//   .then(data => console.log(`Details for customer ${yotpoCustomerId}:`, data))
//   .catch(error => {
//     console.error(`Error fetching customer ${yotpoCustomerId}:`, error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });


// --- Privacy Examples ---

// Example: Check if Data Exists
const checkDataParams: PrivacyCheckParams = {
  email: "customer-to-check@example.com",
};
// client.checkDataExists(checkDataParams)
//   .then(data => console.log("Data existence check:", data)) // Response might be { "exists": true/false } or similar
//   .catch(error => {
//     console.error("Error checking data existence:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Get User Data
const getUserDataParams: PrivacyRequestParams = {
  email: "customer-data-request@example.com",
  // customer_external_id: "CUST_EXT_FOR_GDPR_001" // Optional
};
// client.getUserData(getUserDataParams)
//   .then(data => console.log("User data:", data))
//   .catch(error => {
//     console.error("Error getting user data:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// --- Orders Examples ---

// Example: Create Order (Minimal)
const minimalOrderPayload: CreateOrderPayload = {
  customer_email: "newcustomer@example.com", // or customer_external_id
  order_id: "ORDER_SN12345",
  total_amount_cents: 10000, // e.g., $100.00
  currency_code: "USD",
};
// client.createOrder(minimalOrderPayload)
//   .then(data => console.log("Minimal order created:", data))
//   .catch(error => {
//     console.error("Error creating minimal order:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Create Order (Comprehensive)
const comprehensiveOrderPayload: CreateOrderPayload = {
  customer_external_id: "CUST_EXT_ID_002",
  order_id: "ORDER_FULL_67890",
  total_amount_cents: 25550, // $255.50
  currency_code: "CAD",
  coupon_code: "SUMMER20",
  created_at: new Date().toISOString(),
  financial_state: "paid",
  fulfillment_state: "unfulfilled",
  total_discounts_cents: 2000, // $20.00
  total_tax_cents: 1550,       // $15.50
  total_shipping_cents: 1000,  // $10.00
  shipping_address: {
    address1: "123 Main St",
    city: "Toronto",
    province: "ON",
    zip: "M5V 2K7",
    country_code: "CA",
  },
  line_items: [
    {
      external_product_id: "PROD001",
      title: "Awesome T-Shirt",
      price_cents: 3000, // $30.00
      quantity: 1,
      sku: "TSHIRT-BLK-LG",
      url: "https://example.com/products/awesome-tshirt",
      image_url: "https://example.com/images/tshirt.jpg",
    },
    {
      external_product_id: "PROD002",
      title: "Cool Hat",
      price_cents: 1500, // $15.00
      quantity: 2,
      sku: "HAT-RED-OS",
    },
  ],
  extra_data: {
    gift_message: "Happy Birthday!",
    source_platform: "custom_integration_v1"
  },
  // idempotency_key: "unique-order-key-abc-123" // Optional
};
// client.createOrder(comprehensiveOrderPayload)
//   .then(data => console.log("Comprehensive order created:", data))
//   .catch(error => {
//     console.error("Error creating comprehensive order:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });


// --- Referrals Examples ---

// Example: Identify Referrer
const identifyReferrerPayload: IdentifyReferrerPayload = {
  customer_email: "friend@example.com", // Friend's email
  referral_code: "ADVOCATE_REF_CODE_123", // Advocate's referral code
};
// client.identifyReferrer(identifyReferrerPayload)
//   .then(data => console.log("Referrer identified:", data))
//   .catch(error => {
//     console.error("Error identifying referrer:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Send Referral Emails
const sendEmailsPayload: SendReferralEmailsPayload = {
  customer_email: "advocate@example.com", // Advocate's email
  recipient_emails: ["friend1@example.com", "friend2@example.com"],
  first_name: "AdvocateFirstName", // Optional: Advocate's first name
  last_name: "AdvocateLastName",   // Optional: Advocate's last name
  // referral_code: "ADVOCATE_REF_CODE_123", // Optional: Can be auto-fetched if advocate exists
  // email_template_id: "custom_template_123" // Optional
};
// client.sendReferralEmails(sendEmailsPayload)
//   .then(data => console.log("Referral emails sent:", data))
//   .catch(error => {
//     console.error("Error sending referral emails:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });


// --- Redemption Options Examples ---

// Example: Upload Coupon Codes
const couponPayload: UploadCouponsPayload = {
  redemption_option_id: 54321, // Replace with an actual Redemption Option ID
  coupon_codes: ["CODE001", "CODE002", "CODE003"],
};
// client.uploadCouponCodes(couponPayload)
//   .then(data => console.log("Coupon codes uploaded:", data))
//   .catch(error => {
//     console.error("Error uploading coupon codes:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Get Active Redemption Options (general)
// client.getActiveRedemptionOptions()
//   .then(data => console.log("Active redemption options (general):", data))
//   .catch(error => {
//     console.error("Error getting active redemption options:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Get Active Redemption Options (for a specific customer)
const activeOptionsForCustomerParams: GetActiveRedemptionOptionsParams = {
  customer_email: "newcustomer@example.com",
  include_referral_reward_options: true,
  // excluded_tags: ["vip_only", "special_event"]
};
// client.getActiveRedemptionOptions(activeOptionsForCustomerParams)
//   .then(data => console.log("Active redemption options for customer:", data))
//   .catch(error => {
//     console.error("Error getting customer-specific redemption options:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Get Redemption Code Data
const codeDataParams: GetRedemptionCodeDataParams = {
  redemption_id: "REDEMPTION_INSTANCE_ID_789", // Replace with an actual ID of a specific redemption
  customer_email: "newcustomer@example.com", // Or customer_id
};
// client.getRedemptionCodeData(codeDataParams)
//   .then(data => console.log("Redemption code data:", data))
//   .catch(error => {
//     console.error("Error getting redemption code data:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Fetch Recently Updated Customers
// client.fetchRecentlyUpdatedCustomers({ per_page: 5 })
//   .then(data => console.log("Recently updated customers:", data))
//   .catch(error => {
//     console.error("Error fetching recent customers:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });


// Example: Remove Customer Anniversary
// const removeAnniversaryParams: RemoveAnniversaryParams = {
// customer_external_id: "NEWCUST001",
// };
// client.removeCustomerAnniversary(removeAnniversaryParams)
// .then(data => console.log("Customer anniversary removed:", data))
// .catch(error => {
// console.error("Error removing anniversary:", error);
// if (error instanceof YotpoApiError) {
// console.error("Status:", error.responseStatus);
// console.error("Body:", error.responseBody);
// }
// });


// --- Action Examples (from previous subtask, ensure they still work) ---

// Example for recordCustomerAction
const recordActionPayload: RecordActionPayload = {
  customer_email: "customer@example.com",
  action_name: "coupon_referral",
};
// client.recordCustomerAction(recordActionPayload)
//   .then(response => console.log("Action recorded:", response))
//   .catch(error => {
//     console.error("Error recording action:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example for recordCustomerAction
// const recordActionPayload: RecordActionPayload = {
//   customer_email: "customer@example.com",
//   action_name: "coupon_referral",
//   // created_at: new Date().toISOString(), // Optional
//   // amount: 100.50, // Optional
//   // order_id: "ORDER123", // Optional
//   // extra_data: { custom_field: "custom_value" }, // Optional
//   // idempotency_key: "unique-action-key-123" // Optional
// };
// client.recordCustomerAction(recordActionPayload)
//   .then(response => console.log("Action recorded:", response))
//   .catch(error => {
//     console.error("Error recording action:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example for adjustCustomerPoints
const adjustPointsPayload: AdjustPointsPayload = {
  customer_email: "customer@example.com", // or customer_external_id: "CUST_EXT_ID_123"
  points: 50,
  reason: "Manual adjustment for good feedback", // Optional
  // idempotency_key: "unique-points-key-456" // Optional
};
// client.adjustCustomerPoints(adjustPointsPayload)
//   .then(response => console.log("Points adjusted:", response))
//   .catch(error => {
//     console.error("Error adjusting points:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example for removeCustomerFromActionVipTier
const removeFromVipTierPayload: RemoveFromVipTierPayload = {
  customer_email: "customer@example.com", // or customer_external_id: "CUST_EXT_ID_456"
  vip_tier_id: 12345 // Replace with an actual VIP Tier ID
};
// client.removeCustomerFromActionVipTier(removeFromVipTierPayload)
//   .then(response => console.log("Customer removed from VIP tier:", response))
//   .catch(error => {
//     console.error("Error removing customer from VIP tier:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });


// --- Point Redemption Examples ---

// Example: Create Redemption
const redemptionPayload: CreateRedemptionPayload = {
  customer_email: "newcustomer@example.com", // Or customer_external_id
  redemption_option_id: 78901, // Replace with an actual Redemption Option ID
  // points_to_redeem: 500, // Include if the redemption option allows variable points
  // external_order_id: "ORDER567", // Optional: Link to an external order
  // idempotency_key: "unique-redemption-key-789" // Optional
};
// client.createRedemption(redemptionPayload)
//   .then(data => console.log("Redemption created:", data))
//   .catch(error => {
//     console.error("Error creating redemption:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Approve Redemption Cancellation
const approveCancelPayload: ApproveCancellationPayload = {
  customer_external_id: "NEWCUST001", // Or customer_email
  redemption_id: "REDEMPTION_ID_TO_CANCEL_123", // Replace with an actual Redemption ID
};
// client.approveRedemptionCancellation(approveCancelPayload)
//   .then(data => console.log("Redemption cancellation approved:", data))
//   .catch(error => {
//     console.error("Error approving redemption cancellation:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// --- Campaigns Examples ---

// Example: Get Active Campaigns (general)
// client.getActiveCampaigns()
//   .then(data => console.log("Active campaigns (general):", data))
//   .catch(error => {
//     console.error("Error getting general active campaigns:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Get Active Campaigns (for a specific customer by email)
const campaignsForCustomerParams: GetActiveCampaignsParams = {
  customer_email: "newcustomer@example.com",
  platform: "shopify", // Optional: filter by platform as well
};
// client.getActiveCampaigns(campaignsForCustomerParams)
//   .then(data => console.log("Active campaigns for customer:", data))
//   .catch(error => {
//     console.error("Error getting customer-specific active campaigns:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Get Active Campaigns (filtered by platform)
const campaignsByPlatformParams: GetActiveCampaignsParams = {
  platform: "general",
};
// client.getActiveCampaigns(campaignsByPlatformParams)
//   .then(data => console.log("Active campaigns for platform 'general':", data))
//   .catch(error => {
//     console.error("Error getting platform-specific active campaigns:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// --- VIP Tiers Examples ---

// Example: Get All VIP Tiers (basic details)
// client.getVipTiers()
//   .then(data => console.log("All VIP Tiers (basic):", data))
//   .catch(error => {
//     console.error("Error getting all VIP Tiers (basic):", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Get All VIP Tiers (with details)
// client.getVipTiers({ details: true })
//   .then(data => console.log("All VIP Tiers (detailed):", data))
//   .catch(error => {
//     console.error("Error getting all VIP Tiers (detailed):", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

// Example: Get VIP Tiers for a specific customer (by email, with details)
const vipTiersForCustomerParams: GetVipTiersParams = {
  customer_email: "newcustomer@example.com",
  details: true,
};
// client.getVipTiers(vipTiersForCustomerParams)
//   .then(data => console.log("VIP Tiers for customer:", data))
//   .catch(error => {
//     console.error("Error getting customer's VIP Tiers:", error);
//     if (error instanceof YotpoApiError) {
//       console.error("Status:", error.responseStatus);
//       console.error("Body:", error.responseBody);
//     }
//   });

*/

// Example GET request
// Note: The old example client.getCustomers() and client.createCustomer() are now
// superseded by fetchCustomerDetails/fetchRecentlyUpdatedCustomers and createOrUpdateCustomer respectively.
// They were left in the code during the transition but should be considered deprecated
// in favor of the more specific methods.
*/
