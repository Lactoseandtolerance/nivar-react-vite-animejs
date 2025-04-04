import * as anime from 'animejs';

// This utility provides a consistent way to use anime.js throughout the project
const animeHelper = {
  animate: (params) => {
    return anime.default(params);
  },
  
  set: (targets, values) => {
    return anime.default.set(targets, values);
  },
  
  // Helper for stagger function
  stagger: (value, options) => {
    return anime.default.stagger(value, options);
  },
  
  // Helper for setting dash offset
  setDashoffset: (path) => {
    return anime.default.setDashoffset(path);
  },
  
  // Helper for timeline creation
  timeline: (params) => {
    return anime.default.timeline(params);
  },
  
  // Helper for easing
  getEasing: (name) => {
    return anime.default.easing[name];
  }
};

export default animeHelper;