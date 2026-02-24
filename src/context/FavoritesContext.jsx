import React, { createContext, useState, useEffect, useContext } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('arc_raiders_favs');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('arc_raiders_favs', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (itemId) => {
        const cleanId = itemId.replace('.json', '');
        setFavorites(prev =>
            prev.includes(cleanId)
                ? prev.filter(id => id !== cleanId)
                : [...prev, cleanId]
        );
    };

    const isFavorite = (itemId) => favorites.includes(itemId.replace('.json', ''));

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}