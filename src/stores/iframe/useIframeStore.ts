import { create } from 'zustand'

interface IframeStoreState {
  showHeader: boolean
  setShowHeader: (show: boolean) => void
  showFooter: boolean
  setShowFooter: (show: boolean) => void
}

const getInitialParam = (paramName: string, defaultValue: boolean = true) => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const paramValue = params.get(paramName)
    if (paramValue !== null) {
      return paramValue !== 'false'
    }
  }
  return defaultValue
}

export const useIframeStore = create<IframeStoreState>((set) => ({
  showHeader: getInitialParam('showHeader'),
  setShowHeader: (show) => set({ showHeader: show }),
  showFooter: getInitialParam('showFooter'),
  setShowFooter: (show) => set({ showFooter: show }),
}))
