import React from 'react';
import { HeroSection } from '../landing/HeroSection';
import { ProblemStatement } from '../landing/ProblemStatement';
import { PlatformProcess } from '../landing/PlatformProcess';
import { DisasterPlaybook } from './DisasterPlaybook';
import { EvacuationIntelligence } from '../evacuation/EvacuationIntelligence';
import { ShelterFinder } from './ShelterFinder';
import { ComparisonStory } from '../landing/ComparisonStory';
import { DifferentiationSection } from '../landing/DifferentiationSection';
import { LastMileSection } from '../landing/LastMileSection';
import { HomeSafetyStatus } from './HomeSafetyStatus';

interface CitizenHomeProps {
  onOpenReportModal: () => void;
  onOpenAIChat: () => void;
  onNavigateToMap?: () => void;
  onNavigateToShelters?: () => void;
}

export const CitizenHome: React.FC<CitizenHomeProps> = ({
  onOpenReportModal,
  onOpenAIChat,
  onNavigateToMap,
  onNavigateToShelters
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Safety Status Widget */}
      <HomeSafetyStatus />

      {/* 1. HERO SECTION (5-10s Immediate Comprehension) */}
      <HeroSection
        onExploreIntelligence={() => scrollToSection('evacuation-intelligence')}
        onOpenAIChat={onOpenAIChat}
        onOpenReportModal={onOpenReportModal}
      />

      {/* 2. EXPLAIN THE PROBLEM IMMEDIATELY */}
      <ProblemStatement />

      {/* 3. HOW THE PLATFORM WORKS (5-Step Flow) */}
      <PlatformProcess />

      {/* 4. RAPID 10-SECOND DISASTER PLAYBOOKS */}
      <div id="disaster-playbook">
        <DisasterPlaybook
          onNavigateToMap={onNavigateToMap || (() => scrollToSection('evacuation-intelligence'))}
          onNavigateToShelters={onNavigateToShelters || (() => scrollToSection('shelter-finder'))}
          onOpenReportModal={onOpenReportModal}
        />
      </div>

      {/* 5. ADAPTIVE EVACUATION INTELLIGENCE (Core Differentiator) */}
      <div id="evacuation-intelligence">
        <EvacuationIntelligence />
      </div>

      {/* 6. NEAREST VERIFIED SHELTERS & RELIEF HUBS */}
      <div id="shelter-finder">
        <ShelterFinder />
      </div>

      {/* 7. WHY DISASTER X IS DIFFERENT (Comparison) */}
      <ComparisonStory />

      {/* 8. 5 INNOVATION PILLARS */}
      <DifferentiationSection />

      {/* 9. ZERO-CONNECTIVITY LAST MILE RELIABILITY */}
      <LastMileSection />

    </div>
  );
};
