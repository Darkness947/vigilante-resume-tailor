import { Font } from '@react-pdf/renderer';
import path from 'path';

let fontsRegistered = false;

export function registerAllFonts() {
  if (fontsRegistered) return;
  
  const fontsDir = path.join(process.cwd(), 'public/fonts');
  
  Font.register({
    family: 'Inter',
    fonts: [
      { src: path.join(fontsDir, 'Inter-400.ttf'), fontWeight: 'normal' },
      { src: path.join(fontsDir, 'Inter-Bold.ttf'), fontWeight: 'bold' }
    ]
  });

  Font.register({
    family: 'Cairo',
    fonts: [
      { src: path.join(fontsDir, 'Cairo-400.ttf'), fontWeight: 'normal' },
      { src: path.join(fontsDir, 'Cairo-Bold.ttf'), fontWeight: 'bold' }
    ]
  });
  
  fontsRegistered = true;
}
