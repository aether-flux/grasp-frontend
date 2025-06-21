"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, Sparkles, Users, Rocket, Heart } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Hero Section */}
      <section id="hero" className="px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-[#222222] mb-6 ">
              Get a{" "}
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#A78BFA] bg-clip-text text-transparent">Grasp</span>{" "}
              on Everything
            </h1>
            <p className="text-xl md:text-2xl text-[#222222]/70 mb-12 max-w-2xl mx-auto leading-relaxed">
              The intuitive platform that helps you understand, organize, and master any topic with ease.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center"
          >
            <Link href="/upload">
            <Button
              size="lg"
              className="bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white px-14 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#4F46E5]/30 transition-all duration-300 group cursor-pointer"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/50 border-[#222222]/10 text-[#222222] hover:bg-white hover:border-[#4F46E5]/30 px-8 py-6 text-lg rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              Watch Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#222222] mb-4">
              Everything you need to <span className="text-[#4F46E5]">succeed</span>
            </h2>
            <p className="text-xl text-[#222222]/70 max-w-2xl mx-auto">
              Powerful features designed to make learning and understanding effortless
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered",
                description: "Advanced AI helps you understand complex topics with personalized explanations",
                color: "#A78BFA",
              },
              {
                icon: Rocket,
                title: "Always Improving",
                description: "Regular updates and new features to enhance your learning experience",
                color: "#10B981",
              },
              {
                icon: Heart,
                title: "Made with Care",
                description: "Thoughtfully designed with attention to detail and user experience",
                color: "#A78BFA",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-lg hover:shadow-black/5 transition-all duration-300 group border border-white/20"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-semibold text-[#222222] mb-3">{feature.title}</h3>
                <p className="text-[#222222]/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Bar */}
      <motion.section
        id="get-started"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="px-6 py-16"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#4F46E5] to-[#A78BFA] rounded-3xl p-12 text-center relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5]/20 to-[#A78BFA]/20 blur-xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are already using Grasp to master new skills and knowledge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/upload">
                <Button
                  size="lg"
                  className="bg-white text-[#4F46E5] hover:bg-white/90 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  Start Learning Today
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer id="footer" className="px-6 py-12 border-t border-[#222222]/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#A78BFA] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-[#222222]">Grasp</span>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#" className="text-[#222222]/60 hover:text-[#4F46E5] transition-colors duration-300">
                Privacy
              </a>
              <a href="#" className="text-[#222222]/60 hover:text-[#4F46E5] transition-colors duration-300">
                Terms
              </a>
              <a href="#" className="text-[#222222]/60 hover:text-[#4F46E5] transition-colors duration-300">
                Support
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#222222]/10 text-center">
            <p className="text-[#222222]/60">
              © {new Date().getFullYear()} Grasp. Made with care by Team Rocket.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

