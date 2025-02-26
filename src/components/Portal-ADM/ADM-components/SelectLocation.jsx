import React from 'react';
import { LocationOn } from '@mui/icons-material';

function SelectLocation({ localList, setLocalId }) {
    return (
        <div className="relative w-full max-w-[300px]">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <LocationOn className="text-[#e6a429]" />
            </div>
            
            <select
                onChange={(e) => setLocalId(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#1f2735] text-white rounded-lg
                border border-[#8499c2] hover:border-[#e6a429] 
                focus:border-[#e6a429] focus:ring-2 focus:ring-[#e6a429]/20
                outline-none appearance-none cursor-pointer
                transition-all duration-200"
            >
                <option value="">Selecione um local</option>
                {localList.map((local) => (
                    <option
                        key={local.id}
                        value={local.id}
                        className="bg-[#1f2735] text-white"
                    >
                        {local.nome}
                    </option>
                ))}
            </select>

            {/* Seta customizada */}
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg 
                    className="w-4 h-4 text-[#e6a429]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
        </div>
    );
}

export default SelectLocation;