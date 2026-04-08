import { Font } from '@react-pdf/renderer';
import path from 'path';

let fontsRegistered = false;

export function registerAllFonts() {
  if (fontsRegistered) return;
  
  const fontsDir = path.join(process.cwd(), 'public/fonts');
  
  Font.register({
    family: 'Inter',
    fonts: [
      { src: path.join(fontsDir, 'Inter-400.ttf'), fontWeight: 400, fontStyle: 'normal' },
      { src: path.join(fontsDir, 'Inter-400.ttf'), fontWeight: 400, fontStyle: 'italic' },
      { src: path.join(fontsDir, 'Inter-Bold.ttf'), fontWeight: 700, fontStyle: 'normal' },
      { src: path.join(fontsDir, 'Inter-Bold.ttf'), fontWeight: 700, fontStyle: 'italic' }
    ]
  });

  Font.register({
    family: 'Cairo',
    fonts: [
      { src: path.join(fontsDir, 'Cairo-400.ttf'), fontWeight: 400, fontStyle: 'normal' },
      { src: path.join(fontsDir, 'Cairo-400.ttf'), fontWeight: 400, fontStyle: 'italic' },
      { src: path.join(fontsDir, 'Cairo-Bold.ttf'), fontWeight: 700, fontStyle: 'normal' },
      { src: path.join(fontsDir, 'Cairo-Bold.ttf'), fontWeight: 700, fontStyle: 'italic' }
    ]
  });

  // Alias standard fonts to Inter to prevent react-pdf-html crashes
  const aliases = ['Arial', 'Helvetica', 'sans-serif', 'Times-Roman', 'Times New Roman'];
  aliases.forEach(alias => {
    Font.register({
      family: alias,
      fonts: [
        { src: path.join(fontsDir, 'Inter-400.ttf'), fontWeight: 400, fontStyle: 'normal' },
        { src: path.join(fontsDir, 'Inter-400.ttf'), fontWeight: 400, fontStyle: 'italic' },
        { src: path.join(fontsDir, 'Inter-Bold.ttf'), fontWeight: 700, fontStyle: 'normal' },
        { src: path.join(fontsDir, 'Inter-Bold.ttf'), fontWeight: 700, fontStyle: 'italic' }
      ]
    });
  });
  
  fontsRegistered = true;
}
