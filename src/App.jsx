import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ItemList from "./components/ItemList"
import ItemDetail from "./components/ItemDetail";
import LootPlan from "./components/LootPlan";
import { Footer } from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden">

        <header className="px-8 py-6 border-b border-slate-700 bg-slate-900 z-10">
          <h1 className="text-3xl font-black text-blue-500 tracking-tighter">
            ARC <span className="text-white text-xl">TRACKER PORTFOLIO</span>
          </h1>
        </header>

        <main className="grow overflow-y-auto custom-scrollbar p-8">
          <Routes>
            <Route path="/" element={<ItemList />} />
            <Route path="/item/:itemName" element={<ItemDetail />} />
            <Route path="/loot-plan" element={<LootPlan />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;