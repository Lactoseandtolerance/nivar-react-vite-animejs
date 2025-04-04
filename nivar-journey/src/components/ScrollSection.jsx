import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { useScrollStore } from '../stores/scrollStore';

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  z-index: 1;
  overflow: hidden;
  
  /* Each section could have custom styling */
  ${props => props.customStyles}
`;

// Component for sections that respond to scroll position
const ScrollSection = ({ 
  id, 
  children, 
  customStyles,
  onEnter, // Function to call when section enters viewport
  onProgress, // Function to call during scroll through section
  onLeave // Function to call when section leaves viewport
}) => {
  const sectionRef = useRef(null);
  const { currentSection, setSectionProgress } = useScrollStore();
  const isActive = currentSection === id;
  
  useEffect(() => {
    const section = sectionRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && onEnter) {
            onEnter();
          } else if (!entry.isIntersecting && onLeave) {
            onLeave();
          }
        });
      },
      { threshold: 0.1 } // 10% of the section is visible
    );
    
    if (section) {
      observer.observe(section);
    }
    
    // Calculate section scroll progress
    const handleScroll = () => {
      if (!section) return;
      
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Progress goes from 0 (section top at bottom of viewport)
      // to 1 (section bottom at top of viewport)
      const progress = 1 - (rect.bottom / (rect.height + windowHeight));
      
      // Clamp progress between 0 and 1
      const clampedProgress = Math.max(0, Math.min(1, progress));
      
      setSectionProgress(id, clampedProgress);
      
      if (onProgress) {
        onProgress(clampedProgress);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [id, onEnter, onLeave, onProgress, setSectionProgress]);
  
  return (
    <Section 
      id={id} 
      ref={sectionRef} 
      className={isActive ? 'active' : ''}
      customStyles={customStyles}
    >
      {children}
    </Section>
  );
};

export default ScrollSection;