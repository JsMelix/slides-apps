import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Download,
  Image as ImageIcon,
  Play,
  Pause,
  Settings,
  Edit3,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Layout,
  Eye,
  Sliders,
  Check,
  FileDown,
  Terminal,
  Volume2,
  Maximize2
} from 'lucide-react';

import { Slide, EditorSettings, AspectRatio } from './types';
import { INITIAL_SLIDES } from './data';
import SlideCard from './components/SlideCard';
import HackrsLogo from './components/HackrsLogo';
import NeonIcon from './components/NeonIcon';

export default function App() {
  // Application State
  const [slides, setSlides] = useState<Slide[]>(() => {
    const saved = localStorage.getItem('hackrs_x402_slides');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Slide[];
        const hasBaseUSDC = parsed.some(s => s.title.toLowerCase().includes('base') && s.title.toLowerCase().includes('usdc'));
        if (!hasBaseUSDC) {
          return INITIAL_SLIDES;
        }
        return parsed;
      } catch (e) {
        return INITIAL_SLIDES;
      }
    }
    return INITIAL_SLIDES;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'edit' | 'style' | 'export'>('edit');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(4000); // 4 seconds per slide
  
  // PDF / Capture Generation States
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0, status: '' });

  // Carousel Layout Settings
  const [settings, setSettings] = useState<EditorSettings>(() => {
    const saved = localStorage.getItem('hackrs_x402_settings');
    return saved ? JSON.parse(saved) : {
      aspectRatio: '1:1',
      glowIntensity: 'high',
      showGridLines: true,
      showStarryDots: true,
      stickerRotation: -12,
      stickerSize: 110,
      showSticker: true,
    };
  });

  // Reference for scaling calculations
  const stageRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.85);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('hackrs_x402_slides', JSON.stringify(slides));
  }, [slides]);

  useEffect(() => {
    localStorage.setItem('hackrs_x402_settings', JSON.stringify(settings));
  }, [settings]);

  // Autoplay functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % slides.length);
      }, playSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, slides.length]);

  // Handle auto-scaling to fit the workspace stage
  const updateScale = () => {
    if (!stageRef.current) return;
    const stageWidth = stageRef.current.clientWidth - 64; // Padding offset
    const stageHeight = stageRef.current.clientHeight - 64;

    let targetWidth = 600;
    let targetHeight = 600;

    if (settings.aspectRatio === '16:9') {
      targetWidth = 960;
      targetHeight = 540;
    } else if (settings.aspectRatio === '4:5') {
      targetWidth = 540;
      targetHeight = 675;
    }

    const scaleW = stageWidth / targetWidth;
    const scaleH = stageHeight / targetHeight;
    const fitScale = Math.min(scaleW, scaleH, 1.2); // Cap at 1.2x to prevent blur
    setPreviewScale(fitScale > 0.1 ? fitScale : 0.85);
  };

  useEffect(() => {
    updateScale();
    // Setup observer to watch element resize or document reflows
    const observer = new ResizeObserver(() => updateScale());
    if (stageRef.current) observer.observe(stageRef.current);

    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      observer.disconnect();
    };
  }, [settings.aspectRatio, slides.length]);

  // Reset to original template
  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que deseas restablecer todo al diseño original de x402? Se perderán tus cambios actuales.')) {
      setSlides(INITIAL_SLIDES);
      setActiveIndex(0);
      setSettings({
        aspectRatio: '1:1',
        glowIntensity: 'high',
        showGridLines: true,
        showStarryDots: true,
        stickerRotation: -12,
        stickerSize: 110,
        showSticker: true,
      });
    }
  };

  // Add slide
  const handleAddSlide = () => {
    const newSlideId = String(Date.now());
    const newSlide: Slide = {
      id: String(slides.length + 1),
      title: 'Nueva Diapositiva x402',
      subtitle: 'Personaliza este subtítulo',
      tagline: 'MÓDULO ADICIONAL',
      description: 'Haz doble clic aquí o usa el panel derecho para editar este texto con información relevante de HACKRS o x402.',
      iconName: 'terminal',
      accentColor: 'cyan',
      keyPoints: [
        'Personaliza este punto clave 1',
        'Personaliza este punto clave 2',
      ]
    };
    setSlides([...slides, newSlide]);
    setActiveIndex(slides.length);
  };

  // Delete slide
  const handleDeleteSlide = (indexToDelete: number) => {
    if (slides.length <= 1) {
      alert('La presentación debe contener al menos una diapositiva.');
      return;
    }
    const newSlides = slides.filter((_, idx) => idx !== indexToDelete)
      .map((slide, idx) => ({ ...slide, id: String(idx + 1) })); // Normalise IDs
    setSlides(newSlides);
    setActiveIndex(Math.max(0, indexToDelete - 1));
  };

  // Move slide position (re-order)
  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === slides.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    // Renormalize IDs
    const normalized = newSlides.map((s, idx) => ({ ...s, id: String(idx + 1) }));
    setSlides(normalized);
    setActiveIndex(targetIndex);
  };

  // Update slide property helper
  const updateCurrentSlide = (updated: Partial<Slide>) => {
    const updatedSlides = slides.map((slide, idx) => {
      if (idx === activeIndex) {
        return { ...slide, ...updated };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  // PDF Export Flow - renders all slides in high res, generates PDF
  const handleExportPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress({ current: 0, total: slides.length, status: 'Iniciando generación de PDF...' });

    try {
      // Determine format dimensions in pixels (2x resolution for high sharpness)
      let slideW = 1200;
      let slideH = 1200;
      if (settings.aspectRatio === '16:9') {
        slideW = 1920;
        slideH = 1080;
      } else if (settings.aspectRatio === '4:5') {
        slideW = 1080;
        slideH = 1350;
      }

      // Create PDF instance with custom dimensions
      const orientation = settings.aspectRatio === '16:9' ? 'landscape' : 'portrait';
      const pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: [slideW, slideH],
        hotfixes: ['px_scaling']
      });

      // Loop through slides and capture sequentially
      for (let i = 0; i < slides.length; i++) {
        setExportProgress({
          current: i + 1,
          total: slides.length,
          status: `Procesando diapositiva ${i + 1} de ${slides.length}: "${slides[i].title}"`
        });

        // Target the element in the hidden export container
        const elementId = `export-slide-${slides[i].id}`;
        const el = document.getElementById(elementId);
        if (!el) continue;

        // Capture with html2canvas (use scale: 1 as element is already at absolute sizes)
        const canvas = await html2canvas(el, {
          scale: 1,
          useCORS: true,
          backgroundColor: '#070B14',
          logging: false,
          width: slideW,
          height: slideH
        });

        const imgData = canvas.toDataURL('image/png', 1.0);

        // Add page (except first page which is created automatically)
        if (i > 0) {
          pdf.addPage([slideW, slideH], orientation);
        }

        pdf.addImage(imgData, 'PNG', 0, 0, slideW, slideH, undefined, 'FAST');
      }

      pdf.save(`HACKRS_x402_Infographics_${settings.aspectRatio.replace(':', 'x')}.pdf`);
      setExportProgress({ current: slides.length, total: slides.length, status: '¡PDF Descargado con éxito!' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor reintenta.');
    } finally {
      setTimeout(() => setIsExporting(false), 2000);
    }
  };

  // Export current active slide as PNG
  const handleExportPNG = async () => {
    const el = document.getElementById(`export-slide-${slides[activeIndex].id}`);
    if (!el) return;

    try {
      const canvas = await html2canvas(el, {
        scale: 1,
        useCORS: true,
        backgroundColor: '#070B14',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `HACKRS_x402_Slide_${activeIndex + 1}_${settings.aspectRatio.replace(':', 'x')}.png`;
      link.click();
    } catch (err) {
      console.error('Error exporting PNG:', err);
      alert('Error al descargar la imagen.');
    }
  };

  // Quick helper to handle key point edits
  const handleKeyPointChange = (index: number, val: string) => {
    const currentPoints = [...(slides[activeIndex].keyPoints || [])];
    currentPoints[index] = val;
    updateCurrentSlide({ keyPoints: currentPoints });
  };

  const handleAddKeyPoint = () => {
    const currentPoints = [...(slides[activeIndex].keyPoints || [])];
    currentPoints.push('Nuevo punto clave...');
    updateCurrentSlide({ keyPoints: currentPoints });
  };

  const handleRemoveKeyPoint = (indexToRemove: number) => {
    const currentPoints = (slides[activeIndex].keyPoints || []).filter((_, idx) => idx !== indexToRemove);
    updateCurrentSlide({ keyPoints: currentPoints });
  };

  return (
    <div className="min-h-screen bg-[#02050b] text-slate-100 flex flex-col font-sans select-none antialiased">
      
      {/* Top Navigation Bar with neon styling */}
      <header className="h-16 border-b border-slate-900 bg-[#070b14]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          {/* Glowing Mini HACKRS badge */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <div className="w-full h-full rounded-full bg-[#070b14] flex items-center justify-center">
              <span className="text-cyan-400 font-bold text-xs font-mono tracking-tighter">H_</span>
            </div>
          </div>
          <div>
            <h1 className="text-md font-bold tracking-wider text-white flex items-center gap-2">
              <span>HACKRS STUDIO</span>
              <span className="text-[10px] font-mono py-0.5 px-2 rounded bg-cyan-950/50 text-cyan-400 border border-cyan-800/50">x402 INFOGRAPHICS</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-500">CAROUSEL CREATOR & PDF EXPORTER</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center space-x-3">
          {/* Play/Pause Autoplay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg border transition-all duration-300 flex items-center space-x-1.5 text-xs font-mono font-bold ${
              isPlaying
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isPlaying ? 'Pausar Reproducción' : 'Reproducción Automática'}
          >
            {isPlaying ? <Pause size={14} className="animate-pulse" /> : <Play size={14} />}
            <span>{isPlaying ? 'REPRODUCIENDO' : 'AUTOPLAY'}</span>
          </button>

          {/* Reset Template */}
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-950 transition-all duration-200 flex items-center space-x-1.5 text-xs font-mono"
            title="Restaurar plantilla original"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">RESTAURAR</span>
          </button>

          {/* Core Export CTA */}
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs tracking-wider flex items-center space-x-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300"
          >
            <FileDown size={14} />
            <span>EXPORTAR PDF</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Staging Canvas and Filmstrip list */}
        <div className="flex-1 flex flex-col bg-[#03060d] relative overflow-hidden" ref={stageRef}>
          
          {/* Canvas Starry and Ambient Lighting Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_#0c1424_0%,_transparent_60%)] opacity-80 pointer-events-none" />

          {/* Scaling percentage indicator */}
          <div className="absolute top-4 left-6 z-10 px-2.5 py-1 rounded bg-[#090d16]/80 border border-slate-900 text-[10px] font-mono text-slate-400 flex items-center space-x-1.5 backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span>Escala de Vista: {Math.round(previewScale * 100)}%</span>
            <span>•</span>
            <span className="uppercase font-bold text-sky-300">{settings.aspectRatio}</span>
          </div>

          {/* Active Carousel Stage with Smooth Transitions */}
          <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
            
            {/* Nav Arrows */}
            <button
              onClick={() => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-4 z-20 p-3 rounded-full bg-[#070b14]/70 border border-slate-900 text-slate-300 hover:text-white hover:bg-[#0c1424] hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-200 backdrop-blur"
              title="Anterior"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % slides.length)}
              className="absolute right-4 z-20 p-3 rounded-full bg-[#070b14]/70 border border-slate-900 text-slate-300 hover:text-white hover:bg-[#0c1424] hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-200 backdrop-blur"
              title="Siguiente"
            >
              <ChevronRight size={22} />
            </button>

            {/* Slide Container Wrapper (Scales to fit perfectly) */}
            <div
              className="transition-transform duration-300 ease-out origin-center flex items-center justify-center"
              style={{ transform: `scale(${previewScale})` }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={slides[activeIndex]?.id}
                  initial={{ opacity: 0, x: 60, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -60, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex justify-center items-center"
                >
                  <SlideCard
                    slide={slides[activeIndex]}
                    settings={settings}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Filmstrip rail (Interactive preview list of all slides) */}
          <div className="h-28 bg-[#050912]/90 border-t border-slate-950 px-6 py-3 flex items-center space-x-4 overflow-x-auto relative z-10 shrink-0 select-none">
            
            <div className="text-slate-500 text-[10px] font-mono tracking-widest uppercase rotate-180 shrink-0" style={{ writingMode: 'vertical-lr' }}>
              Navegación Rápida
            </div>

            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setActiveIndex(idx)}
                className={`group h-20 text-left shrink-0 rounded-xl px-4 py-2 border flex flex-col justify-between transition-all duration-300 w-44 select-none ${
                  idx === activeIndex
                    ? 'bg-cyan-950/20 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.2)] text-white'
                    : 'bg-[#070b14] border-slate-900 text-slate-400 hover:bg-slate-900 hover:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-[10px] text-slate-500">SLIDE {idx + 1}</span>
                  <NeonIcon name={slide.iconName} color={idx === activeIndex ? (slide.accentColor || 'cyan') : 'cyan'} size={14} />
                </div>
                <p className="font-bold text-[11px] truncate w-full group-hover:text-white transition-colors">{slide.title}</p>
                <div className="w-full h-1 bg-slate-950 rounded overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${idx === activeIndex ? 'bg-cyan-400' : 'bg-slate-800'}`}
                    style={{ width: `${((idx + 1) / slides.length) * 100}%` }}
                  />
                </div>
              </button>
            ))}

            {/* Quick Add Slide in the Rail */}
            <button
              onClick={handleAddSlide}
              className="h-20 w-16 shrink-0 rounded-xl bg-dashed border-2 border-dashed border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/10 text-slate-500 hover:text-cyan-400 transition-all duration-200 flex flex-col items-center justify-center space-y-1"
              title="Añadir nueva diapositiva"
            >
              <Plus size={18} />
              <span className="text-[9px] font-mono font-bold uppercase">AÑADIR</span>
            </button>
          </div>

        </div>

        {/* Right Side: Tabbed Customization & Builder Pane */}
        <div className="w-full lg:w-[420px] bg-[#070b14] border-l border-slate-950 flex flex-col relative z-30 shrink-0">
          
          {/* Tab Selector */}
          <div className="h-12 border-b border-slate-950 flex select-none bg-[#050912]">
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 flex items-center justify-center space-x-2 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 ${
                activeTab === 'edit'
                  ? 'border-cyan-500 text-cyan-400 bg-cyan-950/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 size={14} />
              <span>EDITAR CONTENIDO</span>
            </button>
            <button
              onClick={() => setActiveTab('style')}
              className={`flex-1 flex items-center justify-center space-x-2 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 ${
                activeTab === 'style'
                  ? 'border-cyan-500 text-cyan-400 bg-cyan-950/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders size={14} />
              <span>ESTILO GLOBAL</span>
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`flex-1 flex items-center justify-center space-x-2 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 ${
                activeTab === 'export'
                  ? 'border-cyan-500 text-cyan-400 bg-cyan-950/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download size={14} />
              <span>EXPORTAR</span>
            </button>
          </div>

          {/* Active Tab Body (Scrollable Pane) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* TAB 1: EDIT CONTENT */}
            {activeTab === 'edit' && slides[activeIndex] && (
              <div className="space-y-5 animate-fadeIn">
                
                {/* Active Slide Tracker Info */}
                <div className="flex items-center justify-between bg-slate-950/50 p-3.5 rounded-xl border border-slate-900">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Editando Diapositiva</span>
                    <h3 className="text-sm font-extrabold text-slate-300">
                      {activeIndex + 1}. {slides[activeIndex].title}
                    </h3>
                  </div>
                  
                  {/* Position controls */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => handleMoveSlide(activeIndex, 'up')}
                      disabled={activeIndex === 0}
                      className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                      title="Mover arriba"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={() => handleMoveSlide(activeIndex, 'down')}
                      disabled={activeIndex === slides.length - 1}
                      className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                      title="Mover abajo"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(activeIndex)}
                      className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400"
                      title="Eliminar diapositiva"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Tagline / Category */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 tracking-wider uppercase mb-1.5">Categoría / Tagline</label>
                  <input
                    type="text"
                    value={slides[activeIndex].tagline || ''}
                    onChange={(e) => updateCurrentSlide({ tagline: e.target.value })}
                    className="w-full bg-[#0a0f1d] border border-slate-900 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                    placeholder="Ej. DEFICION Y ORIGEN"
                  />
                </div>

                {/* Slide Title */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 tracking-wider uppercase mb-1.5">Título de la Diapositiva</label>
                  <textarea
                    rows={2}
                    value={slides[activeIndex].title}
                    onChange={(e) => updateCurrentSlide({ title: e.target.value })}
                    className="w-full bg-[#0a0f1d] border border-slate-900 rounded-lg px-3.5 py-2.5 text-xs text-white font-semibold focus:border-cyan-500 focus:outline-none resize-none"
                    placeholder="Título principal"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 tracking-wider uppercase mb-1.5">Subtítulo</label>
                  <input
                    type="text"
                    value={slides[activeIndex].subtitle || ''}
                    onChange={(e) => updateCurrentSlide({ subtitle: e.target.value })}
                    className="w-full bg-[#0a0f1d] border border-slate-900 rounded-lg px-3.5 py-2.5 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
                    placeholder="Subtítulo complementario"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 tracking-wider uppercase mb-1.5">Descripción Detallada</label>
                  <textarea
                    rows={4}
                    value={slides[activeIndex].description}
                    onChange={(e) => updateCurrentSlide({ description: e.target.value })}
                    className="w-full bg-[#0a0f1d] border border-slate-900 rounded-lg px-3.5 py-2.5 text-xs text-slate-300 leading-relaxed focus:border-cyan-500 focus:outline-none resize-none"
                    placeholder="Escribe la explicación detallada..."
                  />
                </div>

                {/* Key Bullet Points Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] font-mono text-slate-500 tracking-wider uppercase">Puntos Clave / Destacados</label>
                    <button
                      onClick={handleAddKeyPoint}
                      className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                    >
                      <Plus size={12} />
                      <span>Agregar Punto</span>
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {(slides[activeIndex].keyPoints || []).map((point, pIdx) => (
                      <div key={pIdx} className="flex items-center space-x-2">
                        <span className="font-mono text-slate-600 text-[11px]">&gt;</span>
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => handleKeyPointChange(pIdx, e.target.value)}
                          className="flex-1 bg-[#0a0f1d] border border-slate-900 rounded-lg px-3.5 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleRemoveKeyPoint(pIdx)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded transition-colors"
                          title="Eliminar punto"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Accent Style for Slide */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 tracking-wider uppercase mb-2">Color de Acento & Brillo</label>
                  <div className="flex items-center space-x-3.5">
                    {['cyan', 'emerald', 'purple', 'amber', 'crimson'].map((color) => {
                      const bgClasses: Record<string, string> = {
                        cyan: 'bg-cyan-500',
                        emerald: 'bg-emerald-500',
                        purple: 'bg-purple-500',
                        amber: 'bg-amber-500',
                        crimson: 'bg-red-500'
                      };
                      return (
                        <button
                          key={color}
                          onClick={() => updateCurrentSlide({ accentColor: color })}
                          className={`w-7 h-7 rounded-full ${bgClasses[color]} flex items-center justify-center transition-all duration-200 ${
                            slides[activeIndex].accentColor === color
                              ? 'ring-4 ring-white ring-offset-2 ring-offset-[#070b14] scale-110 shadow-lg'
                              : 'opacity-65 hover:opacity-100'
                          }`}
                          title={`Acento ${color}`}
                        >
                          {slides[activeIndex].accentColor === color && <Check size={14} className="text-black stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Cyber Icon Selector */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 tracking-wider uppercase mb-2.5">Ícono del Protocolo (Ciber-Neon)</label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[
                      { name: 'rocket', label: 'Cohete' },
                      { name: 'terminal', label: 'Terminal' },
                      { name: 'coins', label: 'Monedas' },
                      { name: 'cpu', label: 'Procesador' },
                      { name: 'shield', label: 'Escudo' },
                      { name: 'globe', label: 'Red Global' },
                      { name: 'database', label: 'Base Datos' },
                      { name: 'robot', label: 'Robots/IA' },
                    ].map((iconItem) => (
                      <button
                        key={iconItem.name}
                        onClick={() => updateCurrentSlide({ iconName: iconItem.name })}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all duration-200 ${
                          slides[activeIndex].iconName === iconItem.name
                            ? 'bg-cyan-500/10 border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.15)] text-cyan-400'
                            : 'bg-[#0a0f1d] border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800'
                        }`}
                        title={iconItem.label}
                      >
                        <NeonIcon name={iconItem.name} color={slides[activeIndex].accentColor || 'cyan'} size={24} />
                        <span className="text-[9px] font-mono font-bold truncate w-full text-center">{iconItem.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: GLOBAL CAROUSEL STYLE */}
            {activeTab === 'style' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* 1. ASPECT RATIO */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 tracking-wider uppercase mb-2.5">Relación de Aspecto (Lienzo)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: '1:1', label: '1:1 Square', desc: 'LinkedIn / Instagram' },
                      { val: '16:9', label: '16:9 Wide', desc: 'Presentaciones' },
                      { val: '4:5', label: '4:5 Portrait', desc: 'Mobile Tall Feed' }
                    ].map((ratio) => (
                      <button
                        key={ratio.val}
                        onClick={() => setSettings({ ...settings, aspectRatio: ratio.val as AspectRatio })}
                        className={`p-3.5 rounded-xl border flex flex-col items-center text-center space-y-1.5 transition-all duration-200 ${
                          settings.aspectRatio === ratio.val
                            ? 'bg-cyan-500/10 border-cyan-500/60 text-white'
                            : 'bg-[#0a0f1d] border-slate-900 text-slate-400 hover:bg-slate-900 hover:border-slate-800'
                        }`}
                      >
                        <Layout size={18} className={settings.aspectRatio === ratio.val ? 'text-cyan-400' : 'text-slate-500'} />
                        <div>
                          <p className="text-[11px] font-bold">{ratio.label}</p>
                          <p className="text-[8px] font-mono text-slate-500 mt-0.5">{ratio.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. BACKGROUND EFFECTS */}
                <div className="space-y-3.5">
                  <h4 className="text-[11px] font-mono text-slate-500 tracking-wider uppercase">Fondo & Redes Ciber</h4>
                  
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0a0f1d] border border-slate-900">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">Líneas de Cuadrícula Tech</span>
                      <span className="text-[9px] font-mono text-slate-500">Malla de coordenadas ciberpunk</span>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, showGridLines: !settings.showGridLines })}
                      className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                        settings.showGridLines ? 'bg-cyan-500' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`bg-black w-4 h-4 rounded-full shadow-md transform duration-200 ${settings.showGridLines ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0a0f1d] border border-slate-900">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">Nodos Estelares Conectados</span>
                      <span className="text-[9px] font-mono text-slate-500">Redes de datos con estrellas glowing</span>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, showStarryDots: !settings.showStarryDots })}
                      className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                        settings.showStarryDots ? 'bg-cyan-500' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`bg-black w-4 h-4 rounded-full shadow-md transform duration-200 ${settings.showStarryDots ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                {/* 3. NEON GLOW INTENSITY */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 tracking-wider uppercase mb-2">Intensidad del Brillo (Glow)</label>
                  <div className="grid grid-cols-3 gap-2 bg-[#0a0f1d] p-1 rounded-xl border border-slate-900">
                    {['low', 'medium', 'high'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setSettings({ ...settings, glowIntensity: level as 'low' | 'medium' | 'high' })}
                        className={`py-2 rounded-lg text-xs font-bold font-mono uppercase transition-colors ${
                          settings.glowIntensity === level
                            ? 'bg-cyan-500 text-black shadow-lg'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. HACKRS STICKER SETTINGS */}
                <div className="space-y-4 border-t border-slate-950 pt-4">
                  <h4 className="text-[11px] font-mono text-slate-500 tracking-wider uppercase">Logotipo HACKRS (Pegatina)</h4>
                  
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0a0f1d] border border-slate-900">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">Pegatina Holográfica</span>
                      <span className="text-[9px] font-mono text-slate-500">Logotipo circular metálico de HACKRS</span>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, showSticker: !settings.showSticker })}
                      className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                        settings.showSticker ? 'bg-cyan-500' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`bg-black w-4 h-4 rounded-full shadow-md transform duration-200 ${settings.showSticker ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {settings.showSticker && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span>Tamaño de la pegatina</span>
                          <span>{settings.stickerSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="80"
                          max="160"
                          value={settings.stickerSize}
                          onChange={(e) => setSettings({ ...settings, stickerSize: parseInt(e.target.value) })}
                          className="w-full accent-cyan-400 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span>Ángulo / Rotación</span>
                          <span>{settings.stickerRotation}°</span>
                        </div>
                        <input
                          type="range"
                          min="-45"
                          max="45"
                          value={settings.stickerRotation}
                          onChange={(e) => setSettings({ ...settings, stickerRotation: parseInt(e.target.value) })}
                          className="w-full accent-cyan-400 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Visual Demo of Sticker */}
                      <div className="flex items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-900/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-slate-950 opacity-40" />
                        <HackrsLogo size={settings.stickerSize} rotation={settings.stickerRotation} className="relative z-10" />
                        <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-600 uppercase select-none">PREVISUALIZACIÓN COHESIVA</div>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* TAB 3: EXPORT CONTROLS */}
            {activeTab === 'export' && (
              <div className="space-y-5 animate-fadeIn">
                
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-900 text-center space-y-3">
                  <FileDown size={32} className="mx-auto text-cyan-400 stroke-[1.5]" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Descargar Carrusel de Imágenes</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Generamos un archivo PDF con alta definición donde cada diapositiva ocupa una página completa. El formato respetará tu Relación de Aspecto elegida.
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="w-full py-4.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black tracking-wider text-xs flex items-center justify-center space-x-2.5 shadow-[0_4px_25px_rgba(6,182,212,0.3)] hover:shadow-[0_4px_35px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:pointer-events-none transition-all duration-300"
                  >
                    <FileDown size={18} />
                    <span>DESCARGAR COMPILACIÓN PDF</span>
                  </button>

                  <button
                    onClick={handleExportPNG}
                    className="w-full py-3.5 rounded-xl bg-[#0a0f1d] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all duration-200 text-xs font-bold flex items-center justify-center space-x-2"
                  >
                    <ImageIcon size={16} className="text-cyan-400" />
                    <span>DESCARGAR SLIDE ACTUAL (PNG)</span>
                  </button>
                </div>

                <div className="border-t border-slate-950 pt-4 space-y-3.5">
                  <h4 className="text-[11px] font-mono text-slate-500 tracking-wider uppercase">Acciones Rápidas</h4>

                  <button
                    onClick={handleAddSlide}
                    className="w-full py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Plus size={14} className="text-cyan-400" />
                    <span>AÑADIR DIAPOSITIVA AL FINAL</span>
                  </button>

                  <button
                    onClick={() => handleDeleteSlide(activeIndex)}
                    className="w-full py-3 rounded-lg bg-slate-900 hover:bg-red-950/20 border border-slate-800 hover:border-red-950/50 text-slate-400 hover:text-red-400 text-xs font-mono transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Trash2 size={14} />
                    <span>ELIMINAR DIAPOSITIVA ACTUAL</span>
                  </button>
                </div>

                {/* Info Tip */}
                <div className="p-3.5 rounded-lg bg-cyan-950/10 border border-cyan-900/30 text-[10px] font-mono text-slate-400 leading-relaxed">
                  <span className="font-bold text-cyan-400 uppercase mr-1">Sugerencia:</span>
                  Elige la relación **1:1** si deseas publicar este carrusel en LinkedIn, o la relación **16:9** si lo usarás para presentarlo en pantallas grandes. El HACKRS logo se incrustará de forma nítida en cada página del PDF.
                </div>

              </div>
            )}

          </div>

          {/* Active slide controller (Quick navigation indicators) */}
          <div className="h-16 border-t border-slate-950 bg-[#050912] px-6 flex items-center justify-between select-none">
            <span className="font-mono text-[10px] text-slate-500 uppercase">Carrusel de x402</span>
            
            <div className="flex items-center space-x-1">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'w-6 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                      : 'w-1.5 bg-slate-800 hover:bg-slate-700'
                  }`}
                  title={`Saltar a Diapositiva ${idx + 1}`}
                />
              ))}
            </div>

            <span className="font-mono text-[11px] font-bold text-slate-300">
              {activeIndex + 1} / {slides.length}
            </span>
          </div>

        </div>

      </div>

      {/* Hidden high-res container for capturing exact pixel screenshots/PDFs */}
      {/* Renders each slide in standard absolute formats so html2canvas captures perfectly */}
      <div
        className="absolute top-0 left-0 pointer-events-none opacity-0 overflow-hidden"
        style={{ width: '1px', height: '1px', zIndex: -100 }}
      >
        <div id="pdf-export-stage" className="flex flex-col bg-[#02050b]">
          {slides.map((slide) => (
            <div key={slide.id} id={`export-slide-${slide.id}`} className="block">
              <SlideCard slide={slide} settings={settings} />
            </div>
          ))}
        </div>
      </div>

      {/* Export Loader Overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center select-none">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md bg-[#070b14] border border-slate-900 rounded-2xl p-8 shadow-[0_0_50px_rgba(6,182,212,0.2)] text-center space-y-6"
          >
            {/* Spinning glowing status */}
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-slate-900"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileDown size={22} className="text-cyan-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black tracking-wider uppercase text-white">Compilando PDF Profesional</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                {exportProgress.status}
              </p>
            </div>

            {/* Custom progress bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-[1px]">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${(exportProgress.current / exportProgress.total) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Rendimiento: {Math.round((exportProgress.current / exportProgress.total) * 100)}%</span>
                <span>{exportProgress.current} de {exportProgress.total} slides</span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-600 uppercase">
              HACKRS x402 STUDIO // NO CIERRES ESTA VENTANA
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
