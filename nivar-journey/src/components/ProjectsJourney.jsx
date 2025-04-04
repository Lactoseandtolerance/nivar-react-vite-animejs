import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as anime from 'animejs';
import { useScrollStore } from '../stores/scrollStore';
import ScrollSection from './ScrollSection';
import { useMediaQuery } from '../hooks/useMediaQuery';

// Container for the projects section
const ProjectsContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 80px 0;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  color: #d4af37;
  margin-bottom: 3rem;
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

// Container for the journey path
const JourneyPath = styled.div`
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 50px 20px;
`;

// SVG path for the project journey
const JourneyLine = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  
  path {
    fill: none;
    stroke: rgba(212, 175, 55, 0.3);
    stroke-width: 4;
    stroke-dasharray: 10 5;
  }
`;

// Illuminated point on the journey path
const JourneyPoint = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.active ? '#d4af37' : 'rgba(212, 175, 55, 0.3)'};
  box-shadow: ${props => props.active ? '0 0 20px 5px rgba(212, 175, 55, 0.5)' : 'none'};
  transform: translate(-50%, -50%) scale(${props => props.active ? 1.5 : 1});
  transition: all 0.5s ease;
  z-index: 1;
`;

// Progress indicator that moves along the path
const PathProgress = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #d4af37;
  box-shadow: 0 0 20px 5px rgba(212, 175, 55, 0.5);
  transform: translate(-50%, -50%);
  z-index: 2;
`;

// Project card with 3D effect
const ProjectCard = styled.div`
  position: absolute;
  width: 350px;
  height: 400px;
  perspective: 1000px;
  z-index: 5;
  opacity: 0;
  
  @media (max-width: 768px) {
    position: relative;
    margin: 100px auto;
    transform: none !important;
  }
`;

const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  cursor: pointer;
  
  ${ProjectCard}:hover & {
    transform: rotateY(180deg);
  }
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  overflow: hidden;
`;

const CardFront = styled(CardFace)`
  background: #1b1b1b;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%);
  }
`;

const CardMedia = styled.div`
  width: 100%;
  height: 60%;
  overflow: hidden;
  
  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardTitle = styled.h3`
  position: absolute;
  bottom: 70px;
  left: 0;
  width: 100%;
  padding: 0 20px;
  color: #d4af37;
  font-size: 1.5rem;
  z-index: 1;
  text-align: center;
`;

const CardTech = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  z-index: 1;
  
  span {
    background: rgba(212, 175, 55, 0.2);
    color: #d4d4d4;
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 0.7rem;
  }
`;

const CardBack = styled(CardFace)`
  background: #1b1b1b;
  transform: rotateY(180deg);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const CardDescription = styled.p`
  color: #d4d4d4;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 20px;
  flex-grow: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #333;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #d4af37;
    border-radius: 4px;
  }
`;

const CardLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: auto;
  
  a {
    display: inline-block;
    padding: 8px 15px;
    background: rgba(212, 175, 55, 0.2);
    color: #d4af37;
    text-decoration: none;
    border-radius: 5px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(212, 175, 55, 0.4);
    }
  }
`;

// Tooltip that appears when hovering on a project point
const ProjectTooltip = styled.div`
  position: absolute;
  background: rgba(27, 27, 27, 0.9);
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  transform: translate(-50%, -100%);
  margin-top: -10px;
  pointer-events: none;
  white-space: nowrap;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: rgba(27, 27, 27, 0.9) transparent transparent transparent;
  }
`;

// Component for the projects journey
const ProjectsJourney = () => {
  // Move this inside the component
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const containerRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [activeProject, setActiveProject] = useState(0);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const { sectionProgress } = useScrollStore();
  const progress = sectionProgress['projects'] || 0;
  
  // Projects data (using your existing projects)
  const projects = [
    {
      title: "What's Da Moov",
      description: "Ever been bored on a weekend with no idea what's going on nearby? That's why I built What's Da Moov! It's an app that helps you discover local events tailored just for you. I created a recommendation system that learns what you like and suggests events you'll actually want to attend. The app uses your location to find what's happening around you right now, and I made sure the interface is super easy to use with filters that help you find exactly what you're looking for. It was a fun challenge to build a backend that updates in real-time while keeping everyone's data secure.",
      tech: ["SQL", "Database Design", "HTML", "Python", "Flask"],
      media: { type: "image", src: "/assets/Whats_Da_Moov.jpg" },
      links: [{ text: "GitHub", url: "https://github.com/Lactoseandtolerance/What-s-Da-Moov" }],
      position: { x: '20%', y: '15%' }
    },
    {
      title: "Video Surveillance Technique Enhancement",
      description: "This project was my deep dive into computer vision! I wanted to see if I could make surveillance cameras smarter at detecting and tracking objects in real-time. I played around with some really cool techniques like shape context descriptors (which help computers recognize objects from their outlines) and adaptive background mixtures (which help separate moving objects from the background). The most satisfying part was seeing the system successfully track people and objects even when the lighting changed or things got partially hidden. It's like teaching a computer to see the way we do - definitely challenging but incredibly rewarding when it works!",
      tech: ["Python", "OpenCV", "Machine Learning", "Data Processing"],
      media: { type: "image", src: "/assets/Video_Surveillance_Output.jpg" },
      links: [{ text: "GitHub", url: "https://github.com/Lactoseandtolerance/Video-Surveilance-Technique" }],
      position: { x: '70%', y: '30%' }
    },
    {
      title: "Machine Learning Anime Recommendation Algorithm",
      description: "As an anime fan, I got tired of spending hours searching for new shows to watch, so I built my own recommendation system! I created this tool that suggests anime based on what you've already enjoyed. The cool part is that it works in two ways - it can find shows similar to ones you like (content-based filtering) and also recommend shows that people with similar taste enjoyed (collaborative filtering). I had to wrangle some pretty massive datasets, which was a fun challenge. I also built a simple interface with Tkinter so you can just input your favorite shows and get personalized recommendations right away. No more scrolling endlessly through streaming platforms!",
      tech: ["Python", "Pandas", "Scikit-learn", "SQL", "Tkinter", "Collaborative Filtering", "Content-Based Filtering"],
      media: { type: "image", src: "/images/wip.png" },
      links: [{ text: "GitHub", url: "https://github.com/Lactoseandtolerance/Anime-Rec-Systems" }],
      position: { x: '35%', y: '50%' }
    },
    {
      title: "Straight A's or Straight Time",
      description: "Have you ever wondered what really makes a neighborhood 'good'? My team and I were curious about how school quality and crime rates affect housing prices, so we built this tool to help home buyers make smarter decisions. We gathered data from multiple sources like Zillow and crime databases, then created visualizations that show the relationship between these factors. The coolest part was building interactive maps that let you see the 'sweet spots' – neighborhoods with good schools and low crime rates that are still affordable! I even built prediction models that can estimate how home values might change over time. This project was a fun way to apply data science to a real-world problem that affects so many people's biggest life investment.",
      tech: ["Python", "Pandas", "Scikit-learn", "Geospatial Analysis", "Tableau", "Data Visualization", "API Integration"],
      media: { type: "image", src: "/images/wip.png" },
      links: [{ text: "GitHub", url: "https://github.com/yourusername/home-sweet-home" }],
      position: { x: '60%', y: '65%' }
    },
    {
      title: "OffVibe: Audio-Based Music Recommender",
      description: "As a music lover, I was frustrated with how streaming platforms kept recommending the same popular songs. So I built OffVibe to change that! Instead of just looking at what's trending, my system analyzes the actual musical elements of songs – things like tempo, key, energy level, and danceability. I tapped into Spotify's API to grab these audio features and built a recommendation engine that focuses 80% on the music itself and just 20% on user behavior. What I'm most proud of is how this helps independent artists get discovered based on their sound, not just their streaming numbers. It's perfect for DJs looking for mixable tracks or anyone wanting to discover hidden gems that match their taste. The dashboard I created lets you input any song and instantly get recommendations based on its musical DNA!",
      tech: ["Python", "Spotify API", "Machine Learning", "Content-Based Filtering", "Web Development"],
      media: { type: "image", src: "/images/wip.png" },
      links: [{ text: "Demo", url: "https://yourdomain.com/offvibe-demo" }, { text: "GitHub", url: "https://github.com/yourusername/offvibe" }],
      position: { x: '25%', y: '80%' }
    },
    {
      title: "cloudcover: Cloud-Based Energy Forecasting",
      description: "Climate change has me thinking a lot about renewable energy, so I developed this cloud-based forecasting system for solar power generation! The problem is pretty interesting – solar energy is great, but it's unpredictable because of weather changes. I built a machine learning model that uses weather data to predict how much power solar plants will generate in the coming hours and days. The system pulls data from NASA and weather APIs, stores everything in AWS, and runs predictions automatically. What makes this project special is how it helps grid operators balance energy distribution more efficiently, reducing waste and costs. I'm particularly proud of getting the prediction accuracy within 10% of actual values – which might not sound impressive until you realize how chaotic weather patterns can be!",
      tech: ["AWS", "Python", "Machine Learning", "Time Series Analysis", "API Integration", "Flask"],
      media: { type: "image", src: "/images/wip.png" },
      links: [{ text: "Live Demo", url: "https://yourdomain.com/solarcast-demo" }, { text: "GitHub", url: "https://github.com/Lactoseandtolerance/solar_forecast_azure" }],
      position: { x: '80%', y: '88%' }
    }
  ];
  
  // Create path points for the journey
  const pathPoints = projects.map(project => ({
    x: project.position.x,
    y: project.position.y
  }));
  
  // Generate SVG path through all points
  const generatePath = (points) => {
    if (!points.length) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    // Create a curved path through all points
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      
      // Calculate control points for curve
      const cpX1 = parseFloat(prevPoint.x) + (parseFloat(currentPoint.x) - parseFloat(prevPoint.x)) / 2;
      const cpY1 = parseFloat(prevPoint.y);
      const cpX2 = parseFloat(prevPoint.x) + (parseFloat(currentPoint.x) - parseFloat(prevPoint.x)) / 2;
      const cpY2 = parseFloat(currentPoint.y);
      
      // Add curved segment to path
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${currentPoint.x} ${currentPoint.y}`;
    }
    
    return path;
  };
  
  // Calculate point position along the path
  const calculatePathPosition = (progress) => {
    // Simple linear interpolation for demo purposes
    // In a real implementation, you'd use a more accurate path position calculation
    if (progress <= 0) return pathPoints[0];
    if (progress >= 1) return pathPoints[pathPoints.length - 1];
    
    const totalPoints = pathPoints.length;
    const segmentProgress = progress * (totalPoints - 1);
    const segmentIndex = Math.floor(segmentProgress);
    const remainingProgress = segmentProgress - segmentIndex;
    
    // If we're exactly on a point
    if (remainingProgress === 0) return pathPoints[segmentIndex];
    
    // Interpolate between two points
    const startPoint = pathPoints[segmentIndex];
    const endPoint = pathPoints[segmentIndex + 1];
    
    return {
      x: `calc(${parseFloat(startPoint.x) * (1 - remainingProgress) + parseFloat(endPoint.x) * remainingProgress}%)`,
      y: `calc(${parseFloat(startPoint.y) * (1 - remainingProgress) + parseFloat(endPoint.y) * remainingProgress}%)`
    };
  };
  
  // Animate section elements when it comes into view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Animate section title
    anime.default({
      targets: container.querySelector('.section-title'),
      opacity: [0, 1],
      translateY: [30, 0],
      easing: 'easeOutExpo',
      duration: 1000,
      delay: 300
    });
    
    // Animate project cards sequentially based on scroll progress
    const cards = container.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
      const showAtProgress = index / (projects.length * 1.2);
      
      if (progress > showAtProgress) {
        anime.default({
          targets: card,
          opacity: [0, 1],
          scale: [0.8, 1],
          translateZ: [0, 50, 0],
          easing: 'easeOutElastic(1, .5)',
          duration: 1500
        });
      }
    });
    
    // Update active project
    const projectIndex = Math.min(
      projects.length - 1,
      Math.floor(progress * projects.length * 1.2)
    );
    setActiveProject(projectIndex);
    
  }, [progress, projects.length]);
  
  return (
    <ScrollSection
      id="projects"
      customStyles={`
        background-color: rgba(10, 10, 10, 0.7);
      `}
    >
      <ProjectsContainer ref={containerRef}>
        <SectionTitle className="section-title">My Projects Journey</SectionTitle>
        
        <JourneyPath>
          {/* SVG path connecting all projects */}
          <JourneyLine>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d={generatePath(pathPoints)} />
            </svg>
          </JourneyLine>
          
          {/* Points for each project on the path */}
          {projects.map((project, index) => (
            <JourneyPoint
              key={index}
              style={{
                left: project.position.x,
                top: project.position.y
              }}
              active={index === activeProject}
              onMouseEnter={() => {
                setHoveredPoint(index);
                setTooltipPos({
                  x: project.position.x,
                  y: project.position.y
                });
              }}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
          
          {/* Animated progress point that follows the path */}
          <PathProgress 
            style={{
              left: calculatePathPosition(progress).x,
              top: calculatePathPosition(progress).y
            }}
          />
          
          {/* Tooltip for hovered point */}
          {hoveredPoint !== null && (
            <ProjectTooltip
              visible={hoveredPoint !== null}
              style={{
                left: tooltipPos.x,
                top: tooltipPos.y
              }}
            >
              {projects[hoveredPoint].title}
            </ProjectTooltip>
          )}
          
          {/* Project cards */}
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              className="project-card"
              style={{
                left: isMobile ? "auto" : `calc(${project.position.x} - 175px)`,
                top: isMobile ? "auto" : `calc(${project.position.y} - 200px)`,
                zIndex: activeProject === index ? 10 : 5
              }}
            >
              <CardInner>
                <CardFront>
                  <CardMedia>
                    {project.media.type === 'video' ? (
                      <video src={project.media.src} autoPlay muted loop />
                    ) : (
                      <img src={project.media.src} alt={project.title} />
                    )}
                  </CardMedia>
                  <CardTitle>{project.title}</CardTitle>
                  <CardTech>
                    {project.tech.slice(0, 4).map((tech, i) => (
                      <span key={i}>{tech}</span>
                    ))}
                    {project.tech.length > 4 && (
                      <span>+{project.tech.length - 4}</span>
                    )}
                  </CardTech>
                </CardFront>
                
                <CardBack>
                  <CardTitle style={{ position: 'relative', top: 0, textAlign: 'left', padding: 0, marginBottom: '15px' }}>
                    {project.title}
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                  <CardLinks>
                    {project.links.map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.text}
                      </a>
                    ))}
                  </CardLinks>
                </CardBack>
              </CardInner>
            </ProjectCard>
          ))}
        </JourneyPath>
      </ProjectsContainer>
    </ScrollSection>
  );
};

export default ProjectsJourney;