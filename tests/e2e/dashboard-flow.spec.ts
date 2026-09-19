import { test, expect } from '@playwright/test';

test.describe('Benah Palembang E2E Flow', () => {
  test.setTimeout(120000);
  test('Dashboard Website Management & Content Creation Flow', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.getByPlaceholder('nama@email.com').fill('info@benahpalembang.com');
    await page.getByPlaceholder('••••••••').fill('Benah@1717');
    await page.getByRole('button', { name: /masuk/i }).click();

    // Verify successful login
    await expect(page).toHaveURL(/\/dashboard/);

    // 2. Manage Website - Home Tab
    await page.goto('/dashboard/website');
    // Ensure we're on Home tab
    await page.getByRole('button', { name: 'Home' }).click();

    // Modify a field in Home (Hero section)
    const testHomeTitle = `Test Home E2E ${Date.now()}`;
    await page.getByLabel('Title').first().fill(testHomeTitle);
    await page.getByRole('button', { name: /Simpan Perubahan/i }).click();
    await expect(page.getByText('Konten Home berhasil disimpan.')).toBeVisible({ timeout: 10000 });

    // 3. Manage Website - Kategori Tab
    await page.getByRole('button', { name: 'Kategori' }).click();
    // Expand Cerita Warga section
    await page.getByText('Cerita Warga', { exact: true }).click();
    const testCategoryTitle = `Test Kategori E2E ${Date.now()}`;
    // Fill the Judul field inside the expanded section
    await page.getByLabel('Judul').first().fill(testCategoryTitle);
    await page.getByRole('button', { name: /Simpan Perubahan/i }).click();
    await expect(page.getByText('Konten halaman kategori Article berhasil disimpan.')).toBeVisible({ timeout: 10000 });

    // 4. Manage Website - Kolaborasi Tab
    await page.getByRole('button', { name: 'Kolaborasi' }).click();
    const testCollabTitle = `Test Collab E2E ${Date.now()}`;
    await page.getByLabel('Judul Halaman').first().fill(testCollabTitle);
    await page.getByRole('button', { name: /Simpan Perubahan/i }).click();
    await expect(page.getByText('Konten Collaboration berhasil disimpan.')).toBeVisible({ timeout: 10000 });

    // 5. Manage Website - Header & Footer Tab
    await page.getByRole('button', { name: 'Header & Footer' }).click();
    const testFooterDesc = `Test Footer E2E ${Date.now()}`;
    // Find the description textarea or input
    await page.getByLabel('Deskripsi Website / Tagline Footer').first().fill(testFooterDesc);
    await page.getByRole('button', { name: /Simpan Perubahan/i }).click();
    await expect(page.getByText('Konten Header & Footer berhasil disimpan.')).toBeVisible({ timeout: 10000 });

    // 6. Verify on Public Home
    await page.goto('/');
    await expect(page.getByText(testHomeTitle).first()).toBeVisible();
    await expect(page.getByText(testFooterDesc).first()).toBeVisible();

    // 7. Verify on Public Cerita Warga
    await page.goto('/cerita-warga');
    await expect(page.getByText(testCategoryTitle).first()).toBeVisible();

    // 8. Verify on Public Kolaborasi
    await page.goto('/kolaborasi');
    await expect(page.getByText(testCollabTitle).first()).toBeVisible();

    // 9. Create Article
    await page.goto('/dashboard/create-article/new');
    const articleTitle = `Artikel E2E ${Date.now()}`;
    await page.getByPlaceholder(/Judul artikel/i).fill(articleTitle);
    // Assuming there is a native select for category
    await page.locator('select').first().selectOption({ index: 0 }); // Select first category

    // Fill content (Tiptap editor uses contenteditable)
    await page.locator('.ProseMirror').fill('Ini adalah konten artikel E2E test.');

    // Upload image (mock or bypass if required, assuming it's optional or we can just submit)
    // If cover is required, this might fail, but let's try to submit
    await page.getByRole('button', { name: 'Post' }).click();

    // 10. Create Event
    await page.goto('/dashboard/create-event/new');
    const eventTitle = `Event E2E ${Date.now()}`;
    await page.getByLabel(/Judul Event/i).fill(eventTitle);
    // Fill other required event fields (date, location)
    await page.getByLabel(/Lokasi/i).fill('Palembang');
    await page.locator('.ProseMirror').fill('Ini adalah deskripsi event E2E test.');
    await page.getByRole('button', { name: 'Post' }).click();

    // 11. Content Approval
    await page.goto('/dashboard/content');
    // Assuming there are tabs for Article and Event, and approve buttons
    // Approve Article
    await page.getByRole('button', { name: 'Artikel' }).click();
    // Click approve button on the first item (the one we just created)
    const approveArticleBtn = page.getByRole('button', { name: /Setujui/i }).first();
    if (await approveArticleBtn.isVisible()) {
      await approveArticleBtn.click();
    }

    // Approve Event
    await page.getByRole('button', { name: 'Agenda' }).click();
    const approveEventBtn = page.getByRole('button', { name: /Setujui/i }).first();
    if (await approveEventBtn.isVisible()) {
      await approveEventBtn.click();
    }

    // 12. Verify Content on Public Pages
    await page.goto('/agenda');
    await expect(page.getByText(eventTitle).first()).toBeVisible();

    await page.goto('/cerita-warga'); // Assuming first category is cerita warga
    await expect(page.getByText(articleTitle).first()).toBeVisible();
  });
});
