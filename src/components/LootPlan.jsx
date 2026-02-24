import { useMemo, useState, useEffect } from "react";
import { getItems } from "../services/Api";
import { useFavorites } from "../context/FavoritesContext";
import { Link } from "react-router-dom";

function LootPlan() {
    const { favorites } = useFavorites();
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const items = await getItems();
                const full = await Promise.all(items.map(async (f) => {
                    try {
                        const fileName = f.id.endsWith('.json') ? f.id : `${f.id}.json`;
                        const res = await fetch(`https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/items/${fileName}`);
                        if (!res.ok) return null;
                        const data = await res.json();
                        return { ...data, id: f.id.replace('.json', '') };
                    } catch (e) { return null; }
                }));
                setAllItems(full.filter(item => item !== null));
            } catch (error) {
                console.error("Error crítico:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const toggleSection = (id) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const lootPlanData = useMemo(() => {
        if (!allItems.length || !favorites.length) return [];
        const neededMaterialIds = new Set();

        favorites.forEach(favId => {
            const cleanFavId = favId.replace('.json', '');
            const item = allItems.find(i => i.id.replace('.json', '') === cleanFavId);

            if (!item) return;

            // Si tiene receta, pedimos sus ingredientes. 
            // Si NO tiene receta, lo pedimos a él directamente.
            if (item.recipe && Object.keys(item.recipe).length > 0) {
                if (typeof item.recipe === 'object' && !Array.isArray(item.recipe)) {
                    Object.keys(item.recipe).forEach(matId => {
                        neededMaterialIds.add(matId.replace('.json', ''));
                    });
                } else if (Array.isArray(item.recipe)) {
                    item.recipe.forEach(req => {
                        if (req.id) neededMaterialIds.add(req.id.replace('.json', ''));
                    });
                }
            } else {
                // Si es un material base o ítem sin receta: lo añadimos para buscar sus fuentes
                neededMaterialIds.add(cleanFavId);
            }
        });

        return Array.from(neededMaterialIds).map(matId => {
            const materialInfo = allItems.find(i => i.id.replace('.json', '') === matId);
            const targetId = matId.toLowerCase();

            // 1. Obtenemos las fuentes
            let sources = allItems.filter(i => {
                if (!i.recyclesInto) return false;



                if (typeof i.recyclesInto === 'object' && !Array.isArray(i.recyclesInto)) {
                    return Object.keys(i.recyclesInto).some(key =>
                        key.replace('.json', '').toLowerCase() === targetId
                    );
                }
                if (Array.isArray(i.recyclesInto)) {
                    return i.recyclesInto.some(r =>
                        (r.id || "").replace('.json', '').toLowerCase() === targetId
                    );
                }
                return false;
            });

            // 2. Ordenamos
            sources.sort((a, b) => {
                const aWeight = a.isWeapon ? 1 : 0;
                const bWeight = b.isWeapon ? 1 : 0;
                if (aWeight !== bWeight) return aWeight - bWeight;
                return (a.type || "").localeCompare(b.type || "");
            });

            return {
                materialId: matId,
                name: materialInfo?.name?.es || materialInfo?.name?.en || materialInfo?.name || matId,
                sources: sources
            };
        }).filter(group => group.sources.length > 0);
    }, [allItems, favorites]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-mono text-blue-400 animate-pulse text-xs uppercase tracking-widest">Sincronizando con la base de datos...</p>
        </div>
    );

    if (favorites.length === 0) return (
        <div className="max-w-4xl mx-auto mt-20 p-10 border-2 border-dashed border-slate-800 rounded-3xl text-center">
            <p className="text-slate-500 font-mono uppercase text-sm tracking-widest">No hay objetivos fijados.</p>
            <Link to="/" className="inline-block mt-6 text-blue-500 hover:text-blue-400 font-bold uppercase text-xs tracking-widest">← Volver</Link>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Prioridades de Recolección</h1>
                    <p className="text-blue-500 font-mono text-[10px] mt-2 tracking-[0.3em] uppercase">Basado en {favorites.length} objetivos fijados</p>
                </div>
                <Link to="/" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest border-b border-slate-800 pb-1">Volver</Link>
            </header>

            <div className="space-y-4">
                {lootPlanData.map((group) => {
                    const isOpen = expandedSections[group.materialId];

                    return (
                        <section key={group.materialId} className="border border-slate-800 rounded-3xl overflow-hidden bg-slate-900/20 transition-all">
                            <button
                                onClick={() => toggleSection(group.materialId)}
                                className="w-full flex items-center justify-between p-6 hover:bg-slate-800/40 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`text-blue-500 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>▶</div>
                                    <h2 className="text-lg font-bold text-white uppercase tracking-tight">{group.name}</h2>
                                    <span className="px-3 py-1 rounded-full bg-slate-800 text-[9px] text-slate-400 font-mono uppercase">
                                        {group.sources.length} Fuentes
                                    </span>
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                                    {isOpen ? 'Contraer' : 'Expandir'}
                                </span>
                            </button>

                            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100 p-6 pt-0' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                <div className="h-px bg-slate-800 mb-6"></div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {group.sources.map(source => {
                                        const imgUrl = source.imageFilename || `https://cdn.arctracker.io/items/${source.id}.png`;
                                        const displayName = typeof source.name === 'object' ? (source.name.es || source.name.en) : source.name;

                                        return (
                                            <Link
                                                to={`/item/${source.id}`}
                                                key={source.id}
                                                className="group bg-slate-950/40 border border-slate-800/50 p-4 rounded-2xl hover:border-blue-500/50 transition-all flex flex-col items-center shadow-lg"
                                            >
                                                <div className="w-16 h-16 mb-3 flex items-center justify-center p-2 bg-slate-950 rounded-xl border border-slate-800 group-hover:bg-blue-950/20 transition-colors">
                                                    <img
                                                        src={imgUrl}
                                                        alt={displayName}
                                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=?'; }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-bold text-center uppercase leading-tight group-hover:text-white">
                                                    {displayName}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}

export default LootPlan;