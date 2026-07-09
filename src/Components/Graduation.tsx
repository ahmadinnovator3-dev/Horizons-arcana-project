import React, { useState, useEffect } from 'react';
import { useApp } from '../Context/AppContext';
import { PixelCompanion } from './PixelCompanion';
import { Award, GraduationCap, ArrowRight, Heart, Sparkles, BookOpen, Smile, Loader2 } from 'lucide-react';

export const Graduation: React.FC = () => {
    const { companionCustomization, companionName, currentUser, stats, setView, logout } = useApp();
    const [step, setStep] = useState<number>(0);
    const [countdown, setCountdown] = useState<number>(5);


    useEffect(() => {
        if (step === 4) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [step]);


    useEffect(() => {
        if (step === 4 && countdown === 0) {
            logout();
        }
    }, [countdown, step, logout]);

    return(
        <div className="min-h-screen bg-black text-emerald-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-mono overflow-hidden relative select-none">
         
        </div>
    )
}