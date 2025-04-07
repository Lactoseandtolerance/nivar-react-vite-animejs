import * as anime from 'animejs';

// This utility provides a consistent way to use anime.js throughout the project
const animeHelper = {
  animate: (params) => {
    return anime(params);
  },
  
  set: (targets, values) => {
    return anime.set(targets, values);
  },
  
  // Helper for stagger function
  stagger: (value, options) => {
    return anime.stagger(value, options);
  },
  
  // Helper for setting dash offset
  setDashoffset: (path) => {
    return anime.setDashoffset(path);
  },
  
  // Helper for timeline creation
  timeline: (params) => {
    return anime.timeline(params);
  },
  
  // Helper for easing
  getEasing: (name) => {
    return anime.easing[name];
  }
};

export default animeHelper;