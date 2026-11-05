import { useState, useEffect } from 'react';
import { signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { CheckCircle2, X } from 'lucide-react';
import { auth, db, appId } from './config/firebase';
import { BRAND_CONFIG, INITIAL_SERVICES_SEED } from './utils/constants';
import PublicLanding from './pages/PublicLanding';
import AdminPortal from './pages/AdminPortal';

const STORAGE_KEYS = {
  SERVICES: 'rosy_salon_services_v1',
  SETTINGS: 'rosy_salon_settings_v1',
};

const normalizeServices = (list) =>
  (list || []).map((item, idx) => ({
    ...item,
    id: item.id || item.seedId || `servico-${idx + 1}`,
  }));

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizeServices(parsed);
        }
      }
    } catch (e) {
      console.warn('Erro ao ler serviços do localStorage:', e);
    }
    return normalizeServices(INITIAL_SERVICES_SEED);
  });

  const [salonSettings, setSalonSettings] = useState(() => {
    const defaultSettings = {
      adminEmail: 'rosy@salaobeleza.com',
      adminPin: 'rosy2025',
      promoBannerText: 'Preços acessíveis e promoções frequentes para cuidar da sua beleza e bem-estar!',
      whatsappNumber: BRAND_CONFIG.whatsappNumber,
    };
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Erro ao ler configurações do localStorage:', e);
    }
    return defaultSettings;
  });

  const [currentRoute, setCurrentRoute] = useState(() => window.location.hash === '#/admin' ? 'admin' : 'public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.warn('Não foi possível salvar serviços no localStorage:', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(salonSettings));
    } catch (e) {
      console.warn('Não foi possível salvar configurações no localStorage:', e);
    }
  }, [salonSettings]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const handleHashChange = () => setCurrentRoute(window.location.hash === '#/admin' ? 'admin' : 'public');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route) => {
    setCurrentRoute(route);
    window.location.hash = route === 'admin' ? '#/admin' : '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window !== 'undefined' && window.__initial_auth_token) {
          await signInWithCustomToken(auth, window.__initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('Erro ao inicializar autenticação:', err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const servicesColRef = collection(db, 'artifacts', appId, 'public', 'data', 'salon_services');
    const settingsDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'salon_settings', 'config');

    const unsubscribeServices = onSnapshot(servicesColRef, async (snapshot) => {
      if (snapshot.empty) {
        try {
          for (const item of INITIAL_SERVICES_SEED) {
            const docId = item.id || item.seedId;
            const serviceDoc = doc(db, 'artifacts', appId, 'public', 'data', 'salon_services', docId);
            await setDoc(serviceDoc, { ...item, id: docId, updatedAt: new Date().toISOString() });
          }
        } catch (seedError) {
          console.error('Erro ao popular serviços iniciais:', seedError);
        }
      } else {
        const loadedServices = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        loadedServices.sort((a, b) => (a.order || 99) - (b.order || 99));
        setServices(normalizeServices(loadedServices));
      }
      setIsLoadingData(false);
    }, (error) => {
      console.error('Erro ao carregar catálogo de serviços:', error);
      setIsLoadingData(false);
    });

    const unsubscribeSettings = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) setSalonSettings((prev) => ({ ...prev, ...docSnap.data() }));
    }, (error) => {
      console.error('Erro ao carregar configurações:', error);
    });

    return () => { unsubscribeServices(); unsubscribeSettings(); };
  }, [user]);

  const salonRepository = {
    async createService(serviceData) {
      const newId = `servico-${Date.now()}`;
      const newService = {
        ...serviceData,
        id: newId,
        seedId: newId,
        price: Number(serviceData.price) || 0,
        order: Number(serviceData.order) || services.length + 1,
        updatedAt: new Date().toISOString(),
      };

      setServices((prev) => [...prev, newService]);

      if (user) {
        try {
          await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'salon_services'), newService);
        } catch (err) {
          console.error('Erro ao salvar novo serviço no Firebase:', err);
        }
      }
      showToast(`Serviço "${serviceData.name}" adicionado com sucesso!`);
    },

    async updateService(id, updatedFields) {
      if (!id) return;
      const normalizedUpdates = {
        ...updatedFields,
        ...(updatedFields.price !== undefined ? { price: Number(updatedFields.price) } : {}),
        updatedAt: new Date().toISOString(),
      };

      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...normalizedUpdates } : s))
      );

      if (user) {
        try {
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'salon_services', id), normalizedUpdates);
        } catch (err) {
          console.error('Erro ao atualizar serviço no Firebase:', err);
        }
      }
      showToast('Alterações salvas!');
    },

    async deleteService(id, name) {
      if (!id) return;
      setServices((prev) => prev.filter((s) => s.id !== id));

      if (user) {
        try {
          await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'salon_services', id));
        } catch (err) {
          console.error('Erro ao remover serviço no Firebase:', err);
        }
      }
      showToast(`Serviço "${name}" removido.`, 'info');
    },

    async restoreDefaultCatalog() {
      const restored = normalizeServices(INITIAL_SERVICES_SEED).map((item) => ({
        ...item,
        updatedAt: new Date().toISOString(),
      }));
      setServices(restored);

      if (user) {
        try {
          for (const item of restored) {
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'salon_services', item.id), item);
          }
        } catch (err) {
          console.error('Erro ao restaurar catálogo no Firebase:', err);
        }
      }
      showToast('Catálogo padrão restaurado com sucesso!');
    },

    async applyBulkPercentageAdjustment(percentage) {
      const factor = 1 + Number(percentage) / 100;
      const now = new Date().toISOString();

      setServices((prev) =>
        prev.map((s) => ({
          ...s,
          price: Math.round(Number(s.price) * factor),
          updatedAt: now,
        }))
      );

      if (user) {
        try {
          for (const s of services) {
            await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'salon_services', s.id), {
              price: Math.round(Number(s.price) * factor),
              updatedAt: now,
            });
          }
        } catch (err) {
          console.error('Erro ao aplicar reajuste no Firebase:', err);
        }
      }
      showToast(`Reajuste de ${percentage}% aplicado!`);
    },

    async saveSettings(newSettings) {
      setSalonSettings((prev) => ({ ...prev, ...newSettings }));

      if (user) {
        try {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'salon_settings', 'config'), newSettings, { merge: true });
        } catch (err) {
          console.error('Erro ao salvar configurações no Firebase:', err);
        }
      }
      showToast('Configurações atualizadas!');
    },
  };

  return (
    <div className="min-h-screen bg-[#1f1e1f] text-white font-sans selection:bg-[#F23030] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400&display=swap');
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
        .font-sans { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        html { scroll-behavior: smooth; }
      `}</style>

      {toast && (
        <div className="fixed top-20 right-4 z-[100] max-w-sm animate-bounce">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md ${toast.type === 'error' ? 'bg-red-950/95 border-red-500 text-red-100' : 'bg-zinc-900/95 border-[#F23030] text-white'}`}>
            <CheckCircle2 className="w-5 h-5 text-[#F23030] shrink-0" />
            <p className="text-sm font-medium">{toast.message}</p>
            <button onClick={() => setToast(null)} className="ml-auto text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {currentRoute === 'admin' ? (
        <AdminPortal services={services} isLoadingData={isLoadingData} salonSettings={salonSettings} isAdminAuthenticated={isAdminAuthenticated} setIsAdminAuthenticated={setIsAdminAuthenticated} salonRepository={salonRepository} onNavigatePublic={() => navigateTo('public')} showToast={showToast} />
      ) : (
        <PublicLanding services={services} isLoadingData={isLoadingData} salonSettings={salonSettings} onNavigateAdmin={() => navigateTo('admin')} isAdminAuthenticated={isAdminAuthenticated} />
      )}
    </div>
  );
}
