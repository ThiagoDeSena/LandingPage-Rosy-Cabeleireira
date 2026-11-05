import { useState, useMemo } from 'react';
import { Sparkles, MapPin, Lock, Unlock, Search, MessageCircle, Menu, X, ArrowRight, ExternalLink, Scissors, Star, Check, Plus, Settings } from 'lucide-react';
import { BRAND_CONFIG, CATEGORIES, SALON_IMAGE_PRESETS, formatCurrency, abrirWhatsApp, agendarHorario, enviarOrcamentoWhatsApp, abrirLocalizacao } from '../utils/constants';
import SalonLogo from '../components/common/SalonLogo';

function Facebook({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
    );
}

function Instagram({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function WhatsApp({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.2.3-.777 1.028-.953 1.228-.176.2-.352.226-.653.076-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.3-.501.1-.201.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.235-.245-.587-.494-.507-.678-.516l-.578-.01c-.2 0-.527.075-.803.376s-1.053 1.028-1.053 2.508 1.079 2.909 1.229 3.11c.15.2 2.122 3.24 5.141 4.542.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.78-.727 2.031-1.43.251-.702.251-1.303.176-1.43-.076-.126-.276-.201-.577-.352zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.17L2 22l4.98-1.39C8.44 21.49 10.16 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.17c-1.64 0-3.17-.46-4.48-1.26l-.32-.2-3.32.93.94-3.23-.21-.34A8.16 8.16 0 0 1 3.83 12c0-4.505 3.665-8.17 8.17-8.17 4.505 0 8.17 3.665 8.17 8.17 0 4.505-3.665 8.17-8.17 8.17z" />
        </svg>
    );
}

export default function PublicLanding({ services, isLoadingData, salonSettings, onNavigateAdmin, isAdminAuthenticated }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBudgetIds, setSelectedBudgetIds] = useState([]);

    const activeServices = useMemo(() => services.filter((s) => s.active !== false), [services]);
    const filteredServices = useMemo(() => {
        return activeServices.filter((service) => {
            const matchesCategory = selectedCategory === 'Todos' || (selectedCategory === 'Promoções' ? service.featured : service.category === selectedCategory);
            const matchesSearch = !searchQuery.trim() || service.name.toLowerCase().includes(searchQuery.toLowerCase()) || (service.category && service.category.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [activeServices, selectedCategory, searchQuery]);

    const toggleServiceInBudget = (id) => { if (!id) return; setSelectedBudgetIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]); };
    const selectedBudgetServices = useMemo(() => activeServices.filter((s) => selectedBudgetIds.includes(s.id || s.seedId)), [activeServices, selectedBudgetIds]);
    const totalBudgetEstimate = useMemo(() => selectedBudgetServices.reduce((sum, item) => sum + (Number(item.price) || 0), 0), [selectedBudgetServices]);
    const activePhone = salonSettings?.whatsappNumber || BRAND_CONFIG.whatsappNumber;

    return (
        <div className="flex flex-col min-h-screen">
            <div className="bg-[#121212] border-b border-zinc-800/80 text-xs py-2 px-4">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[#f2e5dc]">
                        <Sparkles className="w-3.5 h-3.5 text-[#F23030] shrink-0" />
                        <span className="truncate max-w-xs sm:max-w-none">{salonSettings.promoBannerText}</span>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                        <a href={BRAND_CONFIG.mapsHeroUrl} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-1 text-zinc-400 hover:text-white transition">
                            <MapPin className="w-3.5 h-3.5 text-[#F23030]" />
                            <span>{BRAND_CONFIG.addressText}</span>
                        </a>
                        <button onClick={onNavigateAdmin} className="flex items-center gap-1.5 text-zinc-300 hover:text-[#F23030] font-medium transition bg-zinc-800/70 hover:bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-700">
                            {isAdminAuthenticated ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-[#F23030]" />}
                            <span>Área do Proprietário (/admin)</span>
                        </button>
                    </div>
                </div>
            </div>

            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md text-[#1f1e1f] shadow-md border-b border-zinc-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <a href="#first-section" className="focus:outline-none"><SalonLogo size="md" lightText={false} /></a>
                    <nav className="hidden md:flex items-center gap-8">
                        <ul className="flex items-center gap-6 text-sm font-bold uppercase tracking-wider text-[#1f1e1f]">
                            <li><a href="#first-section" className="py-2 hover:text-[#F23030] border-b-2 border-transparent hover:border-[#F23030] transition-all">Home</a></li>
                            <li><a href="#sobre-nos" className="py-2 hover:text-[#F23030] border-b-2 border-transparent hover:border-[#F23030] transition-all">Sobre nós</a></li>
                            <li><a href="#servicos" className="py-2 hover:text-[#F23030] border-b-2 border-transparent hover:border-[#F23030] transition-all">Serviços</a></li>
                            <li><a href="#contatos" className="py-2 hover:text-[#F23030] border-b-2 border-transparent hover:border-[#F23030] transition-all">Contatos</a></li>
                        </ul>
                        <div className="h-6 w-px bg-zinc-300" />
                        <div className="flex items-center gap-3">
                            <a href={BRAND_CONFIG.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-[#F23030] text-[#1f1e1f] hover:text-white flex items-center justify-center transition-colors"><Facebook className="w-4 h-4" /></a>
                            <a href={BRAND_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-[#F23030] text-[#1f1e1f] hover:text-white flex items-center justify-center transition-colors"><Instagram className="w-4 h-4" /></a>
                            <button onClick={() => agendarHorario(activePhone)} className="flex items-center gap-2 bg-[#F23030] hover:bg-[#d62020] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-md shadow-[#F23030]/20 transition-all cursor-pointer"><WhatsApp className="w-4 h-4" /><span>Agendar</span></button>
                        </div>
                    </nav>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2.5 rounded-lg text-[#F23030] hover:bg-red-50 transition">
                        {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                    </button>
                </div>
                {mobileMenuOpen && (
                    <div className="md:hidden bg-[#1f1e1f] text-white border-t border-zinc-800 px-6 py-8 space-y-6 animate-fadeIn">
                        <ul className="flex flex-col space-y-4 text-center text-lg font-serif font-semibold">
                            <li><a href="#first-section" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#F23030] transition">Home</a></li>
                            <li><a href="#sobre-nos" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#F23030] transition">Sobre nós</a></li>
                            <li><a href="#servicos" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#F23030] transition">Serviços & Preços</a></li>
                            <li><a href="#contatos" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#F23030] transition">Contatos</a></li>
                        </ul>
                        <div className="flex justify-center gap-4 pt-4 border-t border-zinc-800">
                            <a href={BRAND_CONFIG.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-zinc-800 hover:bg-[#F23030] flex items-center justify-center text-white transition"><Facebook className="w-5 h-5" /></a>
                            <a href={BRAND_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-zinc-800 hover:bg-[#F23030] flex items-center justify-center text-white transition"><Instagram className="w-5 h-5" /></a>
                            <button onClick={() => { setMobileMenuOpen(false); agendarHorario(activePhone); }} className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white transition"><WhatsApp className="w-5 h-5" /></button>
                        </div>
                        <div className="pt-2">
                            <button onClick={() => { setMobileMenuOpen(false); onNavigateAdmin(); }} className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium flex items-center justify-center gap-2 border border-zinc-700"><Lock className="w-4 h-4 text-[#F23030]" /><span>Acessar Painel Admin (/admin)</span></button>
                        </div>
                    </div>
                )}
            </header>

            <section id="first-section" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 py-20">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=85')` }} />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1d1d1d]/90 via-[#1d1d1d]/80 to-[#1f1e1f]" />
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F23030]/15 border border-[#F23030]/40 text-[#F28888] text-xs sm:text-sm font-medium tracking-wide uppercase">
                        <Sparkles className="w-4 h-4 text-[#F23030]" />
                        <span>Especialista em Beleza & Bem-Estar Feminino</span>
                    </div>
                    <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-[#F23030] drop-shadow-sm tracking-tight">Rosy Cabeleireira</h1>
                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-white/95 tracking-wide">Salão de Beleza</h2>
                    <p className="max-w-xl mx-auto text-zinc-300 text-base sm:text-lg leading-relaxed font-normal">Realce sua beleza com atendimento acolhedor no Jereissati II. Cortes, tratamentos capilares, alinhamento térmico e coloração com preços acessíveis.</p>
                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <button onClick={() => agendarHorario(activePhone)} className="w-full sm:w-60 h-14 bg-[#F23030] hover:bg-transparent text-white hover:text-[#F23030] border-2 border-[#F23030] rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-[#F23030]/25 cursor-pointer"><WhatsApp className="w-5 h-5" /><span>Agendar Horário</span></button>
                        <button onClick={() => abrirLocalizacao(BRAND_CONFIG.mapsHeroUrl)} className="w-full sm:w-60 h-14 bg-white/10 hover:bg-[#F23030] text-white border-2 border-white/25 hover:border-[#F23030] backdrop-blur-sm rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"><MapPin className="w-5 h-5" /><span>Localização</span></button>
                    </div>
                    <div className="pt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto border-t border-white/10 text-center">
                        <div><p className="font-serif text-2xl sm:text-3xl font-bold text-[#F28888]">{activeServices.length}+</p><p className="text-xs text-zinc-400 uppercase tracking-wider mt-0.5">Especialidades</p></div>
                        <div><p className="font-serif text-2xl sm:text-3xl font-bold text-[#F28888]">100%</p><p className="text-xs text-zinc-400 uppercase tracking-wider mt-0.5">Cuidado Profissional</p></div>
                        <div><p className="font-serif text-2xl sm:text-3xl font-bold text-[#F28888]">Jereissati II</p><p className="text-xs text-zinc-400 uppercase tracking-wider mt-0.5">Fácil Acesso</p></div>
                    </div>
                </div>
            </section>

            <section id="sobre-nos" className="bg-white text-[#1f1e1f] py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-[#F23030] text-xs font-bold uppercase tracking-widest"><span>Nossa História & Espaço</span></div>
                            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#F23030]">Sobre nós</h2>
                            <p className="text-lg sm:text-xl text-zinc-700 leading-relaxed font-normal">O Salão de Beleza <strong>Rosy Cabeleireira</strong> está localizado na <a href={BRAND_CONFIG.mapsAboutUrl} target="_blank" rel="noopener noreferrer" className="text-[#F23030] font-semibold underline decoration-[#F28888] underline-offset-4 hover:text-red-700 inline-flex items-center gap-1"><span>{BRAND_CONFIG.addressText}</span><ExternalLink className="w-4 h-4 inline" /></a>, oferecemos uma variedade de serviços para mulheres que desejam cuidar da sua beleza e bem-estar, com preços acessíveis e promoções frequentes.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left">
                                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3.5"><div className="p-2.5 rounded-xl bg-[#F23030]/10 text-[#F23030] shrink-0"><Sparkles className="w-5 h-5" /></div><div><h4 className="font-bold text-zinc-900 text-sm">Produtos de Qualidade</h4><p className="text-xs text-zinc-600 mt-1">Tratamentos selecionados para proteger a saúde e o brilho dos seus fios.</p></div></div>
                                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3.5"><div className="p-2.5 rounded-xl bg-[#F23030]/10 text-[#F23030] shrink-0"><Check className="w-5 h-5" /></div><div><h4 className="font-bold text-zinc-900 text-sm">Preços Acessíveis</h4><p className="text-xs text-zinc-600 mt-1">Valores transparentes e pacotes especiais para você se cuidar o ano inteiro.</p></div></div>
                            </div>
                            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                <a href={BRAND_CONFIG.mapsAboutUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1f1e1f] hover:bg-zinc-800 text-white text-sm font-semibold transition shadow-sm"><MapPin className="w-4 h-4 text-[#F23030]" /><span>Ver no Google Maps</span></a>
                                <a href="#servicos" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-[#F23030] text-sm font-semibold transition"><span>Conferir Tabela de Preços</span><ArrowRight className="w-4 h-4" /></a>
                            </div>
                        </div>
                        <div className="lg:col-span-5">
                            <div className="relative mx-auto max-w-md lg:max-w-none">
                                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#F23030]/20 to-[#F28888]/30 blur-lg" />
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-zinc-900">
                                    <img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80" alt="Espaço Rosy Cabeleireira" className="w-full h-80 sm:h-96 object-cover" />
                                    <div className="p-4 bg-[#1f1e1f] text-white flex items-center justify-between"><div><p className="font-serif font-bold text-base text-[#f2e5dc]">Rosy Cabeleireira</p><p className="text-xs text-zinc-400">{BRAND_CONFIG.addressText} • {BRAND_CONFIG.cityState}</p></div><span className="px-3 py-1 rounded-full bg-[#F23030]/20 text-[#F28888] text-xs font-semibold border border-[#F23030]/30">Aberto para Agendamentos</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="servicos" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212] relative">
                <div className="max-w-7xl mx-auto space-y-10">
                    <div className="text-center space-y-3 max-w-2xl mx-auto">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F28888]">Tabela Atualizada em Tempo Real</span>
                        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#f2e5dc]">Serviços</h2>
                        <p className="text-zinc-400 text-sm sm:text-base">Escolha o procedimento ideal para o seu cabelo. Clique em <strong className="text-white">Ver Preços</strong> para tirar dúvidas direto no WhatsApp ou selecione vários serviços para simular um pacote!</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800">
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                            {[...CATEGORIES, 'Promoções'].map((cat) => {
                                const isSelected = selectedCategory === cat;
                                return (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${isSelected ? 'bg-[#F23030] text-white shadow-md shadow-[#F23030]/25' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}>{cat === 'Promoções' ? '✨ Destaques' : cat}</button>);
                            })}
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar serviço..." className="w-full pl-9 pr-8 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F23030]" />
                            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"><X className="w-3.5 h-3.5" /></button>}
                        </div>
                    </div>
                    {isLoadingData ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3, 4, 5, 6].map((n) => <div key={n} className="h-96 rounded-2xl bg-zinc-900 animate-pulse border border-zinc-800" />)}</div>
                    ) : filteredServices.length === 0 ? (
                        <div className="text-center py-16 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8"><Scissors className="w-10 h-10 text-zinc-500 mx-auto mb-3" /><h3 className="text-lg font-bold text-white">Nenhum serviço encontrado</h3><button onClick={() => { setSelectedCategory('Todos'); setSearchQuery(''); }} className="mt-4 px-4 py-2 rounded-lg bg-[#F23030] text-white text-xs font-bold uppercase">Mostrar Todos</button></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                            {filteredServices.map((service) => {
                                const srvId = service.id || service.seedId;
                                const isSelectedForBudget = Boolean(srvId) && selectedBudgetIds.includes(srvId);
                                return (
                                    <div key={srvId} className={`group rounded-2xl overflow-hidden bg-[#dddddd] text-[#1f1e1f] shadow-xl transition-all duration-300 flex flex-col justify-between border-2 ${isSelectedForBudget ? 'border-[#F23030] ring-2 ring-[#F23030]/40 -translate-y-1' : 'border-transparent hover:-translate-y-1 hover:shadow-2xl'}`}>
                                        <div>
                                            <div className="relative h-52 w-full overflow-hidden bg-zinc-800">
                                                <img src={service.imageUrl || SALON_IMAGE_PRESETS[0].url} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.src = SALON_IMAGE_PRESETS[0].url; }} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                                                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                                                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-[11px] font-medium">{service.category || 'Salão'}</span>
                                                    {service.featured && <span className="px-2.5 py-1 rounded-md bg-[#F23030] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow"><Star className="w-3 h-3 fill-white" />Destaque</span>}
                                                </div>
                                            </div>
                                            <div className="p-5 text-center space-y-2">
                                                <h3 className="font-serif text-xl font-black uppercase tracking-wide text-[#1f1e1f]">{service.name}</h3>
                                                <div className="py-1">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                                                        {service.isStartingPrice !== false ? 'A partir de ' : 'Valor: '}
                                                        <span className="text-xl font-extrabold text-[#1f1e1f] bg-white/80 px-2.5 py-0.5 rounded-lg border border-zinc-300 ml-1">*R${formatCurrency(service.price)}</span>
                                                    </h4>
                                                </div>
                                                <p className="text-xs font-bold text-zinc-700 leading-snug">{service.disclaimer || '*O preço poderá variar de acordo com o tamanho do cabelo'}</p>
                                            </div>
                                        </div>
                                        <div className="px-5 pb-5 pt-1 space-y-2">
                                            <button onClick={() => abrirWhatsApp(service.whatsappKey || service.name, activePhone)} className="w-full h-10 bg-[#F28888] hover:bg-[#F23030] text-black hover:text-white font-bold uppercase tracking-wider text-xs rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"><MessageCircle className="w-4 h-4" /><span>Ver Preços</span></button>
                                            <button onClick={() => toggleServiceInBudget(srvId)} className={`w-full py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${isSelectedForBudget ? 'bg-[#1f1e1f] text-white' : 'bg-black/5 hover:bg-black/10 text-zinc-800'}`}>
                                                {isSelectedForBudget ? <><Check className="w-3.5 h-3.5 text-[#F28888]" /><span>Adicionado à Simulação</span></> : <><Plus className="w-3.5 h-3.5" /><span>Simular Pacote com este Serviço</span></>}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {selectedBudgetServices.length > 0 && (
                <div className="fixed bottom-4 left-4 right-4 z-40 max-w-3xl mx-auto">
                    <div className="bg-[#1f1e1f]/95 backdrop-blur-md border-2 border-[#F23030] rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-center sm:text-left">
                            <div className="w-10 h-10 rounded-xl bg-[#F23030] text-white flex items-center justify-center font-bold shrink-0">{selectedBudgetServices.length}</div>
                            <div>
                                <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Simulação de Pacote (A partir de)</p>
                                <p className="text-lg font-bold text-white">R$ {formatCurrency(totalBudgetEstimate)} <span className="text-xs font-normal text-zinc-300">({selectedBudgetServices.map((s) => s.name).join(' + ')})</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button onClick={() => setSelectedBudgetIds([])} className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium">Limpar</button>
                            <button onClick={() => enviarOrcamentoWhatsApp(selectedBudgetServices, activePhone)} className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#F23030] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"><MessageCircle className="w-4 h-4" /><span>Consultar Pacote</span></button>
                        </div>
                    </div>
                </div>
            )}

            <section id="contatos" className="bg-[#1f1e1f] py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800">
                <div className="max-w-5xl mx-auto text-center space-y-10">
                    <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F28888]">Fale Conosco & Redes Sociais</span>
                        <h3 className="font-serif text-4xl sm:text-5xl font-bold text-white">Contatos</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <a href={`https://wa.me/${activePhone}?text=${encodeURIComponent('Olá, quero fazer meus cabelos!')}`} target="_blank" rel="noopener noreferrer" className="group p-6 rounded-2xl bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-[#F28888] transition-all flex flex-col items-center justify-center gap-3 shadow-lg"><div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-colors"><WhatsApp className="w-6 h-6" /></div><div><p className="text-xs uppercase tracking-wider text-zinc-400">WhatsApp Agendamentos</p><p className="text-lg font-bold text-white group-hover:text-[#FE8F8F] transition-colors mt-0.5">{BRAND_CONFIG.whatsappDisplay}</p></div></a>
                        <a href={BRAND_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" className="group p-6 rounded-2xl bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-[#F28888] transition-all flex flex-col items-center justify-center gap-3 shadow-lg"><div className="w-12 h-12 rounded-full bg-pink-500/10 text-pink-400 group-hover:bg-pink-600 group-hover:text-white flex items-center justify-center transition-colors"><Instagram className="w-6 h-6" /></div><div><p className="text-xs uppercase tracking-wider text-zinc-400">Instagram Oficial</p><p className="text-lg font-bold text-white group-hover:text-[#FE8F8F] transition-colors mt-0.5">{BRAND_CONFIG.instagramHandle}</p></div></a>
                        <a href={BRAND_CONFIG.facebookUrl} target="_blank" rel="noopener noreferrer" className="group p-6 rounded-2xl bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-[#F28888] transition-all flex flex-col items-center justify-center gap-3 shadow-lg"><div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors"><Facebook className="w-6 h-6" /></div><div><p className="text-xs uppercase tracking-wider text-zinc-400">Facebook</p><p className="text-lg font-bold text-white group-hover:text-[#FE8F8F] transition-colors mt-0.5">{BRAND_CONFIG.facebookName}</p></div></a>
                    </div>
                </div>
            </section>

            <footer className="bg-black text-white py-6 px-4 border-t border-zinc-900 text-xs sm:text-sm">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-zinc-400">© {new Date().getFullYear()} <strong>Rosy Cabeleireira</strong> — {BRAND_CONFIG.addressText}.</p>
                    <h4 className="font-medium text-zinc-300">Desenvolvido por -&gt; <a href={BRAND_CONFIG.developerLinkedin} target="_blank" rel="noopener noreferrer" className="text-[#F28888] hover:text-[#F23030] font-bold underline underline-offset-4 transition">{BRAND_CONFIG.developerName}</a></h4>
                    <button onClick={onNavigateAdmin} className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition"><Settings className="w-3.5 h-3.5" /><span>Gerenciar Salão (/admin)</span></button>
                </div>
            </footer>
        </div>
    );
}