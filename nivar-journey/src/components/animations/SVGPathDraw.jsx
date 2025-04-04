import React, { useRef, useEffect } from 'react';
import anime from 'animejs';
import styled from 'styled-components';
import { useScrollStore } from '../../stores/scrollStore';

const SVGWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: ${props => props.opacity || 1};
`;

// Component that animates SVG paths based on scroll progress
const SVGPathDraw = ({ 
  paths, 
  svgWidth = '100%', 
  svgHeight = '100%',
  sectionId,
  strokeWidth = 2,
  strokeColor = '#d4af37',
  opacity = 1,
  startOnScroll = true
}) => {
  const svgRef = useRef(null);
  const { sectionProgress } = useScrollStore();
  const progress = sectionProgress[sectionId] || 0;
  
  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;
    
    const pathElements = Array.from(svgElement.querySelectorAll('path'));
    
    // Set initial state - paths are invisible
    pathElements.forEach(path => {
      anime.set(path, {
        strokeDashoffset: anime.setDashoffset,
        strokeDasharray: anime.setDashoffset,
      });
    });
    
    // If startOnScroll is false, animate immediately
    if (!startOnScroll) {
      anime({
        targets: pathElements,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1500,
        delay: anime.stagger(300),
      });
    }
  }, [startOnScroll]);
  
  // Update animation based on scroll progress
  useEffect(() => {
    if (!startOnScroll || !svgRef.current) return;
    
    const pathElements = Array.from(svgRef.current.querySelectorAll('path'));
    
    pathElements.forEach((path, index) => {
      const dashoffset = anime.setDashoffset(path);
      const delay = index * 0.1; // Stagger effect
      const triggerPoint = 0.1 + delay;
      
      // Only start animation after a certain scroll progress
      if (progress > triggerPoint) {
        const relativeProgress = (progress - triggerPoint) / (1 - triggerPoint);
        const newOffset = dashoffset * (1 - Math.min(1, relativeProgress * 2));
        
        anime.set(path, {
          strokeDashoffset: newOffset
        });
      }
    });
  }, [progress, startOnScroll]);
  
  return (
    <SVGWrapper opacity={opacity}>
      <svg 
        ref={svgRef}
        width={svgWidth} 
        height={svgHeight} 
        viewBox="0 0 1000 1000" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((pathData, index) => (
          <path
            key={index}
            d={pathData}
            fill="none"
            stroke={typeof strokeColor === 'function' ? strokeColor(index) : strokeColor}
            strokeWidth={typeof strokeWidth === 'function' ? strokeWidth(index) : strokeWidth}
          />
        ))}
      </svg>
    </SVGWrapper>
  );
};

export default SVGPathDraw;