// Gera as versões web (WebP) dos arquivos originais em assets-source/ para public/assets/.
// Não altera as fotos: apenas recodifica (mesma resolução) e, para a logo manuscrita,
// deriva um canal alfa a partir do contraste traço/fundo (mesmo desenho, sem redesenhar).
// A pasta assets-source/restrito NUNCA é processada nem copiada para public/.
import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve('assets-source');
const OUT = path.resolve('public/assets');

const photos = [
  'clinica/recepcao_principal_hero',
  'clinica/recepcao_ambiente_02',
  'clinica/consultorio_03',
  'doutores/adan_procedimento',
  'doutores/adan_retrato',
  'doutores/bruna_procedimento',
  'doutores/bruna_retrato',
  'tratamentos/01_protese_protocolo',
  'tratamentos/02_implante_dentario',
  'tratamentos/03_ortodontia_convencional',
  'tratamentos/04_alinhadores',
  'tratamentos/05_tratamento_de_canal',
  'tratamentos/06_harmonizacao_orofacial',
  'tratamentos/07_lipo_de_papada',
  'tratamentos/08_clinico_geral',
];

async function ensure(dir) {
  await mkdir(dir, { recursive: true });
}

for (const name of photos) {
  const input = path.join(SRC, `${name}.png`);
  const output = path.join(OUT, `${name}.webp`);
  await ensure(path.dirname(output));
  const info = await sharp(input).webp({ quality: 84, effort: 5 }).toFile(output);
  console.log(`${name}.webp ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`);
}

// Marca: originais preservados como PNG.
await ensure(path.join(OUT, 'marca'));
for (const file of ['logo_principal_manuscrita.png', 'logo_secundaria_dente_dourado.png', 'marca_dagua_or7_original.png']) {
  await copyFile(path.join(SRC, 'marca', file), path.join(OUT, 'marca', file));
}

// Logo manuscrita: alfa derivado (traço creme sobre fundo taupe) e recorte nos limites do desenho.
{
  const input = path.join(SRC, 'marca/logo_principal_manuscrita.png');
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const lum = (i) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  // Fundo: média dos cantos. Traço: percentil alto de luminância.
  let bg = 0;
  const corners = [0, width - 1, (height - 1) * width, height * width - 1];
  for (const c of corners) bg += lum(c * 3);
  bg /= corners.length;
  const values = [];
  for (let p = 0; p < width * height; p += 7) values.push(lum(p * 3));
  values.sort((a, b) => a - b);
  const fg = values[Math.floor(values.length * 0.995)];
  const lo = bg + (fg - bg) * 0.12;
  const hi = bg + (fg - bg) * 0.85;
  const out = Buffer.alloc(width * height * 4);
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      const a = Math.max(0, Math.min(1, (lum(p * 3) - lo) / (hi - lo)));
      out[p * 4] = 255;
      out[p * 4 + 1] = 255;
      out[p * 4 + 2] = 255;
      out[p * 4 + 3] = Math.round(a * 255);
      if (a > 0.25) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  const pad = 6;
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const w = Math.min(width, maxX + pad) - left;
  const h = Math.min(height, maxY + pad) - top;
  const res = await sharp(out, { raw: { width, height, channels: 4 } })
    .extract({ left, top, width: w, height: h })
    .png()
    .toFile(path.join(OUT, 'marca/logo_principal_alpha.png'));
  console.log(`logo_principal_alpha.png ${res.width}x${res.height} (bg ${bg.toFixed(0)}, fg ${fg.toFixed(0)})`);
}

// Favicon: recorte do símbolo (dente) da marca secundária, sem redesenho.
{
  const input = path.join(SRC, 'marca/logo_secundaria_dente_dourado.png');
  const meta = await sharp(input).metadata();
  const left = Math.round(meta.width * 0.47);
  const top = 0;
  const size = Math.min(meta.width - left, meta.height);
  // Cobre o final da palavra "Implantes" que invade o recorte do símbolo.
  const cover = await sharp({
    create: { width: Math.round(meta.width * 0.63) - left, height: meta.height - 370, channels: 3, background: '#ffffff' },
  }).png().toBuffer();
  const base = await sharp(input).flatten({ background: '#ffffff' }).composite([{ input: cover, left, top: 370 }]).png().toBuffer();
  await sharp(base)
    .extract({ left, top, width: size, height: size })
    .flatten({ background: '#FFF3E7' })
    .resize(192, 192, { fit: 'contain', background: '#FFF3E7' })
    .png()
    .toFile(path.resolve('public/favicon.png'));
  console.log('favicon.png 192x192');
}
