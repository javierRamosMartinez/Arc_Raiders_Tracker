import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

function CraftingCalculator({ recipe, upgradeCost, allItems }) {

    const activeData = recipe || upgradeCost;
    const isUpgrade = !recipe && upgradeCost;


    const [expandedIngredient, setExpandedIngredient] = useState(null);

    const suggestions = useMemo(() => {
        if (!activeData || !allItems || allItems.length === 0) return {};
        const results = {};

        Object.keys(activeData).forEach(ingredient => {
            const neededAmount = activeData[ingredient];
            const sources = allItems.filter(item => {
                return item.recyclesInto &&
                    item.recyclesInto[ingredient] &&
                    item.recyclesInto[ingredient] > 0;
            }).map(item => ({
                id: item.id,
                name: typeof item.name === 'object' ? item.name.es || item.name.en : item.name,
                yield: item.recyclesInto[ingredient],
                requiredToRecycle: Math.ceil(neededAmount / item.recyclesInto[ingredient]),
                image: item.imageFilename
            }));
            results[ingredient] = sources;
        });

        return results;
    }, [activeData, allItems]);

    const toggleExpand = (ingredient) => {
        setExpandedIngredient(expandedIngredient === ingredient ? null : ingredient);
    };


    if (!activeData) return null;

    return (
        <div className={`mt-10 p-6 rounded-3xl border shadow-2xl backdrop-blur-md ${isUpgrade ? 'bg-orange-900/20 border-orange-500/30' : 'bg-slate-900/80 border-blue-500/30'
            }`}>
            <h3 className="text-xl font-black text-white mb-8 uppercase tracking-tight flex items-center gap-3">
                <span className={`animate-pulse text-2xl ${isUpgrade ? 'text-orange-500' : 'text-blue-500'}`}>
                    {isUpgrade ? '▲' : '◈'}
                </span>
                {isUpgrade ? 'Planificador de Mejora de Equipo' : 'Planificador de Fabricación'}
            </h3>

            {Object.keys(activeData).map(ingredient => {
                const isExpanded = expandedIngredient === ingredient;
                const hasSuggestions = suggestions[ingredient]?.length > 0;

                return (
                    <div key={ingredient} className="mb-3 last:mb-0 overflow-hidden border border-slate-700/50 rounded-2xl bg-slate-800/20">

                        <button
                            onClick={() => toggleExpand(ingredient)}
                            className={`w-full flex items-center gap-4 p-4 transition-all ${isExpanded
                                ? (isUpgrade ? 'bg-orange-500/10' : 'bg-blue-500/10')
                                : 'hover:bg-slate-700/30'
                                }`}
                        >
                            <div className="w-8 h-8 bg-slate-900/50 rounded-lg p-1 border border-slate-700 flex-shrink-0">
                                <img
                                    src={`https://cdn.arctracker.io/items/${ingredient}.png`}
                                    alt={ingredient}
                                    className="w-full h-full object-contain"
                                    onError={(e) => e.target.src = 'https://cdn.arctracker.io/items/unknown.png'}
                                />
                            </div>

                            <div className="flex-1 text-left">
                                <h4 className={`text-xs font-bold uppercase tracking-widest transition-colors ${isExpanded
                                    ? (isUpgrade ? 'text-orange-400' : 'text-blue-400')
                                    : 'text-slate-300'
                                    }`}>
                                    {ingredient.replace(/_/g, ' ')}
                                </h4>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${isUpgrade
                                    ? 'text-orange-300 bg-orange-500/20 border-orange-500/30'
                                    : 'text-blue-300 bg-blue-500/20 border-blue-500/30'
                                    }`}>
                                    x{activeData[ingredient]}
                                </span>
                                <span className={`text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </div>
                        </button>

                        <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100 p-4' : 'max-h-0 opacity-0 pointer-events-none'
                            }`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {hasSuggestions ? (
                                    suggestions[ingredient].map(source => (
                                        <Link
                                            to={`/item/${source.id}`}
                                            key={source.id}
                                            className="bg-slate-900/40 p-3 rounded-xl flex items-center gap-4 border border-slate-700/30 hover:border-blue-500/50 hover:bg-slate-800 transition-all group"
                                        >
                                            <div className="w-10 h-10 bg-slate-900 rounded-lg p-1.5 border border-slate-800 group-hover:scale-110 transition-transform">
                                                <img src={source.image} className="w-full h-full object-contain" alt="" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-[10px] font-black uppercase truncate">
                                                    {source.name}
                                                </p>
                                                <p className="text-[9px] text-slate-500 leading-tight">
                                                    Da <span className="text-blue-400 font-bold">{source.yield}</span> |
                                                    Necesitas <span className="text-orange-400 font-bold">{source.requiredToRecycle}</span>
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-[9px] text-slate-600 font-mono py-2 uppercase tracking-tighter text-balance">
                                        No se han detectado fuentes de desguace para este componente
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default CraftingCalculator;