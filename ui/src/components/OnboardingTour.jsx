import React, { useState, useEffect } from 'react';
import { tour, tooltips } from '../i18n/en/cursorText';

/**
 * Onboarding Tour Component
 * Provides a guided tour of the IDS Editor interface
 * Props:
 * - isActive: boolean - whether tour should be active
 * - onComplete: () => void - callback when tour is completed
 * - onSkip: () => void - callback when tour is skipped
 */
export default function OnboardingTour({ isActive = false, onComplete = () => {}, onSkip = () => {} }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState(null);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      setCurrentStep(0);
    } else {
      setIsVisible(false);
      setCurrentStep(0);
    }
  }, [isActive]);

  useEffect(() => {
    if (isVisible && currentStep < tour.steps.length) {
      const step = tour.steps[currentStep];
      const element = document.querySelector(step.target);
      
      if (element) {
        setHighlightedElement(element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // If element not found, move to next step
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 100);
      }
    }
  }, [currentStep, isVisible]);

  const nextStep = () => {
    if (currentStep < tour.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeTour = () => {
    setIsVisible(false);
    setCurrentStep(0);
    setHighlightedElement(null);
    onComplete();
  };

  const skipTour = () => {
    setIsVisible(false);
    setCurrentStep(0);
    setHighlightedElement(null);
    onSkip();
  };

  if (!isVisible || currentStep >= tour.steps.length) {
    return null;
  }

  const step = tour.steps[currentStep];
  const element = highlightedElement;

  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  const tooltipStyle = {
    position: 'absolute',
    top: step.placement === 'bottom' ? rect.bottom + scrollTop + 10 : 
         step.placement === 'top' ? rect.top + scrollTop - 10 : 
         rect.top + scrollTop + rect.height / 2,
    left: step.placement === 'left' ? rect.left + scrollLeft - 10 :
          step.placement === 'right' ? rect.right + scrollLeft + 10 :
          rect.left + scrollLeft + rect.width / 2,
    transform: step.placement === 'left' ? 'translateX(-100%)' :
               step.placement === 'right' ? 'translateX(0)' :
               'translateX(-50%)',
    zIndex: 10000
  };

  const highlightStyle = {
    position: 'absolute',
    top: rect.top + scrollTop - 4,
    left: rect.left + scrollLeft - 4,
    width: rect.width + 8,
    height: rect.height + 8,
    border: '2px solid #007bff',
    borderRadius: '4px',
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    zIndex: 9999,
    pointerEvents: 'none'
  };

  return (
    <>
      {/* Highlight overlay */}
      <div style={highlightStyle} />
      
      {/* Tooltip */}
      <div className="tour-tooltip" style={tooltipStyle}>
        <div className="tour-tooltip-content">
          <div className="tour-tooltip-header">
            <span className="tour-step-counter">
              {currentStep + 1} of {tour.steps.length}
            </span>
            <button className="tour-close" onClick={skipTour}>×</button>
          </div>
          
          <div className="tour-tooltip-body">
            <p>{step.content}</p>
          </div>
          
          <div className="tour-tooltip-footer">
            <div className="tour-progress">
              <div 
                className="tour-progress-bar"
                style={{ width: `${((currentStep + 1) / tour.steps.length) * 100}%` }}
              />
            </div>
            
            <div className="tour-controls">
              <button 
                className="tour-btn tour-btn-secondary" 
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Previous
              </button>
              
              {currentStep === tour.steps.length - 1 ? (
                <button className="tour-btn tour-btn-primary" onClick={completeTour}>
                  {tooltips.tourComplete}
                </button>
              ) : (
                <button className="tour-btn tour-btn-primary" onClick={nextStep}>
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Arrow */}
        <div className={`tour-arrow tour-arrow-${step.placement}`} />
      </div>
    </>
  );
}
