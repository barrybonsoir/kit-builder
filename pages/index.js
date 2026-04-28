// ... (Keep existing imports and country list)

  const drawVariableShard = (ctx, img, x, y, size, rotation, shapeType, wandSeed, cropScale) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.beginPath();
    const shardSize = size / 2.3;
    if (shapeType === 'triangle') {
      ctx.moveTo(0, 0);
      ctx.lineTo(shardSize, -shardSize / 2.1);
      ctx.lineTo(shardSize, shardSize / 2.1);
    } else if (shapeType === 'slant') {
      ctx.rect(shardSize / 4, -shardSize / 8, shardSize * 1.3, shardSize / 4);
    } else if (shapeType === 'circle') {
      ctx.arc(shardSize, 0, shardSize / 3, 0, Math.PI * 2);
    } else {
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 1.7, -7.5 * Math.PI / 180, 7.5 * Math.PI / 180);
    }
    ctx.closePath();
    ctx.clip();

    ctx.rotate(wandSeed * Math.PI / 180);
    
    // DYNAMIC CROP LOGIC:
    // cropScale of 1.0 = Full logo visible in shard
    // cropScale of 4.0 = Extreme zoom/severe crop (colorful shapes)
    const finalDrawSize = size * cropScale;

    ctx.drawImage(img, -finalDrawSize / 2, -finalDrawSize / 2, finalDrawSize, finalDrawSize);
    ctx.restore();
  };

  const generateMark = async () => {
    // ... (Existing canvas setup and image loading)

    for (let l = 0; l < 12; l++) { // Increased to 12 layers for more density
      const folds = [8, 12, 16, 24, 32][Math.floor(Math.random() * 5)];
      const layerShape = shapePalette[Math.floor(Math.random() * shapePalette.length)];
      const layerScale = 0.2 + (Math.random() * 0.8);
      const layerWand = Math.random() * 360;
      
      // Randomly pick a "Zoom" for this specific layer
      // 50% chance of high-detail (1.0-1.5) vs 50% chance of abstract-crop (2.5-5.0)
      const layerCropZoom = Math.random() > 0.5 
        ? 1.0 + Math.random() * 0.5 
        : 2.5 + Math.random() * 2.5;

      const layerImg = imgs[Math.floor(Math.random() * 4)];

      for (let i = 0; i < folds; i++) {
        drawVariableShard(ctx, layerImg, center, center, size * layerScale, i * (360 / folds), layerShape, layerWand, layerCropZoom);
      }
    }
    // ... (Set image output)
  };
  