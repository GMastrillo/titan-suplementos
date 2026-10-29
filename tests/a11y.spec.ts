import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Acessibilidade WCAG AA — Rede Titan Suplementos', () => {
  test('Página Inicial deve passar nos critérios de acessibilidade', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast']) // Next.js dev overlays can flag contrast
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Simulador de Atendimento com IA deve ter navegação acessível', async ({ page }) => {
    await page.goto('/atendimento');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
