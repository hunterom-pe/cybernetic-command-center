import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { Eye, Heart, Activity, ShieldCheck, Zap } from 'lucide-react';
import { useCyberSFX } from '../../hooks/useCyberSFX';

interface BaselinePrompt {
  id: string;
  question: string;
  response: string;
  pupilDelta: string;
  result: string;
}

const BASELINE_PROMPTS: BaselinePrompt[] = [
  {
    id: 'p1',
    question: 'You find a tortoise on its back in the desert. You aren’t helping. Why?',
    response: 'Capillary dilation detected. Empathy delay: 1.4s',
    pupilDelta: '+1.8mm',
    result: 'HUMAN BASELINE NORMAL'
  },
  {
    id: 'p2',
    question: 'What’s it like to hold the hand of someone you love? Interlinked.',
    response: 'Systemic pulse shift. Cells interlinked.',
    pupilDelta: '-0.6mm',
    result: 'INTERLINKED // STABLE'
  },
  {
    id: 'p3',
    question: 'A calfskin wallet is gifted for your birthday. Reaction?',
    response: 'Autonomic nervous response: Minimal thermal spike.',
    pupilDelta: '+0.2mm',
    result: 'REPLICANT TELEMETRY OK'
  }
];

export const VoightKampffWidget: React.FC = () => {
  const { playClickSFX, playChimeSFX } = useCyberSFX();
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [bpm, setBpm] = useState(74);
  const [pupilSize, setPupilSize] = useState(14);
  const [isScanning, setIsScanning] = useState(false);

  const currentPrompt = BASELINE_PROMPTS[activePromptIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setBpm(Math.floor(72 + Math.random() * 8));
      setPupilSize(12 + Math.floor(Math.random() * 6));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleNextPrompt = () => {
    playClickSFX();
    setIsScanning(true);
    setTimeout(() => {
      playChimeSFX();
      setIsScanning(false);
      setActivePromptIndex((prev) => (prev + 1) % BASELINE_PROMPTS.length);
    }, 800);
  };

  return (
    <GlassCard>
      <WidgetHeader
        icon={Eye}
        prefix="TYRELL CORP"
        title="VOIGHT-KAMPFF EMPATHY TELEMETRY"
        badge="NEXUS-6 VERIFIED"
        badgeColor="orange"
      />

      <div className="grid grid-cols-12 gap-3 h-full items-center">
        {/* Left: Animated Iris Dilation Scanner */}
        <div className="col-span-4 bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2 flex flex-col items-center justify-around h-full">
          <div className="font-mono text-[9px] text-slate-400 uppercase">IRIS SCANNER</div>

          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            {/* Outer Reticle Ring */}
            <div className="absolute inset-0 rounded-full border border-[#FF9900]/40 animate-spin" style={{ animationDuration: '10s' }} />

            {/* Glowing Iris Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="28" stroke="#FF0055" strokeWidth="2" fill="transparent" strokeDasharray="4 4" />
              <circle cx="40" cy="40" r={pupilSize} fill="#FF9900" className="transition-all duration-700" style={{ filter: 'drop-shadow(0 0 8px #FF9900)' }} />
              <circle cx="40" cy="40" r="4" fill="#FFFFFF" />
            </svg>

            {isScanning && (
              <div className="absolute inset-0 rounded-full border-2 border-[#00E5FF] animate-ping" />
            )}
          </div>

          <div className="font-mono text-[9px] text-amber-400 font-bold">
            PUPIL: {pupilSize / 4}mm
          </div>
        </div>

        {/* Right: Telemetry & Interactive Prompt */}
        <div className="col-span-8 flex flex-col justify-between h-full py-0.5">
          {/* Baseline Prompt Question */}
          <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2 space-y-1">
            <div className="font-mono text-[9px] font-bold text-[#FF9900] uppercase flex justify-between">
              <span>VOIGHT-KAMPFF QUERY // 0{activePromptIndex + 1}</span>
              <span className="text-[#00E5FF]">{currentPrompt.result}</span>
            </div>
            <div className="font-sans text-xs font-semibold text-slate-100 italic leading-snug">
              "{currentPrompt.question}"
            </div>
            <div className="font-mono text-[9px] text-slate-400 pt-0.5 border-t border-[#2A2A36]">
              {currentPrompt.response}
            </div>
          </div>

          {/* Telemetry Numbers & Action Button */}
          <div className="flex items-center justify-between font-mono text-[10px] pt-1">
            <div className="flex items-center space-x-3 text-slate-300">
              <span className="flex items-center space-x-1">
                <Heart size={11} className="text-[#FF0055] animate-pulse" />
                <span>{bpm} BPM</span>
              </span>
              <span className="flex items-center space-x-1 text-slate-400">
                <Activity size={11} className="text-[#00E5FF]" />
                <span>RESP: 16/m</span>
              </span>
            </div>

            <button
              onClick={handleNextPrompt}
              className="px-2.5 py-1 rounded bg-[#FF9900] text-black font-extrabold hover:scale-105 transition-transform flex items-center space-x-1 text-[9px]"
            >
              <Zap size={10} />
              <span>TEST BASELINE</span>
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
