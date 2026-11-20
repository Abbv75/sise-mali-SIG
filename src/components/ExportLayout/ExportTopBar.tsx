import { X, Loader2, RotateCcw, FileImage, FileText, File as FileWord } from 'lucide-react'
import { useExportStore } from '@/stores/export/useExportStore'

interface ExportTopBarProps {
  onExportPng: () => void
  onExportPdf: () => void
  onExportWord: () => void
  onResetView: () => void
}

export function ExportTopBar({ onExportPng, onExportPdf, onExportWord, onResetView }: ExportTopBarProps) {
  const { close, isExporting, pageWidth, pageHeight, setPageSize } = useExportStore()

  return (
    <div
      className="flex items-center justify-between px-4 py-2 shrink-0 gap-4"
      style={{ background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
    >
      {/* ── Gauche : titre + fermer ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={close}
          className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          title="Fermer (Échap)"
        >
          <X className="w-5 h-5" />
        </button>
        <span className="text-white font-semibold text-sm tracking-wide whitespace-nowrap">
          Mise en page — Export
        </span>
      </div>

      {/* ── Centre : taille de la page ── */}
      <div className="flex items-center gap-2 text-white/80 text-xs">
        <span className="text-white/50">Taille page :</span>
        <input
          type="number"
          value={pageWidth}
          min={400}
          max={5000}
          onChange={(e) => setPageSize(Number(e.target.value), pageHeight)}
          className="w-20 bg-white/10 border border-white/20 rounded px-2 py-1 text-center text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#009460]"
        />
        <span className="text-white/40">×</span>
        <input
          type="number"
          value={pageHeight}
          min={300}
          max={5000}
          onChange={(e) => setPageSize(pageWidth, Number(e.target.value))}
          className="w-20 bg-white/10 border border-white/20 rounded px-2 py-1 text-center text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#009460]"
        />
        <span className="text-white/50">px</span>

        {/* Présets rapides */}
        <div className="flex gap-1 ml-2">
          {[
            { label: 'A4 P', w: 794, h: 1123 },
            { label: 'A4 L', w: 1123, h: 794 },
            { label: 'A3 L', w: 1587, h: 1123 },
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => setPageSize(p.w, p.h)}
              className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] text-white/70 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Réinitialiser la vue */}
        <button
          onClick={onResetView}
          className="ml-2 p-1.5 rounded text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          title="Recentrer la vue"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Droite : exporter ── */}
      <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
        {isExporting && (
          <span className="text-xs text-[#009460] font-medium flex items-center gap-1.5 pr-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Création...
          </span>
        )}
        <button
          onClick={onExportPng}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold text-xs text-white transition-all disabled:opacity-50 bg-[#009460] hover:bg-[#007a4f]"
          title="Exporter en image"
        >
          <FileImage className="w-3.5 h-3.5" /> PNG
        </button>
        <button
          onClick={onExportPdf}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold text-xs text-white transition-all disabled:opacity-50 bg-red-600 hover:bg-red-700"
          title="Exporter en document PDF"
        >
          <FileText className="w-3.5 h-3.5" /> PDF
        </button>
        <button
          onClick={onExportWord}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold text-xs text-white transition-all disabled:opacity-50 bg-blue-600 hover:bg-blue-700"
          title="Exporter en document Word (DOCX)"
        >
          <FileWord className="w-3.5 h-3.5" /> Word
        </button>
      </div>
    </div>
  )
}
