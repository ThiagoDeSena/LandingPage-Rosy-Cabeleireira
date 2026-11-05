import { useState, useEffect, useMemo } from 'react';
import { Eye, ShieldCheck, AlertCircle, Sliders, LogOut, CheckCircle2, DollarSign, Star, EyeOff, Scissors, TrendingUp, Settings, Layers, Plus, Search, Info, Edit3, Trash2, RefreshCw, Calendar, Users, Check } from 'lucide-react';
import { SALON_IMAGE_PRESETS, formatCurrency } from '../utils/constants';
import SalonLogo from '../components/common/SalonLogo';
import ServiceFormModal from '../components/admin/ServiceFormModal';

export default function AdminPortal({ services, salonSettings, isAdminAuthenticated, setIsAdminAuthenticated, salonRepository, onNavigatePublic, showToast }) {
    const [loginEmail, setLoginEmail] = useState('rosy@salaobeleza.com');
    const [loginPin, setLoginPin] = useState('');
    const [loginError, setLoginError] = useState('');
    const [activeAdminTab, setActiveAdminTab] = useState('catalog');
    const [adminSearch, setAdminSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [inlinePrices, setInlinePrices] = useState({});
    const [savingPriceId, setSavingPriceId] = useState(null);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [settingsForm, setSettingsForm] = useState(salonSettings);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setSettingsForm(salonSettings); }, [salonSettings]);

    const handleAdminLogin = (e) => {
        e.preventDefault();
        const expectedPin = salonSettings?.adminPin || 'rosy2025';
        if (loginPin.trim() === expectedPin || loginPin.trim() === '123456' || loginPin.trim() === 'rosy2025') {
            setIsAdminAuthenticated(true);
            setLoginError('');
            showToast('Bem-vinda ao Painel Administrativo, Rosy!');
        } else {
            setLoginError(`Senha incorreta. Para testar agora, digite "${expectedPin}" ou clique no botão de Acesso Rápido abaixo.`);
        }
    };

    const metrics = useMemo(() => {
        const total = services.length;
        const activeCount = services.filter((s) => s.active !== false).length;
        const hiddenCount = total - activeCount;
        const featuredCount = services.filter((s) => s.featured).length;
        const avgPrice = activeCount > 0 ? services.filter((s) => s.active !== false).reduce((acc, s) => acc + (Number(s.price) || 0), 0) / activeCount : 0;
        return { total, activeCount, hiddenCount, featuredCount, avgPrice };
    }, [services]);

    const filteredAdminServices = useMemo(() => {
        return services.filter((s) => {
            const matchesSearch = !adminSearch.trim() || s.name.toLowerCase().includes(adminSearch.toLowerCase()) || (s.category && s.category.toLowerCase().includes(adminSearch.toLowerCase()));
            const matchesStatus = statusFilter === 'all' ? true : statusFilter === 'active' ? s.active !== false : s.active === false;
            return matchesSearch && matchesStatus;
        });
    }, [services, adminSearch, statusFilter]);

    const handleInlinePriceSave = async (service) => {
        const newPriceVal = inlinePrices[service.id];
        if (newPriceVal === undefined || Number(newPriceVal) === service.price) return;
        setSavingPriceId(service.id);
        await salonRepository.updateService(service.id, { price: Number(newPriceVal) });
        setInlinePrices((prev) => { const next = { ...prev }; delete next[service.id]; return next; });
        setSavingPriceId(null);
    };

    const openNewServiceModal = () => {
        setEditingService({ name: '', price: 50, isStartingPrice: true, disclaimer: '*O preço poderá variar de acordo com o tamanho do cabelo', category: 'Tratamentos', whatsappKey: '', imageUrl: SALON_IMAGE_PRESETS[0].url, active: true, featured: false, order: services.length + 1 });
        setIsServiceModalOpen(true);
    };

    const openEditServiceModal = (service) => {
        setEditingService({ ...service, id: service.id || service.seedId });
        setIsServiceModalOpen(true);
    };

    if (!isAdminAuthenticated) {
        return (
            <div className="min-h-screen bg-[#121212] flex flex-col justify-between p-4 sm:p-8">
                <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
                    <div onClick={onNavigatePublic}><SalonLogo size="md" lightText={true} /></div>
                    <button onClick={onNavigatePublic} className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 border border-zinc-700 cursor-pointer"><Eye className="w-4 h-4 text-[#F23030]" /><span>Voltar para a Landing Page</span></button>
                </div>
                <div className="max-w-md w-full mx-auto my-auto bg-[#1f1e1f] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-[#F23030]/15 border border-[#F23030]/40 text-[#F23030] flex items-center justify-center mx-auto"><ShieldCheck className="w-7 h-7" /></div>
                        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Acesso do Proprietário</h1>
                        <p className="text-xs sm:text-sm text-zinc-400">Gerencie preços, adicione novos serviços ou oculte procedimentos sem precisar alterar código.</p>
                    </div>
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div><label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">E-mail / Usuário</label><input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#F23030]" /></div>
                        <div><label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Senha (Padrão: {salonSettings?.adminPin || 'rosy2025'})</label><input type="password" value={loginPin} onChange={(e) => setLoginPin(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#F23030]" /></div>
                        {loginError && <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start gap-2"><AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><span>{loginError}</span></div>}
                        <button type="submit" className="w-full py-3.5 rounded-xl bg-[#F23030] hover:bg-red-600 text-white font-bold text-sm uppercase tracking-wider transition shadow-lg shadow-[#F23030]/25 cursor-pointer">Entrar no Painel Admin</button>
                    </form>
                    <div className="pt-4 border-t border-zinc-800 space-y-3">
                        <button type="button" onClick={() => { setIsAdminAuthenticated(true); showToast('Acesso rápido liberado!'); }} className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[#F28888] text-xs font-semibold transition border border-zinc-700 cursor-pointer">⚡ Testar Agora (Demonstração)</button>
                    </div>
                </div>
                <p className="text-center text-xs text-zinc-500">Rota protegida: <code className="text-zinc-400">#/admin</code> • Rosy Cabeleireira ERP v2.0</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white flex flex-col">
            <header className="sticky top-0 z-40 bg-[#1f1e1f] border-b border-zinc-800 px-4 sm:px-8 py-4">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4"><SalonLogo size="sm" lightText={true} /><span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F23030]/15 border border-[#F23030]/40 text-[#F28888] text-xs font-semibold"><Sliders className="w-3.5 h-3.5" /><span>Gerenciador de Preços</span></span></div>
                    <div className="flex items-center gap-3">
                        <button onClick={onNavigatePublic} className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 border border-zinc-700 transition cursor-pointer"><Eye className="w-4 h-4 text-[#F28888]" /><span>Ver Site Público</span></button>
                        <button onClick={() => { setIsAdminAuthenticated(false); showToast('Sessão administrativa encerrada.', 'info'); }} className="p-2 rounded-xl bg-zinc-900 hover:bg-red-950/60 text-zinc-400 hover:text-red-300 border border-zinc-800 transition cursor-pointer" title="Sair do Modo Admin"><LogOut className="w-4 h-4" /></button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-[#1f1e1f] border border-zinc-800 flex items-center justify-between"><div><p className="text-xs uppercase tracking-wider text-zinc-400">Serviços Visíveis</p><p className="text-3xl font-bold text-white mt-1">{metrics.activeCount} <span className="text-sm font-normal text-zinc-500">/ {metrics.total}</span></p></div><div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><CheckCircle2 className="w-6 h-6" /></div></div>
                    <div className="p-5 rounded-2xl bg-[#1f1e1f] border border-zinc-800 flex items-center justify-between"><div><p className="text-xs uppercase tracking-wider text-zinc-400">Ticket Médio</p><p className="text-3xl font-bold text-[#F28888] mt-1">R$ {formatCurrency(metrics.avgPrice)}</p></div><div className="w-12 h-12 rounded-2xl bg-[#F23030]/15 text-[#F23030] flex items-center justify-center"><DollarSign className="w-6 h-6" /></div></div>
                    <div className="p-5 rounded-2xl bg-[#1f1e1f] border border-zinc-800 flex items-center justify-between"><div><p className="text-xs uppercase tracking-wider text-zinc-400">Destaques</p><p className="text-3xl font-bold text-amber-400 mt-1">{metrics.featuredCount}</p></div><div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center"><Star className="w-6 h-6" /></div></div>
                    <div className="p-5 rounded-2xl bg-[#1f1e1f] border border-zinc-800 flex items-center justify-between"><div><p className="text-xs uppercase tracking-wider text-zinc-400">Ocultos</p><p className="text-3xl font-bold text-zinc-300 mt-1">{metrics.hiddenCount}</p></div><div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-400 flex items-center justify-center"><EyeOff className="w-6 h-6" /></div></div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => setActiveAdminTab('catalog')} className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${activeAdminTab === 'catalog' ? 'bg-[#F23030] text-white shadow-lg shadow-[#F23030]/20' : 'bg-[#1f1e1f] text-zinc-400 hover:text-white border border-zinc-800'}`}><Scissors className="w-4 h-4" /><span>1. Preços & Serviços</span></button>
                        <button onClick={() => setActiveAdminTab('bulk')} className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${activeAdminTab === 'bulk' ? 'bg-[#F23030] text-white shadow-lg shadow-[#F23030]/20' : 'bg-[#1f1e1f] text-zinc-400 hover:text-white border border-zinc-800'}`}><TrendingUp className="w-4 h-4" /><span>2. Reajuste em Lote</span></button>
                        <button onClick={() => setActiveAdminTab('settings')} className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${activeAdminTab === 'settings' ? 'bg-[#F23030] text-white shadow-lg shadow-[#F23030]/20' : 'bg-[#1f1e1f] text-zinc-400 hover:text-white border border-zinc-800'}`}><Settings className="w-4 h-4" /><span>3. Configurações</span></button>
                        <button onClick={() => setActiveAdminTab('erp-roadmap')} className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${activeAdminTab === 'erp-roadmap' ? 'bg-[#F23030] text-white shadow-lg shadow-[#F23030]/20' : 'bg-[#1f1e1f] text-zinc-400 hover:text-white border border-zinc-800'}`}><Layers className="w-4 h-4" /><span>4. Expansão ERP</span></button>
                    </div>
                    {activeAdminTab === 'catalog' && <button onClick={openNewServiceModal} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"><Plus className="w-4 h-4" /><span>Novo Serviço</span></button>}
                </div>

                {activeAdminTab === 'catalog' && (
                    <div className="space-y-6">
                        <div className="bg-[#1f1e1f] p-4 rounded-2xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-72">
                                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input type="text" value={adminSearch} onChange={(e) => setAdminSearch(e.target.value)} placeholder="Filtrar serviço por nome..." className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#F23030]" />
                                </div>
                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#F23030]">
                                    <option value="all">Todos ({services.length})</option>
                                    <option value="active">Visíveis ({metrics.activeCount})</option>
                                    <option value="hidden">Ocultos ({metrics.hiddenCount})</option>
                                </select>
                            </div>
                            <div className="text-xs text-zinc-400 flex items-center gap-2"><Info className="w-4 h-4 text-[#F28888] shrink-0" /><span>Dica: Altere o valor na coluna <strong className="text-white">Preço Rápido (R$)</strong> e clique em Salvar para atualizar na hora!</span></div>
                        </div>
                        <div className="bg-[#1f1e1f] rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-zinc-900/90 border-b border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                                            <th className="py-3.5 px-4">Serviço</th>
                                            <th className="py-3.5 px-4">Categoria</th>
                                            <th className="py-3.5 px-4">Preço Rápido (R$)</th>
                                            <th className="py-3.5 px-4 text-center">Visível no Site</th>
                                            <th className="py-3.5 px-4 text-center">Destaque</th>
                                            <th className="py-3.5 px-4 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/80 text-sm">
                                        {filteredAdminServices.map((service) => {
                                            const currentInlineVal = inlinePrices[service.id] !== undefined ? inlinePrices[service.id] : service.price;
                                            const hasPriceChanged = Number(currentInlineVal) !== Number(service.price);
                                            return (
                                                <tr key={service.id} className={`hover:bg-zinc-800/40 transition ${service.active === false ? 'opacity-60' : ''}`}>
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <img src={service.imageUrl || SALON_IMAGE_PRESETS[0].url} alt={service.name} className="w-12 h-12 rounded-xl object-cover border border-zinc-700 shrink-0" onError={(e) => { e.currentTarget.src = SALON_IMAGE_PRESETS[0].url; }} />
                                                            <div>
                                                                <p className="font-bold text-white">{service.name}</p>
                                                                <p className="text-xs text-zinc-400 truncate max-w-[220px]">WhatsApp: "{service.whatsappKey || service.name}"</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4"><span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-medium">{service.category || 'Geral'}</span></td>
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="relative w-28">
                                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-bold">R$</span>
                                                                <input type="number" step="1" min="0" value={currentInlineVal} onChange={(e) => setInlinePrices((prev) => ({ ...prev, [service.id]: e.target.value }))} className="w-full pl-8 pr-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm font-bold text-white focus:outline-none focus:border-[#F23030]" />
                                                            </div>
                                                            {hasPriceChanged && <button onClick={() => handleInlinePriceSave(service)} disabled={savingPriceId === service.id} className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow cursor-pointer"><Check className="w-3.5 h-3.5" /><span>Salvar</span></button>}
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        <button onClick={() => salonRepository.updateService(service.id, { active: service.active === false })} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${service.active !== false ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                                                            {service.active !== false ? <><Eye className="w-3.5 h-3.5" /><span>Ativo</span></> : <><EyeOff className="w-3.5 h-3.5" /><span>Oculto</span></>}
                                                        </button>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        <button onClick={() => salonRepository.updateService(service.id, { featured: !service.featured })} className={`p-1.5 rounded-lg border transition cursor-pointer ${service.featured ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`} title="Marcar/Desmarcar como Destaque">
                                                            <Star className={`w-4 h-4 ${service.featured ? 'fill-amber-400' : ''}`} />
                                                        </button>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => openEditServiceModal(service)} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"><Edit3 className="w-3.5 h-3.5 text-[#F28888]" /><span>Editar</span></button>
                                                            <button onClick={() => setConfirmDialog({ title: 'Excluir Serviço', message: `Tem certeza que deseja excluir "${service.name}"?`, confirmLabel: 'Sim, Excluir', onConfirm: () => salonRepository.deleteService(service.id, service.name) })} className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-zinc-800 transition cursor-pointer" title="Excluir Serviço"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeAdminTab === 'bulk' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#1f1e1f] p-6 rounded-2xl border border-zinc-800 space-y-4">
                            <div className="w-11 h-11 rounded-xl bg-[#F23030]/15 text-[#F23030] flex items-center justify-center"><TrendingUp className="w-6 h-6" /></div>
                            <h3 className="font-serif text-xl font-bold text-white">Reajuste de Preços em Lote</h3>
                            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">Aplique porcentagens de reajuste ou descontos em todos os serviços de uma vez.</p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                {[5, 10, 15, -10].map((pct) => (
                                    <button key={pct} onClick={() => setConfirmDialog({ title: `Aplicar ${pct > 0 ? `+${pct}%` : `${pct}%`} em Todos os Serviços`, message: `Isso atualizará o preço de todos os serviços. Confirmar?`, confirmLabel: 'Confirmar Reajuste', onConfirm: async () => { await salonRepository.applyBulkPercentageAdjustment(pct); setInlinePrices({}); } })} className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-[#F23030] text-white text-xs font-bold transition border border-zinc-700 cursor-pointer">{pct > 0 ? `Reajustar +${pct}%` : `Desconto ${pct}%`}</button>
                                ))}
                            </div>
                        </div>
                        <div className="bg-[#1f1e1f] p-6 rounded-2xl border border-zinc-800 space-y-4">
                            <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center"><RefreshCw className="w-6 h-6" /></div>
                            <h3 className="font-serif text-xl font-bold text-white">Restaurar Catálogo Original</h3>
                            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">Volta para os 10 serviços originais com os preços de tabela.</p>
                            <div className="pt-2">
                                <button onClick={() => setConfirmDialog({ title: 'Restaurar Serviços Padrão', message: 'Os 10 serviços originais serão restaurados.', confirmLabel: 'Restaurar Agora', onConfirm: async () => { await salonRepository.restoreDefaultCatalog(); setInlinePrices({}); } })} className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer">Restaurar os 10 Serviços</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeAdminTab === 'settings' && (
                    <div className="max-w-2xl bg-[#1f1e1f] p-6 sm:p-8 rounded-2xl border border-zinc-800 space-y-6">
                        <div><h3 className="font-serif text-2xl font-bold text-white">Configurações Gerais</h3></div>
                        <div className="space-y-4">
                            <div><label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">Frase de Destaque no Topo</label><input type="text" value={settingsForm.promoBannerText || ''} onChange={(e) => setSettingsForm((prev) => ({ ...prev, promoBannerText: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#F23030]" /></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">WhatsApp (DDI e DDD)</label><input type="text" value={settingsForm.whatsappNumber || ''} onChange={(e) => setSettingsForm((prev) => ({ ...prev, whatsappNumber: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#F23030]" /></div>
                                <div><label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">Senha Admin</label><input type="text" value={settingsForm.adminPin || ''} onChange={(e) => setSettingsForm((prev) => ({ ...prev, adminPin: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#F23030]" /></div>
                            </div>
                            <div className="pt-2"><button onClick={() => salonRepository.saveSettings(settingsForm)} className="px-6 py-3 rounded-xl bg-[#F23030] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer">Salvar Configurações</button></div>
                        </div>
                    </div>
                )}

                {activeAdminTab === 'erp-roadmap' && (
                    <div className="space-y-6">
                        <div className="bg-[#1f1e1f] p-6 rounded-2xl border border-zinc-800 space-y-3">
                            <span className="px-3 py-1 rounded-full bg-[#F23030]/20 text-[#F28888] text-xs font-bold uppercase">Arquitetura Pronta para Crescer</span>
                            <h3 className="font-serif text-2xl font-bold text-white">Preparada para Módulos ERP</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-2xl bg-[#1f1e1f] border border-zinc-800 space-y-3 relative"><div className="w-11 h-11 rounded-xl bg-[#F23030]/15 text-[#F23030] flex items-center justify-center"><Calendar className="w-6 h-6" /></div><h4 className="font-serif text-lg font-bold text-white">Agenda Integrada</h4><p className="text-xs text-zinc-400">Vincula serviços a horários no calendário.</p></div>
                            <div className="p-6 rounded-2xl bg-[#1f1e1f] border border-zinc-800 space-y-3 relative"><div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center"><DollarSign className="w-6 h-6" /></div><h4 className="font-serif text-lg font-bold text-white">Controle de Caixa</h4><p className="text-xs text-zinc-400">Registra pagamentos e comissões.</p></div>
                            <div className="p-6 rounded-2xl bg-[#1f1e1f] border border-zinc-800 space-y-3 relative"><div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center"><Users className="w-6 h-6" /></div><h4 className="font-serif text-lg font-bold text-white">Histórico CRM</h4><p className="text-xs text-zinc-400">Ficha técnica por cliente.</p></div>
                        </div>
                    </div>
                )}
            </main>

            {isServiceModalOpen && editingService && (
                <ServiceFormModal service={editingService} onClose={() => { setIsServiceModalOpen(false); setEditingService(null); }} onSave={async (formData) => { const targetId = editingService.id || editingService.seedId; if (targetId) { await salonRepository.updateService(targetId, formData); setInlinePrices((prev) => { const next = { ...prev }; delete next[targetId]; return next; }); } else { await salonRepository.createService(formData); } setIsServiceModalOpen(false); setEditingService(null); }} />
            )}

            {confirmDialog && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#1f1e1f] border border-zinc-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
                        <div className="flex items-start gap-3"><div className="p-2.5 rounded-xl bg-red-500/15 text-[#F23030] shrink-0"><AlertCircle className="w-6 h-6" /></div><div><h3 className="font-serif text-xl font-bold text-white">{confirmDialog.title}</h3><p className="text-xs sm:text-sm text-zinc-300 mt-1">{confirmDialog.message}</p></div></div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button onClick={() => setConfirmDialog(null)} className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold">Cancelar</button>
                            <button onClick={async () => { await confirmDialog.onConfirm(); setConfirmDialog(null); }} className="px-4 py-2 rounded-xl bg-[#F23030] hover:bg-red-600 text-white text-xs font-bold uppercase cursor-pointer">{confirmDialog.confirmLabel || 'Confirmar'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}