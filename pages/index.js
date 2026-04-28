// ... (Keep existing imports and country list)

  const drawMultiShapeShard = (ctx, img, x, y, size, rotation, shapeType, wandSeed, scaleFactor) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.beginPath();
    // Shard dimensions adjusted for native clarity
    const shardBase = size / 2.8; 
    
    if (shapeType === 'triangle') {
      ctx.moveTo(0, 0);
      ctx.lineTo(shardBase, -shardBase / 4); 
      ctx.lineTo(shardBase, shardBase / 4);
    } else if (shapeType === 'slant') {
      // Rectangular "blade" shape
      ctx.rect(shardBase / 2, -shardBase / 15, shardBase * 0.8, shardBase / 7);
    } else if (shapeType === 'circle') {
      // Circular "punch-out"
      ctx.arc(shardBase * 0.8, 0, shardBase / 5, 0, Math.PI * 2);
    } else {
      // Mechanical "Wedge" (10-degree)
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2, -5 * Math.PI / 180, 5 * Math.PI / 180);
    }
    ctx.closePath();
    ctx.clip();

    ctx.rotate(wandSeed * Math.PI / 180);
    
    // SCALE RULE: Randomly scaled between 0.4 and 1.1 
    // This allows for tiny, detailed logos and full-sized crisp marks
    const finalDrawSize = size * scaleFactor; 

    ctx.drawImage(img, -finalDrawSize / 2, -finalDrawSize / 2, finalDrawSize, finalDrawSize);
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

    const shapePalette = ['triangle', 'slant', 'circle', 'wedge'];
    ctx.clearRect(0, 0, size, size);

    // 16 Layers for high-density texture
    for (let l = 0; l < 16; l++) {
      const folds = [8, 12, 16, 24, 32][Math.floor(Math.random() * 5)];
      const layerShape = shapePalette[Math.floor(Math.random() * shapePalette.length)];
      const layerScale = 0.2 + (Math.random() * 0.8); // Radial distance from center
      const layerWand = Math.random() * 360;
      
      // Randomly scale the logo down (0.4 to 1.1)
      const internalScale = 0.4 + (Math.random() * 0.7);
      
      const layerImg = imgs[Math.floor(Math.random() * 4)];

      for (let i = 0; i < folds; i++) {
        drawMultiShapeShard(ctx, layerImg, center, center, size * layerScale, i * (360/folds), layerShape, layerWand, internalScale);
      }
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };

// ... (Keep return/UI logic)