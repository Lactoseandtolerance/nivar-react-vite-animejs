import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import animeHelper from '../../utils/animeHelper';
import { useScrollStore } from '../../stores/scrollStore';

const TimelineContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 50px 0;
`;

const TimelineLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 4px;
  background: linear-gradient(to bottom, ${props => props.startColor || '#00e676'}, ${props => props.endColor || '#d4af37'});
  transform: translateX(-50%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.startColor || '#00e676'};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.endColor || '#d4af37'};
  }
  
  @media (max-width: 768px) {
    left: 30px;
  }
`;

const TimelineProgress = styled.div`
  position: absolute;
  top: 0;
  bottom: 100%;
  left: 50%;
  width: 4px;
  background: #fff;
  transform: translateX(-50%);
  transition: bottom 0.1s linear;
  
  @media (max-width: 768px) {
    left: 30px;
  }
`;

const TimelineItem = styled.div`
  position: relative;
  width: 50%;
  padding: 20px;
  margin-bottom: 50px;
  opacity: 0;
  transform: translateY(50px);
  
  &:nth-child(odd) {
    margin-left: auto;
    padding-left: 50px;
    
    &::before {
      left: 0;
      transform: translateX(-50%);
    }
  }
  
  &:nth-child(even) {
    padding-right: 50px;
    
    &::before {
      right: 0;
      transform: translateX(50%);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 30px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.dotColor || '#d4af37'};
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding-left: 60px !important;
    padding-right: 20px !important;
    
    &::before {
      left: 30px !important;
      transform: translateX(-50%) !important;
      right: auto !important;
    }
  }
`;

const TimelineDate = styled.div`
  font-weight: bold;
  color: ${props => props.color || '#00e676'};
  margin-bottom: 10px;
`;

const TimelineTitle = styled.h3`
  margin: 0 0 10px;
  color: #fff;
`;

const TimelineContent = styled.div`
  background: rgba(17, 17, 17, 0.7);
  border-radius: 10px;
  padding: 20px;
  border-left: 4px solid ${props => props.borderColor || '#d4af37'};
`;

// Component that creates an animated timeline based on scroll progress
const ScrollTimeline = ({ 
  items, 
  sectionId,
  startColor = '#00e676',
  endColor = '#d4af37'
}) => {
  const containerRef = useRef(null);
  const { sectionProgress } = useScrollStore();
  const progress = sectionProgress[sectionId] || 0;
  
  // Animate timeline items based on scroll progress
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const itemElements = container.querySelectorAll('.timeline-item');
    
    itemElements.forEach((item, index) => {
      const triggerPoint = index / (items.length * 1.5);
      
      if (progress > triggerPoint) {
        animeHelper.animate({
          targets: item,
          opacity: [0, 1],
          translateY: [50, 0],
          easing: 'easeOutExpo',
          duration: 800,
          delay: 0
        });
      }
    });
  }, [items.length, progress]);
  
  return (
    <TimelineContainer ref={containerRef}>
      <TimelineLine startColor={startColor} endColor={endColor} />
      <TimelineProgress style={{ bottom: `${(1 - progress) * 100}%` }} />
      
      {items.map((item, index) => (
        <TimelineItem 
          key={index} 
          className="timeline-item"
          dotColor={item.color}
        >
          <TimelineContent borderColor={item.color}>
            <TimelineDate color={item.color}>{item.date}</TimelineDate>
            <TimelineTitle>{item.title}</TimelineTitle>
            <div>{item.content}</div>
          </TimelineContent>
        </TimelineItem>
      ))}
    </TimelineContainer>
  );
};

export default ScrollTimeline;