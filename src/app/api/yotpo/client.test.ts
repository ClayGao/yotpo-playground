import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { YotpoLoyaltyClient, YotpoApiError, GetActiveCampaignsParams, CreateUpdateCustomerPayload, FetchCustomerDetailsParams } from './client';

// Mock global fetch
global.fetch = vi.fn();

const mockGuid = 'test-guid';
const mockApiKey = 'test-apiKey';

describe('YotpoLoyaltyClient', () => {
    let client: YotpoLoyaltyClient;

    beforeEach(() => {
        client = new YotpoLoyaltyClient(mockGuid, mockApiKey);
    });

    afterEach(() => {
        vi.resetAllMocks(); // Reset mocks after each test
    });

    describe('Constructor and Authentication', () => {
        it('should store guid and apiKey correctly', () => {
            // This is indirectly tested by header checks in other tests.
            // Direct access to private members for assertion isn't standard.
            // We'll rely on the `request` method's behavior.
            expect(client).toBeInstanceOf(YotpoLoyaltyClient);
        });

        it('should set correct headers in the request method', async () => {
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
                status: 200,
            });

            // Make a simple call to trigger the request method
            await client.getActiveCampaigns();

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String), // URL can vary
                expect.objectContaining({
                    headers: {
                        'Content-Type': 'application/json',
                        'x-guid': mockGuid,
                        'x-api-key': mockApiKey,
                    },
                })
            );
        });
    });

    describe('getActiveCampaigns', () => {
        it('should fetch active campaigns successfully with no params', async () => {
            const mockResponseData = { campaigns: [{ id: 1, name: 'Test Campaign' }] };
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponseData,
                text: async () => JSON.stringify(mockResponseData),
                status: 200,
            });

            const result = await client.getActiveCampaigns();

            expect(fetch).toHaveBeenCalledWith(
                `https://loyalty.yotpo.com/api/v2/campaigns`,
                expect.objectContaining({
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-guid': mockGuid,
                        'x-api-key': mockApiKey,
                    },
                })
            );
            expect(result).toEqual(mockResponseData);
        });

        it('should fetch active campaigns successfully with query params', async () => {
            const mockResponseData = { campaigns: [{ id: 2, name: 'Filtered Campaign' }] };
            const params: GetActiveCampaignsParams = { platform: 'shopify' };
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponseData,
                text: async () => JSON.stringify(mockResponseData),
                status: 200,
            });

            const result = await client.getActiveCampaigns(params);

            expect(fetch).toHaveBeenCalledWith(
                `https://loyalty.yotpo.com/api/v2/campaigns?platform=shopify`,
                expect.objectContaining({
                    method: 'GET',
                })
            );
            expect(result).toEqual(mockResponseData);
        });

        it('should throw YotpoApiError on API error (e.g., 500)', async () => {
            const errorResponse = { errors: ['Server Error'] };
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                json: async () => errorResponse,
                text: async () => JSON.stringify(errorResponse),
                status: 500,
            });

            try {
                await client.getActiveCampaigns();
            } catch (e) {
                expect(e).toBeInstanceOf(YotpoApiError);
                const apiError = e as YotpoApiError;
                expect(apiError.message).toContain('API request failed with status 500');
                expect(apiError.responseStatus).toBe(500);
                expect(apiError.responseBody).toEqual(errorResponse);
            }
        });
    });

    describe('createOrUpdateCustomer', () => {
        const customerPayload: CreateUpdateCustomerPayload = {
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
        };

        it('should create/update customer successfully with valid payload', async () => {
            const mockResponseData = { id: 123, ...customerPayload };
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponseData,
                text: async () => JSON.stringify(mockResponseData),
                status: 201,
            });

            const result = await client.createOrUpdateCustomer(customerPayload);

            expect(fetch).toHaveBeenCalledWith(
                `https://loyalty.yotpo.com/api/v2/customers`,
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'x-guid': mockGuid,
                        'x-api-key': mockApiKey,
                    }),
                    body: JSON.stringify(customerPayload),
                })
            );
            expect(result).toEqual(mockResponseData);
        });

        it('should throw YotpoApiError on client-side validation failure (missing email)', async () => {
            const invalidPayload = { first_name: 'Test' } as CreateUpdateCustomerPayload;
            await expect(client.createOrUpdateCustomer(invalidPayload)).rejects.toThrowError(YotpoApiError);
            // Check if the error message is as expected
            try {
                await client.createOrUpdateCustomer(invalidPayload);
            } catch (e) {
                expect((e as YotpoApiError).message).toBe('Email is required to create or update a customer.');
            }
        });

        it('should throw YotpoApiError on API error (e.g., 400 Bad Request)', async () => {
            const errorResponse = { errors: { email: ['is invalid'] } };
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                json: async () => errorResponse,
                text: async () => JSON.stringify(errorResponse),
                status: 400,
            });

            try {
                await client.createOrUpdateCustomer(customerPayload);
            } catch (e) {
                expect(e).toBeInstanceOf(YotpoApiError);
                const apiError = e as YotpoApiError;
                expect(apiError.responseStatus).toBe(400);
                expect(apiError.responseBody).toEqual(errorResponse);
            }
        });
    });

    describe('YotpoApiError', () => {
        it('should correctly construct with message, status, and body', () => {
            const message = "Test error message";
            const status = 404;
            const body = { detail: "Not Found" };
            const error = new YotpoApiError(message, status, body);

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(YotpoApiError);
            expect(error.name).toBe("YotpoApiError");
            expect(error.message).toBe(message);
            expect(error.responseStatus).toBe(status);
            expect(error.responseBody).toEqual(body);
        });

         it('should handle non-JSON error response text in YotpoApiError during request', async () => {
            const errorText = "Service unavailable";
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
                ok: false,
                json: async () => { throw new Error("Simulating JSON parse error for non-JSON response"); }, // Simulate failure to parse as JSON
                text: async () => errorText, // Provide plain text
                status: 503,
            });

            try {
                await client.getActiveCampaigns();
            } catch (e) {
                expect(e).toBeInstanceOf(YotpoApiError);
                const apiError = e as YotpoApiError;
                expect(apiError.responseStatus).toBe(503);
                expect(apiError.responseBody).toBe(errorText); // Should capture the plain text
                expect(apiError.message).toContain(errorText);
            }
        });
    });
});
