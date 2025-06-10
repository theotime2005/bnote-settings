import { expect, test } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

async function selectLanguage(page, lang = "fr") {
  await page.goto(BASE_URL + "/");
  // Clique sur le bouton de langue si affiché
  const langButton = page.locator(`button:has-text('${lang}')`);
  if (await langButton.isVisible()) {
    await langButton.click();
  }
}

async function goToViaMenu(page, routeName) {
  // Utilise la classe .nav-link et le texte traduit du menu
  const navLink = page.locator(".nav-link");
  const count = await navLink.count();
  for (let i = 0; i < count; i++) {
    const text = await navLink.nth(i).innerText();
    if (
      (routeName === "settings" && /préférences du b\.?note/i.test(text)) ||
      (routeName === "about" && /propos du site/i.test(text)) ||
      (routeName === "download" && /téléchargement/i.test(text)) ||
      (routeName === "faq" && /faq/i.test(text))
    ) {
      await navLink.nth(i).click();
      return;
    }
  }
  // Debug : affiche tous les textes trouvés
  const allTexts = [];
  for (let i = 0; i < count; i++) {
    allTexts.push(await navLink.nth(i).innerText());
  }
  throw new Error(`Lien de menu non trouvé pour ${routeName}. Textes trouvés : ${allTexts.join(" | ")}`);
}

test.describe("Navigation application complète", () => {
  test("Accueil", async ({ page }) => {
    await selectLanguage(page);
    await expect(page.locator("h1")).toHaveText(/Accueil/i);
  });

  test("Paramètres", async ({ page }) => {
    await selectLanguage(page);
    await goToViaMenu(page, "settings");
    await expect(page.locator("h1")).toHaveText(/préférences/i);
  });

  test("À propos", async ({ page }) => {
    await selectLanguage(page);
    await goToViaMenu(page, "about");
    await expect(page.locator("h1")).toHaveText(/propos/i);
    const aboutCount = await page.locator(".about-section, .about-text, section").count();
    expect(aboutCount).toBeGreaterThan(0);
  });

  test("Téléchargement", async ({ page }) => {
    await selectLanguage(page);
    await goToViaMenu(page, "download");
    await expect(page.locator("h1")).toHaveText(/téléchargement/i);
    const eurobrailleLinks = await page.locator("a[href*='eurobraille']").count();
    expect(eurobrailleLinks).toBeGreaterThan(0);
  });

  test("FAQ", async ({ page }) => {
    await selectLanguage(page);
    await goToViaMenu(page, "faq");
    await expect(page.locator("h1")).toHaveText(/faq/i);
    const faqCount = await page.locator(".faq-question, h2, h3").count();
    expect(faqCount).toBeGreaterThan(0);
  });
});
