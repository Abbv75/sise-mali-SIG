import { useCallback } from 'react'
import { useExportStore } from '@/stores/export/useExportStore'

/**
 * Gère la capture de la zone de composition (page blanche + carte + annotations + widgets)
 * et le téléchargement en PNG, PDF et Word.
 */
export function useExportRenderer(pageRef: React.RefObject<HTMLDivElement | null>) {
  const { setIsExporting } = useExportStore()

  const captureImage = async (page: HTMLDivElement): Promise<string> => {
    const { toPng } = await import('html-to-image')
    return toPng(page, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      skipFonts: false,
    })
  }

  const exportPng = useCallback(async () => {
    const page = pageRef.current
    if (!page) return
    setIsExporting(true)
    try {
      const url = await captureImage(page)
      const a = document.createElement('a')
      a.href = url
      a.download = `carte-sise-mali-${new Date().toISOString().slice(0, 10)}.png`
      a.click()
    } catch (err) {
      console.error('[Export] Erreur export PNG :', err)
    } finally {
      setIsExporting(false)
    }
  }, [pageRef, setIsExporting])

  const exportPdf = useCallback(async () => {
    const page = pageRef.current
    if (!page) return
    setIsExporting(true)
    try {
      const url = await captureImage(page)
      const { jsPDF } = await import('jspdf')
      
      const width = page.offsetWidth
      const height = page.offsetHeight
      const orientation = width > height ? 'l' : 'p'
      
      const pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: [width, height]
      })
      
      pdf.addImage(url, 'PNG', 0, 0, width, height)
      pdf.save(`carte-sise-mali-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (err) {
      console.error('[Export] Erreur export PDF :', err)
    } finally {
      setIsExporting(false)
    }
  }, [pageRef, setIsExporting])

  const exportWord = useCallback(async () => {
    const page = pageRef.current
    if (!page) return
    setIsExporting(true)
    try {
      const url = await captureImage(page)
      const res = await fetch(url)
      const blob = await res.blob()
      const arrayBuffer = await blob.arrayBuffer()
      
      const { Document, Packer, Paragraph, ImageRun, PageOrientation } = await import('docx')
      const { saveAs } = await import('file-saver')
      
      const imgWidth = page.offsetWidth
      const imgHeight = page.offsetHeight
      const ratio = imgWidth / imgHeight
      
      const isLandscape = imgWidth > imgHeight
      // Word document max width ~600px for portrait, ~800px for landscape
      const targetW = isLandscape ? 800 : 600
      const targetH = Math.round(targetW / ratio)
      
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                size: {
                  orientation: isLandscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT
                },
                margin: { top: 720, right: 720, bottom: 720, left: 720 } // 0.5 inch margins
              }
            },
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: arrayBuffer,
                    type: 'png',
                    transformation: {
                      width: targetW,
                      height: targetH
                    }
                  })
                ]
              })
            ]
          }
        ]
      })
      
      const docBlob = await Packer.toBlob(doc)
      saveAs(docBlob, `carte-sise-mali-${new Date().toISOString().slice(0, 10)}.docx`)
    } catch (err) {
      console.error('[Export] Erreur export Word :', err)
    } finally {
      setIsExporting(false)
    }
  }, [pageRef, setIsExporting])

  return { exportPng, exportPdf, exportWord }
}
