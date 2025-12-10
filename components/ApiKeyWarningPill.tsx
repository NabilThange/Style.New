import React from 'react';
import { KeyRound, ChevronRight } from 'lucide-react';

interface ApiKeyWarningPillProps {
    onOpenModal: () => void;
}

export const ApiKeyWarningPill: React.FC<ApiKeyWarningPillProps> = ({ onOpenModal }) => {
    return (
        <button
            onClick={onOpenModal}
            className="fixed top-24 right-6 z-40 flex items-center gap-3 bg-white/90 backdrop-blur-md pl-3 pr-4 py-2.5 rounded-full shadow-lg border border-red-100 group hover:shadow-xl hover:scale-105 transition-all duration-300 animate-in slide-in-from-right fade-in"
        >
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                <KeyRound className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-left">
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider leading-none mb-0.5">Missing API Key</p>
                <p className="text-xs font-medium text-gray-900 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Connect to enable AI <ChevronRight className="w-3 h-3 text-gray-400" />
                </p>
            </div>
        </button>
    );
};
