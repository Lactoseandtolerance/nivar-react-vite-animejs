export const optimizedImageLoader = {
    // Cache for loaded images
    cache: new Map(),
    
    // Preload important images
    preload(urls) {
      return Promise.all(
        urls.map(url => this.load(url))
      );
    },
    
    // Load single image with caching
    load(url) {
      // Return from cache if already loaded
      if (this.cache.has(url)) {
        return Promise.resolve(this.cache.get(url));
      }
      
      // Load new image
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          this.cache.set(url, img);
          resolve(img);
        };
        
        img.onerror = () => {
          reject(new Error(`Failed to load image: ${url}`));
        };
        
        img.src = url;
      });
    }
  };