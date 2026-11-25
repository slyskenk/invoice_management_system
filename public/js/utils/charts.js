// Zero-dependency Canvas Charting Utility
const ChartRenderer = {
  drawThroughputChart(canvasId, dataPoints = []) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = 140;

    ctx.clearRect(0, 0, width, height);

    if (dataPoints.length === 0) {
      dataPoints = [12, 18, 15, 26, 32, 28, 45, 52, 48, 62, 58, 70, 65, 82, 78, 88, 92, 85, 96, 94];
    }

    const maxVal = Math.max(...dataPoints, 100);
    const minVal = 0;
    const stepX = width / (dataPoints.length - 1);

    // Create Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

    // Path
    ctx.beginPath();
    dataPoints.forEach((val, i) => {
      const x = i * stepX;
      const y = height - ((val - minVal) / (maxVal - minVal)) * (height - 30) - 15;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const prevX = (i - 1) * stepX;
        const prevY = height - ((dataPoints[i - 1] - minVal) / (maxVal - minVal)) * (height - 30) - 15;
        const cpX1 = prevX + (x - prevX) / 2;
        const cpX2 = prevX + (x - prevX) / 2;
        ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y);
      }
    });

    // Stroke line
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Accent dot at last point
    const lastX = width;
    const lastY = height - ((dataPoints[dataPoints.length - 1] - minVal) / (maxVal - minVal)) * (height - 30) - 15;
    ctx.beginPath();
    ctx.arc(lastX - 2, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#06B6D4';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
};

window.ChartRenderer = ChartRenderer;
