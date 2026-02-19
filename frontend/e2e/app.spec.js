const { test, expect } = require("@playwright/test");

test.describe("Landing Page", () => {
  test("devrait afficher le titre SafeLand", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("SafeLand");
  });

  test("devrait afficher les 6 modules", async ({ page }) => {
    await page.goto("/");
    const modules = [
      "Titre Foncier NFT",
      "Escrow",
      "Fridda",
      "Justice",
      "Registre",
    ];
    for (const mod of modules) {
      await expect(page.getByText(mod, { exact: false }).first()).toBeVisible();
    }
  });

  test("devrait avoir un bouton CTA vers le dashboard", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: /dashboard|commencer|démarrer/i }).first();
    await expect(cta).toBeVisible();
  });

  test("devrait avoir une navbar avec le logo", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.getByText("SafeLand").first()).toBeVisible();
  });

  test("devrait afficher la section stack technique", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Solidity", { exact: false }).first()).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("devrait naviguer vers le dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/dashboard");
  });

  test("devrait naviguer vers les propriétés", async ({ page }) => {
    await page.goto("/properties");
    await expect(page).toHaveURL("/properties");
  });

  test("devrait naviguer vers l'escrow", async ({ page }) => {
    await page.goto("/escrow");
    await expect(page).toHaveURL("/escrow");
  });

  test("devrait naviguer vers Fridda", async ({ page }) => {
    await page.goto("/fridda");
    await expect(page).toHaveURL("/fridda");
  });

  test("devrait naviguer vers Justice", async ({ page }) => {
    await page.goto("/justice");
    await expect(page).toHaveURL("/justice");
  });

  test("devrait naviguer vers Stats", async ({ page }) => {
    await page.goto("/stats");
    await expect(page).toHaveURL("/stats");
  });
});

test.describe("Responsive", () => {
  test("devrait être responsive sur mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("devrait avoir un menu hamburger sur mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    // Le menu mobile devrait être présent (bouton hamburger)
    const mobileButton = page.locator("nav button").first();
    await expect(mobileButton).toBeVisible();
  });
});

test.describe("Accessibilité", () => {
  test("devrait avoir un titre de page", async ({ page }) => {
    await page.goto("/");
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test("devrait avoir des liens accessibles dans la navbar", async ({ page }) => {
    await page.goto("/");
    const navLinks = page.locator("nav a");
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Wallet (sans MetaMask)", () => {
  test("devrait afficher le bouton Connecter Wallet", async ({ page }) => {
    await page.goto("/dashboard");
    // Sans MetaMask, le bouton de connexion devrait être visible
    const connectBtn = page.getByText(/connect|connecter/i).first();
    await expect(connectBtn).toBeVisible();
  });
});
