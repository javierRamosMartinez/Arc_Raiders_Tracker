import React from "react";

function ItemCardSkeleton() {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-between h-64 animate-pulse overflow-hidden relative ">

            <div className="w-28 h-28 bg-slate-700 rounded-full mb-4"></div>

            <div className="h-4 w-3/4 bg-slate-700 rounded mb-2"></div>

            <div className="h-3 w-1/2 bg-slate-700 rounded"></div>

            <div className="
                absolute 
                inset-0 
                bg-gradient-to-r 
                from-transparent 
                via-slate-700/30 
                to-transparent 
                animate-shimmer
            "></div>
        </div>
    )
}

export default ItemCardSkeleton;