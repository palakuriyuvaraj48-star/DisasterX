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

interface CitizenHomeProps {
  onOpenReportModal: () => void;
  onOpenAIChat: () => void;
}

export const CitizenHome: React.FC<CitizenHomeProps> = ({
  onOpenReportModal,
  onOpenAIChat
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-16">
      
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

      {/* 4. RAPID CITIZEN PLAYBOOK ("Are you in danger?") */}
      <section id="disaster-playbook">
        <DisasterPlaybook
          onNavigateToMap={() => scrollToSection('evacuation-intelligence')}
          onNavigateToShelters={() => scrollToSection('verified-shelters')}
          onOpenReportModal={onOpenReportModal}
        />
      </section>

      {/* 5. DEDICATED EVACUATION INTELLIGENCE ("Find the safest way out") */}
      <section id="evacuation-intelligence">
        <EvacuationIntelligence />
      </section>

      {/* 6. VERIFIED SHELTERS DIRECTORY */}
      <section id="verified-shelters">
        <ShelterFinder
          onSelectShelterOnMap={() => scrollToSection('evacuation-intelligence')}
        />
      </section>

      {/* 7. COMPARISON STORY (Traditional vs DisasterGuard) */}
      <ComparisonStory />

      {/* 8. DIFFERENTIATION (Why this is different) */}
      <DifferentiationSection />

      {/* 9. BUILT FOR THE LAST MILE */}
      <LastMileSection />

    </div>
  );
};
