
import React, { useState, useEffect } from 'react';
import { Save, Globe, Check, Palette, Type } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

const Settings: React.FC = () => {
  const { currencySymbol, themeColor, fontFamily, pharmacyName, updateSettings } = usePharmacy();
  const [curr, setCurr] = useState(currencySymbol);
  const [color, setColor] = useState(themeColor);
  const [font, setFont] = useState(fontFamily);
  const [name, setName] = useState(pharmacyName);
  const [saved, setSaved] = useState(false);

  // Sync state with context if it changes externally
  useEffect(() => {
    setName(pharmacyName);
    setCurr(currencySymbol);
    setColor(themeColor);
    setFont(fontFamily);
  }, [pharmacyName, currencySymbol, themeColor, fontFamily]);

  const handleSave = () => {
    updateSettings({ 
      currencySymbol: curr,
      themeColor: color,
      fontFamily: font,
      pharmacyName: name
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={`space-y-6 max-w-4xl mx-auto ${font}`}>
      <div className="md:hidden">
        <h2 className="text-2xl font-extrabold text-slate-800">System Settings</h2>
        <p className="text-slate-500 font-medium">Manage application preferences</p>
      </div>

      <div className={`bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden`}>
        {/* General Info */}
        <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Globe size={20} className={`text-[var(--color-text)]`} /> General Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Pharmacy Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none font-medium bg-white`} 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Currency Symbol</label>
                    <select 
                      value={curr}
                      onChange={(e) => setCurr(e.target.value)}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none font-medium bg-white`}
                    >
                        <option value="$">$ - USD</option>
                        <option value="€">€ - EUR</option>
                        <option value="₱">₱ - PHP</option>
                        <option value="£">£ - GBP</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Appearance Settings */}
        <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Palette size={20} className={`text-[var(--color-text)]`} /> Appearance & Theme
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Theme Color</label>
                    <div className="grid grid-cols-5 gap-3">
                        {['amber', 'teal', 'blue', 'rose', 'emerald'].map((c) => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`h-10 rounded-lg border-2 flex items-center justify-center transition-all ${color === c ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent'}`}
                                style={{ backgroundColor: `var(--color-${c}-400, ${c === 'amber' ? '#fbbf24' : c === 'teal' ? '#2dd4bf' : c === 'blue' ? '#60a5fa' : c === 'rose' ? '#fb7185' : '#34d399'})` }}
                            >
                                {color === c && <Check size={16} className="text-slate-900" />}
                                {/* Fallback inline styles for visual representation if tailwind classes don't load immediately in preview */}
                                <div className={`w-full h-full rounded-md opacity-80`} style={{ backgroundColor: c === 'amber' ? '#fbbf24' : c === 'teal' ? '#2dd4bf' : c === 'blue' ? '#60a5fa' : c === 'rose' ? '#fb7185' : '#34d399' }}></div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Type size={16}/> Font Family</label>
                    <select 
                      value={font}
                      onChange={(e) => setFont(e.target.value)}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none font-medium bg-white`}
                    >
                        <option value="font-sans">Sans Serif (Inter/System)</option>
                        <option value="font-serif">Serif (Merriweather)</option>
                        <option value="font-mono">Monospace (Coding)</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="p-6 bg-gray-50 flex justify-end">
            <button 
              onClick={handleSave}
              className={`bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-2`}
            >
                {saved ? <Check size={20} /> : <Save size={20} />}
                {saved ? 'Changes Saved' : 'Save Changes'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
