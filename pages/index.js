// ... (keep countries and basic setup)

  const drawEmblemShard = (ctx, img, x, y, size, rotation, shapeType, wandSeed, scale, cX, cY) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.beginPath();
    const shardBase = size / 3; 
    
    // NEW: Curvilinear Geometry Library
    if (shapeType === 'circle') {
      ctx.arc(shardBase * 0.7, 0, shardBase / 6, 0, Math.PI * 2);
    } else if (shapeType === 'pill') {
      // Rounded pill shape for a softer interlocking look
      ctx.roundRect(shardBase / 2, -shardBase / 10, shardBase * 0.8, shardBase / 5, 20);
    } else if (shapeType === 'ring') {
      // Hollow ring segment
      ctx.arc(0, 0, shardBase * 1.1, -5 * Math.PI / 180, 5 * Math.PI / 180);
      ctx.lineTo(shardBase * 0.8 * Math.cos(5 * Math.PI / 180), 5 * Math.PI / 180);
      ctx.arc(0, 0, shardBase * 0.8, 5 * Math.PI / 180, -5 * Math.PI / 180, true);
    } else if (shapeType === 'arcWedge') {
      // Wide curved plate
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2.5, -15 * Math.PI / 180, 15 * Math.PI / 180);
    } else {
      // Classic Wedge (for structure)
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2, -3 * Math.PI / 180, 3 * Math.PI / 180);
    }
    ctx.closePath();
    ctx.clip();

    ctx.rotate(wandSeed * Math.PI / 180);
    const finalDrawSize = size * scale; 
    ctx.drawImage(img, (-finalDrawSize / 2) + cX, (-finalDrawSize / 2) + cY, finalDrawSize, finalDrawSize);
    ctx.restore();
  };

  const generateMark = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 1024;
    const center = size / 2;

    // ... (keep image loading logic)

    const shapePalette = ['circle', 'pill', 'ring', 'arcWedge', 'wedge'];
    ctx.clearRect(0, 0, size, size);

    // Layer Architecture
    for (let l = 0; l < 15; l++) {
      // Alternate between high-count rings and low-count structural "plates"
      const folds = l % 2 === 0 ? [16, 24, 32][Math.floor(Math.random() * 3)] : [6, 8, 12][Math.floor(Math.random() * 3)];
      const layerScale = 0.1 + (Math.random() * 0.9);
      
      const layerImg = imgs[Math.floor(Math.random() * imgs.length)];
      const layerShape = shapePalette[Math.floor(Math.random() * shapePalette.length)];
      const layerWand = Math.random() * 360;
      const internalScale = 0.5 + (Math.random() * 0.5);
      
      const cropX = (Math.random() - 0.5) * (size * 0.3);
      const cropY = (Math.random() - 0.5) * (size * 0.3);

      for (let i = 0; i < folds; i++) {
        drawEmblemShard(ctx, layerImg, center, center, size * layerScale, i * (360/folds), layerShape, layerWand, internalScale, cropX, cropY);
      }
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };
// ... (keep return/UI logic)