import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  grid-gap: ${props => props.gap || '20px'};
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(${props => props.mobileColumns || 2}, 1fr);
  }
`;

const GridItem = styled.div`
  opacity: 0;
  transform: scale(0.8);
`;

// Component that reveals grid items with a staggered animation
const StaggeredGrid = ({ 
  children, 
  columns = 3, 
  mobileColumns = 2,
  gap = '20px',
  staggerDelay = 50,
  duration = 800,
  triggerOnScroll = true,
  className = '',
  easing = 'easeOutElastic(1, .5)'
}) => {
  const gridRef = useRef(null);
  
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    
    const items = Array.from(grid.children);
    
    const animate = () => {
      anime({
        targets: items,
        opacity: [0, 1],
        scale: [0.8, 1],
        duration,
        delay: anime.stagger(staggerDelay),
        easing
      });
    };
    
    if (triggerOnScroll) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      
      observer.observe(grid);
      return () => observer.disconnect();
    } else {
      animate();
    }
  }, [duration, easing, staggerDelay, triggerOnScroll]);
  
  return (
    <Grid 
      ref={gridRef}
      columns={columns}
      mobileColumns={mobileColumns}
      gap={gap}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <GridItem key={index}>
          {child}
        </GridItem>
      ))}
    </Grid>
  );
};

export default StaggeredGrid;