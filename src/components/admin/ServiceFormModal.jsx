import { useState, useRef } from 'react';
import { X, Upload, Camera, Link2, Image as ImageIcon, Check, Trash2 } from 'lucide-react';
import { CATEGORIES, SALON_IMAGE_PRESETS } from '../../utils/constants';

const compressImageFile = (file, maxWidth = 900, quality = 0.82) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxWidth) {
                    if (width > height) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxWidth) / height);
                        height = maxWidth;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            img.onerror = () => reject(new Error('Não foi possível processar a imagem selecionada.'));
            img.src = event.target.result;
        };
        reader.onerror = () => reject(new Error('Erro ao ler o arquivo de imagem.'));
        reader.readAsDataURL(file);
    });
};

export default function ServiceFormModal({ service, onClose, onSave }) {
    const initialImage = service.imageUrl || SALON_IMAGE_PRESETS[0].url;
    const isInitialDataUrl = initialImage.startsWith('data:image/');

    const [formData, setFormData] = useState({
        name: service.name || '',
        price: service.price ?? 50,
        isStartingPrice: service.isStartingPrice !== false,
        disclaimer: service.disclaimer || '*O preço poderá variar de acordo com o tamanho do cabelo',
        category: service.category || 'Corte & Finalização',
        whatsappKey: service.whatsappKey || '',
        imageUrl: initialImage,
        active: service.active !== false,
        featured: Boolean(service.featured),
        order: service.order || 1,
    });

    const [optionalUrl, setOptionalUrl] = useState(() => {
        if (isInitialDataUrl) return '';
        const isPreset = SALON_IMAGE_PRESETS.some((p) => p.url === initialImage);
        return isPreset ? '' : initialImage;
    });

    const [uploadedFileName, setUploadedFileName] = useState(
        isInitialDataUrl ? 'Foto enviada do aparelho' : ''
    );
    const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
    const [photoError, setPhotoError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef(null);

    const isUploadedPhoto = formData.imageUrl?.startsWith('data:image/');

    const processSelectedFile = async (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setPhotoError('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WEBP).');
            return;
        }
        setPhotoError('');
        setIsProcessingPhoto(true);
        try {
            const compressedDataUrl = await compressImageFile(file);
            setFormData((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
            setUploadedFileName(file.name);
            setOptionalUrl('');
        } catch (err) {
            setPhotoError(err.message || 'Erro ao carregar a foto.');
        } finally {
            setIsProcessingPhoto(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) processSelectedFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processSelectedFile(file);
    };

    const handleRemoveUploadedPhoto = () => {
        setUploadedFileName('');
        setFormData((prev) => ({
            ...prev,
            imageUrl: optionalUrl.trim() || SALON_IMAGE_PRESETS[0].url,
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleOptionalUrlChange = (e) => {
        const val = e.target.value;
        setOptionalUrl(val);
        if (val.trim()) {
            setUploadedFileName('');
            setFormData((prev) => ({ ...prev, imageUrl: val.trim() }));
        } else if (!isUploadedPhoto) {
            setFormData((prev) => ({ ...prev, imageUrl: SALON_IMAGE_PRESETS[0].url }));
        }
    };

    const handleSelectPreset = (presetUrl) => {
        setUploadedFileName('');
        setOptionalUrl('');
        setFormData((prev) => ({ ...prev, imageUrl: presetUrl }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;
        setIsSubmitting(true);
        await onSave({
            ...formData,
            price: Number(formData.price) || 0,
            imageUrl: formData.imageUrl || SALON_IMAGE_PRESETS[0].url,
            whatsappKey: formData.whatsappKey.trim() || formData.name.trim(),
        });
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#1f1e1f] border border-zinc-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div>
                        <h3 className="font-serif text-2xl font-bold text-white">
                            {service.id ? 'Editar Serviço' : 'Adicionar Novo Serviço'}
                        </h3>
                        <p className="text-xs text-zinc-400">
                            As alterações aparecem imediatamente na Landing Page da Rosy.
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Nome do Serviço *</label>
                            <input type="text" required value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} placeholder="Ex: Hidratação + Escova" className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#F23030]" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Preço (R$) *</label>
                            <input type="number" step="0.50" min="0" required value={formData.price} onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm font-bold text-white focus:outline-none focus:border-[#F23030]" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Categoria</label>
                            <select value={formData.category} onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#F23030]">
                                {CATEGORIES.filter((c) => c !== 'Todos').map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Texto enviado no WhatsApp</label>
                            <input type="text" value={formData.whatsappKey} onChange={(e) => setFormData((prev) => ({ ...prev, whatsappKey: e.target.value }))} placeholder={formData.name || 'Ex: Corte de cabelo'} className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#F23030]" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Observação de Preço (Asterisco)</label>
                        <input type="text" value={formData.disclaimer} onChange={(e) => setFormData((prev) => ({ ...prev, disclaimer: e.target.value }))} className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-[#F23030]" />
                    </div>

                    {/* OPÇÃO PRINCIPAL: ENVIAR FOTO DA CLIENTE */}
                    <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                                <Camera className="w-4 h-4 text-[#F23030]" />
                                <span>Foto do Serviço (Foto da Cliente)</span>
                            </label>
                            <span className="px-2 py-0.5 rounded-full bg-[#F23030]/20 text-[#F28888] text-[10px] font-bold uppercase">
                                Opção Principal
                            </span>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={`p-4 rounded-2xl border-2 border-dashed transition-all ${
                                isDragging
                                    ? 'border-[#F23030] bg-[#F23030]/10'
                                    : isUploadedPhoto
                                    ? 'border-emerald-500/50 bg-emerald-950/15'
                                    : 'border-zinc-700 bg-zinc-900/70 hover:border-[#F28888]/60'
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-zinc-700 shrink-0 bg-zinc-800 shadow-md">
                                    <img
                                        src={formData.imageUrl || SALON_IMAGE_PRESETS[0].url}
                                        alt="Pré-visualização do serviço"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.currentTarget.src = SALON_IMAGE_PRESETS[0].url; }}
                                    />
                                    {isUploadedPhoto && (
                                        <span className="absolute bottom-1 left-1 right-1 bg-emerald-600/90 text-white text-[9px] font-bold uppercase text-center py-0.5 rounded">
                                            Foto Própria
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 text-center sm:text-left space-y-2.5 w-full">
                                    <div>
                                        <p className="text-xs sm:text-sm font-bold text-white">
                                            {isUploadedPhoto
                                                ? `Foto selecionada: ${uploadedFileName || 'Foto da cliente'}`
                                                : 'Envie uma foto real tirada no salão'}
                                        </p>
                                        <p className="text-[11px] text-zinc-400">
                                            Escolha uma foto da galeria do celular, computador ou arraste a imagem aqui.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isProcessingPhoto}
                                            className="px-4 py-2 rounded-xl bg-[#F23030] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#F23030]/20 transition cursor-pointer"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                            <span>
                                                {isProcessingPhoto
                                                    ? 'Processando foto...'
                                                    : isUploadedPhoto
                                                    ? 'Trocar Foto'
                                                    : 'Escolher Foto do Aparelho'}
                                            </span>
                                        </button>

                                        {isUploadedPhoto && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveUploadedPhoto}
                                                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-red-950/60 text-zinc-300 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 border border-zinc-700 transition cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span>Remover</span>
                                            </button>
                                        )}
                                    </div>

                                    {photoError && (
                                        <p className="text-xs text-red-400 font-medium">{photoError}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* OPÇÃO SECUNDÁRIA / OPCIONAL: LINK DA INTERNET OU FOTOS MODELO */}
                        <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                    <Link2 className="w-3.5 h-3.5 text-[#F28888]" />
                                    <span>Ou usar link da internet / foto modelo (Opcional)</span>
                                </span>
                                <span className="text-[10px] text-zinc-500">Caso não tenha foto própria</span>
                            </div>

                            <div className="space-y-1.5">
                                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                                    <ImageIcon className="w-3 h-3 text-zinc-500" />
                                    <span>Fotos modelo prontas (clique para usar):</span>
                                </span>
                                <div className="flex gap-1.5 overflow-x-auto pb-1">
                                    {SALON_IMAGE_PRESETS.map((preset) => {
                                        const isSelectedPreset = formData.imageUrl === preset.url;
                                        return (
                                            <button
                                                key={preset.url}
                                                type="button"
                                                onClick={() => handleSelectPreset(preset.url)}
                                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap border transition flex items-center gap-1 cursor-pointer ${
                                                    isSelectedPreset
                                                        ? 'bg-[#F23030] text-white border-[#F23030]'
                                                        : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white'
                                                }`}
                                            >
                                                {isSelectedPreset && <Check className="w-3 h-3" />}
                                                <span>{preset.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <input
                                    type="url"
                                    value={optionalUrl}
                                    onChange={handleOptionalUrlChange}
                                    placeholder="https://... (Opcional: cole aqui o link de uma imagem da internet)"
                                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F23030]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer">
                            <input type="checkbox" checked={formData.active} onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))} className="w-4 h-4 accent-[#F23030]" />
                            <div>
                                <p className="text-xs font-bold text-white">Visível na Landing Page</p>
                                <p className="text-[11px] text-zinc-400">Desmarque para ocultar temporariamente</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer">
                            <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))} className="w-4 h-4 accent-[#F23030]" />
                            <div>
                                <p className="text-xs font-bold text-white">Destaque / Promoção</p>
                                <p className="text-[11px] text-zinc-400">Exibe selo especial no card</p>
                            </div>
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer">Cancelar</button>
                        <button type="submit" disabled={isSubmitting || isProcessingPhoto} className="px-6 py-2.5 rounded-xl bg-[#F23030] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg cursor-pointer">
                            {isSubmitting ? 'Salvando...' : 'Salvar Serviço'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
