import { create } from 'zustand'

interface UiStoreState {
  isLoginDialogOpen: boolean
  isMobileNavOpen: boolean
  openLoginDialog: () => void
  setLoginDialogOpen: (open: boolean) => void
  setMobileNavOpen: (open: boolean) => void
}

export const useUiStore = create<UiStoreState>((set) => ({
  isLoginDialogOpen: false,
  isMobileNavOpen: false,
  openLoginDialog: () => {
    set({ isLoginDialogOpen: true })
  },
  setLoginDialogOpen: (isLoginDialogOpen) => {
    set({ isLoginDialogOpen })
  },
  setMobileNavOpen: (isMobileNavOpen) => {
    set({ isMobileNavOpen })
  },
}))
