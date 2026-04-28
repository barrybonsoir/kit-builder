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

    // Load the 4 selected images
    const imgs = await Promise.all(selections.map(s => 
      loadImg(`/logos/${s.name.toLowerCase().replace(/\s+/g, '-')}.png`)
    ));

    // Helper: Grab a random logo from the four selected
    const getRandomLogo = () => imgs[Math.floor(Math.random() * 4)];

    ctx.clearRect(0, 0, size, size);

    // LAYER 1: Structural Ring (Strict Symmetry - 8-fold)
    // Every wedge is now a random logo from the 4.
    const wand1 = Math.random() * 360;
    const scale1 = 0.85 + Math.random() * 0.15;
    for (let i = 0; i < 8; i++) {
      drawShard(ctx, getRandomLogo(), center, center, size * scale1, i * 45, 45, wand1, i % 2 === 0);
    }

    // LAYER 2: Radical Stickers (Accented Chaos - 4-fold stickers)
    // Every 'sticker' is now a random logo from the 4.
    const wand2 = Math.random() * 360;
    const stickerScale = 0.5 + Math.random() * 0.2;
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate((i * 90 + 45) * Math.PI / 180);
      
      // Random offset rotation (Tier 4)
      const offsetRotation = (Math.random() * 30 - 15);
      ctx.rotate(offsetRotation * Math.PI / 180);
      
      // Random positional offset (Make it messy)
      ctx.translate(size * (0.2 + Math.random() * 0.08), 0);
      
      const s = size * stickerScale;
      // Wand Seed (Rotate source internally)
      ctx.rotate(wand2 * Math.PI / 180);
      
      ctx.drawImage(getRandomLogo(), -s/2, -s/2, s, s);
      ctx.restore();
    }

    // LAYER 3: Central Cluster (High Complexity - 12, 16, or 24 fold)
    // Every intricate shard is now a random logo. Total clash.
    const clusterFolds = [12, 16, 24][Math.floor(Math.random() * 3)]; // Randomized high frequency
    const clusterScale = 0.35 + Math.random() * 0.1;
    for (let i = 0; i < clusterFolds; i++) {
      const sourceImg = getRandomLogo();
      const wandSeed = (Math.random() * 360); // Each shard is a different random "bite"
      drawShard(ctx, sourceImg, center, center, size * clusterScale, i * (360/clusterFolds), 360/clusterFolds, wandSeed, false);
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };