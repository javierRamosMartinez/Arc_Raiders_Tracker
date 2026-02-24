import { useState, useEffect } from "react";

export function useFavorites() {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('arc_raiders_favs');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('arc_raiders_favs', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (itemId) => {
        setFavorites(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        );
    };

    const isFavorite = (itemId) => favorites.includes(itemId);

    return { favorites, toggleFavorite, isFavorite };
}