/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#103a27',
    tint: '#0b5735',

    // Core surfaces
    background: '#f5faf7',
    foreground: '#103a27',

    // Cards / elevated surfaces
    card: '#ffffff',
    cardForeground: '#103a27',

    // Primary action color (buttons, links, active states)
    primary: '#0b5735',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#eaf2ed',
    secondaryForeground: '#103a27',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#eaf2ed',
    mutedForeground: '#718379',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#f7c900',
    accentForeground: '#103a27',

    // Destructive actions (delete, error states)
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#dfeae3',
    input: '#dfeae3',

    // Brand colors used by the food delivery screens.
    brandGreen: '#0b5735',
    brandDeepGreen: '#063a23',
    brandYellow: '#f7c900',
    brandCream: '#f5faf7',
    brandMint: '#e9f3ed',
    brandMutedGreen: '#74877c',
    brandLettuce: '#61aa4b',
    brandTomato: '#ee4438',
    brandPatty: '#8a5228',
    brandPaper: '#fbfff9',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 18,
};

export default colors;
