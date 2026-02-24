import { useLanguage } from "../context/LanguageContext.jsx";

const LANGUAGES = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'fr', label: 'FR' },
    { code: 'de', label: 'DE' },
    { code: 'ja', label: 'JP' },
    { code: 'ru', label: 'RU' },
    { code: 'zh-CN', label: 'CN' }
];

export function Footer() {
    const { lang, setLang } = useLanguage();

    return (
        <footer className="shrink-0 border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Sección Info */}
                    <div className="flex items-center gap-4">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-black text-[10px] text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                            ARC
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black tracking-tighter text-white uppercase">
                                Raider Tracker
                            </span>

                        </div>
                    </div>

                    {/* Selector de Idioma */}
                    <div className="flex items-center gap-4">
                        <span className="hidden lg:block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            Interface_Lang:
                        </span>
                        <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                            {LANGUAGES.map((l) => (
                                <button
                                    key={l.code}
                                    onClick={() => setLang(l.code)}
                                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all duration-200 ${lang === l.code
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Links de Utilidad */}
                    <div className="flex gap-4 border-l border-slate-800 pl-6 md:flex">
                        <a href="#" className="text-[9px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Github</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}