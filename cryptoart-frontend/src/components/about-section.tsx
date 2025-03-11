"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Shield, Palette, Bitcoin } from "lucide-react"

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="about" className="py-24 bg-black relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-10" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            About Cryptoart
          </motion.h2>
          <motion.p
            className="text-lg text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Cryptoart is at the intersection of artistic expression and blockchain security. We provide a platform for
            artists to create, showcase, and sell their digital art as NFTs while ensuring the highest level of security
            and authenticity.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Palette className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Artistic Innovation</h3>
            <p className="text-gray-400">
              We empower artists with tools to create unique digital masterpieces that stand out in the NFT marketplace.
            </p>
          </motion.div>

          <motion.div
            className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Uncompromising Security</h3>
            <p className="text-gray-400">
              Our platform utilizes cutting-edge blockchain technology to ensure your digital assets remain secure and
              authentic.
            </p>
          </motion.div>

          <motion.div
            className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Bitcoin className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Blockchain Integration</h3>
            <p className="text-gray-400">
              Seamlessly connect your wallet and interact with our smart contracts to mint, buy, and sell NFTs with
              ease.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

