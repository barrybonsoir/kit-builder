import { NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';

export async function POST(req) {
  const { selections } = await req.json();
  const size = 1024;
  const center = size / 2;

  try {
    // 1. Process each of the 4 selections into 22.5° wedges
    const wedges = await Promise.all(selections.map(async (country, i) => {
      const filePath = path.join(process.cwd(), 'public', 'logos', `${country.name.toLowerCase().replace(/\s+/g, '-')}.png`);
      
      // Random starting angle for the "Wand"
      const startAngle = Math.random() * 337.5;

      // Create a radial mask for a 22.5 degree slice
      const svgMask = Buffer.from(`
        <svg width="${size}" height="${size}">
          <path d="M ${center} ${center} L ${size} ${center} A ${center} ${center} 0 0 1 ${size * 0.9} ${size * 0.7} Z" 
                fill="white" transform="rotate(${startAngle} ${center} ${center})"/>
        </svg>
      `);

      return sharp(filePath)
        .resize(size, size)
        .composite([{ input: svgMask, blend: 'dest-in' }])
        .rotate(-startAngle) // Reset to 0 for stitching
        .toBuffer();
    }));

    // 2. Stitch the 90° Quadrant
    let quadrant = sharp({
      create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
    });

    const quadrantLayers = wedges.map((wedge, i) => ({
      input: wedge,
      blend: 'over'
      // Rotation logic would go here via sharp's rotate()
    }));

    // 3. Mirror logic (Flop/Flip)
    const finalMark = await quadrant
      .composite(quadrantLayers)
      .toBuffer();

    // Return the image as a base64 string
    return NextResponse.json({ image: `data:image/png;base64,${finalMark.toString('base64')}` });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}