const generateMark = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 1024;
    const center = size / 2;

    // ... (keep img loading logic)

    const shapePalette = ['shield', 'arcRing', 'teardrop', 'wedge'];
    ctx.clearRect(0, 0, size, size);

    // FIXED DEPTH: 12 Layers total
    for (let l = 0; l < 12; l++) {
      // 1. GUARANTEED REPRESENTATION: 
      // Force layers 0-3 to use each of the 4 selected images
      const layerImg = l < 4 ? imgs[l] : imgs[Math.floor(Math.random() * 4)];
      
      // 2. BADGE SYMMETRY:
      // Lower fold counts (6, 8, 12) for the first 8 layers ensure it "rules"
      const folds = l < 8 ? [6, 8, 12][Math.floor(Math.random() * 3)] : [16, 24, 32][Math.floor(Math.random() * 3)];
      
      const layerScale = 0.2 + (l * 0.06);
      const layerShape = shapePalette[Math.floor(Math.random() * shapePalette.length)];
      const layerWand = Math.random() * 360;
      
      // 3. LEGIBILITY CROP:
      // Picking a specific detail once per layer to mirror perfectly
      const cropX = (Math.random() - 0.5) * (size * 0.3);
      const cropY = (Math.random() - 0.5) * (size * 0.3);

      for (let i = 0; i < folds; i++) {
        drawEmblemShard(ctx, layerImg, center, center, size * layerScale, i * (360/folds), layerShape, layerWand, 0.9, cropX, cropY);
      }
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };