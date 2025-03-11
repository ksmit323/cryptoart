"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface MintButtonProps {
  nftData: {
    id: number
    name: string
    price: string
  }
  onSuccess?: () => void
  className?: string
}

export default function MintButton({ nftData, onSuccess, className }: MintButtonProps) {
  const { isConnected, connect } = useWallet()
  const [isMinting, setIsMinting] = useState(false)
  const { toast } = useToast()

  // Simulated minting function
  const mintNft = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      connect()
      return
    }

    setIsMinting(true)

    try {
      // Simulate blockchain interaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // This is where you would call your actual smart contract
      // Example with ethers.js (commented out as it's just a placeholder):
      /*
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      
      // Convert price from ETH to Wei
      const priceInWei = ethers.utils.parseEther(nftData.price.split(' ')[0]);
      
      // Call the mint function on the smart contract
      const tx = await contract.mint(nftData.id, { value: priceInWei });
      await tx.wait();
      */

      // Success handling
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Minting error:", error)
      toast({
        title: "Minting failed",
        description: "There was an error while minting your NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <Button
      onClick={mintNft}
      disabled={isMinting}
      size="lg"
      className={cn(
        "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0",
        className,
      )}
    >
      {isMinting ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Minting...
        </>
      ) : (
        <>
          Mint "{nftData.name}" for {nftData.price}
        </>
      )}
    </Button>
  )
}

