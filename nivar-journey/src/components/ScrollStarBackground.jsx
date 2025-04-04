import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { useScrollStore } from '../stores/scrollStore';

// Main container for the star background
const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: linear-gradient(to bottom, #000000 0%, #050510 100%);
  overflow: hidden;
`;

// Star layer with depth and velocity
const StarLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

// Individual star
const Star = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  opacity: ${props => props.opacity};
  box-shadow: 0 0 ${props => props.glow}px ${props => props.glow / 2}px ${props => props.color};
`;

// Dynamic comet trail effect
const Comet = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  background: transparent;
  transform: rotate(${props => props.angle}deg);
  overflow: visible;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 ${props => props.size * 2}px ${props => props.size}px rgba(255, 255, 255, 0.5),
                0 0 ${props => props.size}px ${props => props.size / 2}px #fff;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.size * 30}px;
    height: 1px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.7), transparent);
    transform-origin: left center;
  }
`;

// Nebula effect
const Nebula = styled.div`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    ${props => props.color1} 0%,
    ${props => props.color2} 40%,
    transparent 70%
  );
  opacity: 0.15;
  filter: blur(${props => props.blur}px);
`;

// Animated constellation
const Constellation = styled.svg`
  position: absolute;
  opacity: 0.5;
`;

const ScrollStarBackground = () => {
  const starsRef = useRef([]);
  const cometsRef = useRef([]);
  const nebulaeRef = useRef([]);
  const constellationsRef = useRef([]);
  const { scrollProgress, currentSection } = useScrollStore();
  
  // Create stars with varying properties
  useEffect(() => {
    // Create star configuration
    const smallStars = createStars(300, 1, 2, ['#FFFFFF', '#E0E0E0', '#CCCCCC']);
    const mediumStars = createStars(150, 2, 3, ['#FFFFFF', '#D4AF37', '#87CEEB']);
    const largeStars = createStars(50, 3, 5, ['#FFFFFF', '#D4AF37', '#4169E1']);
    
    starsRef.current = [...smallStars, ...mediumStars, ...largeStars];
    
    // Create comets
    cometsRef.current = Array.from({ length: 5 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 1 + Math.random() * 2,
      angle: Math.random() * 360,
      speed: 100 + Math.random() * 400,
      delay: Math.random() * 20
    }));
    
    // Create nebulae
    nebulaeRef.current = Array.from({ length: 3 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      width: 100 + Math.random() * 400,
      height: 100 + Math.random() * 400,
      color1: getRandomColor(0.2),
      color2: getRandomColor(0.05),
      blur: 30 + Math.random() * 50
    }));
    
    // Create constellations
    constellationsRef.current = [
      {
        points: generateConstellationPoints(7, window.innerWidth * 0.2, window.innerHeight * 0.3),
        x: window.innerWidth * 0.2,
        y: window.innerHeight * 0.2
      },
      {
        points: generateConstellationPoints(5, window.innerWidth * 0.15, window.innerHeight * 0.2),
        x: window.innerWidth * 0.7,
        y: window.innerHeight * 0.6
      }
    ];
    
    // Initialize animations
    initializeAnimations();
    
  }, []);
  
  // Update background based on scroll progress
  useEffect(() => {
    // Parallax effect - different layers move at different speeds
    const layers = document.querySelectorAll('.star-layer');
    layers.forEach((layer, index) => {
      const depth = index + 1;
      const translateY = scrollProgress * 100 * depth;
      layer.style.transform = `translateY(${translateY}px)`;
    });
    
    // Change star colors based on current section
    updateStarColors(currentSection);
    
  }, [scrollProgress, currentSection]);
  
  // Helper function to create stars with given properties
  const createStars = (count, minSize, maxSize, colors) => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: minSize + Math.random() * (maxSize - minSize),
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.5 + Math.random() * 0.5,
      glow: Math.random() * 5,
      layer: Math.floor(Math.random() * 3)
    }));
  };
  
  // Initialize animations for various elements
  const initializeAnimations = () => {
    // Animate stars twinkling
    anime({
      targets: '.star',
      opacity: [
        { value: el => el.style.opacity * 0.5, duration: 700, easing: 'easeInOutSine' },
        { value: el => el.style.opacity, duration: 700, easing: 'easeInOutSine' }
      ],
      scale: [
        { value: 0.8, duration: 700, easing: 'easeInOutSine' },
        { value: 1, duration: 700, easing: 'easeInOutSine' }
      ],
      delay: anime.stagger(200, { grid: [100, 5], from: 'random' }),
      loop: true
    });
    
    // Animate comets
    animateComets();
    
    // Animate nebulae
    anime({
      targets: '.nebula',
      opacity: [0.05, 0.2, 0.05],
      scale: [1, 1.1, 1],
      duration: 20000,
      easing: 'easeInOutSine',
      delay: anime.stagger(5000),
      loop: true
    });
    
    // Animate constellation lines
    anime({
      targets: '.constellation-line',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1500,
      delay: anime.stagger(300),
      loop: false
    });
  };
  
  // Animate comets across the screen
  const animateComets = () => {
    cometsRef.current.forEach((comet, index) => {
      const cometEl = document.querySelector(`.comet-${index}`);
      if (!cometEl) return;
      
      const newX = window.innerWidth + 200;
      const newY = -200;
      
      anime({
        targets: cometEl,
        translateX: [comet.x - 200, newX],
        translateY: [comet.y, newY],
        duration: comet.speed * 50,
        easing: 'linear',
        delay: comet.delay * 1000,
        complete: () => {
          // Reset comet position
          comet.x = Math.random() * window.innerWidth;
          comet.y = window.innerHeight + 200;
          comet.angle = Math.random() * 60 - 30;
          comet.speed = 100 + Math.random() * 400;
          comet.delay = Math.random() * 5;
          
          anime({
            targets: cometEl,
            translateX: comet.x,
            translateY: comet.y,
            duration: 0,
            complete: () => animateComet(cometEl, comet)
          });
        }
      });
    });
  };
  
  // Animate a single comet
  const animateComet = (element, comet) => {
    const newX = window.innerWidth + 200;
    const newY = -200;
    
    anime({
      targets: element,
      translateX: [comet.x, newX],
      translateY: [comet.y, newY],
      duration: comet.speed * 30,
      easing: 'linear',
      delay: comet.delay * 1000,
      complete: () => {
        // Reset comet position
        comet.x = Math.random() * window.innerWidth;
        comet.y = window.innerHeight + 200;
        comet.angle = Math.random() * 60 - 30;
        
        anime({
          targets: element,
          translateX: comet.x,
          translateY: comet.y,
          duration: 0,
          complete: () => animateComet(element, comet)
        });
      }
    });
  };
  
  // Update star colors based on current section
  const updateStarColors = (section) => {
    let accentColor = '#d4af37'; // Default gold
    
    switch (section) {
      case 'about':
        accentColor = '#d4af37'; // Gold
        break;
      case 'projects':
        accentColor = '#d4af37'; // Gold
        break;
      case 'goals':
        accentColor = '#00e676'; // Green
        break;
      case 'resume':
        accentColor = '#00e676'; // Green
        break;
      case 'contact':
        accentColor = '#ff6b6b'; // Red
        break;
      default:
        accentColor = '#d4af37'; // Gold
    }
    
    // Animate color change for some stars
    anime({
      targets: '.accent-star',
      backgroundColor: accentColor,
      boxShadowColor: accentColor,
      easing: 'easeOutQuad',
      duration: 800
    });
  };
  
  // Helper to generate random color with specified opacity
  const getRandomColor = (opacity = 1) => {
    const colors = [
      `rgba(212, 175, 55, ${opacity})`, // Gold
      `rgba(65, 105, 225, ${opacity})`, // Royal Blue
      `rgba(135, 206, 235, ${opacity})`, // Sky Blue
      `rgba(255, 107, 107, ${opacity})`, // Red
      `rgba(0, 230, 118, ${opacity})` // Green
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Generate random points for a constellation
  const generateConstellationPoints = (count, width, height) => {
    const points = [];
    for (let i = 0; i < count; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height
      });
    }
    return points;
  };
  
  // Generate SVG path for constellation
  const generateConstellationPath = (points) => {
    let path = '';
    for (let i = 0; i < points.length - 1; i++) {
      path += `M${points[i].x},${points[i].y} L${points[i + 1].x},${points[i + 1].y} `;
    }
    // Add some connections between non-adjacent points
    if (points.length > 3) {
      path += `M${points[0].x},${points[0].y} L${points[points.length - 1].x},${points[points.length - 1].y} `;
      path += `M${points[1].x},${points[1].y} L${points[points.length - 2].x},${points[points.length - 2].y} `;
    }
    return path;
  };
  
  return (
    <BackgroundContainer>
      {/* Three layers of stars for parallax effect */}
      {[0, 1, 2].map((layer) => (
        <StarLayer key={layer} className={`star-layer layer-${layer}`}>
          {starsRef.current
            .filter(star => star.layer === layer)
            .map((star, index) => (
              <Star
                key={`star-${layer}-${index}`}
                className={`star ${index % 3 === 0 ? 'accent-star' : ''}`}
                style={{
                  left: `${star.x}px`,
                  top: `${star.y}px`
                }}
                size={star.size}
                color={star.color}
                opacity={star.opacity}
                glow={star.glow}
              />
            ))}
        </StarLayer>
      ))}
      
      {/* Comets */}
      {cometsRef.current.map((comet, index) => (
        <Comet
          key={`comet-${index}`}
          className={`comet comet-${index}`}
          style={{
            transform: `translateX(${comet.x}px) translateY(${comet.y}px)`
          }}
          size={comet.size}
          angle={comet.angle}
        />
      ))}
      
      {/* Nebulae */}
      {nebulaeRef.current.map((nebula, index) => (
        <Nebula
          key={`nebula-${index}`}
          className="nebula"
          style={{
            left: `${nebula.x}px`,
            top: `${nebula.y}px`,
            width: `${nebula.width}px`,
            height: `${nebula.height}px`
          }}
          color1={nebula.color1}
          color2={nebula.color2}
          blur={nebula.blur}
        />
      ))}
      
      {/* Constellations */}
      {constellationsRef.current.map((constellation, index) => (
        <Constellation
          key={`constellation-${index}`}
          className="constellation"
          style={{
            left: `${constellation.x}px`,
            top: `${constellation.y}px`
          }}
          viewBox={`0 0 ${window.innerWidth * 0.3} ${window.innerHeight * 0.3}`}
        >
          {/* Lines between stars */}
          <path
            className="constellation-line"
            d={generateConstellationPath(constellation.points)}
            fill="none"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
            strokeDasharray="5,3"
          />
          
          {/* Constellation points */}
          {constellation.points.map((point, pidx) => (
            <circle
              key={`const-point-${index}-${pidx}`}
              cx={point.x}
              cy={point.y}
              r={pidx === 0 ? 3 : 2}
              fill={pidx === 0 ? '#d4af37' : '#fff'}
              opacity={0.8}
            />
          ))}
        </Constellation>
      ))}
    </BackgroundContainer>
  );
};

export default ScrollStarBackground;