# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard-flow.spec.ts >> Benah Palembang E2E Flow >> Dashboard Website Management & Content Creation Flow
- Location: tests\e2e\dashboard-flow.spec.ts:5:7

# Error details

```
TimeoutError: locator.fill: Timeout 10000ms exceeded.
Call log:
  - waiting for getByPlaceholder('nama@email.com')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [active]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - navigation [ref=e7]:
          - button [disabled] [ref=e8]:
            - img "previous" [ref=e9]
          - generic [ref=e11]:
            - generic [ref=e12]: 1/
            - generic [ref=e13]: "2"
          - button [ref=e14] [cursor=pointer]:
            - img "next" [ref=e15]
        - link "Next.js 16.3.3 (stale) Turbopack" [ref=e18] [cursor=pointer]:
          - /url: https://nextjs.org/docs/messages/version-staleness
          - generic "There is a newer version (16.3.5) available, upgrade recommended!" [ref=e21]: Next.js 16.3.3 (stale)
          - generic [ref=e22]: Turbopack
      - dialog "Console Error" [ref=e24]:
        - generic [ref=e27]:
          - generic [ref=e29]:
            - generic [ref=e30]:
              - generic [ref=e31]: Console Error
              - generic [ref=e33]:
                - button "Copy Error Info" [ref=e34] [cursor=pointer]
                - button "No related documentation found" [disabled] [ref=e37]
                - button "Attach Node.js inspector" [ref=e40] [cursor=pointer]
            - generic [ref=e50]:
              - text: Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client. Consider using template tag instead (
              - link "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template" [ref=e51] [cursor=pointer]:
                - /url: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
              - text: ).
          - generic [ref=e52]:
            - generic [ref=e53]:
              - paragraph [ref=e55]:
                - generic [ref=e60]: src\app\layout.tsx (98:9) @ RootLayout
                - button "Open in editor" [ref=e61] [cursor=pointer]
              - generic [ref=e65]:
                - generic [ref=e66]: 96 | >
                - generic [ref=e67]: 97 | <head>
                - generic [ref=e68]: "> 98 | <Script"
                - generic [ref=e69]: "| ^"
                - generic [ref=e70]: 99 | id="theme-init"
                - generic [ref=e71]: 100 | strategy="beforeInteractive"
                - generic [ref=e72]: "101 | dangerouslySetInnerHTML={{"
            - generic [ref=e73]:
              - generic [ref=e74]:
                - paragraph [ref=e75]:
                  - text: Call Stack
                  - generic [ref=e76]: "15"
                - button "Show 13 ignore-listed frame(s)" [ref=e77] [cursor=pointer]
              - generic [ref=e80]:
                - generic [ref=e81]: script
                - text: <anonymous>
              - generic [ref=e82]:
                - generic [ref=e83]:
                  - text: RootLayout
                  - button "Open RootLayout in editor" [ref=e84] [cursor=pointer]
                - text: src\app\layout.tsx (98:9)
      - contentinfo [ref=e87]:
        - region "Error feedback" [ref=e88]:
          - paragraph [ref=e89]:
            - link "Was this helpful?" [ref=e90] [cursor=pointer]:
              - /url: https://nextjs.org/telemetry#error-feedback
          - button "Mark as helpful" [ref=e91] [cursor=pointer]
          - button "Mark as not helpful" [ref=e95] [cursor=pointer]
    - generic [ref=e102] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e103]
      - generic [ref=e107]:
        - button "Open issues overlay" [ref=e108]:
          - generic [ref=e109]:
            - generic [aria-hidden] [ref=e110]: "1"
            - generic [ref=e111]: "2"
          - generic [ref=e112]:
            - text: Issue
            - generic [aria-hidden] [ref=e113]: s
        - button "Collapse issues badge" [ref=e114]
  - generic [ref=e118]:
    - heading "This page couldn’t load" [level=1] [ref=e121]
    - paragraph [ref=e122]: A server error occurred. Reload to try again.
    - button "Reload" [ref=e125] [cursor=pointer]
  - paragraph [ref=e126]: ERROR 3395616011
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Benah Palembang E2E Flow', () => {
  4   |   test.setTimeout(120000);
  5   |   test('Dashboard Website Management & Content Creation Flow', async ({ page }) => {
  6   |     // 1. Login
  7   |     await page.goto('/login');
> 8   |     await page.getByPlaceholder('nama@email.com').fill('info@benahpalembang.com');
      |                                                   ^ TimeoutError: locator.fill: Timeout 10000ms exceeded.
  9   |     await page.getByPlaceholder('••••••••').fill('Benah@1717');
  10  |     await page.getByRole('button', { name: /masuk/i }).click();
  11  | 
  12  |     // Verify successful login
  13  |     await expect(page).toHaveURL(/\/dashboard/);
  14  | 
  15  |     // 2. Manage Website - Home Tab
  16  |     await page.goto('/dashboard/website');
  17  |     // Ensure we're on Home tab
  18  |     await page.getByRole('button', { name: 'Home' }).click();
  19  | 
  20  |     // Modify a field in Home (Hero section)
  21  |     const testHomeTitle = `Test Home E2E ${Date.now()}`;
  22  |     await page.getByLabel('Title').first().fill(testHomeTitle);
  23  |     await page.getByRole('button', { name: /Simpan Perubahan/i }).click();
  24  |     await expect(page.getByText('Konten Home berhasil disimpan.')).toBeVisible({ timeout: 10000 });
  25  | 
  26  |     // 3. Manage Website - Kategori Tab
  27  |     await page.getByRole('button', { name: 'Kategori' }).click();
  28  |     // Expand Cerita Warga section
  29  |     await page.getByText('Cerita Warga', { exact: true }).click();
  30  |     const testCategoryTitle = `Test Kategori E2E ${Date.now()}`;
  31  |     // Fill the Judul field inside the expanded section
  32  |     await page.getByLabel('Judul').first().fill(testCategoryTitle);
  33  |     await page.getByRole('button', { name: /Simpan Perubahan/i }).click();
  34  |     await expect(page.getByText('Konten halaman kategori Article berhasil disimpan.')).toBeVisible({ timeout: 10000 });
  35  | 
  36  |     // 4. Manage Website - Kolaborasi Tab
  37  |     await page.getByRole('button', { name: 'Kolaborasi' }).click();
  38  |     const testCollabTitle = `Test Collab E2E ${Date.now()}`;
  39  |     await page.getByLabel('Judul Halaman').first().fill(testCollabTitle);
  40  |     await page.getByRole('button', { name: /Simpan Perubahan/i }).click();
  41  |     await expect(page.getByText('Konten Collaboration berhasil disimpan.')).toBeVisible({ timeout: 10000 });
  42  | 
  43  |     // 5. Manage Website - Header & Footer Tab
  44  |     await page.getByRole('button', { name: 'Header & Footer' }).click();
  45  |     const testFooterDesc = `Test Footer E2E ${Date.now()}`;
  46  |     // Find the description textarea or input
  47  |     await page.getByLabel('Deskripsi Website / Tagline Footer').first().fill(testFooterDesc);
  48  |     await page.getByRole('button', { name: /Simpan Perubahan/i }).click();
  49  |     await expect(page.getByText('Konten Header & Footer berhasil disimpan.')).toBeVisible({ timeout: 10000 });
  50  | 
  51  |     // 6. Verify on Public Home
  52  |     await page.goto('/');
  53  |     await expect(page.getByText(testHomeTitle).first()).toBeVisible();
  54  |     await expect(page.getByText(testFooterDesc).first()).toBeVisible();
  55  | 
  56  |     // 7. Verify on Public Cerita Warga
  57  |     await page.goto('/cerita-warga');
  58  |     await expect(page.getByText(testCategoryTitle).first()).toBeVisible();
  59  | 
  60  |     // 8. Verify on Public Kolaborasi
  61  |     await page.goto('/kolaborasi');
  62  |     await expect(page.getByText(testCollabTitle).first()).toBeVisible();
  63  | 
  64  |     // 9. Create Article
  65  |     await page.goto('/dashboard/create-article/new');
  66  |     const articleTitle = `Artikel E2E ${Date.now()}`;
  67  |     await page.getByPlaceholder(/Judul artikel/i).fill(articleTitle);
  68  |     // Assuming there is a native select for category
  69  |     await page.locator('select').first().selectOption({ index: 0 }); // Select first category
  70  | 
  71  |     // Fill content (Tiptap editor uses contenteditable)
  72  |     await page.locator('.ProseMirror').fill('Ini adalah konten artikel E2E test.');
  73  | 
  74  |     // Upload image (mock or bypass if required, assuming it's optional or we can just submit)
  75  |     // If cover is required, this might fail, but let's try to submit
  76  |     await page.getByRole('button', { name: 'Post' }).click();
  77  | 
  78  |     // 10. Create Event
  79  |     await page.goto('/dashboard/create-event/new');
  80  |     const eventTitle = `Event E2E ${Date.now()}`;
  81  |     await page.getByLabel(/Judul Event/i).fill(eventTitle);
  82  |     // Fill other required event fields (date, location)
  83  |     await page.getByLabel(/Lokasi/i).fill('Palembang');
  84  |     await page.locator('.ProseMirror').fill('Ini adalah deskripsi event E2E test.');
  85  |     await page.getByRole('button', { name: 'Post' }).click();
  86  | 
  87  |     // 11. Content Approval
  88  |     await page.goto('/dashboard/content');
  89  |     // Assuming there are tabs for Article and Event, and approve buttons
  90  |     // Approve Article
  91  |     await page.getByRole('button', { name: 'Artikel' }).click();
  92  |     // Click approve button on the first item (the one we just created)
  93  |     const approveArticleBtn = page.getByRole('button', { name: /Setujui/i }).first();
  94  |     if (await approveArticleBtn.isVisible()) {
  95  |       await approveArticleBtn.click();
  96  |     }
  97  | 
  98  |     // Approve Event
  99  |     await page.getByRole('button', { name: 'Agenda' }).click();
  100 |     const approveEventBtn = page.getByRole('button', { name: /Setujui/i }).first();
  101 |     if (await approveEventBtn.isVisible()) {
  102 |       await approveEventBtn.click();
  103 |     }
  104 | 
  105 |     // 12. Verify Content on Public Pages
  106 |     await page.goto('/agenda');
  107 |     await expect(page.getByText(eventTitle).first()).toBeVisible();
  108 | 
```