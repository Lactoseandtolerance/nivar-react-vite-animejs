import React, { useState } from 'react';
import styled from 'styled-components';
import { useScrollStore } from '../stores/scrollStore';
import animeHelper from '../utils/animeHelper';

const NavContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  justify-content: center;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 10px 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.2);
`;

const NavButton = styled.button`
  background: ${props => props.active ? props.color : 'transparent'};
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.active ? '#000' : '#fff'};
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:after {
    content: '${props => props.label}';
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    white-space: nowrap;
    opacity: ${props => props.active ? 1 : 0};
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: ${props => props.active ? props.color : 'rgba(255, 255, 255, 0.1)'};
    &:after {
      opacity: 1;
    }
  }
`;

const MobileNavigation = () => {
  const { currentSection } = useScrollStore();
  
  const sections = [
    { id: 'intro', label: 'Intro', color: '#d4af37', icon: '🏠' },
    { id: 'about', label: 'About', color: '#d4af37', icon: '👤' },
    { id: 'projects', label: 'Projects', color: '#d4af37', icon: '💻' },
    { id: 'goals', label: 'Goals', color: '#00e676', icon: '🎯' },
    { id: 'resume', label: 'Resume', color: '#00e676', icon: '📄' },
    { id: 'contact', label: 'Contact', color: '#ff6b6b', icon: '📧' }
  ];
  
  const scrollToSection = (id) => {
    // Use anime.js for smooth scrolling
    const element = document.getElementById(id);
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = scrollTop + rect.top;
    
    animeHelper.animate({
      targets: [document.documentElement, document.body],
      scrollTop: targetY,
      duration: 1000,
      easing: 'easeInOutQuad'
    });
  };
  
  return (
    <NavContainer>
      {sections.map(section => (
        <NavButton
          key={section.id}
          active={currentSection === section.id}
          color={section.color}
          label={section.label}
          onClick={() => scrollToSection(section.id)}
        >
          {section.icon}
        </NavButton>
      ))}
    </NavContainer>
  );
};

export default MobileNavigation;