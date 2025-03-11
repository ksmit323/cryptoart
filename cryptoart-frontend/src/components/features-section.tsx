"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"

export default function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    {
      title: "Seamless Wallet Integration",
      description: "Connect your Web3 wallet with a single click and start exploring the world of NFT art immediately.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Secure NFT Minting",
      description:
        "Mint your digital art as NFTs with confidence, knowing that our platform provides the highest level of security.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Artist Marketplace",
      description:
        "Discover unique digital art from talented artists around the world, or showcase and sell your own creations.",
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Key Features
          </motion.h2>
          <motion.p
            className="text-lg text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover what makes Cryptoart the premier platform for digital art and NFTs
          </motion.p>
        </div>

        <div ref={ref} className="space-y-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-8 md:gap-16`}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="w-full md:w-1/2">
                <div className="relative overflow-hidden rounded-2xl group">
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

