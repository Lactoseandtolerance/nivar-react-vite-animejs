export const analytics = {
    // Initialize analytics
    init() {
      // Track page views
      this.trackPageView();
      
      // Track scroll depth
      this.trackScrollDepth();
      
      // Track section visibility
      this.trackSectionViews();
      
      // Track outbound links
      this.trackOutboundLinks();
      
      // Track user engagement time
      this.trackEngagementTime();
    },
    
    // Track page views
    trackPageView() {
      // Example using Google Analytics
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: window.location.pathname
        });
      }
      
      console.log('Page view tracked', {
        title: document.title,
        url: window.location.href,
        path: window.location.pathname
      });
    },
    
    // Track scroll depth
    trackScrollDepth() {
      const scrollDepths = [25, 50, 75, 100];
      let trackedDepths = [];
      
      window.addEventListener('scroll', () => {
        // Calculate scroll percentage
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollTop = window.scrollY;
        const scrollPercentage = Math.floor((scrollTop / scrollHeight) * 100);
        
        // Track when reaching certain depths
        scrollDepths.forEach(depth => {
          if (scrollPercentage >= depth && !trackedDepths.includes(depth)) {
            trackedDepths.push(depth);
            
            // Send to analytics
            if (window.gtag) {
              window.gtag('event', 'scroll_depth', {
                depth: depth + '%'
              });
            }
            
            console.log('Scroll depth tracked', { depth: depth + '%' });
          }
        });
      });
    },
    
    // Track section views
    trackSectionViews() {
      // Create an intersection observer
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            
            // Send to analytics
            if (window.gtag) {
              window.gtag('event', 'section_view', {
                section_id: sectionId
              });
            }
            
            console.log('Section view tracked', { sectionId });
          }
        });
      }, { threshold: 0.5 });
      
      // Observe all sections
      document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
      });
    },
    
    // Track outbound links
    trackOutboundLinks() {
      document.addEventListener('click', (event) => {
        // Check if clicked element is a link
        const link = event.target.closest('a');
        if (!link) return;
        
        // Check if it's an external link
        const isExternal = (
          link.hostname !== window.location.hostname &&
          link.href.startsWith('http')
        );
        
        if (isExternal) {
          // Send to analytics
          if (window.gtag) {
            window.gtag('event', 'outbound_link', {
              url: link.href,
              text: link.textContent.trim()
            });
          }
          
          console.log('Outbound link tracked', {
            url: link.href,
            text: link.textContent.trim()
          });
        }
      });
    },
    
    // Track user engagement time
    trackEngagementTime() {
      const startTime = Date.now();
      let isEngaged = true;
      
      // Update engagement status
      document.addEventListener('visibilitychange', () => {
        isEngaged = document.visibilityState === 'visible';
      });
      
      // Track engagement time when leaving
      window.addEventListener('beforeunload', () => {
        if (!isEngaged) return;
        
        const engagementTime = Math.floor((Date.now() - startTime) / 1000);
        
        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'engagement_time', {
            time_seconds: engagementTime
          });
        }
        
        console.log('Engagement time tracked', { 
          time_seconds: engagementTime 
        });
      });
    }
  };
  