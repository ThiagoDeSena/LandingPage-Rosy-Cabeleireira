export const BRAND_CONFIG = {
    name: 'Rosy Cabeleireira',
    subtitle: 'Salão de Beleza',
    whatsappNumber: '5585986344404',
    whatsappDisplay: '(85) 9 8634-4404',
    instagramHandle: '@rosycabeleireira_70',
    instagramUrl: 'https://www.instagram.com/rosycabeleireira_70/',
    facebookName: 'Rosy Cabeleireira',
    facebookUrl: 'https://www.facebook.com/roseysena.sena?locale=pt_BR',
    addressText: 'Rua 70, n° 120a no Jereissati II',
    cityState: 'Pacatuba - CE',
    mapsHeroUrl: 'https://maps.app.goo.gl/TVqu7ktDEP1xxZ498',
    mapsAboutUrl: 'https://maps.app.goo.gl/ZrFMsq7WgKF7oURm7',
    developerName: 'Thiago de Sena',
    developerLinkedin: 'https://www.linkedin.com/in/thiago-de-sena-ab5b09179/',
};

export const CATEGORIES = [
    'Todos',
    'Corte & Finalização',
    'Tratamentos',
    'Alisamento & Redução',
    'Coloração',
];

export const SALON_IMAGE_PRESETS = [
    { label: 'Corte Feminino Moderno', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80' },
    { label: 'Lavatório & Hidratação', url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80' },
    { label: 'Escova & Finalização Brilhante', url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Alisamento & Realinhamento', url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Coloração & Tinta', url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80' },
    { label: 'Mechas & Luzes Iluminadas', url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80' },
    { label: 'Interior Salão de Beleza', url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80' },
];

export const INITIAL_SERVICES_SEED = [
    { id: 'servico-01-corte', seedId: 'servico-01-corte', name: 'Corte', price: 30.0, isStartingPrice: true, disclaimer: '*O preço poderá variar de acordo com o tamanho do cabelo', category: 'Corte & Finalização', whatsappKey: 'Corte de cabelo', imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80', active: true, featured: false, order: 1 },
    { id: 'servico-02-hidratacao', seedId: 'servico-02-hidratacao', name: 'Hidratação', price: 30.0, isStartingPrice: true, disclaimer: '*O preço poderá variar de acordo com o tamanho do cabelo', category: 'Tratamentos', whatsappKey: 'Hidratação', imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80', active: true, featured: false, order: 2 },
    { id: 'servico-03-hidratacao-escova', seedId: 'servico-03-hidratacao-escova', name: 'Hidratação + Escova', price: 50.0, isStartingPrice: true, disclaimer: '*O preço poderá variar de acordo com o tamanho do cabelo', category: 'Tratamentos', whatsappKey: 'Hidratação mais escova', imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80', active: true, featured: true, order: 3 },
    { id: 'servico-04-botox', seedId: 'servico-04-botox', name: 'Botox', price: 80.0, isStartingPrice: true, disclaimer: '*O preço poderá variar de acordo com o tamanho do cabelo', category: 'Alisamento & Redução', whatsappKey: 'Botox', imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80', active: true, featured: true, order: 4 },
    { id: 'servico-05-realinhamento', seedId: 'servico-05-realinhamento', name: 'Realinhamento dos Fios', price: 150.0, isStartingPrice: true, disclaimer: '*O preço poderá variar de acordo com o tamanho do cabelo', category: 'Alisamento & Redução', whatsappKey: 'Realinhamento dos Fios', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', active: true, featured: false, order: 5 },
    { id: 'servico-06-aplicacao-tinta', seedId: 'servico-06-aplicacao-tinta', name: 'Aplicação de Tinta', price: 30.0, isStartingPrice: true, disclaimer: '*O preço poderá variar de acordo com o tamanho do cabelo', category: 'Coloração', whatsappKey: 'Aplicação de Tinta', imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80', active: true, featured: false, order: 6 },
    { id: 'servico-07-organica', seedId: 'servico-07-organica', name: 'Orgânica', price: 150.0, isStartingPrice: true, disclaimer: '*O preço poderá variar de acordo com o tamanho do cabelo', category: 'Alisamento & Redução', whatsappKey: 'orgânica', imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80', active: true, featured: true, order: 7 },
    { id: 'servico-08-definitiva-tioglicolato', seedId: 'servico-08-definitiva-tioglicolato', name: 'Definitiva com Tioglicolato de Amônia', price: 250.0, isStartingPrice: true, disclaimer: '*O preço poderá variar de acordo com o tamanho do cabelo', category: 'Alisamento & Redução', whatsappKey: 'Definitiva com Tioglicolato de Amônia', imageUrl: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=800&q=80', active: true, featured: false, order: 8 },
    { id: 'servico-09-escova', seedId: 'servico-09-escova', name: 'Escova', price: 25.0, isStartingPrice: true, disclaimer: '*O preço poderá variar de acordo com o tamanho do cabelo', category: 'Corte & Finalização', whatsappKey: 'Escova', imageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80', active: true, featured: false, order: 9 },
    { id: 'servico-10-luzes', seedId: 'servico-10-luzes', name: 'Luzes', price: 300.0, isStartingPrice: true, disclaimer: '*O preço poderá variar de acordo com o tamanho do cabelo', category: 'Coloração', whatsappKey: 'Luzes', imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80', active: true, featured: true, order: 10 },
];

export const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const abrirWhatsApp = (servico, customPhone = BRAND_CONFIG.whatsappNumber) => {
    const mensagem = `Olá, gostaria de saber mais sobre o preço da(o) ${servico}?`;
    const linkWhatsApp = `https://api.whatsapp.com/send?phone=${customPhone}&text=${encodeURIComponent(mensagem)}`;
    window.open(linkWhatsApp, '_blank', 'noopener,noreferrer');
};

export const agendarHorario = (customPhone = BRAND_CONFIG.whatsappNumber) => {
    const mensagem = 'Olá, quero agendar um horário para fazer meus cabelos!';
    const linkWhatsApp = `https://api.whatsapp.com/send?phone=${customPhone}&text=${encodeURIComponent(mensagem)}`;
    window.open(linkWhatsApp, '_blank', 'noopener,noreferrer');
};

export const enviarOrcamentoWhatsApp = (selectedServices, customPhone = BRAND_CONFIG.whatsappNumber) => {
    const listaNomes = selectedServices.map((s) => `• ${s.name} (A partir de R$ ${formatCurrency(s.price)})`).join('\n');
    const totalEstimado = selectedServices.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    const mensagem = `Olá Rosy! Gostaria de agendar/consultar o valor para os seguintes serviços:\n\n${listaNomes}\n\nValor base estimado: a partir de R$ ${formatCurrency(totalEstimado)}. Poderia me informar a disponibilidade?`;
    const linkWhatsApp = `https://api.whatsapp.com/send?phone=${customPhone}&text=${encodeURIComponent(mensagem)}`;
    window.open(linkWhatsApp, '_blank', 'noopener,noreferrer');
};

export const abrirLocalizacao = (url = BRAND_CONFIG.mapsHeroUrl) => {
    window.open(url, '_blank', 'noopener,noreferrer');
};
