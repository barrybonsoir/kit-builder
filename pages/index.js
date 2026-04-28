import React, { useState, useRef } from 'react';
import Head from 'next/head';

// ... (keep countries list)

export default function Home() {
  // ... (keep state/refs)

  const drawEmblemShard = (ctx, img, x, y, size, rotation, shapeType, wandSeed, scale, cX, cY) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.beginPath();
    const shardBase = size / 2.8; 
    
    // REFINED GEOMETRY: Larger shapes for "Emblem" feel
    if (shapeType === 'shield') {
      // Creates a high-end badge look
      ctx.moveTo(shardBase * 0.5, -shardBase / 3);
      ctx.lineTo(shardBase * 1.2, -shardBase / 3);
      ctx.quadraticCurveTo(shardBase * 1.3, 0, shardBase * 1.2, shardBase / 3);
      ctx.lineTo(shardBase * 0.5, shardBase / 3);
      ctx.quadraticCurveTo(shardBase * 0.4, 0, shardBase * 0.5, -shardBase / 3);
    } else if (shapeType === 'bigArc') {
      // Large structural rings with gaps
      ctx.arc(0, 0, shardBase * 1.2, -8 * Math.PI / 180, 8 * Math.PI / 180);
      ctx.arc(0, 0, shardBase * 0.9, 8 * Math.PI / 180, -8 * Math.PI / 180, true);
    } else if (shapeType === 'teardrop') {
      ctx.moveTo(shardBase * 0.4, 0);
      ctx.bezierCurveTo(shardBase, -shardBase/2, shardBase * 1.5, -shardBase/4, shardBase * 1.5, 0);
      ctx.bezierCurveTo(shardBase * 1.5, shardBase/4, shardBase, shardBase/2, shardBase * 0.4, 0);
    } else {
      // Very thin structural wedge to preserve negative space
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2, -1.5 * Math.PI / 180, 1.5 * Math.PI / 180);
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

    // ... (keep img loader)

    const shapePalette = ['shield', 'bigArc', 'teardrop', 'wedge'];
    ctx.clearRect(0, 0, size, size);

    // DEPTH: Reduced to 8-10 layers to allow more black background to breathe
    for (let l = 0; l < 9; l++) {
      // Lower fold counts (6, 8, 12) make it look like a badge, not a firework
      const folds = [6, 8, 12, 16][Math.floor(Math.random() * 4)];
      const layerScale = 0.2 + (l * 0.08) + (Math.random() * 0.1);
      
      const layerImg = imgs[Math.floor(Math.random() * imgs.length)];
      const layerShape = shapePalette[Math.floor(Math.random() * shapePalette.length)];
      const layerWand = Math.random() * 360;
      
      // Random Crop: Picking one specific aesthetic "beat" for the whole ring
      const cropX = (Math.random() - 0.5) * (size * 0.4);
      const cropY = (Math.random() - 0.5) * (size * 0.4);

      for (let i = 0; i < folds; i++) {
        drawEmblemShard(ctx, layerImg, center, center, size * layerScale, i * (360/folds), layerShape, layerWand, 0.8, cropX, cropY);
      }
    }

    setGeneratedImg(canvas.toDataURL('image/png'));
  };

  // ... (keep return UI)