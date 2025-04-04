import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { useScrollStore } from '../stores/scrollStore';
import { seo } from '../utils/seo';

// Main container that manages the entire scroll experience
const Container = styled.div`
  position: relative;
  width: 100%;
  background: #000;
  overflow: hidden;
`;

// This component will detect scroll position and manage section transitions
const ScrollContainer = ({ children }) => {
  const containerRef = useRef(null);
  const { 
    currentSection, 
    setCurrentSection, 
    scrollProgress, 
    setScrollProgress 
  } = useScrollStore();
  
  useEffect(() => {
    // Function to calculate scroll progress and update store
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      // Calculate overall scroll progress (0 to 1)
      const totalScrollProgress = scrollTop / (docHeight - windowHeight);
      setScrollProgress(totalScrollProgress);
      
      // Detect current section based on scroll position
      // This would be expanded to work with your sections
      const sections = ['intro', 'about', 'projects', 'goals', 'resume', 'contact'];
      const sectionElements = sections.map(id => document.getElementById(id));
      
      for (let i = 0; i < sectionElements.length; i++) {
        if (!sectionElements[i]) continue;
        
        const rect = sectionElements[i].getBoundingClientRect();
        if (rect.top <= windowHeight * 0.3 && rect.bottom >= windowHeight * 0.3) {
          if (currentSection !== sections[i]) {
            setCurrentSection(sections[i]);
          }
          break;
        }
      }
    };

    useEffect(() => {
        seo.updateMetaTags(currentSection);
        }, [currentSection]);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection, setCurrentSection, setScrollProgress]);
  
  return (
    <Container ref={containerRef}>
      {children}
    </Container>
  );
};

export default ScrollContainer;