import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';

const TextWrapper = styled.div`
  overflow: hidden;
  position: relative;
`;

const TextSpan = styled.span`
  display: inline-block;
  transform: translateY(100%);
  opacity: 0;
`;

// Component that reveals text one character at a time with staggered animation
const TextReveal = ({ 
  text, 
  Component = 'h1', 
  delay = 0,
  duration = 800,
  staggerValue = 50,
  easing = 'easeOutExpo',
  className = '',
  triggerOnScroll = true
}) => {
  const elementRef = useRef(null);
  const characters = text.split('');
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const animate = () => {
      anime({
        targets: element.querySelectorAll('.text-reveal-char'),
        translateY: [100, 0],
        opacity: [0, 1],
        easing,
        duration,
        delay: anime.stagger(staggerValue, { start: delay }),
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
        { threshold: 0.1 }
      );
      
      observer.observe(element);
      return () => observer.disconnect();
    } else {
      animate();
    }
  }, [delay, duration, easing, staggerValue, triggerOnScroll]);
  
  return (
    <TextWrapper as={Component} ref={elementRef} className={className}>
      {characters.map((char, index) => (
        <TextSpan key={index} className="text-reveal-char">
          {char === ' ' ? '\u00A0' : char}
        </TextSpan>
      ))}
    </TextWrapper>
  );
};

export default TextReveal;