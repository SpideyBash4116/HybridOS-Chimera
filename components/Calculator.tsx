
import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  
  const buttons = [
    ['AC', '+/-', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  return (
    <div className="h-full bg-black/80 flex flex-col p-6 font-sans">
      <div className="flex-1 flex flex-col justify-end items-end p-4 mb-6">
        <span className="text-[10px] uppercase font-black tracking-widest opacity-20 mb-2">Hybrid Compute</span>
        <h1 className="text-6xl font-thin tracking-tighter text-white tabular-nums truncate w-full text-right">{display}</h1>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {buttons.flat().map((btn) => {
          const isOperator = ['/', '*', '-', '+', '='].includes(btn);
          const isAction = ['AC', '+/-', '%'].includes(btn);
          const isZero = btn === '0';

          return (
            <button
              key={btn}
              onClick={() => {
                if (btn === 'AC') setDisplay('0');
                else if (display === '0') setDisplay(btn);
                else setDisplay(prev => prev + btn);
              }}
              className={`
                h-14 rounded-2xl text-lg font-bold transition-all active:scale-90
                ${isZero ? 'col-span-2' : ''}
                ${isOperator ? 'bg-orange-500 text-white hover:bg-orange-400 shadow-lg shadow-orange-500/20' : 
                  isAction ? 'bg-white/10 text-white hover:bg-white/20' : 
                  'bg-white/5 text-white hover:bg-white/10 border border-white/5'}
              `}
            >
              {btn}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calculator;
