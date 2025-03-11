"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { Loader2, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

interface WalletButtonProps {
  className?: string
}

export default function WalletButton({ className }: WalletButtonProps) {
  const { connect, disconnect, isConnected, address, isConnecting } = useWallet()
  const [isHovering, setIsHovering] = useState(false)

  const handleClick = () => {
    if (isConnected) {
      disconnect()
    } else {
      connect()
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant={isConnected ? "outline" : "default"}
      className={cn(
        isConnected
          ? "border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-white cursor-pointer"
          : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 cursor-pointer",
        className,
      )}
      disabled={isConnecting}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : isConnected ? (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          {isHovering ? "Disconnect" : `${address?.slice(0, 4)}...${address?.slice(-4)}`}
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}

