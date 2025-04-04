export const performanceMonitor = {
    fps: {
      value: 0,
      samples: [],
      lastCalculated: 0
    },
    
    // Initialize the monitor
    init() {
      this.fpsElement = document.createElement('div');
      this.fpsElement.style.position = 'fixed';
      this.fpsElement.style.top = '10px';
      this.fpsElement.style.right = '10px';
      this.fpsElement.style.background = 'rgba(0, 0, 0, 0.5)';
      this.fpsElement.style.color = '#fff';
      this.fpsElement.style.padding = '5px 10px';
      this.fpsElement.style.borderRadius = '5px';
      this.fpsElement.style.fontSize = '12px';
      this.fpsElement.style.fontFamily = 'monospace';
      this.fpsElement.style.zIndex = '9999';
      document.body.appendChild(this.fpsElement);
      
      let lastTime = performance.now();
      
      const update = () => {
        const time = performance.now();
        const delta = time - lastTime;
        lastTime = time;
        
        // Calculate FPS
        const fps = 1000 / delta;
        this.fps.samples.push(fps);
        
        // Limit samples array to prevent memory issues
        if (this.fps.samples.length > 60) {
          this.fps.samples.shift();
        }
        
        // Update FPS every 500ms
        if (time - this.fps.lastCalculated > 500) {
          // Calculate average FPS
          const average = this.fps.samples.reduce((a, b) => a + b, 0) / this.fps.samples.length;
          this.fps.value = Math.round(average);
          this.fps.lastCalculated = time;
          
          // Update display
          this.fpsElement.textContent = `FPS: ${this.fps.value}`;
          
          // Color code based on performance
          if (this.fps.value > 50) {
            this.fpsElement.style.color = '#00ff00';
          } else if (this.fps.value > 30) {
            this.fpsElement.style.color = '#ffff00';
          } else {
            this.fpsElement.style.color = '#ff0000';
          }
        }
        
        requestAnimationFrame(update);
      };
      
      requestAnimationFrame(update);
    },
    
    // Get current performance metrics
    getMetrics() {
      return {
        fps: this.fps.value
      };
    }
  };