/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Layers, 
  Weight, 
  Maximize, 
  ArrowRightLeft, 
  RefreshCcw, 
  Info,
  ChevronDown,
  Scissors,
  CircleDollarSign
} from 'lucide-react';

// --- TYPES ---
interface PETRecord {
  thickness: number; // мкр
  weightPerM2: number; // гр
  m2PerKg: number; // кол-во м2 в 1кг
}

// --- DATA SERVICE ---
const DEFAULT_PET_DATA: PETRecord[] = [
  { thickness: 11, weightPerM2: 15.4083, m2PerKg: 64.9 },
  { thickness: 11.5, weightPerM2: 16.1031, m2PerKg: 62.1 },
  { thickness: 12, weightPerM2: 16.8067, m2PerKg: 59.5 },
  { thickness: 12.5, weightPerM2: 17.5131, m2PerKg: 57.1 },
  { thickness: 13, weightPerM2: 18.2149, m2PerKg: 54.9 },
  { thickness: 15, weightPerM2: 21.0158, m2PerKg: 47.6 },
  { thickness: 19, weightPerM2: 26.5957, m2PerKg: 37.6 },
  { thickness: 19.5, weightPerM2: 27.3224, m2PerKg: 36.6 },
  { thickness: 20, weightPerM2: 28.0112, m2PerKg: 35.7 },
  { thickness: 20.5, weightPerM2: 28.7356, m2PerKg: 34.8 },
  { thickness: 21, weightPerM2: 29.4118, m2PerKg: 34 },
  { thickness: 21.5, weightPerM2: 30.1205, m2PerKg: 33.2 },
  { thickness: 22, weightPerM2: 30.7692, m2PerKg: 32.5 },
  { thickness: 22.5, weightPerM2: 31.5457, m2PerKg: 31.7 },
  { thickness: 23, weightPerM2: 32.2581, m2PerKg: 31 },
  { thickness: 23.5, weightPerM2: 32.8947, m2PerKg: 30.4 },
  { thickness: 24, weightPerM2: 33.557, m2PerKg: 29.8 },
  { thickness: 24.5, weightPerM2: 34.2466, m2PerKg: 29.2 },
  { thickness: 25, weightPerM2: 34.965, m2PerKg: 28.6 },
  { thickness: 25.5, weightPerM2: 35.7143, m2PerKg: 28 },
  { thickness: 26, weightPerM2: 36.3636, m2PerKg: 27.5 },
  { thickness: 26.5, weightPerM2: 37.037, m2PerKg: 27 },
  { thickness: 27, weightPerM2: 37.7358, m2PerKg: 26.5 },
  { thickness: 27.5, weightPerM2: 38.4615, m2PerKg: 26 },
  { thickness: 28, weightPerM2: 39.2157, m2PerKg: 25.5 },
  { thickness: 28.5, weightPerM2: 39.8406, m2PerKg: 25.1 },
  { thickness: 29, weightPerM2: 40.6504, m2PerKg: 24.6 },
  { thickness: 30, weightPerM2: 42.0168, m2PerKg: 23.8 },
  { thickness: 31, weightPerM2: 43.4783, m2PerKg: 23 },
  { thickness: 32, weightPerM2: 44.843, m2PerKg: 22.3 },
  { thickness: 32.5, weightPerM2: 45.4545, m2PerKg: 22 },
  { thickness: 33, weightPerM2: 46.2963, m2PerKg: 21.6 },
  { thickness: 33.5, weightPerM2: 46.9484, m2PerKg: 21.3 },
  { thickness: 34, weightPerM2: 47.619, m2PerKg: 21 },
  { thickness: 34.5, weightPerM2: 48.3092, m2PerKg: 20.7 },
  { thickness: 35, weightPerM2: 49.0196, m2PerKg: 20.4 },
  { thickness: 35.5, weightPerM2: 49.7512, m2PerKg: 20.1 },
  { thickness: 36, weightPerM2: 50.5051, m2PerKg: 19.8 },
  { thickness: 36.5, weightPerM2: 51.0204, m2PerKg: 19.6 },
  { thickness: 37, weightPerM2: 51.8135, m2PerKg: 19.3 },
  { thickness: 37.5, weightPerM2: 52.6316, m2PerKg: 19 },
  { thickness: 38, weightPerM2: 53.1915, m2PerKg: 18.8 },
  { thickness: 38.5, weightPerM2: 53.7634, m2PerKg: 18.6 },
  { thickness: 39, weightPerM2: 54.6448, m2PerKg: 18.3 },
  { thickness: 40, weightPerM2: 55.8659, m2PerKg: 17.9 },
  { thickness: 50, weightPerM2: 70.4225, m2PerKg: 14.2 },
  { thickness: 100, weightPerM2: 140.8451, m2PerKg: 7.1 },
  { thickness: 175, weightPerM2: 250, m2PerKg: 4 },
];

// --- UTILS ---
const parseNum = (val: string) => {
  if (!val) return 0;
  const normalized = val.replace(',', '.').replace(/\s/g, '');
  const n = parseFloat(normalized);
  return isNaN(n) ? 0 : n;
};

const formatNum = (num: number, decimals: number = 2, showEmpty: boolean = true) => {
  if (num === 0 && showEmpty) return "";
  return num.toLocaleString('ru-RU', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: decimals,
    useGrouping: true
  });
};

const displayRU = (num: number, dec: number = 2) => 
  num.toLocaleString('ru-RU', { 
    minimumFractionDigits: dec, 
    maximumFractionDigits: dec,
    useGrouping: true
  });

// --- APP COMPONENT ---
export default function App() {
  const [data, setData] = useState<PETRecord[]>(DEFAULT_PET_DATA);
  const [loading, setLoading] = useState(true);
  const [selectedThickness, setSelectedThickness] = useState<number>(20);
  
  // Input fields
  const [inputs, setInputs] = useState({
    weight: "420,17",
    area: "15000",
    length: "750000",
    format: "20",
    priceKg: "0",
    priceM2: "0"
  });
  const [pricePriority, setPricePriority] = useState<'kg' | 'm2'>('kg');

  // Load cache
  useEffect(() => {
    const saved = localStorage.getItem('pet_calc_cache');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.thickness) setSelectedThickness(state.thickness);
        if (state.pricePriority) setPricePriority(state.pricePriority);
        setInputs(prev => ({ ...prev, ...state }));
      } catch (e) { console.error(e); }
    }
    setLoading(false);
  }, []);

  // Save cache
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('pet_calc_cache', JSON.stringify({ ...inputs, thickness: selectedThickness, pricePriority }));
    }
  }, [inputs, selectedThickness, pricePriority, loading]);

  const record = useMemo(() => 
    data.find(r => r.thickness === selectedThickness) || data[0]
  , [data, selectedThickness]);

  // Unified Sync Logic
  const sync = (source: string, val: string, currentFormat?: string) => {
    const v = parseNum(val);
    const updates: Partial<typeof inputs> = { [source]: val };
    const f = parseNum(currentFormat ?? inputs.format);
    const m2kg = record.m2PerKg;
    const gsm = record.weightPerM2 / 1000;

    if (source === 'weight') {
      const a = v * m2kg;
      updates.area = formatNum(a);
      updates.length = formatNum(f > 0 ? (a / (f / 1000)) : 0, 1);
    } else if (source === 'area') {
      const w = v * gsm;
      updates.weight = formatNum(w);
      updates.length = formatNum(f > 0 ? (v / (f / 1000)) : 0, 1);
    } else if (source === 'length') {
      const a = v * (f / 1000);
      updates.area = formatNum(a);
      updates.weight = formatNum(a * gsm);
    } else if (source === 'format') {
      const a = parseNum(inputs.area);
      updates.length = formatNum(v > 0 ? (a / (v / 1000)) : 0, 1);
    } else if (source === 'priceKg') {
      updates.priceM2 = formatNum(v / (m2kg || 1));
    } else if (source === 'priceM2') {
      updates.priceKg = formatNum(v * m2kg);
    }

    setInputs(prev => ({ ...prev, ...updates }));
  };

  // Recalculate on thickness or priority change
  useEffect(() => {
    if (!loading) {
      sync('area', inputs.area);
      // Sync price based on priority when thickness changes
      if (pricePriority === 'kg') {
        sync('priceKg', inputs.priceKg);
      } else {
        sync('priceM2', inputs.priceM2);
      }
    }
  }, [selectedThickness]);

  if (loading) return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <RefreshCcw className="w-8 h-8 text-brand" />
      </motion.div>
    </div>
  );

  const numWeight = parseNum(inputs.weight);
  const numArea = parseNum(inputs.area);
  const numLength = parseNum(inputs.length);
  const numPriceKg = parseNum(inputs.priceKg);

  return (
    <div className="min-h-screen flex flex-col bg-bg-base overflow-x-hidden">
      <header className="h-16 bg-white border-b border-border-subtle flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <svg width="42" height="24" viewBox="0 0 110 60" fill="none" className="drop-shadow-sm">
            <path d="M5 5V55M5 55L30 5M30 5V55" stroke="#003B64" strokeWidth="12" strokeLinejoin="round"/>
            <path d="M40 55V5H70V55" stroke="#3EA0D3" strokeWidth="12" strokeLinejoin="round"/>
            <path d="M80 5V55M105 5L80 30L105 55" stroke="#003B64" strokeWidth="12" strokeLinejoin="round"/>
          </svg>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <h1 className="text-lg font-bold text-slate-900 m-0 tracking-tight">ООО ИПК · Калькулятор ПЭТ</h1>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row gap-6 p-6 max-w-[1440px] mx-auto w-full">
        <aside className="w-full lg:w-[350px] shrink-0">
          <div className="bg-white border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col gap-6 sticky top-6">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-base font-bold text-slate-900 m-0 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-brand" /> Ввод данных
              </h2>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Измените любой параметр</p>
            </div>
            
            <InputField label="Общий вес (кг)" value={inputs.weight} onChange={(v) => sync('weight', v)} icon={<Weight className="w-3 h-3 text-brand" />} />
            <InputField label="Площадь (м²)" value={inputs.area} onChange={(v) => sync('area', v)} icon={<Maximize className="w-3 h-3 text-emerald-600" />} />

            <div className="flex flex-col gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Толщина (мкм)</label>
              <div className="relative">
                <select 
                  value={selectedThickness}
                  onChange={(e) => setSelectedThickness(parseFloat(e.target.value))}
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-lg font-bold focus:ring-2 focus:ring-brand/10 focus:border-brand appearance-none outline-none cursor-pointer"
                >
                  {data.map(r => <option key={r.thickness} value={r.thickness}>{r.thickness} мкр</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Ширина (мм)</label>
              <input type="text" value={inputs.format} onChange={(e) => sync('format', e.target.value)} className="h-11 px-3 bg-white border border-slate-200 rounded-lg text-lg font-bold outline-none" />
            </div>

            <InputField label="Длина (м.п.)" value={inputs.length} onChange={(v) => sync('length', v)} icon={<Scissors className="w-3 h-3 text-indigo-600" />} />

            <div className="space-y-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
              <label className="text-[10px] font-extrabold text-slate-700 uppercase block mb-1">Расчёт стоимости</label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className={`flex flex-col gap-1 p-2 rounded-lg border transition-all cursor-pointer ${pricePriority === 'kg' ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200 opacity-70'}`}
                  onClick={() => setPricePriority('kg')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Цена / КГ</span>
                    {pricePriority === 'kg' && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />}
                  </div>
                  <input 
                    type="text" 
                    value={inputs.priceKg} 
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => sync('priceKg', e.target.value)} 
                    className="h-8 w-full bg-transparent text-sm font-black outline-none" 
                  />
                </div>
                <div 
                  className={`flex flex-col gap-1 p-2 rounded-lg border transition-all cursor-pointer ${pricePriority === 'm2' ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200 opacity-70'}`}
                  onClick={() => setPricePriority('m2')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Цена / М²</span>
                    {pricePriority === 'm2' && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />}
                  </div>
                  <input 
                    type="text" 
                    value={inputs.priceM2} 
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => sync('priceM2', e.target.value)} 
                    className="h-8 w-full bg-transparent text-sm font-black outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="mt-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-brand leading-snug">
              <Info className="w-3 h-3 mb-1" /> При вводе одного значения остальные обновляются автоматически.
            </div>
          </div>
        </aside>

        <div className="flex-grow flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-border-subtle rounded-[2rem] p-8 shadow-sm flex flex-col justify-between">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-[0.1em] mb-4 block">Характеристика</label>
                <div className="text-5xl font-black text-slate-900 mb-2">
                  {selectedThickness} <span className="text-2xl font-normal text-text-muted">мкр</span>
                </div>
              </div>
              <div className="space-y-3 pt-6 border-t border-slate-50">
                <div className="flex justify-between items-center"><span className="text-sm text-text-muted">Вес 1м²:</span><span className="text-lg font-bold font-mono">{displayRU(record.weightPerM2, 4)} гр</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-text-muted">Квадратов в 1кг:</span><span className="text-lg font-bold font-mono">{displayRU(record.m2PerKg, 2)} м²</span></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white border border-border-subtle rounded-[2rem] p-8 shadow-sm flex flex-col justify-between">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-[0.1em] mb-4 block">Итоговый метраж</label>
                <div className="text-6xl font-black font-mono tracking-tighter text-slate-900">{displayRU(numLength, 1)}</div>
                <div className="text-xl font-medium mt-1 text-slate-800">погонных метров (м.п.)</div>
              </div>
              <div className="pt-6 border-t border-slate-50"><span className="text-sm text-text-muted">При ширине формата {inputs.format} мм</span></div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <ResultSmallCard label="Общий вес" value={displayRU(numWeight, 2)} unit="кг" icon={<Weight className="w-5 h-5 text-brand" />} colorClass="bg-blue-50/80 text-brand border-blue-100" />
            <ResultSmallCard label="Общая площадь" value={displayRU(numArea, 2)} unit="м²" icon={<Maximize className="w-5 h-5 text-emerald-600" />} colorClass="bg-emerald-50/80 text-emerald-600 border-emerald-100" />
            <ResultSmallCard label="Итоговая цена" value={formatNum(numWeight * numPriceKg, 2, false)} unit="₽" icon={<CircleDollarSign className="w-5 h-5 text-amber-600" />} colorClass="bg-amber-50/80 text-amber-600 border-amber-100" />
            <ResultSmallCard label="Количество м.п." value={displayRU(numLength, 0)} unit="м.п." icon={<Scissors className="w-5 h-5 text-indigo-600" />} colorClass="bg-indigo-50/80 text-indigo-600 border-indigo-100" />
          </div>
        </div>
      </main>

      <footer className="h-10 bg-white border-t border-border-subtle flex items-center justify-between px-6 shrink-0 text-[11px] text-text-muted uppercase tracking-widest font-semibold">
        <div>ООО ИПК | Designed by Economist</div>
        <div>Инструментарий пересчёта ПЭТ материалов</div>
      </footer>
    </div>
  );
}

function InputField({ label, value, onChange, icon }: { label: string, value: string, onChange: (v: string) => void, icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 focus-within:ring-2 focus-within:ring-brand/10 transition-all p-3 border border-slate-200 rounded-xl bg-white shadow-sm ring-offset-2">
      <label className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider flex items-center gap-1.5">{icon}{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-full bg-transparent text-xl font-bold font-mono text-slate-900 outline-none" />
    </div>
  );
}

function ResultSmallCard({ label, value, unit, icon, colorClass }: { label: string, value: string, unit: string, icon: React.ReactNode, colorClass: string }) {
  return (
    <div className="bg-white border border-border-subtle rounded-[1.5rem] p-5 shadow-sm flex items-center gap-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className={`w-12 h-12 ${colorClass.split(' ')[0]} rounded-2xl flex items-center justify-center shrink-0 border ${colorClass.split(' ').pop()}`}>{icon}</div>
      <div className="flex flex-col">
        <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1 opacity-70">{label}</label>
        <div className="flex items-baseline gap-1">
          <div className="text-xl font-black text-slate-900 font-mono tracking-tight">{value}</div>
          <span className="text-[10px] font-bold text-text-muted uppercase">{unit}</span>
        </div>
      </div>
    </div>
  );
}
