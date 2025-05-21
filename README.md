This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Yotpo Loyalty API 客戶端

本專案包含一個用於與 Yotpo Loyalty & Referrals API 互動的 TypeScript 客戶端 (`src/app/api/yotpo/client.ts`)。

### 功能

此客戶端支援以下 Yotpo Loyalty API 功能類別：

*   **Actions (操作)**：記錄顧客行為、調整顧客點數、從 VIP 等級中移除顧客。
*   **Customers (顧客)**：建立/更新顧客資料、設定生日/週年紀念日、查詢顧客詳情。
*   **Point Redemptions (點數兌換)**：建立兌換請求、核准取消兌換。
*   **Redemption Options (兌換選項)**：上傳優惠券代碼、查詢有效的兌換選項。
*   **Referrals (推薦)**：識別推薦人、發送推薦郵件。
*   **Campaigns (活動)**：查詢有效的行銷活動。
*   **Orders (訂單)**：建立訂單記錄。
*   **Refunds (退款)**：建立退款記錄。
*   **VIP Tiers (VIP 等級)**：查詢 VIP 等級資訊。
*   **Privacy (隱私)**：檢查用戶資料是否存在、獲取用戶資料。

### 基本用法

首先，您需要使用您的 `guid` 和 `apiKey` 初始化客戶端：

```typescript
import { YotpoLoyaltyClient } from './src/app/api/yotpo/client';

const client = new YotpoLoyaltyClient('YOUR_GUID', 'YOUR_API_KEY');

// 範例：查詢有效的行銷活動
async function fetchCampaigns() {
  try {
    const campaigns = await client.getActiveCampaigns();
    console.log('有效的行銷活動:', campaigns);
  } catch (error) {
    console.error('查詢失敗:', error);
  }
}

fetchCampaigns();
```

詳細的 API 方法和所需的參數/酬載 (payload) 結構，請參閱 `src/app/api/yotpo/client.ts` 檔案中的 JSDoc 註解。

### API 遊樂場 (Playground)

專案中包含一個互動式的 API 遊樂場頁面，位於 `src/app/yotpo-tester/page.tsx`。
您可以透過此頁面：

1.  輸入您的 `guid` 和 `apiKey`。
2.  選擇要測試的 API 端點。
3.  提供必要的參數或酬載。
4.  執行請求並查看回應或錯誤。

這是在實際呼叫 API 前進行測試和熟悉各端點的好方法。

### 單元測試 (Unit Tests)

本客戶端包含一組單元測試，使用 [Vitest](https://vitest.dev/) 撰寫。這些測試確保客戶端的核心功能和錯誤處理如預期般運作。

若要執行測試，請在專案根目錄執行以下指令：

```bash
npm run test
```

或使用 Vitest UI：

```bash
npm run test:ui
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
