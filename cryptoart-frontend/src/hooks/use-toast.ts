"use client"

import { toast as customToast } from "@/components/ui/toast"

type ToastProps = {
  title: string
  description: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    customToast(`${title}: ${description}`)
  }

  return { toast }
}

