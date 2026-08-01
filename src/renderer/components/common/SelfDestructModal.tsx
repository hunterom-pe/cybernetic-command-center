import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, X, Lock, Check } from 'lucide-react';
import { useCyberSFX } from '../../hooks/useCyberSFX';

interface SelfDestructModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SelfDestructModal: React.FC<SelfDestructModalProps> = ({ isOpen, onClose }) => {
  const { playClickSFX, playChimeSFX } = useCyberSFX();
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes (300 seconds)
  const [overrideInput, setOverrideInput] = useState('');
  const [isAborted, setIsAborted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen || isAborted) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isAborted]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleAbortAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSFX();

    if (overrideInput.trim().toUpperCase() === '4-7-B' || overrideInput.trim().toUpperCase() === '47B') {
      playChimeSFX();
      setIsAborted(true);
      setErrorMessage('');
    } else {
      setErrorMessage('INVALID OVERRIDE CODE. ACCESS DENIED.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-lg animate-fade-in">
      <div className="bg-[#121218] border-2 border-[#FF3300] rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(255,51,0,0.6)] overflow-hidden font-mono">
        {/* Flashing Red Emergency Header */}
        <div className="p-4 bg-[#FF3300] text-black font-extrabold flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-2 text-sm tracking-wider">
            <ShieldAlert size={18} />
            <span>USCSS NOSTROMO // EMERGENCY SELF-DESTRUCT</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-black hover:bg-black/20">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-center">
          {!isAborted ? (
            <>
              <div className="space-y-1">
                <div className="text-slate-400 text-xs">EVACUATION COUNTDOWN TIMER</div>
                <div className="text-6xl font-extrabold text-[#FF3300] tracking-tight drop-shadow-[0_0_15px_rgba(255,51,0,0.8)] font-sans">
                  {formattedTime}
                </div>
                <div className="text-amber-400 text-[10px] font-bold">
                  OPTION TO OVERRIDE EXPIRING IN T-MINUS 5 MINUTES
                </div>
              </div>

              {/* Override Input Form */}
              <form onSubmit={handleAbortAttempt} className="space-y-3 bg-[#1A1A24] p-4 rounded-xl border border-[#2A2A36]">
                <div className="text-slate-300 text-xs font-bold uppercase flex items-center justify-center space-x-1">
                  <Lock size={12} className="text-amber-400" />
                  <span>ENTER EMERGENCY OVERRIDE CODE (CODE: 4-7-B)</span>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={overrideInput}
                    onChange={(e) => setOverrideInput(e.target.value)}
                    placeholder="e.g. 4-7-B"
                    className="flex-1 bg-[#121218] border border-[#2A2A36] rounded-lg px-3 py-2 text-center text-white text-sm font-bold uppercase focus:outline-none focus:border-[#FF3300]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#FF3300] text-black font-extrabold hover:bg-red-500 transition-colors text-xs"
                  >
                    ABORT
                  </button>
                </div>

                {errorMessage && (
                  <div className="text-[#FF3300] text-[10px] font-bold animate-bounce">
                    {errorMessage}
                  </div>
                )}
              </form>
            </>
          ) : (
            /* Aborted Screen */
            <div className="py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-950 border border-[#00FF66] text-[#00FF66] flex items-center justify-center mx-auto">
                <Check size={24} />
              </div>
              <div className="text-[#00FF66] text-lg font-bold">SELF-DESTRUCT SEQUENCE ABORTED</div>
              <div className="text-slate-400 text-xs">
                MU/TH/UR 6000 EMERGENCY OVERRIDE ACKNOWLEDGED. NOSTROMO CORE STABILIZED.
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 rounded-lg bg-[#00FF66] text-black font-extrabold"
              >
                RETURN TO DASHBOARD
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
