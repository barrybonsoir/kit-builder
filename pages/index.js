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

    // Load exactly 4 unique images
    const imgs = await Promise.all(selections.map(s => 
      loadImg(`/logos/${s.name.toLowerCase().replace(/\s+/g, '-')}.png`)
    ));

    ctx.clearRect(0, 0, size, size);

    // LAYER 1: Logo 0 (Structural Base - 8-fold)
    const wand1 = Math.random() * 360;
    const scale1 = 0.85 + Math.random() * 0.15;
    for (let i = 0; i < 8; i++) {
      drawShard(ctx, imgs[0], center, center, size * scale1, i * 45, 45, wand1, i % 2 === 0);
    }

    // LAYER 2: Logo 1 (Accented Chaos - 4 or 6-fold stickers)
    const stickers = Math.random() > 0.5 ? 4 : 6;
    const stickerScale = 0.45 + Math.random() * 0.2;
    const wand2 = Math.random() * 360;
    for (let i = 0; i < stickers; i++) {
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate((i * (360 / stickers)) * Math.PI / 180);
      ctx.translate(size * 0.22, 0); // Radial offset
      ctx.rotate((Math.random() * 40 - 20) * Math.PI / 180); // Offset rotation
      const s = size * stickerScale;
      ctx.rotate(wand2 * Math.PI / 180);
      ctx.drawImage(imgs[1], -s/2, -s/2, s, s);
      ctx.restore();
    }

    // LAYER 3: Logo 2 & 3 (Central Multi-Fold Cluster)
    // We mix Logo 2 and 3 here to ensure all 4 are visible
    const clusterFolds = 12;
    for (let i = 0; i < clusterFolds; i++) {
      const sourceImg = i % 2 === 0 ? imgs[2] : imgs[3];
      const wandSeed = (Math.random() * 360);
      drawShard(ctx, sourceImg, center, center, size * 0.35, i * (360/clusterFolds), 30, wandSeed, false);
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };