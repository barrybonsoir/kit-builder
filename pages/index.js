// ... (keep imports and countries list)

  const drawShatteredShard = (ctx, img, x, y, size, rotation, shapeType, wandSeed, internalScale) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.beginPath();
    const shardBase = size / 2.8; 
    
    // VARIETY: Using randomized geometric masks for every individual shard
    if (shapeType === 'triangle') {
      ctx.moveTo(0, 0);
      ctx.lineTo(shardBase, -shardBase / 4); 
      ctx.lineTo(shardBase, shardBase / 4);
    } else if (shapeType === 'slant') {
      ctx.rect(shardBase / 2, -shardBase / 12, shardBase * 0.7, shardBase / 10);
    } else if (shapeType === 'circle') {
      ctx.arc(shardBase * 0.7, 0, shardBase / 6, 0, Math.PI * 2);
    } else {
      // Very narrow 6-degree wedge for maximum negative space (black gaps)
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2, -3 * Math.PI / 180, 3 * Math.PI / 180);
    }
    ctx.closePath();
    ctx.clip();

    // RANDOM CROP: Subtle internal shift to ensure we catch different edges of the logo
    // This creates the "shattered" look without losing resolution.
    const cropShiftX = (Math.random() - 0.5) * (size * 0.2);
    const cropShiftY = (Math.random() - 0.5) * (size * 0.2);
    
    ctx.rotate(wandSeed * Math.PI / 180);
    const finalDrawSize = size * internalScale; 
    
    ctx.drawImage(img, (-finalDrawSize / 2) + cropShiftX, (-finalDrawSize / 2) + cropShiftY, finalDrawSize, finalDrawSize);
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

    // 14 Layers for a dense but sharp build
    for (let l = 0; l < 14; l++) {
      const folds = [12, 16, 24, 32, 48][Math.floor(Math.random() * 5)];
      const layerScale = 0.2 + (Math.random() * 0.8);
      
      // Internal scale remains between 0.4 and 1.0 to keep it sharp
      const internalScale = 0.4 + (Math.random() * 0.6);

      for (let i = 0; i < folds; i++) {
        // MIX LOGIC: Every individual shard can be a different logo from your 4 picks
        const randomImg = imgs[Math.floor(Math.random() * imgs.length)];
        
        // MIX SHAPE: Every shard in the ring can be a different geometric mask
        const randomShape = shapePalette[Math.floor(Math.random() * shapePalette.length)];
        
        const individualWand = Math.random() * 360;

        drawShatteredShard(
          ctx, 
          randomImg, 
          center, 
          center, 
          size * layerScale, 
          i * (360/folds), 
          randomShape, 
          individualWand, 
          internalScale
        );
      }
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };

// ... (keep return/UI logic)
