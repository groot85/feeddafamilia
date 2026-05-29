import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { 
  Heart, 
  PlusSquare, 
  Home, 
  Baby,
  Users,
  ChevronLeft,
  Sparkles,
  History,
  CheckCircle2,
  Calendar,
  Star,
  Laugh,
  ShieldCheck
} from 'lucide-react';

// --- CONFIGURAÇÃO DO FIREBASE (GitHub Safe) ---
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_AUTH_DOMAIN_AQUI",
    projectId: "SEU_PROJECT_ID_AQUI",
    storageBucket: "SEU_STORAGE_BUCKET_AQUI",
    messagingSenderId: "SEU_SENDER_ID_AQUI",
    appId: "SEU_APP_ID_AQUI"
};

// Inicialização segura para ambientes React
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'family-feed-github-ready';

export default function App() {
  const [user, setUser] = useState(null);
  const [memories, setMemories] = useState([]);
  const [view, setView] = useState('selection'); 
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    userName: '',
    birthDayMonth: '', 
    schoolOrJob: '', 
    favoriteMusic: '',
    favoriteColor: '',
    favoriteFood: '',
    admiredTrait: '',
    funnyMoment: '',
    biggestTalent: '',
    avatarColor: 'bg-indigo-500'
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Erro na autenticação anônima:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'memories');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const sorted = data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setMemories(sorted);
      setLoading(false);
    }, (err) => {
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    setFormData({
      userName: '',
      birthDayMonth: '',
      schoolOrJob: '',
      favoriteMusic: '',
      favoriteColor: '',
      favoriteFood: '',
      admiredTrait: '',
      funnyMoment: '',
      biggestTalent: '',
      avatarColor: 'bg-indigo-500'
    });
    setView('form');
    window.scrollTo(0,0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const colors = ['bg-blue-600', 'bg-purple-600', 'bg-rose-600', 'bg-orange-600', 'bg-emerald-600', 'bg-indigo-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newEntry = {
      ...formData,
      role: role,
      avatarColor: randomColor,
      createdAt: serverTimestamp(),
      userId: user.uid
    };

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'memories'), newEntry);
      setView('feed');
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Erro ao salvar dados de extensão:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col font-sans text-slate-900 border-x border-slate-100 overflow-hidden">
      
      {view === 'feed' && (
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <History size={18} />
            </div>
            <h1 className="text-lg font-black tracking-tight uppercase italic text-indigo-900">
              Mural da Família
            </h1>
          </div>
          <button onClick={() => setView('selection')} className="bg-indigo-50 p-2 rounded-full hover:bg-indigo-100 transition-colors">
            <PlusSquare size={22} className="text-indigo-600" />
          </button>
        </header>
      )}

      <main className="flex-1 overflow-y-auto">
        
        {view === 'selection' && (
          <div className="flex flex-col items-center justify-center p-8 space-y-10 animate-in fade-in zoom-in duration-500 pt-12">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 mx-auto transform rotate-3">
                <Sparkles size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Bem-vindos!</h2>
              <p className="text-slate-500 text-sm font-medium px-4">Quem está participando agora?</p>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full">
              <button 
                onClick={() => selectRole('parent')}
                className="group flex items-center gap-4 p-5 bg-slate-50 border-2 border-transparent hover:border-indigo-500 hover:bg-white rounded-3xl transition-all text-left shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-50">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base">Sou Pai/Mãe</h3>
                  <p className="text-[10px] text-slate-400 font-medium italic uppercase tracking-tighter">Vou falar sobre meu filho(a)</p>
                </div>
              </button>

              <button 
                onClick={() => selectRole('child')}
                className="group flex items-center gap-4 p-5 bg-slate-50 border-2 border-transparent hover:border-rose-500 hover:bg-white rounded-3xl transition-all text-left shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-50">
                  <Baby size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base">Sou Filho(a)</h3>
                  <p className="text-[10px] text-slate-400 font-medium italic uppercase tracking-tighter">Vou falar sobre meus pais</p>
                </div>
              </button>
            </div>
            
            <button onClick={() => setView('feed')} className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-indigo-600">
              Ver Memórias Salvas
            </button>
          </div>
        )}

        {view === 'form' && (
          <div className="p-6 pb-32 animate-in slide-in-from-right duration-500">
            <button onClick={() => setView('selection')} className="flex items-center gap-2 text-slate-400 mb-6 font-black text-[10px] uppercase tracking-widest">
              <ChevronLeft size={16} /> Voltar
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 leading-tight">Suas Respostas</h2>
              <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <ShieldCheck size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-blue-700 leading-tight">
                  PRIVACIDADE: Use apelidos ou apenas o primeiro nome. NÃO coloque sobrenomes nem o ano de nascimento.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seu Nome ou Apelido</label>
                  <input required placeholder="Ex: Bia, Rafa, Guga..." className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-indigo-400 focus:bg-white outline-none transition-all font-bold"
                    value={formData.userName} onChange={(e) => setFormData({...formData, userName: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dia e Mês de Aniversário (dele/a)</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 text-slate-300" size={18} />
                    <input required type="text" placeholder="Ex: 12 de Maio" className="w-full bg-slate-50 p-4 pl-12 rounded-2xl border-2 border-transparent focus:border-indigo-400 outline-none font-bold"
                      value={formData.birthDayMonth} onChange={(e) => setFormData({...formData, birthDayMonth: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{role === 'parent' ? "Turma Escolar" : "Profissão dele/a"}</label>
                  <input required placeholder="Ex: 5º Ano B / Engenheiro" className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-indigo-400 outline-none font-bold"
                    value={formData.schoolOrJob} onChange={(e) => setFormData({...formData, schoolOrJob: e.target.value})} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] border-b border-emerald-50 pb-2">Favoritos</h3>
                <input required placeholder="Estilo de música ou banda" className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-emerald-400 outline-none font-bold"
                  value={formData.favoriteMusic} onChange={(e) => setFormData({...formData, favoriteMusic: e.target.value})} />
                <input required placeholder="Cor favorita" className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-emerald-400 outline-none font-bold"
                  value={formData.favoriteColor} onChange={(e) => setFormData({...formData, favoriteColor: e.target.value})} />
                <input required placeholder="Comida favorita" className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-emerald-400 outline-none font-bold"
                  value={formData.favoriteFood} onChange={(e) => setFormData({...formData, favoriteFood: e.target.value})} />
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] border-b border-rose-50 pb-2">Sobre Ele(a)</h3>
                <textarea required placeholder="O que você mais admira?" className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-rose-400 outline-none font-bold h-20 resize-none"
                  value={formData.admiredTrait} onChange={(e) => setFormData({...formData, admiredTrait: e.target.value})} />
                <textarea required placeholder="Um momento engraçado..." className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-rose-400 outline-none font-bold h-20 resize-none"
                  value={formData.funnyMoment} onChange={(e) => setFormData({...formData, funnyMoment: e.target.value})} />
                <input required placeholder="Qual o maior talento?" className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-rose-400 outline-none font-bold"
                  value={formData.biggestTalent} onChange={(e) => setFormData({...formData, biggestTalent: e.target.value})} />
              </div>

              <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-95">
                SALVAR NO MURAL
                <CheckCircle2 size={20} />
              </button>
            </form>
          </div>
        )}

        {view === 'feed' && (
          <div className="p-4 space-y-6 pb-24 animate-in fade-in duration-500">
            {memories.length === 0 ? (
              <div className="text-center py-20 px-8 opacity-50">
                <History size={40} className="mx-auto mb-4" />
                <p className="font-bold text-sm">O mural está vazio.</p>
              </div>
            ) : (
              memories.map((m) => (
                <article key={m.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-4 flex items-center justify-between border-b border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg ${m.avatarColor}`}>
                        {m.userName?.charAt(0) || '?'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-slate-900 truncate">{m.userName}</h4>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md inline-block ${m.role === 'parent' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                          {m.role === 'parent' ? 'Pai/Mãe' : 'Filho(a)'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter flex items-center justify-end gap-1">
                        <Calendar size={10} /> {m.birthDayMonth}
                      </p>
                      <p className="text-[9px] font-bold text-indigo-400 uppercase truncate max-w-[80px]">
                        {m.schoolOrJob}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-4 bg-slate-50/50 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase">Música</p>
                      <p className="text-[10px] font-bold truncate">{m.favoriteMusic}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase">Cor</p>
                      <p className="text-[10px] font-bold truncate">{m.favoriteColor}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase">Comida</p>
                      <p className="text-[10px] font-bold truncate">{m.favoriteFood}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex gap-3">
                      <Heart size={16} className="text-rose-400 shrink-0 mt-0.5" />
                      <p className="text-xs font-medium text-slate-700 italic leading-relaxed">"{m.admiredTrait}"</p>
                    </div>
                    <div className="flex gap-3">
                      <Laugh size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                      <p className="text-xs font-medium text-slate-700 italic leading-relaxed">"{m.funnyMoment}"</p>
                    </div>
                    <div className="bg-indigo-600 p-3 rounded-2xl flex items-center justify-between text-white shadow-md shadow-indigo-100 mt-2">
                       <div className="flex items-center gap-2">
                          <Star size={14} fill="white" />
                          <p className="text-xs font-black tracking-tight">{m.biggestTalent}</p>
                       </div>
                       <Sparkles size={14} className="opacity-50" />
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </main>

      {/* Menu Inferior Fixo */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-slate-100 flex justify-around py-4 z-50">
        <button onClick={() => setView('feed')} className={`flex flex-col items-center gap-1 ${view === 'feed' ? 'text-indigo-600' : 'text-slate-300'}`}>
          <Home size={22} />
          <span className="text-[8px] font-black uppercase">Mural</span>
        </button>
        <button onClick={() => setView('selection')} className={`flex flex-col items-center gap-1 ${view === 'form' || view === 'selection' ? 'text-indigo-600' : 'text-slate-300'}`}>
          <PlusSquare size={22} />
          <span className="text-[8px] font-black uppercase">Novo</span>
        </button>
      </nav>

    </div>
  );
}