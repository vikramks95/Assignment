import { test, expect } from '@playwright/test';

test.describe('Map Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the map container', async ({ page }) => {
    const mapContainer = page.getByTestId('map-container');
    await expect(mapContainer).toBeVisible();

    await page.waitForSelector('.leaflet-container', { timeout: 5000 });
    const leafletContainer = page.locator('.leaflet-container');
    await expect(leafletContainer).toBeVisible();
  });

  test('should display and interact with sidebar', async ({ page }) => {
    const sidebar = page.locator('.absolute.left-0.top-0').first();
    await expect(sidebar).toBeVisible();

    const sidebarTitle = page.getByText('Define Area of Interest');
    await expect(sidebarTitle).toBeVisible();

    const closeButton = page.getByLabel('Close sidebar');
    await closeButton.click();

    await page.waitForTimeout(500);

    const openButton = page.getByTestId('open-sidebar');
    await expect(openButton).toBeVisible();
    await openButton.click();

    await page.waitForTimeout(500);
    await expect(sidebarTitle).toBeVisible();
  });

  test('should search for a location', async ({ page }) => {
    const searchInput = page.getByTestId('location-search');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Cologne, Germany');
    await searchInput.press('Enter');

    await page.waitForTimeout(2000);

    const leafletContainer = page.locator('.leaflet-container');
    await expect(leafletContainer).toBeVisible();
  });

  test('should toggle drawing tools', async ({ page }) => {
    const polygonButton = page.getByTestId('polygon-tool');
    const rectangleButton = page.getByTestId('rectangle-tool');

    await expect(polygonButton).toBeVisible();
    await expect(rectangleButton).toBeVisible();

    await polygonButton.click();
    await expect(polygonButton).toHaveClass(/bg-blue-600/);

    const polygonInstructions = page.getByText('Click on the map to add points');
    await expect(polygonInstructions).toBeVisible();

    await rectangleButton.click();
    await expect(rectangleButton).toHaveClass(/bg-blue-600/);
    await expect(polygonButton).not.toHaveClass(/bg-blue-600/);

    const rectangleInstructions = page.getByText('Click and drag on the map');
    await expect(rectangleInstructions).toBeVisible();
  });

  test('should draw a polygon on the map', async ({ page }) => {
    const polygonButton = page.getByTestId('polygon-tool');
    await polygonButton.click();

    const mapContainer = page.getByTestId('map-container');
    const boundingBox = await mapContainer.boundingBox();

    if (boundingBox) {
      const centerX = boundingBox.x + boundingBox.width / 2;
      const centerY = boundingBox.y + boundingBox.height / 2;

      await page.mouse.click(centerX, centerY);
      await page.mouse.click(centerX + 50, centerY);
      await page.mouse.click(centerX + 50, centerY + 50);
      await page.mouse.click(centerX, centerY + 50);

      await page.mouse.dblclick(centerX, centerY + 50);

      await page.waitForTimeout(1000);

      const drawnAreasText = page.getByText(/Drawn Areas \(1\)/);
      await expect(drawnAreasText).toBeVisible();

      const clearButton = page.getByTestId('clear-areas');
      await expect(clearButton).toBeVisible();
      await clearButton.click();

      await expect(drawnAreasText).not.toBeVisible();
    }
  });
});
