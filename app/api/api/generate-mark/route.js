export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';

export const dynamic = 'force-dynamic'; // Prevents build-time crashes

export async function POST(req) {
  try {
    const { selections } = await req.json();
    const size = 1024;
    const center = size / 2;

    const processedWedges = await Promise.all(selections.map(async (country, i) => {
      const fileName = `${country.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      const filePath = path.join(process.cwd(), 'public', 'logos', fileName);
      
      // 1. Create a 22.5 degree wedge mask via SVG
      const startAngle = 0; 
      const endAngle = 22.5;
      const radStart = (startAngle * Math.PI) / 180;
      const radEnd = (endAngle * Math.PI) / 180;
      
      const x1 = center + center * Math.cos(radStart);
      const y1 = center + center * Math.sin(radStart);
      const x2 = center + center * Math.cos(radEnd);
      const y2 = center + center * Math.sin(radEnd);

      const svgMask = Buffer.from(`
        <svg width="${size}" height="${size}">
          <path d="M ${center} ${center} L ${x1} ${y1} A ${center} ${center} 0 0 1 ${x2} ${y2} Z" fill="white" />
        </svg>
      `);

      // 2. Randomly rotate the SOURCE image so we sample a different part of the logo
      const randomRotate = Math.floor(Math.random() * 360);

      return sharp(filePath)
        .resize(size, size)
        .rotate(randomRotate)
        .composite([{ input: svgMask, blend: 'dest-in' }])
        .toBuffer();
    }));

    // 3. Assemble the Quadrant (90 degrees)
    const quad = await sharp({
      create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
    })
    .composite(processedWedges.map((w, i) => ({
      input: w,
      blend: 'over',
      // Stack the 22.5 degree wedges side-by-side
      gravity: 'centre',
      rotate: i * 22.5 
    })))
    .png()
    .toBuffer();

    // 4. Mirror logic: 90 -> 180 -> 360
    const topHalf = await sharp(quad)
      .composite([{ input: await sharp(quad).flop().toBuffer(), blend: 'over' }])
      .toBuffer();

    const fullCircle = await sharp(topHalf)
      .composite([{ input: await sharp(topHalf).flip().toBuffer(), blend: 'over' }])
      .toBuffer();

    return NextResponse.json({ image: `data:image/png;base64,${fullCircle.toString('base64')}` });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}