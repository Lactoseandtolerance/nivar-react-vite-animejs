import React from 'react';
import styled from 'styled-components';
import { useScrollStore } from '../stores/scrollStore';

const NavContainer = styled.div`
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const NavDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? props.activeColor || '#d4af37' : '#333'};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: scale(1.2);
  }
  
  &::after {
    content: '${props => props.label}';
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
    color: ${props => props.active ? props.activeColor || '#d4af37' : '#888'};
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

const ProgressIndicator = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${props => props.progress * 100}%;
  height: 3px;
  background: linear-gradient(to right, #d4af37, #00e676);
  z-index: 1000;
`;

const NavigationIndicator = () => {
  const { currentSection, scrollProgress } = useScrollStore();
  
  const sections = [
    { id: 'intro', label: 'Intro', color: '#d4af37' },
    { id: 'about', label: 'About', color: '#d4af37' },
    { id: 'projects', label: 'Projects', color: '#d4af37' },
    { id: 'goals', label: 'Goals', color: '#00e676' },
    { id: 'resume', label: 'Resume', color: '#00e676' },
    { id: 'contact', label: 'Contact', color: '#ff6b6b' }
  ];
  
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <>
      <ProgressIndicator progress={scrollProgress} />
      <NavContainer>
        {sections.map(section => (
          <NavDot
            key={section.id}
            active={currentSection === section.id}
            activeColor={section.color}
            label={section.label}
            onClick={() => scrollToSection(section.id)}
          />
        ))}
      </NavContainer>
    </>
  );
};

export default NavigationIndicator;