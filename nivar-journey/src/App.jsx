import React, { useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import ScrollContainer from './components/ScrollContainer';
import NavigationIndicator from './components/NavigationIndicator';
import ScrollStarBackground from './components/ScrollStarBackground';
import TextReveal from './components/animations/TextReveal';
import ParallaxContainer from './components/animations/ParallaxContainer';
import ScrollSection from './components/ScrollSection';
import ProjectsJourney from './components/ProjectsJourney';
import ScrollTimeline from './components/animations/ScrollTimeline';
import StaggeredGrid from './components/animations/StaggeredGrid';
import SVGPathDraw from './components/animations/SVGPathDraw';
import { useScrollStore } from './stores/scrollStore';
import { analytics } from './utils/analytics';
import animeHelper from './utils/animeHelper';
import MobileNavigation from './components/MobileNavigation';
import { useMediaQuery } from './hooks/useMediaQuery';

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Roboto Mono', monospace;
    background-color: #000;
    color: #d4d4d4;
    overflow-x: hidden;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
`;

// Styled components for sections
import styled from 'styled-components';

const IntroContainer = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  text-align: center;
`;

const IntroTitle = styled.h1`
  font-size: 5rem;
  color: #d4af37;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`;

const IntroSubtitle = styled.h2`
  font-size: 2rem;
  color: #c0c0c0;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const ScrollPrompt = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  font-size: 0.9rem;
  opacity: 0.7;
  
  &::after {
    content: '';
    width: 20px;
    height: 20px;
    margin-top: 10px;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: rotate(45deg);
    animation: scrollPrompt 2s infinite;
  }
  
  @keyframes scrollPrompt {
    0% {
      transform: rotate(45deg) translate(-5px, -5px);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: rotate(45deg) translate(5px, 5px);
      opacity: 0;
    }
  }
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  color: #d4af37;
  margin-bottom: 3rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const AboutText = styled.div`
  p {
    font-size: 1.2rem;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    color: #d4d4d4;
  }
`;

const SkillBubble = styled.div`
  background: #1b1b1b;
  color: #fff;
  border: 1px solid ${props => props.color || '#d4af37'};
  border-radius: 10px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.9rem;
  cursor: pointer;
  height: 45px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    transform: scale(1.1);
    background: ${props => props.color || '#d4af37'};
    color: #000;
    z-index: 10;
    box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
  }
`;

const ContactContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem;
  background: rgba(27, 27, 27, 0.8);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1.1rem;
  font-weight: bold;
  color: #d4d4d4;
`;

const Input = styled.input`
  padding: 1rem;
  background: rgba(61, 61, 61, 0.8);
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  color: #f0f0f0;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #d4af37;
  }
`;

const Textarea = styled.textarea`
  padding: 1rem;
  background: rgba(61, 61, 61, 0.8);
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  color: #f0f0f0;
  resize: vertical;
  min-height: 150px;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #d4af37;
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  background: #d4af37;
  color: #000;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #a98c37;
    transform: translateY(-3px);
  }
`;

const Footer = styled.footer`
  padding: 2rem 0;
  text-align: center;
  position: relative;
  z-index: 1;
  background-color: rgba(8, 8, 8, 0.5);
`;

const Copyright = styled.p`
  font-size: 1rem;
  color: #a0a0a0;
`;

// Main App component
const App = () => {
  const { setCurrentSection } = useScrollStore();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Initialize scroll position on load
  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentSection('intro');
  }, [setCurrentSection]);
  
  // Goals timeline data
  const goalsTimeline = [
    {
      date: "2024-2025",
      title: "Begin Graduate Studies",
      content: "Start Master's in Mechanical Engineering with Energy Systems concentration, while continuing to develop software skills.",
      color: "#00e676"
    },
    {
      date: "2025-2026",
      title: "Research & Internship",
      content: "Conduct research in renewable energy systems and secure an internship applying both software and mechanical engineering skills.",
      color: "#d4af37"
    },
    {
      date: "2026",
      title: "Master's Degree Completion",
      content: "Complete Master's program with specialized knowledge in energy systems and sustainable technology integration.",
      color: "#00a1ff"
    },
    {
      date: "2026-2027",
      title: "Renewable Energy Projects",
      content: "Work on clean energy projects that leverage both programming and mechanical engineering expertise.",
      color: "#ff6b6b"
    },
    {
      date: "2027-2028",
      title: "Technical Leadership",
      content: "Advance to a position bridging software and mechanical engineering in sustainable technology development.",
      color: "#00e676"
    }
  ];
  
  // Skills with categories
  const skills = [
    { name: 'Python', category: 'Programming', color: '#3f51b5' },
    { name: 'JavaScript', category: 'Programming', color: '#3f51b5' },
    { name: 'HTML', category: 'Web', color: '#2196f3' },
    { name: 'CSS', category: 'Web', color: '#2196f3' },
    { name: 'SQL', category: 'Data', color: '#009688' },
    { name: 'React.js', category: 'Web', color: '#2196f3' },
    { name: 'Three.js', category: 'Graphics', color: '#ff9800' },
    { name: 'Data Visualization', category: 'Data', color: '#009688' },
    { name: 'Machine Learning', category: 'AI', color: '#9c27b0' },
    { name: 'Database Design', category: 'Data', color: '#009688' },
    { name: 'RESTful APIs', category: 'Web', color: '#2196f3' },
    { name: 'Pandas', category: 'Data', color: '#009688' },
    { name: 'Scikit-learn', category: 'AI', color: '#9c27b0' },
    { name: 'OpenCV', category: 'AI', color: '#9c27b0' },
    { name: 'Content-Based Filtering', category: 'AI', color: '#9c27b0' }
  ];
  
  // SVG path for skill connection visualization
  const skillConnectionPaths = [
    'M50,50 C80,30 120,80 150,50',
    'M150,50 C180,20 220,80 250,50',
    'M50,150 C80,130 120,180 150,150',
    'M150,150 C180,120 220,180 250,150',
    'M50,100 C100,50 150,150 200,100',
    'M100,50 C150,100 200,50 250,100',
    'M100,150 C150,100 200,150 250,100'
  ];

  useEffect(() => {
     analytics.init();
  }, []);
  
  return (
    <>
      <GlobalStyle />
      
      {/* Star background that reacts to scroll */}
      <ScrollStarBackground />
      
      {/* Navigation indicator */}
      {!isMobile && <NavigationIndicator />}
      
      {/* Mobile navigation for small screens */}
      {isMobile && <MobileNavigation />}
      
      {/* Main scroll container */}
      <ScrollContainer>
        {/* Intro section */}
        <ScrollSection id="intro">
          <IntroContainer>
            <ParallaxContainer>
              <TextReveal 
                text="Angel Nivar" 
                Component={IntroTitle} 
                triggerOnScroll={false}
              />
              <TextReveal 
                text="Exploring the infinite possibilities of technology" 
                Component={IntroSubtitle} 
                delay={1000}
                triggerOnScroll={false}
              />
              <div data-parallax="0.2" data-parallax-direction="vertical">
                <ScrollPrompt>Scroll to begin the journey</ScrollPrompt>
              </div>
            </ParallaxContainer>
          </IntroContainer>
        </ScrollSection>
        
        {/* About section */}
        <ScrollSection 
          id="about"
          customStyles={`
            background-color: rgba(10, 10, 10, 0.7);
            padding: 100px 0;
          `}
        >
          <SectionContainer>
            <TextReveal 
              text="About Me" 
              Component={SectionTitle} 
            />
            
            <AboutContent>
              <AboutText>
                <p data-parallax="0.1" data-parallax-direction="vertical">
                  I'm a passionate developer with skills in a variety of technologies.
                  I enjoy getting lost in learning and applying my skills to the fullest
                  extent I can!
                </p>
                <p data-parallax="0.15" data-parallax-direction="vertical">
                  My journey in technology began with a curiosity about how things work,
                  which quickly evolved into a passion for creating and innovating. I've
                  developed expertise in various programming languages and technologies,
                  always striving to expand my knowledge and skills.
                </p>
                <p data-parallax="0.2" data-parallax-direction="vertical">
                  When I'm not coding, I enjoy exploring modern fashion trends and finding
                  creative ways to express myself. I believe that creativity and technical
                  skill go hand in hand, and I bring both to every project I work on.
                </p>
              </AboutText>
              
              <div>
                <SVGPathDraw 
                  paths={skillConnectionPaths} 
                  sectionId="about"
                  strokeColor={(index) => {
                    const colors = ['#3f51b5', '#2196f3', '#009688', '#9c27b0', '#ff9800'];
                    return colors[index % colors.length];
                  }}
                  strokeWidth={(index) => 1 + (index % 3)}
                  opacity={0.3}
                />
                
                <StaggeredGrid columns={3} mobileColumns={2} gap="15px">
                  {skills.map((skill, index) => (
                    <SkillBubble key={index} color={skill.color}>
                      {skill.name}
                    </SkillBubble>
                  ))}
                </StaggeredGrid>
              </div>
            </AboutContent>
          </SectionContainer>
        </ScrollSection>
        
        {/* Projects section */}
        <ProjectsJourney />
        
        {/* Goals section */}
        <ScrollSection 
          id="goals"
          customStyles={`
            background-color: rgba(10, 10, 10, 0.7);
            padding: 100px 0;
          `}
        >
          <SectionContainer>
            <TextReveal 
              text="Career Path in Sustainable Engineering" 
              Component={SectionTitle} 
            />
            
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px' }}>
              <p data-parallax="0.1" data-parallax-direction="vertical" style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                As I continue to grow in my career, I'm focused on bridging the worlds of software
                development and mechanical engineering. My aim is to combine these disciplines
                to create innovative solutions for <strong style={{ color: '#00e676' }}>sustainability and renewable energy</strong>.
              </p>
            </div>
            
            <ScrollTimeline 
              items={goalsTimeline} 
              sectionId="goals"
              startColor="#00e676"
              endColor="#d4af37"
            />
          </SectionContainer>
        </ScrollSection>
        
        {/* Resume section - simplified for the example */}
        <ScrollSection 
          id="resume"
          customStyles={`
            background-color: rgba(10, 10, 10, 0.7);
            padding: 100px 0;
          `}
        >
          <SectionContainer>
            <TextReveal 
              text="My Resume" 
              Component={SectionTitle} 
            />
            
            <div style={{ 
              width: '100%', 
              maxWidth: '800px', 
              height: '600px', 
              margin: '0 auto',
              background: '#1b1b1b',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#d4af37',
              fontSize: '1.5rem'
            }}>
              Resume Content Would Be Here
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <SubmitButton as="a" href="/Angel_Nivar_Resume.pdf" download>
                Download Resume
              </SubmitButton>
            </div>
          </SectionContainer>
        </ScrollSection>
        
        {/* Contact section */}
        <ScrollSection 
          id="contact"
          customStyles={`
            background-color: rgba(10, 10, 10, 0.7);
            padding: 100px 0;
          `}
        >
          <SectionContainer>
            <TextReveal 
              text="Contact Me" 
              Component={SectionTitle} 
            />
            
            <ContactContainer>
              <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.2rem' }}>
                I'd love to hear from you! Fill out the form below or email me directly at{' '}
                <a href="mailto:anivar.fw@gmail.com" style={{ color: '#d4af37' }}>
                  anivar.fw@gmail.com
                </a>.
              </p>
              
              <Form>
                <FormGroup>
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="Your Name" 
                    required 
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Your Email" 
                    required 
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    placeholder="What's on your mind?" 
                    required 
                  />
                </FormGroup>
                
                <SubmitButton type="submit">
                  Send Message
                </SubmitButton>
              </Form>
            </ContactContainer>
          </SectionContainer>
        </ScrollSection>
        
        {/* Footer */}
        <Footer>
          <Copyright>
            &copy; {new Date().getFullYear()} Angel Nivar. All Rights Reserved.
          </Copyright>
        </Footer>
      </ScrollContainer>
    </>
  );
};

export default App;