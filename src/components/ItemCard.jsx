import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23475569" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;

function ItemCard({ itemId }) {
    const [itemData, setItemData] = useState(null);
    const { isFavorite, toggleFavorite } = useFavorites();
    const fav = isFavorite(itemId);
    const { lang } = useLanguage();

    // Colores 
    const rarityColors = {
        common: "100, 116, 139",
        uncommon: "16, 185, 129",
        rare: "59, 130, 246",
        epic: "168, 85, 247",
        legendary: "245, 158, 11",
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/items/${itemId}.json`);
                if (!response.ok) throw new Error();
                const data = await response.json();
                setItemData(data);
            } catch (err) { console.error(err); }
        };
        fetchDetails();
    }, [itemId]);

    const rarity = (itemData?.rarity || 'common').toLowerCase();
    const rgb = rarityColors[rarity] || rarityColors.common;

    const getDisplayBame = () => {
        if (!itemData) return itemId.replace(/_/g, ' ');
        const names = itemData.name;
        if (typeof names === 'object') {
            return names[lang] || names.en || Object.values(names)[0];
        }
        return names;
    };

    const displayName = getDisplayBame();

    return (
        <Link
            to={`/item/${itemId}`}
            style={{ "--r-color": rgb }}
            className="relative group bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col items-center transition-all duration-500 hover:-translate-y-1.5
            hover:border-[rgba(var(--r-color),0.5)] 
            hover:shadow-[0_8px_30px_rgb(0,0,0,0.4),0_0_15px_rgba(var(--r-color),0.15)] 
            hover:bg-slate-900/60"
        >
            {/* Efecto en hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[rgba(var(--r-color),0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Botón Favorito */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(itemId);
                }}
                className={`absolute top-4 right-4 z-30 p-2 rounded-full transition-all duration-300 ${fav ? 'text-blue-500 scale-110' : 'text-slate-600 hover:text-slate-300'
                    }`}
            >
                {fav ? '★' : '☆'}
            </button>

            {/* Contenedor Imagen */}
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                {/* "Aura" de la imagen */}
                <div className="absolute inset-0 bg-[rgba(var(--r-color),0.1)] blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <img
                    src={itemData?.imageFilename || `https://cdn.arctracker.io/items/${itemId}.png`}
                    alt={displayName}
                    className="relative w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                    onError={(e) => { e.target.src = PLACEHOLDER_SVG; }}
                />
            </div>

            <div className="w-full text-center relative z-10">
                <span
                    style={{ color: `rgb(var(--r-color))` }}
                    className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2 block opacity-80"
                >
                    {itemData?.rarity || 'Common'}
                </span>

                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white capitalize truncate px-2 transition-colors">
                    {displayName}
                </h3>


                <div className="mt-5 pt-4 border-t border-slate-800/60 group-hover:border-[rgba(var(--r-color),0.3)] transition-colors duration-500">
                    <span
                        style={{ color: `rgb(var(--r-color))` }}
                        className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 group-hover:opacity-90 transition-all"
                    >
                        Analizar
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default ItemCard;