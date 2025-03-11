"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

interface ToastProps {
  message: string
  duration?: number
  onClose: () => void
}

export function Toast({ message, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg">{message}</div>
}

export function Toaster() {
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Expose the addToast function globally
    ;(window as any).addToast = addToast
    
    return () => {
      // Cleanup if needed
      delete (window as any).addToast
    }
  }, [])

  const addToast = (message: string) => {
    const id = Date.now()
    setToasts((prevToasts) => [...prevToasts, { id, message }])
  }

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  // Return null on the server and during initial render
  if (!isMounted) {
    return null
  }

  // Only create the portal once we're on the client
  return createPortal(
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} onClose={() => removeToast(toast.id)} />
      ))}
    </>,
    document.body
  )
}

export function toast(message: string) {
  if (typeof window !== "undefined") {
    ;(window as any).addToast(message)
  }
}