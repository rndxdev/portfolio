import { ref } from 'vue'

// Shared open-state so the navbar button and the global ⌘K shortcut both drive it.
const isOpen = ref(false)

export function useCommandPalette() {
  return {
    isOpen,
    open: () => (isOpen.value = true),
    close: () => (isOpen.value = false),
    toggle: () => (isOpen.value = !isOpen.value),
  }
}
