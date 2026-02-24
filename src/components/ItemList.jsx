import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { getItems } from "../services/Api.js";
import ItemCard from "./ItemCard";
import ItemCardSkeleton from "./ItemCardSkeleton";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { Link } from "react-router-dom";

function ItemList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { favorites } = useFavorites();
    const [sortBy, setSortBy] = useState("name");

    const [visibleCount, setVisibleCount] = useState(25);
    const observer = useRef();

    const lastItemRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setVisibleCount(prev => prev + 25);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading])

    useEffect(() => {
        const loadData = async () => {
            try {
                const basicData = await getItems();
                const fullItems = await Promise.all(
                    basicData.map(async (item) => {
                        try {
                            const res = await fetch(`https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/items/${item.id}.json`);
                            const detail = await res.json();
                            return { ...item, ...detail, id: item.id };
                        } catch (e) { return item; }
                    })
                );
                setItems(fullItems);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const categories = useMemo(() => {
        const types = items.map(i => i.type).filter(Boolean);
        return ["All", "Favoritos", ...new Set(types)].sort();
    }, [items]);





    const filteredItems = useMemo(() => {
        let result = items.filter(item => {
            const id = item.id.toLowerCase();


            const isHigherLevel = id.endsWith('_ii') || id.endsWith('_iii') || id.endsWith('_iv');
            if (isHigherLevel) return false;


            const name = (typeof item.name === 'object' ? (item.name.es || item.name.en) : item.name) || "";
            const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());


            let matchesCat = false;
            if (selectedFilter === "All") {
                matchesCat = true;
            } else if (selectedFilter === "Favoritos") {
                const cleanId = item.id.replace('.json', '');
                matchesCat = favorites.includes(cleanId);
            } else {
                matchesCat = item.type === selectedFilter;
            }

            return matchesSearch && matchesCat;
        });

        // SISTEMA DE ORDENACIÓN
        return result.sort((a, b) => {
            if (sortBy === "name") {
                const nameA = (typeof a.name === 'object' ? a.name.es : a.name) || "";
                const nameB = (typeof b.name === 'object' ? b.name.es : b.name) || "";
                return nameA.localeCompare(nameB);
            }
            if (sortBy === "rarity") {
                const rarities = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
                return (rarities[b.rarity?.toLowerCase()] || 0) - (rarities[a.rarity?.toLowerCase()] || 0);
            }
            if (sortBy === "weight") {
                return (b.weightKg || 0) - (a.weightKg || 0);
            }
            if (sortBy === "value") {
                return (b.value || 0) - (a.value || 0);
            }
            return 0;
        });
    }, [items, selectedFilter, searchQuery, favorites, sortBy]);


    const itemsToDisplay = useMemo(() => {
        return filteredItems.slice(0, visibleCount);
    }, [filteredItems, visibleCount]);


    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="mb-10 space-y-6">
                <div>
                    <h2 className="text-3xl font-black border-l-4 border-blue-500 pl-4 uppercase text-white tracking-tighter">
                        Base de Datos
                    </h2>
                    <p className="text-slate-500 text-xs font-mono mt-1 ml-4 uppercase tracking-widest">
                        Sincronizado con Central de Mando
                    </p>
                </div>
                <div className="flex flex-row items-stretch gap-4 w-full">
                    {/* BUSCADOR */}
                    <input
                        className="flex-1 bg-slate-900/50 border border-slate-700 text-white px-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                        placeholder="Buscar..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* SELECT */}
                    <div className="relative group shrink-0">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="h-full bg-slate-900/50 border border-slate-700 text-white pl-6 pr-16 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] outline-none appearance-none cursor-pointer hover:border-blue-500/50 transition-colors"
                        >
                            <option value="name">Nombre</option>
                            <option value="rarity">Calidad</option>
                            <option value="weight">Masa</option>
                            <option value="value">Valor</option>
                        </select>
                        <div className="absolute right-7 top-1/2 -translate-y-1/2 pointer-events-none flex items-center border-l border-slate-700/50 pl-4">
                            <span className="text-blue-500 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.8))' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* BOTÓN FILTRAR */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`shrink-0 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border flex items-center gap-3 ${isFilterOpen
                            ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                            : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                            }`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isFilterOpen ? 'bg-blue-400 shadow-[0_0_8px_#3b82f6] animate-pulse' : 'bg-slate-700'
                            }`} />
                        {isFilterOpen ? "Cerrar" : "Filtrar"}
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ">


                        <Link
                            to="/loot-plan"
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-300 ${favorites.length > 0
                                ? 'bg-blue-600/10 border-blue-500/50 text-blue-400 hover:bg-blue-600 hover:text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                                : 'bg-slate-800/50 border-slate-700 text-slate-500 grayscale opacity-50 cursor-not-allowed'
                                }`}
                        >
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest">Plan de Extracción</span>
                                <span className="text-[9px] opacity-70 font-mono">{favorites.length} Objetivos fijados</span>
                            </div>
                            <div className="text-xl">📋</div>
                        </Link>
                    </div>
                </div>



                {isFilterOpen && (
                    <div className="flex flex-wrap gap-2 p-4 bg-slate-900/50 rounded-2xl">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedFilter(cat)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-bold border ${selectedFilter === cat ? 'bg-blue-600 border-blue-400' : 'bg-slate-800 border-slate-700'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Grid de Contenido */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => <ItemCardSkeleton key={`sk-${i}`} />)
                ) : itemsToDisplay.length > 0 ? (
                    <>
                        {itemsToDisplay.map((item, index) => {
                            // Si es el último ítem de la lista actual, le ponemos la referencia del observer
                            if (itemsToDisplay.length === index + 1) {
                                return (
                                    <div ref={lastItemRef} key={item.id}>
                                        <ItemCard itemId={item.id.replace('.json', '')} />
                                    </div>
                                );
                            }
                            return <ItemCard key={item.id} itemId={item.id.replace('.json', '')} />;
                        })}
                    </>
                ) : (
                    <p className="col-span-full text-center text-slate-500 py-20">Sin resultados</p>
                )}
            </div>

            {/* Indicador de carga inferior (opcional) */}
            {!loading && filteredItems.length > visibleCount && (
                <div className="text-center py-10">
                    <p className="text-slate-600 font-mono text-[10px] animate-pulse uppercase">Cargando más suministros...</p>
                </div>
            )}
        </div>
    );

}

export default ItemList;