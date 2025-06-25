import type { ColorDefinitions } from "@/types/colors";
import { vars } from "nativewind";

/**
 * Color definitions for light and dark themes.
 * 
 * Light theme hex colors (Monochrome):
 * - primary: #000000 (black)
 * - secondary: #333333 (dark gray)
 * - background: #ffffff (white)
 * - surface: #fafafa (light gray)
 * - surface-variant: #f5f5f5 (lighter gray)
 * - on-background: #000000 (black)
 * - on-surface: #000000 (black)
 * - on-surface-variant: #666666 (medium gray)
 * - border: #e0e0e0 (light gray)
 * - tab-active: #000000 (black)
 * - tab-inactive: #999999 (gray)
 * - error: #000000 (black)
 * - warning: #444444 (dark gray)
 * - success: #222222 (very dark gray)
 * - info: #555555 (dark gray)
 * - on-primary: #ffffff (white)
 * - on-secondary: #ffffff (white)
 * - on-error: #ffffff (white)
 * - disabled: #cccccc (light gray)
 * - on-disabled: #999999 (gray)
 * - outline: #d0d0d0 (light gray)
 * - shadow: #000000 (black)
 * 
 * Dark theme hex colors (Monochrome):
 * - primary: #ffffff (white)
 * - secondary: #cccccc (light gray)
 * - background: #000000 (black)
 * - surface: #111111 (very dark gray)
 * - surface-variant: #222222 (dark gray)
 * - on-background: #ffffff (white)
 * - on-surface: #ffffff (white)
 * - on-surface-variant: #cccccc (light gray)
 * - border: #333333 (dark gray)
 * - tab-active: #ffffff (white)
 * - tab-inactive: #666666 (medium gray)
 * - error: #ffffff (white)
 * - warning: #bbbbbb (light gray)
 * - success: #dddddd (very light gray)
 * - info: #aaaaaa (gray)
 * - on-primary: #000000 (black)
 * - on-secondary: #000000 (black)
 * - on-error: #000000 (black)
 * - disabled: #444444 (dark gray)
 * - on-disabled: #666666 (medium gray)
 * - outline: #555555 (dark gray)
 * - shadow: #000000 (black)
 */
export const colorDefinitions: ColorDefinitions = {
  light: {
    "--color-primary": "0 0 0",
    "--color-secondary": "51 51 51",
    "--color-background": "255 255 255",
    "--color-surface": "250 250 250",
    "--color-surface-variant": "245 245 245",
    "--color-on-background": "0 0 0",
    "--color-on-surface": "0 0 0",
    "--color-on-surface-variant": "102 102 102",
    "--color-border": "224 224 224",
    "--color-tab-active": "0 0 0",
    "--color-tab-inactive": "153 153 153",
    "--color-error": "0 0 0",
    "--color-warning": "68 68 68",
    "--color-success": "34 34 34",
    "--color-info": "85 85 85",
    "--color-on-primary": "255 255 255",
    "--color-on-secondary": "255 255 255",
    "--color-on-error": "255 255 255",
    "--color-disabled": "204 204 204",
    "--color-on-disabled": "153 153 153",
    "--color-outline": "208 208 208",
    "--color-shadow": "0 0 0",
  },
  dark: {
    "--color-primary": "255 255 255",
    "--color-secondary": "204 204 204",
    "--color-background": "0 0 0",
    "--color-surface": "17 17 17",
    "--color-surface-variant": "34 34 34",
    "--color-on-background": "255 255 255",
    "--color-on-surface": "255 255 255",
    "--color-on-surface-variant": "204 204 204",
    "--color-border": "51 51 51",
    "--color-tab-active": "255 255 255",
    "--color-tab-inactive": "102 102 102",
    "--color-error": "255 255 255",
    "--color-warning": "187 187 187",
    "--color-success": "221 221 221",
    "--color-info": "170 170 170",
    "--color-on-primary": "0 0 0",
    "--color-on-secondary": "0 0 0",
    "--color-on-error": "0 0 0",
    "--color-disabled": "68 68 68",
    "--color-on-disabled": "102 102 102",
    "--color-outline": "85 85 85",
    "--color-shadow": "0 0 0",
  },
};

export const themes = {
  light: vars(colorDefinitions.light),
  dark: vars(colorDefinitions.dark),
};