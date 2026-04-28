const generateMark = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 1024;
    const center = size / 2;

    // ... (keep loadImg logic)

    try {
      const imgs = await Promise.all(selections.map(s => 
        loadImg(`/logos/${s.name.toLowerCase().replace(/\s+/g, '-')}.png`)
      ));

      const shapePalette = ['shield', 'arcRing', 'teardrop', 'wedge'];
      ctx.clearRect(0, 0, size, size);

      // MANDATORY REPRESENTATION: 12 Layers total
      for (let l = 0; l < 12; l++) {
        // Step 1: Force first 4 layers to use each selection 1:1
        const layerImg = l < 4 ? imgs[l] : imgs[Math.floor(Math.random() * 4)];
        
        // Step 2: "Ruler" Symmetry - keep fold counts low for legibility
        // The version that "rules" (image_ee2178.jpg) uses 6-8 folds.
        const folds = l < 8 ? [6, 8, 12][Math.floor(Math.random() * 3)] : [16, 24, 32][Math.floor(Math.random() * 3)];
        
        // Step 3: Structured Nesting - ensure logos don't overlap perfectly
        const layerScale = 0.25 + (l * 0.055); 
        const layerShape = shapePalette[Math.floor(Math.random() * shapePalette.length)];
        const layerWand = Math.random() * 360;
        
        // Step 4: Symmetrical Detail Lock
        const cropX = (Math.random() - 0.5) * (size * 0.3);
        const cropY = (Math.random() - 0.5) * (size * 0.3);

        for (let i = 0; i < folds; i++) {
          drawEmblemShard(ctx, layerImg, center, center, size * layerScale, i * (360/folds), layerShape, layerWand, 0.9, cropX, cropY);
        }
      }

      setGeneratedImg(canvas.toDataURL('image/png'));
    } catch (e) {
      console.error("Synthesis failed:", e);
    }
  };