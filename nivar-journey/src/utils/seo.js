export const seo = {
    // Update meta tags for the current section
    updateMetaTags(section) {
      // Base title and description
      let title = 'Angel Nivar | Portfolio';
      let description = 'Exploring the infinite possibilities of technology through innovative projects in software development, data science, and machine learning.';
      
      // Update based on section
      switch (section) {
        case 'about':
          title = 'About Me | Angel Nivar';
          description = 'Learn about Angel Nivar\'s background, skills, and passion for technology and innovation.';
          break;
        case 'projects':
          title = 'Projects | Angel Nivar';
          description = 'Explore Angel Nivar\'s projects in software development, data science, and machine learning.';
          break;
        case 'goals':
          title = 'Career Goals | Angel Nivar';
          description = 'Discover Angel Nivar\'s vision for combining software development and mechanical engineering for sustainable solutions.';
          break;
        case 'resume':
          title = 'Resume | Angel Nivar';
          description = 'View Angel Nivar\'s professional resume highlighting skills, experience, and qualifications.';
          break;
        case 'contact':
          title = 'Contact | Angel Nivar';
          description = 'Get in touch with Angel Nivar for collaboration, opportunities, or questions.';
          break;
        default:
          // Use defaults for home page
          break;
      }
      
      // Update document title
      document.title = title;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
      
      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      
      if (ogTitle) {
        ogTitle.setAttribute('content', title);
      }
      
      if (ogDescription) {
        ogDescription.setAttribute('content', description);
      }
      
      // Update canonical URL if needed
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical && section !== 'intro') {
        canonical.setAttribute('href', `https://angelnivar.com/#${section}`);
      } else if (canonical) {
        canonical.setAttribute('href', 'https://angelnivar.com');
      }
    }
  };