import fs from 'fs';
import { formatHex, formatRgb, parse } from 'culori';

const cssPath = 'src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(/oklch\([^)]+\)/g, (match) => {
  try {
    const c = parse(match);
    if (!c) return match;
    const rgb = formatRgb(c);
    return rgb;
  } catch (e) {
    return match;
  }
});

fs.writeFileSync(cssPath, css);
console.log('Converted OKLCH to RGB');
