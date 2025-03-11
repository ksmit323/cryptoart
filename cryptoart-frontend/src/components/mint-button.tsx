"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ethers } from "ethers"
import contractABI from '../../abi/contractABI.json' 

interface MintButtonProps {
  nftData: {
    id: number
    name: string
    price: string
    metadataURI?: string 
  }
  onSuccess?: () => void
  className?: string
}

const contractAddress = "0xA4ab6E67D044cB1172960E46775346F7491Ce971"

export default function MintButton({ nftData, onSuccess, className }: MintButtonProps) {
  const { isConnected, connect } = useWallet()
  const [isMinting, setIsMinting] = useState(false)
  const { toast } = useToast()

  // Mint NFT function using mintForArtist
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
      if (!window.ethereum) {
        throw new Error("No Ethereum wallet detected. Please install MetaMask or another compatible wallet")
      }

      // Setup ethers with provider and contract
      const provider = new ethers.BrowserProvider(window.ethereum as any)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)
      
      // Get the user's address
      const userAddress = await signer.getAddress()
      
      // Generate metadata URI if not provided
      const metadataURI = nftData.metadataURI || `https://example.com/metadata/${nftData.id}`
      
      // Call mintForArtist function
      console.log("Minting with parameters:", {
        to: userAddress,
        editionName: nftData.name,
        artPieceId: nftData.id.toString(),
        metadataURI
      })
      
      const tx = await contract.mintForArtist(
        userAddress,
        nftData.name,
        nftData.id.toString(),
        metadataURI
      )
      
      // Wait for transaction confirmation
      toast({
        title: "Transaction submitted",
        description: "Your NFT is being minted. Please wait for confirmation.",
      })
      
      await tx.wait()
      
      // Success handling
      toast({
        title: "Minting successful!",
        description: `You've successfully minted "${nftData.name}"`,
        variant: "default",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("Minting error:", error)
      toast({
        title: "Minting failed",
        description: error?.message || "There was an error while minting your NFT. Please try again.",
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
        "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 cursor-pointer",
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