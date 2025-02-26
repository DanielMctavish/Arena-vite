import React from 'react';
import { Warning } from '@mui/icons-material';

function AlertModal({ isOpen, onClose, title, message }) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center 
            justify-center z-[999] animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="bg-[#1c2833] w-[90%] max-w-[400px] rounded-xl shadow-lg 
                shadow-black/30 p-6 transform animate-scaleIn"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#e6a429]/20 
                    flex items-center justify-center">
                        <Warning className="text-[#e6a429] text-4xl" />
                    </div>

                    <h2 className="text-xl font-bold text-white text-center">
                        {title}
                    </h2>

                    <p className="text-white/80 text-center">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className="mt-2 px-6 py-2 bg-gradient-to-r from-[#e6a429] to-[#ffd700]
                        rounded-lg text-white font-medium hover:opacity-90 
                        transition-opacity duration-200"
                    >
                        Entendi
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AlertModal; 