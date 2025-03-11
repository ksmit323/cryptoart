"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useWallet } from "@/hooks/use-wallet"
import MintButton from "@/components/mint-button"
import { useToast } from "@/hooks/use-toast"

export default function MintSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const { address, isConnected } = useWallet()
  const [selectedNft, setSelectedNft] = useState(0)
  const { toast } = useToast()

  const nfts = [
    {
      id: 1,
      name: "Cosmic Dreamer",
      artist: "Digital Visionary",
      price: "0.05 ETH",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 2,
      name: "Neural Nexus",
      artist: "Crypto Creator",
      price: "0.08 ETH",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 3,
      name: "Ethereal Essence",
      artist: "Blockchain Artisan",
      price: "0.12 ETH",
      image: "/placeholder.svg?height=400&width=400",
    },
  ]

  const handleMintSuccess = () => {
    toast({
      title: "NFT Minted Successfully!",
      description: `You've successfully minted "${nfts[selectedNft].name}"`,
      variant: "default",
    })
  }

  return (
    <section id="mint" className="py-24 bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-3xl"
            style={{
              width: `${Math.random() * 40 + 20}vw`,
              height: `${Math.random() * 40 + 20}vh`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 30 + 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Mint Your NFT
          </motion.h2>
          <motion.p
            className="text-lg text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Select and mint your favorite digital artwork as an NFT
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          className="grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {nfts.map((nft, index) => (
            <motion.div
              key={nft.id}
              className={`bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                selectedNft === index
                  ? "border-purple-500 scale-105 shadow-lg shadow-purple-500/20"
                  : "border-gray-800 hover:border-gray-700"
              }`}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedNft(index)}
            >
              <div className="relative aspect-square">
                <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="w-full h-full object-cover" />
                {selectedNft === index && (
                  <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Selected
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">{nft.name}</h3>
                <p className="text-gray-400 text-sm mb-4">Artist: {nft.artist}</p>
                <div className="flex justify-between items-center">
                  <span className="text-purple-400 font-bold">{nft.price}</span>
                  <button
                    className={`w-6 h-6 rounded-full border-2 ${
                      selectedNft === index ? "border-purple-500 bg-purple-500/20" : "border-gray-600"
                    } flex items-center justify-center`}
                    onClick={() => setSelectedNft(index)}
                  >
                    {selectedNft === index && <div className="w-3 h-3 rounded-full bg-purple-500" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <MintButton nftData={nfts[selectedNft]} onSuccess={handleMintSuccess} className="px-8 py-3 text-lg" />

          {isConnected && (
            <motion.p
              className="mt-4 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Connected wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

