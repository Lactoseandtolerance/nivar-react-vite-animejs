import { useEffect } from 'react';
import { useScrollStore } from '../stores/scrollStore';

// Hook to manage accessibility features
export const useA11y = () => {
  const { currentSection } = useScrollStore();
  
  // Update title based on current section
  useEffect(() => {
    const baseTitle = 'Angel Nivar | Portfolio';
    let sectionTitle = '';
    
    switch (currentSection) {
      case 'intro':
        sectionTitle = 'Home';
        break;
      case 'about':
        sectionTitle = 'About Me';
        break;
      case 'projects':
        sectionTitle = 'Projects';
        break;
      case 'goals':
        sectionTitle = 'Career Goals';
        break;
      case 'resume':
        sectionTitle = 'Resume';
        break;
      case 'contact':
        sectionTitle = 'Contact';
        break;
      default:
        sectionTitle = '';
    }
    
    document.title = sectionTitle ? `${sectionTitle} | ${baseTitle}` : baseTitle;
  }, [currentSection]);
  
  // Listen for keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Keyboard shortcuts for navigation
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        navigateToNextSection();
        e.preventDefault();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        navigateToPrevSection();
        e.preventDefault();
      } else if (e.key === 'Home') {
        navigateToSection('intro');
        e.preventDefault();
      } else if (e.key === 'End') {
        navigateToSection('contact');
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection]);
  
  // Helper navigation functions
  const navigateToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const navigateToNextSection = () => {
    const sections = ['intro', 'about', 'projects', 'goals', 'resume', 'contact'];
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
      navigateToSection(sections[currentIndex + 1]);
    }
  };
  
  const navigateToPrevSection = () => {
    const sections = ['intro', 'about', 'projects', 'goals', 'resume', 'contact'];
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
      navigateToSection(sections[currentIndex - 1]);
    }
  };
  
  return {
    navigateToSection,
    navigateToNextSection,
    navigateToPrevSection
  };
};

// src/components/A11yFeatures.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const A11yContainer = styled.div`
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const A11yButton = styled.button`
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(50, 50, 50, 0.9);
  }
`;

const A11yMenu = styled.div`
  position: absolute;
  top: 0;
  left: 50px;
  background: rgba(10, 10, 10, 0.9);
  border-radius: 5px;
  padding: 15px;
  width: 240px;
  transform: ${props => props.open ? 'scale(1)' : 'scale(0)'};
  transform-origin: top left;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const A11yOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  
  label {
    color: #fff;
    margin-right: 10px;
  }
`;

const ToggleSwitch = styled.input`
  height: 0;
  width: 0;
  visibility: hidden;
  
  &:checked + span {
    background: #d4af37;
  }
  
  &:checked + span:after {
    left: calc(100% - 2px);
    transform: translateX(-100%);
  }
`;

const ToggleSlider = styled.span`
  cursor: pointer;
  width: 50px;
  height: 25px;
  background: #444;
  display: block;
  border-radius: 25px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 21px;
    height: 21px;
    background: #fff;
    border-radius: 50%;
    transition: 0.3s;
  }
`;

// Accessibility features component
const A11yFeatures = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState({
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false
  });
  
  // Toggle accessibility setting
  const toggleSetting = (setting) => {
    setSettings(prev => {
      const newSettings = { ...prev, [setting]: !prev[setting] };
      
      // Apply settings to the document
      if (setting === 'reduceMotion') {
        document.body.classList.toggle('reduce-motion', newSettings.reduceMotion);
      } else if (setting === 'highContrast') {
        document.body.classList.toggle('high-contrast', newSettings.highContrast);
      } else if (setting === 'largeText') {
        document.body.classList.toggle('large-text', newSettings.largeText);
      } else if (setting === 'screenReader') {
        document.body.classList.toggle('screen-reader', newSettings.screenReader);
      }
      
      // Save settings to localStorage
      localStorage.setItem('a11ySettings', JSON.stringify(newSettings));
      
      return newSettings;
    });
  };
  
  // Load saved settings on mount
  React.useEffect(() => {
    const savedSettings = localStorage.getItem('a11ySettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      
      // Apply saved settings
      document.body.classList.toggle('reduce-motion', parsedSettings.reduceMotion);
      document.body.classList.toggle('high-contrast', parsedSettings.highContrast);
      document.body.classList.toggle('large-text', parsedSettings.largeText);
      document.body.classList.toggle('screen-reader', parsedSettings.screenReader);
    }
  }, []);
  
  return (
    <A11yContainer>
      <A11yButton 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Accessibility options"
      >
        ♿
      </A11yButton>
      
      <A11yMenu open={menuOpen}>
        <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>Accessibility Options</h3>
        
        <A11yOption>
          <label htmlFor="reduceMotion">Reduce motion</label>
          <div>
            <ToggleSwitch
              type="checkbox"
              id="reduceMotion"
              checked={settings.reduceMotion}
              onChange={() => toggleSetting('reduceMotion')}
            />
            <ToggleSlider />
          </div>
        </A11yOption>
        
        <A11yOption>
          <label htmlFor="highContrast">High contrast</label>
          <div>
            <ToggleSwitch
              type="checkbox"
              id="highContrast"
              checked={settings.highContrast}
              onChange={() => toggleSetting('highContrast')}
            />
            <ToggleSlider />
          </div>
        </A11yOption>
        
        <A11yOption>
          <label htmlFor="largeText">Larger text</label>
          <div>
            <ToggleSwitch
              type="checkbox"
              id="largeText"
              checked={settings.largeText}
              onChange={() => toggleSetting('largeText')}
            />
            <ToggleSlider />
          </div>
        </A11yOption>
        
        <A11yOption>
          <label htmlFor="screenReader">Screen reader optimized</label>
          <div>
            <ToggleSwitch
              type="checkbox"
              id="screenReader"
              checked={settings.screenReader}
              onChange={() => toggleSetting('screenReader')}
            />
            <ToggleSlider />
          </div>
        </A11yOption>
      </A11yMenu>
    </A11yContainer>
  );
};

export default A11yFeatures;