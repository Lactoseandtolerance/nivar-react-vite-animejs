import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import animeHelper from '../../utils/animeHelper';

const Container = styled.div`
  position: relative;
  overflow: hidden;
  height: ${props => props.height || '100vh'};
  width: ${props => props.width || '100%'};
`;

// Component that creates parallax effect for child elements
const ParallaxContainer = ({ 
  children, 
  height,
  width,
  className
}) => {
  const containerRef = useRef(null);
  const [elements, setElements] = useState([]);
  
  // Find all elements with data-parallax attribute
  useEffect(() => {
    if (containerRef.current) {
      const parallaxElements = containerRef.current.querySelectorAll('[data-parallax]');
      setElements(Array.from(parallaxElements));
    }
  }, [children]);
  
  // Set up scroll event handler
  useEffect(() => {
    if (!elements.length) return;
    
    const handleScroll = () => {
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;
      const windowCenter = window.innerHeight / 2;
      
      // Calculate how far container is from center of screen (-1 to 1)
      const distanceFromCenter = (containerCenter - windowCenter) / window.innerHeight;
      
      // Update each parallax element
      elements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.2;
        const direction = element.dataset.parallaxDirection || 'vertical';
        
        if (direction === 'vertical') {
          animeHelper.set(element, {
            translateY: `${distanceFromCenter * 100 * speed}px`
          });
        } else if (direction === 'horizontal') {
          animeHelper.set(element, {
            translateX: `${distanceFromCenter * 100 * speed}px`
          });
        } else if (direction === 'rotation') {
          animeHelper.set(element, {
            rotate: `${distanceFromCenter * 15 * speed}deg`
          });
        } else if (direction === 'scale') {
          const scale = 1 + (distanceFromCenter * 0.2 * speed);
          animeHelper.set(element, {
            scale: Math.max(0.5, Math.min(1.5, scale))
          });
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [elements]);
  
  return (
    <Container 
      ref={containerRef} 
      height={height}
      width={width}
      className={className}
    >
      {children}
    </Container>
  );
};

export default ParallaxContainer;