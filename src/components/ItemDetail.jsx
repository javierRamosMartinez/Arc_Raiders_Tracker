import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItems } from "../services/Api";
import { useLanguage } from "../context/LanguageContext.jsx";
import CraftingCalculator from "./CraftingCalculator";

function ItemDetail() {
    const { lang } = useLanguage();
    const { itemName } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mapeo de colores para el Glow dinámico
    const rarityColors = {
        common: "100, 116, 139",
        uncommon: "16, 185, 129",
        rare: "59, 130, 246",
        epic: "168, 85, 247",
        legendary: "245, 158, 11",
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resItem = await fetch(`https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/items/${itemName}.json`);
                const dataItem = await resItem.json();
                setItem(dataItem);

                const rawFiles = await getItems();
                const fullItemsData = await Promise.all(
                    rawFiles.map(async (file) => {
                        try {
                            const id = file.id.replace('.json', '');
                            const res = await fetch(`https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/items/${id}.json`);
                            return await res.json();
                        } catch (e) { return null; }
                    })
                );
                setAllItems(fullItemsData.filter(i => i !== null));
            } catch (error) {
                console.error("Error cargando base de datos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [itemName]);

    // Lógica de traducción 
    const getTranslation = (field) => {
        if (!item || !item[field]) return "";
        const content = item[field];
        if (typeof content === 'object') {
            return content[lang] || content['en'] || Object.values(content)[0];
        }
        return content;
    };

    const hasBlueprintInDB = useMemo(() => {
        if (!item || allItems.length === 0) return false;
        const baseId = item.id.replace('_i', '');
        const expectedBlueprintId = `${baseId}_blueprint`;
        return allItems.some(i => i.id === expectedBlueprintId);
    }, [item, allItems]);

    if (loading) return <div className="p-20 text-center font-mono text-blue-500 animate-pulse uppercase tracking-[0.3em]">Analizando componentes...</div>;
    if (!item) return <div className="p-20 text-center text-red-500 font-black uppercase">Registro no encontrado.</div>;

    const rgb = rarityColors[item.rarity?.toLowerCase()] || rarityColors.common;

    return (
        <div className="max-w-4xl mx-auto p-4 animate-in fade-in duration-500" style={{ "--r-color": rgb }}>
            <button
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-slate-400 hover:text-[rgb(var(--r-color))] transition-colors uppercase text-xs font-black tracking-widest"
            >
                <span>←</span> {lang === 'es' ? 'Volver al Inventario' : 'Back to Inventory'}
            </button>

            <div className="flex flex-col gap-6">
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
                    <div className="flex flex-col md:flex-row">
                        {/* Imagen */}
                        <div className="md:w-1/2 bg-slate-950/40 p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-800">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[rgba(var(--r-color),0.15)] blur-[50px] rounded-full" />
                                <img
                                    src={item.imageFilename}
                                    alt={getTranslation('name')}
                                    className="relative w-64 h-64 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                                />
                            </div>
                        </div>

                        {/* Texto */}
                        <div className="md:w-1/2 p-10 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-6">
                                <span
                                    style={{ backgroundColor: `rgb(var(--r-color))` }}
                                    className="px-3 py-1 text-[10px] font-black text-white rounded-full uppercase tracking-wider"
                                >
                                    {item.rarity || 'Common'}
                                </span>
                                <span className="text-slate-600 text-[10px] font-mono uppercase tracking-widest">UID: {item.id}</span>
                            </div>

                            <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter leading-none">
                                {getTranslation('name')} {item.value && (
                                    <span className="text-xl font-light text-amber-500/80 italic tracking-normal">
                                        {item.value.toLocaleString()}<span className="text-[10px] ml-1 not-italic opacity-60">₵</span>
                                    </span>
                                )}
                            </h2>

                            <p className="text-slate-400 text-lg leading-relaxed mb-8 italic font-medium opacity-90">
                                "{getTranslation('description')}"
                            </p>

                            {/* Alerta de Blueprint */}
                            {(item.blueprintLocked || hasBlueprintInDB) && (
                                <div className="mb-8 flex items-center gap-4 bg-[rgba(var(--r-color),0.05)] border-l-4 border-[rgb(var(--r-color))] p-4 rounded-r-2xl">
                                    <div style={{ color: `rgb(var(--r-color))` }} className="text-xl">📑</div>
                                    <div>
                                        <p style={{ color: `rgb(var(--r-color))` }} className="text-[10px] font-black uppercase tracking-[0.2em]">Restricted Access</p>
                                        <p className="text-slate-200 text-xs font-bold uppercase mt-1">
                                            {lang === 'es' ? 'Requiere Plano de Fabricación' : 'Requires Blueprint to craft'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                {/* MASA */}
                                <div className="bg-slate-900/20 border border-slate-800/40 p-5 rounded-2xl flex flex-col justify-between min-h-[110px]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-[2px] h-3 bg-blue-500/50"></div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                            {lang === 'es' ? 'Masa' : 'Mass'}
                                        </p>
                                    </div>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="text-3xl font-light text-white italic">
                                            {item.weightKg || '0.00'}
                                        </span>
                                        <span className="text-xs font-mono text-blue-400/60 uppercase">kg</span>
                                    </div>
                                    <div className="mt-4 w-full h-[1px] bg-gradient-to-r from-blue-500/30 to-transparent"></div>
                                </div>

                                {/* CATEGORÍA */}
                                <div className="bg-slate-900/20 border border-slate-800/40 p-5 rounded-2xl flex flex-col justify-between min-h-[110px]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-[2px] h-3 bg-slate-600"></div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                            {lang === 'es' ? 'Tipo' : 'Type'}
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-xl font-light text-white uppercase tracking-wider truncate">
                                            {item.type || 'Material'}
                                        </p>
                                        <p className="text-[7px] font-mono text-slate-600 mt-1 uppercase tracking-widest">
                                            Data_Stream://{item.type || 'Object'}
                                        </p>
                                    </div>
                                </div>

                                {/* STACK SIZE */}
                                <div className="bg-slate-900/20 border border-slate-800/40 p-5 rounded-2xl flex flex-col justify-between min-h-[110px] col-span-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-[2px] h-3 bg-blue-500/50"></div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                            {lang === 'es' ? 'Apilamiento' : 'Stack'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-3xl font-light text-blue-400 leading-none">
                                            {item.stackSize || '1'}
                                        </span>
                                        <div className="flex flex-col border-l border-slate-800/80 pl-2">
                                            <span className="text-[8px] font-bold text-slate-500 uppercase leading-none">Units</span>
                                            <span className="text-[8px] font-bold text-slate-700 uppercase mt-1 italic">Limit</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-1">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i} className={`h-[2px] w-[2px] rounded-full ${i < 3 ? 'bg-blue-500/40' : 'bg-slate-800'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {(item.recipe || item.upgradeCost) && (
                    <div className="animate-in slide-in-from-bottom-4 duration-700">
                        <CraftingCalculator
                            recipe={item.recipe}
                            upgradeCost={item.upgradeCost}
                            allItems={allItems}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ItemDetail;