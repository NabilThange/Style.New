import React, { useState } from 'react';
import { KeyRound, X, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface ApiKeyModalProps {
    onSave: (key: string) => void;
    onSkip: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, onSkip }) => {
    const [key, setKey] = useState('');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onSkip}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header Decoration */}
                <div className="h-32 bg-gradient-to-r from-gray-900 to-gray-800 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20">
                        <KeyRound className="w-8 h-8 text-white" />
                    </div>
                    <button
                        onClick={onSkip}
                        className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 pt-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Unlock Style AI</h2>
                        <p className="text-gray-500 text-sm">
                            Enter your Gemini API key to start generating unlimited outfits and virtual try-ons.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 pl-1">
                                Google Gemini API Key
                            </label>
                            <input
                                type="password"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                placeholder="AIzaSy..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                autoFocus
                            />
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex gap-3 text-blue-900">
                            <div className="shrink-0 mt-0.5">
                                <ExternalLink className="w-4 h-4" />
                            </div>
                            <div className="text-xs space-y-1">
                                <p className="font-bold">Instead Visit Us on Google AI Studio</p>
                                <p className="opacity-80 leading-relaxed">
                                    Use Style for free in Google AI Studio.
                                </p>
                                <a
                                    href="https://aistudio.google.com/apps/drive/1iPHoSyJtDL7EoTInH-VPTadYK0RPZRrk?fullscreenApplet=true"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 font-bold underline hover:text-blue-700"
                                >
                                    Visit Style &rarr;
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-6">
                            <Button
                                onClick={() => key && onSave(key)}
                                disabled={!key}
                                variant="primary"
                                className="w-full py-4 text-base shadow-lg"
                            >
                                Start Creating
                            </Button>
                            <button
                                onClick={onSkip}
                                className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest py-2"
                            >
                                Skip for now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
