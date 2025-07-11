export interface ColorTheme {
  background: string;
  panel: string;
  button: string;
  buttonText: string;
  buttonHover: string;
  buttonBorder: string;
  badgeBg: string;
  useBackgroundImage: boolean;
}

export const DEFAULT_THEME: ColorTheme = {
  background: '#e5d0b9',
  panel: '#FEF9F4',
  button: '#95B3D2',
  buttonText: '#ffffff',
  buttonHover: '#7A9CC2',
  buttonBorder: '#95B3D2',
  badgeBg: '#f7f4f0',
  useBackgroundImage: true
};