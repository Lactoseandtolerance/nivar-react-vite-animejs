export const smartThrottle = {
    // Default levels of detail (high, medium, low)
    detailLevels: {
      high: {
        starCount: 500,
        nebulaBlur: 30,
        particleEmissionRate: 50,
        useBlur: true,
        useTransparentEffects: true
      },
      medium: {
        starCount: 300,
        nebulaBlur: 20,
        particleEmissionRate: 30,
        useBlur: true,
        useTransparentEffects: true
      },
      low: {
        starCount: 150,
        nebulaBlur: 10,
        particleEmissionRate: 15,
        useBlur: false,
        useTransparentEffects: false
      }
    },
    
    // Current level of detail
    currentLevel: 'high',
    
    // Update level of detail based on FPS
    updateDetailLevel(fps) {
      if (fps < 30) {
        this.currentLevel = 'low';
      } else if (fps < 50) {
        this.currentLevel = 'medium';
      } else {
        this.currentLevel = 'high';
      }
      
      return this.detailLevels[this.currentLevel];
    },
    
    // Get current settings
    getSettings() {
      return this.detailLevels[this.currentLevel];
    }
  };
  
  // Example usage in ScrollStarBackground.jsx
  import { useAnimationFrame } from '../hooks/useAnimationFrame';
  import { performanceMonitor, smartThrottle } from '../utils/optimizations';
  
  // Inside the component:
  const [settings, setSettings] = useState(smartThrottle.getSettings());
  
  // Initialize performance monitoring in development only
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      performanceMonitor.init();
    }
  }, []);
  
  // Monitor performance and adjust settings
  useAnimationFrame((deltaTime) => {
    if (process.env.NODE_ENV === 'development') {
      // Check every second
      accumulator += deltaTime;
      if (accumulator > 1) {
        accumulator = 0;
        const fps = performanceMonitor.getMetrics().fps;
        const newSettings = smartThrottle.updateDetailLevel(fps);
        setSettings(newSettings);
      }
    }
  });
  
  // Apply settings to the star field
  useEffect(() => {
    // Create appropriate number of stars based on settings
    const smallStars = createStars(settings.starCount * 0.6, 1, 2, ['#FFFFFF', '#E0E0E0', '#CCCCCC']);
    const mediumStars = createStars(settings.starCount * 0.3, 2, 3, ['#FFFFFF', '#D4AF37', '#87CEEB']);
    const largeStars = createStars(settings.starCount * 0.1, 3, 5, ['#FFFFFF', '#D4AF37', '#4169E1']);
    
    starsRef.current = [...smallStars, ...mediumStars, ...largeStars];
    
    // Adjust nebula blur
    const nebulae = document.querySelectorAll('.nebula');
    nebulae.forEach(nebula => {
      nebula.style.filter = `blur(${settings.nebulaBlur}px)`;
    });
    
    // Toggle blur effects for better performance
    if (!settings.useBlur) {
      document.querySelectorAll('.blur-effect').forEach(el => {
        el.style.backdropFilter = 'none';
      });
    }
  }, [settings]);