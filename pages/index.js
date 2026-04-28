// NEW: Advanced Masking Logic
  const drawComplexMask = (ctx, img, x, y, size, rotation, maskType, wandSeed) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.beginPath();
    if (maskType === 'circle') {
      // Offset circle mask
      ctx.arc(size / 4, 0, size / 4, 0, Math.PI * 2);
    } else if (maskType === 'slant') {
      // Parallelogram / Sheared Box
      ctx.moveTo(0, -size/4);
      ctx.lineTo(size/2, -size/2);
      ctx.lineTo(size/2, size/2);
      ctx.lineTo(0, size/4);
    } else {
      // Classic 45-degree Wedge
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2, -22.5 * Math.PI / 180, 22.5 * Math.PI / 180);
    }
    ctx.closePath();
    ctx.clip();

    // Internal Wand Seed + Random XY Slide
    const offsetX = (Math.random() - 0.5) * (size / 2);
    const offsetY = (Math.random() - 0.5) * (size / 2);
    ctx.rotate(wandSeed * Math.PI / 180);
    ctx.drawImage(img, -size/2 + offsetX, -size/2 + offsetY, size, size);
    
    ctx.restore();
  };

  const generateMark = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 1024;
    const center = size / 2;

    const loadImg = (src) => new Promise((res) => {
      const img = new Image();
      img.onload = () => res(img);
      img.src = src;
    });

    const imgs = await Promise.all(selections.map(s => 
      loadImg(`/logos/${s.name.toLowerCase().replace(/\s+/g, '-')}.png`)
    ));

    const getRandomLogo = () => imgs[Math.floor(Math.random() * imgs.length)];

    ctx.clearRect(0, 0, size, size);

    // LAYER 1: The Outer Turbine (8-fold Slants)
    const wand1 = Math.random() * 360;
    for (let i = 0; i < 8; i++) {
      drawComplexMask(ctx, getRandomLogo(), center, center, size * 0.9, i * 45, 'slant', wand1);
    }

    // LAYER 2: The Sticker Layer (4-fold Full Overlap)
    // Keep this for that "messy sticker" vibe we liked
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate((i * 90 + (Math.random() * 20)) * Math.PI / 180);
      ctx.translate(size * 0.2, 0);
      const s = size * (0.4 + Math.random() * 0.2);
      ctx.rotate(Math.random() * 360 * Math.PI / 180);
      ctx.drawImage(getRandomLogo(), -s/2, -s/2, s, s);
      ctx.restore();
    }

    // LAYER 3: The Intricate Core (16-fold Circles)
    const wand3 = Math.random() * 360;
    for (let i = 0; i < 16; i++) {
      drawComplexMask(ctx, getRandomLogo(), center, center, size * 0.4, i * 22.5, 'circle', wand3 + (i * 10));
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };