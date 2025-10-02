"use client"
import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Topic, VocabularyWord, VocabularyResponse, getTopics, getVocabularyForTopic } from "@/lib/database"

// Algenib TTS integration
declare global {
  interface Window {
    AlgenibAudioService: any;
  }
}
import { Icon } from '@iconify/react'
import {
  Search,
  Languages,
  MessageCircle,
  BookOpen,
  ArrowLeft,
  X,
  Settings,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Square,
} from "lucide-react"

// Topic icon mapping for our new 39 topics
// Iconify Solar set icons (solar by 480 Design) — use icon names, render with <Icon icon="solar:..." />
const TOPIC_ICONS = [
  { id: 1, icon: 'solar:chat-round-linear' }, // Greetings
  { id: 2, icon: 'solar:calculator-linear' }, // Numbers
  { id: 3, icon: 'solar:clock-circle-linear' }, // Time & Dates
  { id: 4, icon: 'solar:map-point-linear' }, // Directions & Transportation
  { id: 5, icon: 'solar:cart-3-linear' }, // Shopping & Money
  { id: 6, icon: 'solar:cup-hot-linear' }, // Food, Drinks & Restaurants
  { id: 7, icon: 'solar:danger-triangle-linear' }, // Emergency & Safety
  { id: 8, icon: 'solar:heart-pulse-linear' }, // Health
  { id: 9, icon: 'solar:home-2-linear' }, // Home & Household Items
  { id: 10, icon: 'solar:t-shirt-linear' }, // Clothing & Personal Style
  { id: 11, icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.74 5.47c2.36 1.03 3.61 3.56 3.18 5.99A6 6 0 0 1 18 16v.17a3 3 0 0 1 1-.17a3 3 0 0 1 3 3a3 3 0 0 1-3 3H6a4 4 0 0 1-4-4a4 4 0 0 1 4-4h.27C5 12.45 4.6 10.24 5.5 8.26a5.49 5.49 0 0 1 7.24-2.79m-.81 1.83c-1.77-.8-3.84.01-4.62 1.77c-.46 1.02-.38 2.15.1 3.06A5.99 5.99 0 0 1 12 10c.7 0 1.38.12 2 .34a3.51 3.51 0 0 0-2.07-3.04m1.62-3.66c-.55-.24-1.1-.41-1.67-.52l2.49-1.3l.9 2.89a7.7 7.7 0 0 0-1.72-1.07m-7.46.8c-.49.35-.92.75-1.29 1.19l.11-2.81l2.96.68c-.62.21-1.22.53-1.78.94M18 9.71c-.09-.59-.22-1.16-.41-1.71l2.38 1.5l-2.05 2.23c.11-.65.13-1.33.08-2.02M3.04 11.3c.07.6.2 1.17.39 1.7l-2.37-1.5L3.1 9.28c-.1.65-.13 1.33-.06 2.02M19 18h-3v-2a4 4 0 0 0-4-4a4 4 0 0 0-4 4H6a2 2 0 0 0-2 2a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1a1 1 0 0 0-1-1"/></svg>' }, // Weather
  { id: 12, icon: 'solar:users-group-rounded-linear' }, // Family
  { id: 13, icon: 'solar:emoji-funny-square-linear' }, // Emotions & Feelings
  { id: 14, icon: 'solar:user-circle-linear' }, // Personality & Character
  { id: 15, icon: 'solar:gameboy-linear' }, // Hobbies & Leisure Activities
  { id: 16, icon: 'solar:basketball-linear' }, // Sports & Fitness
  { id: 17, icon: 'solar:buildings-2-linear' }, // City
  { id: 18, icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 6h2V4h-2zm1 6q-1.9 0-3.625-.788T5 9.45V8q0-.825.588-1.412T7 6h2V3q0-.425.288-.712T10 2h4q.425 0 .713.288T15 3v3h2q.825 0 1.413.588T19 8v1.45q-1.65.975-3.375 1.763T12 12m-5 9q-.825 0-1.412-.587T5 19v-7.3q1.4.85 2.888 1.45t3.112.8V14q0 .425.288.713T12 15t.713-.288T13 14v-.05q1.625-.2 3.113-.8T19 11.7V19q0 .825-.587 1.413T17 21q0 .425-.288.713T16 22q-.4 0-.562-.363T15 21H9q0 .425-.288.713T8 22q-.4 0-.562-.363T7 21"/></svg>' }, // Travel
  { id: 19, icon: 'solar:star-bold' }, // Colors & Shapes  
  { id: 20, icon: 'solar:sun-bold' }, // Nature
  { id: 21, icon: 'solar:walking-linear' }, // Actions
  { id: 22, icon: 'solar:document-text-linear' }, // Adjectives
  { id: 23, icon: 'solar:music-note-4-linear' }, // Arts & Entertainment
  { id: 24, icon: 'solar:smartphone-linear' }, // Technology & Gadgets
  { id: 25, icon: 'solar:case-round-linear' }, // Work & Professions
  { id: 26, icon: 'solar:graduation-cap-linear' }, // Education & School Life
  { id: 27, icon: 'solar:microphone-linear' }, // Communication & Media
  { id: 28, icon: 'solar:leaf-linear' }, // Environment & Sustainability
  { id: 29, icon: 'solar:graph-up-linear' }, // Business & Economics
  { id: 30, icon: 'solar:book-2-linear' }, // Common Collocations
  { id: 31, icon: 'solar:chat-square-like-linear' }, // Slang & Modern Expressions
  { id: 32, icon: 'solar:atom-linear' }, // Science & Technology
  { id: 33, icon: 'solar:calculator-minimalistic-linear' }, // Mathematics & Geometry
  { id: 34, icon: 'solar:history-linear' }, // History & Culture
  { id: 35, icon: 'solar:scale-linear' }, // Politics & Law
  { id: 36, icon: 'solar:meditation-round-linear' }, // Religion & Philosophy
  { id: 37, icon: 'solar:magic-stick-3-linear' }, // Mythology & Fantasy
  { id: 38, icon: 'solar:confetti-minimalistic-linear' }, // Celebrations & Holidays
  { id: 39, icon: 'solar:document-medicine-linear' }, // Advanced Communication & Formal Language
  { id: 40, icon: 'solar:global-linear' }, // Cultural Integration & Global Perspectives
]

// iPhone-style Topic Slider Component
interface TopicSliderProps {
  topics: Topic[]
  selectedTopic: Topic | null
  onTopicSelect: (topic: Topic) => void
  TOPIC_ICONS: Array<{ id: number; icon: string | any }>
  getTopicDisplayName: (id: number, name: string) => string
}

const TopicSlider: React.FC<TopicSliderProps> = ({ 
  topics, 
  selectedTopic, 
  onTopicSelect, 
  TOPIC_ICONS, 
  getTopicDisplayName 
}) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // Define the 6 sections with their topics and metadata
  const sections = [
    {
      name: "FIRST AID KIT",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><mask id="SVGDmnSdctG"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="#fff" fill-opacity="0" stroke-dasharray="64" stroke-dashoffset="64" d="M9 7h11c0.55 0 1 0.45 1 1v11c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-11c0 -0.55 0.45 -1 1 -1Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.9s" dur="0.5s" values="0;1"/><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path><path stroke-dasharray="16" stroke-dashoffset="16" d="M9 7v-3c0 -0.55 0.45 -1 1 -1h4c0.55 0 1 0.45 1 1v3"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="16;0"/></path><path stroke="#000" stroke-dasharray="8" stroke-dashoffset="8" d="M12 11v6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.4s" dur="0.2s" values="8;0"/></path><path stroke="#000" stroke-dasharray="8" stroke-dashoffset="8" d="M9 14h6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.6s" dur="0.2s" values="8;0"/></path></g></mask><rect width="24" height="24" fill="currentColor" mask="url(#SVGDmnSdctG)"/></svg>',
      topics: topics.slice(0, 6), // 6 topics: Greetings, Numbers, Time, Emergency, Directions, Travel
      gridCols: 2
    },
    {
      name: "DAILY LIFE", 
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-opacity="0" d="M17 14v4c0 1.66 -1.34 3 -3 3h-6c-1.66 0 -3 -1.34 -3 -3v-4Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.8s" dur="0.15s" values="0;0.3"/></path><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="48" stroke-dashoffset="48" d="M17 9v9c0 1.66 -1.34 3 -3 3h-6c-1.66 0 -3 -1.34 -3 -3v-9Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="48;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M17 9h3c0.55 0 1 0.45 1 1v3c0 0.55 -0.45 1 -1 1h-3"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="14;0"/></path><mask id="SVGnGEayvOG"><path stroke="#fff" d="M8 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M12 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M16 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4"><animateMotion calcMode="linear" dur="3s" path="M0 0v-8" repeatCount="indefinite"/></path></mask><rect width="24" height="0" y="7" fill="currentColor" mask="url(#SVGnGEayvOG)"><animate fill="freeze" attributeName="y" begin="0.8s" dur="0.6s" values="7;2"/><animate fill="freeze" attributeName="height" begin="0.8s" dur="0.6s" values="0;5"/></rect></g></svg>',
      topics: topics.slice(6, 14), // 8 topics: Shopping, Food, Health, Home, Family, Personal Style, Weather & Nature, Places
      gridCols: 2
    },
    {
      name: "WORK & SCHOOL",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="20" stroke-dashoffset="20" d="M3 21h18"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="20;0"/></path><path fill="currentColor" fill-opacity="0" stroke-dasharray="48" stroke-dashoffset="48" d="M7 17v-4l10 -10l4 4l-10 10h-4"><animate fill="freeze" attributeName="fill-opacity" begin="1.1s" dur="0.15s" values="0;0.3"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.6s" values="48;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M14 6l4 4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="8;0"/></path></g></svg>',
      topics: topics.slice(20, 28), // 8 topics: Professions, Education, History & Culture, Science, Technology, Arts, Mathematics, Colors
      gridCols: 2
    },
    {
      name: "PERSONAL & SOCIAL LIFE",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><mask id="SVGydZajcRT"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="#fff" fill-opacity="0" stroke-dasharray="64" stroke-dashoffset="64" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9"><animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.5s" values="0;1"/><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path><path stroke="#000" stroke-dasharray="2" stroke-dashoffset="2" d="M9 9v1"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.2s" dur="0.2s" values="2;0"/></path><path stroke="#000" stroke-dasharray="2" stroke-dashoffset="2" d="M15 9v1"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.4s" dur="0.2s" values="2;0"/></path><path stroke="#000" stroke-dasharray="12" stroke-dashoffset="12" d="M8 14c0.5 1.5 1.79 3 4 3c2.21 0 3.5 -1.5 4 -3"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.6s" dur="0.2s" values="12;0"/></path></g></mask><rect width="24" height="24" fill="currentColor" mask="url(#SVGydZajcRT)"/></svg>',
      topics: topics.slice(14, 20), // 6 topics: Emotions & Feelings, Personality, Actions, Hobbies, Sports, Adjectives
      gridCols: 2
    },
    {
      name: "CULTURE & SOCIETY",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-dasharray="80" stroke-dashoffset="80" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.47 5.94c1.83 1.37 3.81 4.14 4.53 5.63c0.72 -1.49 2.7 -4.26 4.53 -5.63c1.33 -0.99 3.47 -1.75 3.47 0.68c0 0.49 -0.28 4.08 -0.45 4.66c-0.57 2.03 -2.65 2.55 -4.5 2.23c3.24 0.55 4.06 2.36 2.28 4.17c-3.38 3.44 -4.85 -0.87 -5.23 -1.97c-0.07 -0.2 -0.1 -0.3 -0.1 -0.22c-0 -0.08 -0.03 0.02 -0.1 0.22c-0.38 1.1 -1.86 5.41 -5.23 1.97c-1.78 -1.81 -0.96 -3.63 2.28 -4.17c-1.85 0.31 -3.93 -0.21 -4.5 -2.23c-0.17 -0.58 -0.45 -4.18 -0.45 -4.66c0 -2.43 2.14 -1.67 3.47 -0.68Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="80;0"/></path></svg>',
      topics: topics.slice(28, 36), // 8 topics: Business & Economics, Politics & Law, Religion & Philosophy, Cultural Integration, Environment, Media, Mythology & Fantasy, Celebrations & Holidays
      gridCols: 2
    },
    {
      name: "VETERAN FIELD",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-dasharray="64" stroke-dashoffset="64" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l-9 3.5v6.5c0 3.5 3.5 9 8 10c4.5 -1 8 -6.5 8 -10v-6.5l-8 -3.5Z"><animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.15s" values="0;0.3"/><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path></svg>',
      topics: topics.slice(36, 38), // 2 topics: Common Phrases, Modern Expressions
      gridCols: 2
    }
  ]

  // Touch handlers for swipe gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0) // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
    if (isRightSwipe && currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  // Navigation dot click handler
  const handleDotClick = (sectionIndex: number) => {
    setCurrentSection(sectionIndex)
  }

  const renderTopicButton = (topic: Topic) => {
    const hasCustomIcon = topic.icon
    const iconData = TOPIC_ICONS.find(icon => icon.id === topic.id)
    
    // Direct mapping for custom SVG icons
    const customSVGIcons: { [key: number]: string } = {
      11: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.74 5.47c2.36 1.03 3.61 3.56 3.18 5.99A6 6 0 0 1 18 16v.17a3 3 0 0 1 1-.17a3 3 0 0 1 3 3a3 3 0 0 1-3 3H6a4 4 0 0 1-4-4a4 4 0 0 1 4-4h.27C5 12.45 4.6 10.24 5.5 8.26a5.49 5.49 0 0 1 7.24-2.79m-.81 1.83c-1.77-.8-3.84.01-4.62 1.77c-.46 1.02-.38 2.15.1 3.06A5.99 5.99 0 0 1 12 10c.7 0 1.38.12 2 .34a3.51 3.51 0 0 0-2.07-3.04m1.62-3.66c-.55-.24-1.1-.41-1.67-.52l2.49-1.3l.9 2.89a7.7 7.7 0 0 0-1.72-1.07m-7.46.8c-.49.35-.92.75-1.29 1.19l.11-2.81l2.96.68c-.62.21-1.22.53-1.78.94M18 9.71c-.09-.59-.22-1.16-.41-1.71l2.38 1.5l-2.05 2.23c.11-.65.13-1.33.08-2.02M3.04 11.3c.07.6.2 1.17.39 1.7l-2.37-1.5L3.1 9.28c-.1.65-.13 1.33-.06 2.02M19 18h-3v-2a4 4 0 0 0-4-4a4 4 0 0 0-4 4H6a2 2 0 0 0-2 2a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1a1 1 0 0 0-1-1"/></svg>',
      18: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 6h2V4h-2zm1 6q-1.9 0-3.625-.788T5 9.45V8q0-.825.588-1.412T7 6h2V3q0-.425.288-.712T10 2h4q.425 0 .713.288T15 3v3h2q.825 0 1.413.588T19 8v1.45q-1.65.975-3.375 1.763T12 12m-5 9q-.825 0-1.412-.587T5 19v-7.3q1.4.85 2.888 1.45t3.112.8V14q0 .425.288.713T12 15t.713-.288T13 14v-.05q1.625-.2 3.113-.8T19 11.7V19q0 .825-.587 1.413T17 21q0 .425-.288.713T16 22q-.4 0-.562-.363T15 21H9q0 .425-.288.713T8 22q-.4 0-.562-.363T7 21"/></svg>'
    }
    
    return (
      <button
        key={topic.id}
        onClick={() => onTopicSelect(topic)}
        className={`bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center hover:bg-black/30 transition-all duration-300 transform hover:scale-[1.02] h-28 sm:h-32 ${
          selectedTopic?.id === topic.id ? "bg-white/20 border-white/30" : ""
        }`}
      >
        <div className="flex flex-col items-center gap-2 sm:gap-3 h-full justify-center">
          {hasCustomIcon ? (
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12" 
              style={{ color: 'rgba(255,255,255,0.8)' }}
              dangerouslySetInnerHTML={{ __html: topic.icon! }}
            />
          ) : customSVGIcons[topic.id] ? (
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12" 
              style={{ color: 'rgba(255,255,255,0.8)' }}
              dangerouslySetInnerHTML={{ __html: customSVGIcons[topic.id] }}
            />
          ) : iconData && typeof iconData.icon === 'string' ? (
            <Icon icon={iconData.icon} width="40" height="40" className="sm:w-12 sm:h-12" style={{ color: 'rgba(255,255,255,0.8)' }} />
          ) : iconData ? (
            (iconData.icon as any)({ className: 'w-10 h-10 sm:w-12 sm:h-12 text-white/80' })
          ) : (
            <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white/80" />
          )}
          <p className="text-white/90 text-sm sm:text-base font-medium leading-tight px-1">{getTopicDisplayName(topic.id, topic.name)}</p>
        </div>
      </button>
    )
  }

  const currentSectionData = sections[currentSection]

  return (
    <div className="h-full flex flex-col">
      {/* Section title */}
      <div className="mb-3 px-4 py-1 flex-shrink-0">
        <h2 className="text-white font-medium flex items-start justify-center gap-2">
          <span className="text-base sm:text-xl tracking-wide">{currentSectionData.name}</span>
          <div 
            className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 -mt-1" 
            style={{ color: 'currentColor' }}
            dangerouslySetInnerHTML={{ __html: currentSectionData.icon }}
          />
        </h2>
      </div>

      {/* Sliding container - clean and simple */}
      <div 
        className="flex-1 overflow-hidden px-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-300 ease-out h-full"
          style={{ transform: `translateX(-${currentSection * 100}%)` }}
        >
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="w-full flex-shrink-0 px-3 overflow-hidden">
              <div 
                className={`grid gap-3 sm:gap-4 h-full content-start ${
                  section.gridCols === 3 ? 'grid-cols-3' : 'grid-cols-2'
                }`}
              >
                {section.topics.map(renderTopicButton)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-4 pb-2 flex-shrink-0">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentSection 
                ? 'bg-white' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

type PageState = "native" | "target" | "confirmation" | "learning"

export function LanguageSelector() {
  const [currentPage, setCurrentPage] = useState<PageState>("native")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [nativeLanguage, setNativeLanguage] = useState("")
  const [nativeLanguageCode, setNativeLanguageCode] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("")
  const [targetLanguageCode, setTargetLanguageCode] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [questionText, setQuestionText] = useState("What language do you speak?")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    autoPlay: true, // Auto-play enabled by default as requested
    trainingLanguageVoice: "Male" as "Female" | "Male", // Changed to Male
    mainLanguageVoice: "Male" as "Female" | "Male",
    pronunciationSpeed: "Normal" as "Slow" | "Normal" | "Fast",
    pauseBetweenTranslations: 0.5, // 0.5 seconds by default
    pauseForNextWord: 0.7, // 0.7 seconds by default
    repeatTargetLanguage: 1, // 1x by default
    repeatMainLanguage: 1, // 1x by default
  })

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudioStep, setCurrentAudioStep] = useState<'training' | 'main' | 'pause' | 'idle'>('idle')
  // User interaction tracking to prevent auto-play on page load
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [autoPlayActive, setAutoPlayActive] = useState(false)
  
  // Ref to track auto-play state for cancellation
  const autoPlayRef = useRef(false)
  
  // Audio call tracking to prevent rapid concurrent calls
  const audioCallInProgress = useRef(false)
  const lastAudioCallTime = useRef(0)
  
  // Hybrid audio service for Umbriel + TTS
  const [hasUmbrielAudio, setHasUmbrielAudio] = useState(false)
  const [umbrielStatus, setUmbrielStatus] = useState<string>("")
  const [activeAudioService, setActiveAudioService] = useState<string>("None")

  // 🌍 UNIVERSAL LANGUAGE CODE MAPPING - All 47 Azure Languages + Alnilam
  const getLanguageCode = (languageName: string): string => {
    const languageMap: { [key: string]: string } = {
      // ✅ Phase 1B Complete (7 languages)
      'Swedish': 'sv-SE',
      'Norwegian': 'nb-NO', 
      'Danish': 'da-DK',
      'Hebrew': 'he-IL',
      'Chinese': 'zh-CN',
      'Mandarin': 'zh-CN',
      'Finnish': 'fi-FI',
      'Czech': 'cs-CZ',

      // 🚀 Phase 2 - Western European (6 languages)
      'German': 'de-DE',
      'French': 'fr-FR',
      'Spanish': 'es-ES',
      'Italian': 'it-IT',
      'Portuguese': 'pt-PT',
      'Dutch': 'nl-NL',

      // 🌍 Phase 2 - Eastern European (6 languages)
      'Russian': 'ru-RU',
      'Polish': 'pl-PL',
      'Ukrainian': 'uk-UA',
      'Hungarian': 'hu-HU',
      'Romanian': 'ro-RO',
      'Bulgarian': 'bg-BG',

      // 🥢 Phase 2 - Asian Languages (8 languages)
      'Japanese': 'ja-JP',
      'Korean': 'ko-KR',
      'Thai': 'th-TH',
      'Vietnamese': 'vi-VN',
      'Hindi': 'hi-IN',
      'Bengali': 'bn-IN',
      'Tamil': 'ta-IN',
      'Telugu': 'te-IN',

      // 🕌 Phase 2 - Middle Eastern & Others (6 languages)
      'Arabic': 'ar-SA',
      'Turkish': 'tr-TR',
      'Persian': 'fa-IR',
      'Farsi': 'fa-IR',
      'Urdu': 'ur-PK',
      'Malayalam': 'ml-IN',
      'Gujarati': 'gu-IN',

      // 🌟 Phase 3 - Additional European & Others (14 languages)
      'Croatian': 'hr-HR',
      'Slovak': 'sk-SK',
      'Slovenian': 'sl-SI',
      'Lithuanian': 'lt-LT',
      'Latvian': 'lv-LV',
      'Estonian': 'et-EE',
      'Greek': 'el-GR',
      'Maltese': 'mt-MT',
      'Macedonian': 'mk-MK',
      'Icelandic': 'is-IS',
      'Irish': 'ga-IE',
      'Welsh': 'cy-GB',
      'Basque': 'eu-ES',
      'Catalan': 'ca-ES',

      // 🎵 Alnilam Library Languages (22 languages)
      'English': 'en-US',
      'Indonesian': 'id-ID',
      'Marathi': 'mr-IN',

      // Additional Azure variants
      'Malay': 'ms-MY',
      'Serbian': 'sr-RS',
    }
    return languageMap[languageName] || 'en-US'
  }

  // Get flag icon for language code using Flag Icons pack
  const getFlagIcon = (languageCode: string): string => {
    const flagMap: { [key: string]: string } = {
      'ar': 'flag:sa-1x1', // Arabic -> Saudi Arabia
      'bg': 'flag:bg-1x1', // Bulgarian -> Bulgaria
      'bn': 'flag:bd-1x1', // Bengali -> Bangladesh
      'ca': 'flag:es-ct-1x1', // Catalan -> Catalonia (Spain)
      'cs': 'flag:cz-1x1', // Czech -> Czech Republic
      'cy': 'flag:gb-wls-1x1', // Welsh -> Wales
      'da': 'flag:dk-1x1', // Danish -> Denmark
      'de': 'flag:de-1x1', // German -> Germany
      'el': 'flag:gr-1x1', // Greek -> Greece
      'en': 'flag:us-1x1', // English -> United States
      'es': 'flag:es-1x1', // Spanish -> Spain
      'et': 'flag:ee-1x1', // Estonian -> Estonia
      'eu': 'flag:es-pv-1x1', // Basque -> Basque Country
      'fa': 'flag:ir-1x1', // Persian -> Iran
      'fi': 'flag:fi-1x1', // Finnish -> Finland
      'fr': 'flag:fr-1x1', // French -> France
      'ga': 'flag:ie-1x1', // Irish -> Ireland
      'gu': 'flag:in-1x1', // Gujarati -> India
      'he': 'flag:il-1x1', // Hebrew -> Israel
      'hi': 'flag:in-1x1', // Hindi -> India
      'hr': 'flag:hr-1x1', // Croatian -> Croatia
      'hu': 'flag:hu-1x1', // Hungarian -> Hungary
      'id': 'flag:id-1x1', // Indonesian -> Indonesia
      'is': 'flag:is-1x1', // Icelandic -> Iceland
      'it': 'flag:it-1x1', // Italian -> Italy
      'ja': 'flag:jp-1x1', // Japanese -> Japan
      'ko': 'flag:kr-1x1', // Korean -> South Korea
      'lt': 'flag:lt-1x1', // Lithuanian -> Lithuania
      'lv': 'flag:lv-1x1', // Latvian -> Latvia
      'mk': 'flag:mk-1x1', // Macedonian -> North Macedonia
      'ml': 'flag:in-1x1', // Malayalam -> India
      'mr': 'flag:in-1x1', // Marathi -> India
      'mt': 'flag:mt-1x1', // Maltese -> Malta
      'nl': 'flag:nl-1x1', // Dutch -> Netherlands
      'no': 'flag:no-1x1', // Norwegian -> Norway
      'pl': 'flag:pl-1x1', // Polish -> Poland
      'pt': 'flag:pt-1x1', // Portuguese -> Portugal
      'ro': 'flag:ro-1x1', // Romanian -> Romania
      'ru': 'flag:ru-1x1', // Russian -> Russia
      'sk': 'flag:sk-1x1', // Slovak -> Slovakia
      'sl': 'flag:si-1x1', // Slovenian -> Slovenia
      'sv': 'flag:se-1x1', // Swedish -> Sweden
      'ta': 'flag:in-1x1', // Tamil -> India
      'te': 'flag:in-1x1', // Telugu -> India
      'th': 'flag:th-1x1', // Thai -> Thailand
      'tr': 'flag:tr-1x1', // Turkish -> Turkey
      'uk': 'flag:ua-1x1', // Ukrainian -> Ukraine
      'ur': 'flag:pk-1x1', // Urdu -> Pakistan
      'vi': 'flag:vn-1x1', // Vietnamese -> Vietnam
      'zh': 'flag:cn-1x1', // Chinese -> China
    }
    return flagMap[languageCode] || 'flag:us-1x1'
  }

  // Get available voices for a language - TTS DISABLED
  const getVoiceForLanguage = (languageCode: string, gender: 'Female' | 'Male'): any => {
    // const voices = speechSynthesis.getVoices()
    console.log('TTS disabled - voice selection skipped:', { languageCode, gender })
    return null
  }

  // Speech speed mapping
  const getSpeedRate = (speed: string): number => {
    let rate: number
    switch (speed) {
      case 'Slow': rate = 0.7; break
      case 'Fast': rate = 1.3; break
      default: rate = 1.0 // Normal
    }
    console.log(`getSpeedRate: ${speed} -> ${rate}`)
    return rate
  }

  // Speak function with Promise support
  const speak = (text: string, languageCode: string, voice: SpeechSynthesisVoice | null): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Enhanced validation to handle all edge cases
      if (!text || text === undefined || text === null || typeof text !== 'string') {
        console.warn('speak() called with invalid text:', text)
        resolve()
        return
      }

      const trimmedText = String(text).trim()
      if (!trimmedText || trimmedText.length === 0) {
        console.warn('speak() called with empty text after trimming:', text)
        resolve()
        return
      }

      try {
        // const utterance = new SpeechSynthesisUtterance(trimmedText)
        // utterance.lang = languageCode
        // utterance.rate = getSpeedRate(settings.pronunciationSpeed)
        
        // if (voice) {
        //   utterance.voice = voice
        // }

        // utterance.onend = () => resolve()
        // utterance.onerror = (error) => {
        //   console.error('Speech synthesis error:', error)
        //   reject(error)
        // }

        // speechSynthesis.speak(utterance) // TTS DISABLED
        console.log('TTS disabled - would speak:', trimmedText, 'in', languageCode)
        resolve() // Immediately resolve since no actual speech
      } catch (error) {
        console.error('Error in speak function:', error)
        reject(error)
      }
    })
  }

  // Sleep function for pauses
  const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Multi-voice Audio Service Integration
  const [algenibService, setAlgenibService] = useState<any>(null)
  const [alnilamService, setAlnilamService] = useState<any>(null)
  
  // Audio control for immediate stopping
  const [currentAudioElements, setCurrentAudioElements] = useState<HTMLAudioElement[]>([])
  const audioElementsRef = useRef<HTMLAudioElement[]>([])
  const stopRequestedRef = useRef(false)
  
  // Initialize Algenib Audio Service
  useEffect(() => {
    // Dynamically import the Algenib audio service
    const initAlgenib = async () => {
      try {
        // Load the service from the public directory
        if (typeof window !== 'undefined') {
          const script = document.createElement('script')
          script.src = '/lib/algenib-audio-service.js'
          script.onload = () => {
            if (window.AlgenibAudioService) {
              const service = new window.AlgenibAudioService()
              setAlgenibService(service)
              setActiveAudioService("Algenib")
              console.log('🎤 Algenib Audio Service initialized')
            }
          }
          document.head.appendChild(script)
        }
      } catch (error) {
        console.error('Failed to initialize Algenib service:', error)
      }
    }
    
    initAlgenib()
  }, [])

  // Initialize Alnilam Audio Service
  useEffect(() => {
    const initAlnilam = () => {
      try {
        console.log('🚀 Starting Alnilam service initialization...') // Updated for debugging
        console.log('🔍 initAlnilam function called - checking environment');
        
        // Create service directly with all needed methods
        const alnilamAudioService = {
          async playWordSequence(sourceWord: string, targetWord: string, settings: any, wordId: string, sourceLanguage: string, targetLanguage: string) {
            console.log('🎵 Alnilam playWordSequence called:', {
              sourceWord, targetWord, sourceLanguage, targetLanguage, wordId
            });

            try {
              // Reset stop flag
              stopRequestedRef.current = false;
              
              // Clear any existing audio elements
              audioElementsRef.current.forEach(audio => {
                try {
                  audio.pause();
                  audio.src = '';
                } catch (e) {}
              });
              audioElementsRef.current = [];

              // Convert language names to codes - UPDATED FOR AZURE ROUTING
              const languageMappings = {
                // Azure target languages (keep Azure locale codes)
                'Chinese': 'zh-CN', 'Swedish': 'sv-SE', 'Norwegian': 'no', 'Danish': 'da-DK',
                'Finnish': 'fi-FI', 'Hebrew': 'he-IL', 'Czech': 'cs-CZ', 'Greek': 'el-GR',
                'Malay': 'ms-MY', 'Hungarian': 'hu-HU', 'Bulgarian': 'bg-BG', 'Croatian': 'hr-HR',
                'Slovak': 'sk-SK', 'Slovenian': 'sl-SI', 'Estonian': 'et-EE',
                
                // Alnilam languages (use simple codes for compatibility)
                'Arabic': 'ar', 'German': 'de', 'Spanish': 'es', 'French': 'fr',
                'Hindi': 'hi', 'Indonesian': 'id', 'Italian': 'it', 'Japanese': 'ja',
                'Korean': 'ko', 'Portuguese': 'pt', 'Russian': 'ru', 'Dutch': 'nl',
                'Polish': 'pl', 'Thai': 'th', 'Turkish': 'tr', 'Vietnamese': 'vi',
                'Romanian': 'ro', 'Ukrainian': 'uk', 'Bengali': 'bn', 'Marathi': 'mr',
                'Tamil': 'ta', 'Telugu': 'te', 'English': 'en'
              };

              const sourceLangCode = (languageMappings as any)[sourceLanguage] || sourceLanguage.toLowerCase();
              const targetLangCode = (languageMappings as any)[targetLanguage] || targetLanguage.toLowerCase();

              console.log(`🌟 Playing Alnilam audio: TARGET FIRST ${targetWord} (${targetLangCode}) → THEN SOURCE ${sourceWord} (${sourceLangCode})`);

              // CRITICAL FIX: Enable audio context for autoplay policy
              try {
                // Try to resume AudioContext if it's suspended (autoplay policy)
                if (typeof window !== 'undefined' && window.AudioContext) {
                  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                  if (audioContext.state === 'suspended') {
                    console.log('🔓 Resuming AudioContext for autoplay...');
                    await audioContext.resume();
                  }
                }
              } catch (audioContextError) {
                console.log('⚠️ AudioContext resume failed (might be normal):', (audioContextError as Error).message);
              }

              // � UNIVERSAL AUDIO ROUTING - Supports all 47 Azure languages + Alnilam
              const getAudioUrl = (wordId: string | number, languageCode: string) => {
                console.log(`🌍 Using Universal Audio API for ${languageCode}`);
                return `/api/universal-audio?wordId=${wordId}&languageCode=${languageCode}`;
              };

              // FIXED ORDER: Play TARGET language first (what user is learning)
              if (wordId && targetLangCode) {
                const targetUrl = getAudioUrl(wordId, targetLangCode);
                console.log(`🎯 Loading TARGET audio FIRST: ${targetUrl}`);
                
                // Set visual indicator for target language
                if (settings?.setCurrentAudioStep) {
                  settings.setCurrentAudioStep('training');
                }
                
                // FIXED MAPPING: Target language repeats (what user is learning)
                const targetRepeats = settings?.repeatTargetLanguage || 1;
                for (let i = 0; i < targetRepeats; i++) {
                  // Check if stop was requested
                  if (stopRequestedRef.current) {
                    console.log('🛑 Stop requested during target audio');
                    return false;
                  }
                  
                  try {
                    const targetAudio = new Audio(targetUrl);
                    // Store audio element for stop functionality
                    audioElementsRef.current.push(targetAudio);
                    
                    // CRITICAL: Set audio properties for better browser compatibility
                    targetAudio.crossOrigin = 'anonymous';
                    targetAudio.preload = 'auto';
                    // Apply speed setting to audio playback
                    targetAudio.playbackRate = getSpeedRate(settings.pronunciationSpeed || 'Normal');
                    
                    await new Promise((resolve, reject) => {
                      const timeout = setTimeout(() => {
                        reject(new Error('Audio timeout'));
                      }, 10000); // 10 second timeout
                      
                      targetAudio.onended = () => {
                        clearTimeout(timeout);
                        resolve(null);
                      };
                      targetAudio.onerror = (error) => {
                        clearTimeout(timeout);
                        reject(error);
                      };
                      targetAudio.oncanplaythrough = () => {
                        // Check stop flag before playing
                        if (stopRequestedRef.current) {
                          clearTimeout(timeout);
                          resolve(null);
                          return;
                        }
                        // Audio is ready to play
                        targetAudio.play().catch(reject);
                      };
                      
                      // Load the audio
                      targetAudio.load();
                    });
                    console.log(`✅ TARGET audio played: ${targetWord} (${targetLangCode}) - Repeat ${i + 1}/${targetRepeats}`);
                    
                    // Small pause between repeats (except after last repeat)
                    if (i < targetRepeats - 1) {
                      await new Promise(resolve => setTimeout(resolve, 300));
                    }
                  } catch (error) {
                    console.log(`⚠️ TARGET audio failed: ${targetWord} (${targetLangCode}) - Repeat ${i + 1}`, error);
                    return false; // Return false on audio failure
                  }
                }

                // Pause between translations
                if (settings?.pauseBetweenTranslations) {
                  await new Promise(resolve => setTimeout(resolve, settings.pauseBetweenTranslations * 1000));
                }
              }

              // Check if stop was requested between target and source
              if (stopRequestedRef.current) {
                console.log('🛑 Stop requested between target and source');
                return false;
              }

                            // FIXED ORDER: Play SOURCE language second (native/main language)
              if (wordId && sourceLangCode) {
                const sourceUrl = getAudioUrl(wordId, sourceLangCode);
                console.log(`🎵 Loading SOURCE audio SECOND: ${sourceUrl}`);
                
                // Set visual indicator for source language
                if (settings?.setCurrentAudioStep) {
                  settings.setCurrentAudioStep('main');
                }
                
                // FIXED MAPPING: Source language repeats (main/native language)
                const sourceRepeats = settings?.repeatMainLanguage || 1;
                for (let i = 0; i < sourceRepeats; i++) {
                  // Check if stop was requested
                  if (stopRequestedRef.current) {
                    console.log('🛑 Stop requested during source audio');
                    return false;
                  }
                  
                  try {
                    const sourceAudio = new Audio(sourceUrl);
                    // Store audio element for stop functionality
                    audioElementsRef.current.push(sourceAudio);
                    
                    // Apply speed setting to source audio playback
                    sourceAudio.playbackRate = getSpeedRate(settings.pronunciationSpeed || 'Normal');
                    
                    await new Promise((resolve, reject) => {
                      const timeout = setTimeout(() => {
                        reject(new Error('Audio timeout'));
                      }, 10000); // 10 second timeout
                      
                      sourceAudio.onended = () => {
                        clearTimeout(timeout);
                        resolve(null);
                      };
                      sourceAudio.onerror = (error) => {
                        clearTimeout(timeout);
                        reject(error);
                      };
                      sourceAudio.oncanplaythrough = () => {
                        // Check stop flag before playing
                        if (stopRequestedRef.current) {
                          clearTimeout(timeout);
                          resolve(null);
                          return;
                        }
                        sourceAudio.play().catch(reject);
                      };
                      
                      // Load the audio
                      sourceAudio.load();
                    });
                    console.log(`✅ SOURCE audio played: ${sourceWord} (${sourceLangCode}) - Repeat ${i + 1}/${sourceRepeats}`);
                    
                    // Small pause between repeats (except after last repeat)
                    if (i < sourceRepeats - 1) {
                      await new Promise(resolve => setTimeout(resolve, 300));
                    }
                  } catch (error) {
                    console.log(`⚠️ SOURCE audio failed: ${sourceWord} (${sourceLangCode}) - Repeat ${i + 1}`);
                  }
                }
              }

              console.log('🎉 Alnilam sequence completed successfully');
              
              // Reset visual indicator to idle
              if (settings?.setCurrentAudioStep) {
                settings.setCurrentAudioStep('idle');
              }
              
              return true;

            } catch (error) {
              console.error('❌ Alnilam sequence failed:', error);
              return false;
            }
          },

          isAvailable() {
            return true;
          },

          getStatus() {
            return {
              available: true,
              name: 'Alnilam Multilingual Audio Service'
            };
          }
        };

        console.log('🌊 Alnilam Audio Service initialized - Beautiful multilingual TTS');
        console.log('✅ Alnilam service created:', alnilamAudioService);
        setAlnilamService(alnilamAudioService);
        console.log('✅ Alnilam service set in state');
        setActiveAudioService("Alnilam");
        console.log('🌟 Alnilam Audio Service initialized successfully');
        
        // IMMEDIATE TEST: Try calling the service right after initialization
        console.log('🧪 Testing Alnilam service immediately after initialization...');
        console.log('🧪 Service object test:', {
          serviceExists: !!alnilamAudioService,
          hasPlayMethod: !!alnilamAudioService.playWordSequence,
          serviceType: typeof alnilamAudioService
        });
        
      } catch (error) {
        console.error('❌ Failed to initialize Alnilam service:', error);
        console.log('Alnilam service not available, Algenib will be used instead');
      }
    }
    
    initAlnilam()
  }, [])

  // Main audio playback function - Algenib Enhanced
  const playAudio = async (word: any, autoPlay = false) => {
    const now = Date.now();
    console.log('🔴 DEBUG: playAudio called', { 
      word: word ? 'exists' : 'null', 
      isPlaying, 
      autoPlay,
      audioCallInProgress: audioCallInProgress.current,
      timeSinceLastCall: now - lastAudioCallTime.current,
      timestamp: now
    });
    
    // Prevent rapid consecutive calls (less than 100ms apart)
    if (audioCallInProgress.current) {
      console.log('🔴 DEBUG: Audio call already in progress, ignoring');
      return;
    }
    
    if (now - lastAudioCallTime.current < 100) {
      console.log('🔴 DEBUG: Too soon since last call, ignoring');
      return;
    }
    
    if (!word || isPlaying) {
      console.log('🔴 DEBUG: Returning early', { hasWord: !!word, isPlaying });
      return;
    }

    // Set guards
    audioCallInProgress.current = true;
    lastAudioCallTime.current = now;

    try {
      // Enhanced validation for word data
      const sourceWord = word.sourceWord || word.training_word || ''
      const targetWord = word.targetWord || word.main_word || ''
      const wordId = word.id

      if (!sourceWord || typeof sourceWord !== 'string' || sourceWord.trim().length === 0) {
        console.warn('No valid source word found in:', word)
        return
      }
      if (!targetWord || typeof targetWord !== 'string' || targetWord.trim().length === 0) {
        console.warn('No valid target word found in:', word)
        return
      }

      console.log('🎓 Algenib audio playback for:', { 
        wordId,
        sourceWord, 
        targetWord, 
        targetLanguage, 
        nativeLanguage,
        currentWordIndex,
        autoPlay
      })

      if (autoPlay) {
        setAutoPlayActive(true)
      }
      setIsPlaying(true)
      
      console.log('🎮 Play button clicked - checking services...', {
        alnilamService: !!alnilamService,
        alnilamServiceType: typeof alnilamService,
        alnilamServiceDetails: alnilamService,
        algenibService: !!algenibService,
        wordId,
        sourceWord,
        targetWord,
        targetLanguage,
        nativeLanguage
      });
      
      // CRITICAL DEBUG: Check if Alnilam service is available
      if (!alnilamService) {
        console.error('🚨 CRITICAL: Alnilam service is null/undefined!');
        console.log('🔍 Service initialization status check needed');
      }
      
      if (!wordId) {
        console.error('🚨 CRITICAL: wordId is missing!', { wordId });
      }
      
      // Priority 1: Try Alnilam Multilingual Audio first (54,738 files)
      if (alnilamService && wordId) {
        console.log('🌟 Using Alnilam Multilingual Audio for comprehensive language support')
        console.log('🔧 About to call playWordSequence with:', {
          sourceWord, targetWord, wordId, nativeLanguage, targetLanguage,
          settingsType: typeof settings,
          hasSetCurrentAudioStep: typeof setCurrentAudioStep
        })
        setActiveAudioService("Alnilam")
        
        try {
          const alnilamSuccess = await alnilamService.playWordSequence(
            sourceWord,           // sourceWord string
            targetWord,           // targetWord string  
            {                     // settings object
              speed: settings.pronunciationSpeed,
              pauseBetweenTranslations: settings.pauseBetweenTranslations,
              pauseForNextWord: settings.pauseForNextWord,
              repeatTargetLanguage: settings.repeatTargetLanguage,
              repeatMainLanguage: settings.repeatMainLanguage,
              setCurrentAudioStep
            },
            wordId,               // wordId
            nativeLanguage,       // sourceLanguage
            targetLanguage        // targetLanguage
          )
          
          console.log('🎵 Alnilam playWordSequence returned:', alnilamSuccess)
          
          if (alnilamSuccess) {
            console.log('✅ Alnilam audio completed successfully')
            setCurrentAudioStep('idle')
            setIsPlaying(false)
            return
          } else {
            console.log('⚠️ Alnilam audio not available, trying Algenib...')
          }
        } catch (error) {
          console.error('❌ Alnilam service error:', error)
          console.log('🔄 Falling back to Algenib due to Alnilam error')
        }
      } else {
        console.warn('❌ Alnilam service not available:', {
          hasService: !!alnilamService,
          hasWordId: !!wordId,
          serviceType: typeof alnilamService
        })
      }
      
      // Priority 2: Try Algenib TTS as backup
      if (algenibService && wordId) {
        console.log('🎤 Using Algenib TTS for professional teaching voice')
        setActiveAudioService("Algenib")
        
        const algenibSuccess = await algenibService.playWordSequence(
          { id: wordId, sourceWord, targetWord },
          targetLanguage,
          nativeLanguage,
          {
            repeatTargetLanguage: settings.repeatTargetLanguage,
            repeatMainLanguage: settings.repeatMainLanguage,
            pauseBetweenTranslations: settings.pauseBetweenTranslations
          }
        )
        
        if (algenibSuccess) {
          console.log('✅ Algenib audio completed successfully')
          setCurrentAudioStep('idle')
          setIsPlaying(false)
          return
        } else {
          console.log('⚠️ Algenib audio not available, falling back to browser TTS')
        }
      }
      
      // Priority 3: Browser TTS fallback if neither Alnilam nor Algenib available
      console.log('🔄 Using browser TTS as final fallback')
      console.log('🔴 DEBUG: Browser TTS settings:', {
        repeatTargetLanguage: settings.repeatTargetLanguage,
        repeatMainLanguage: settings.repeatMainLanguage,
        pauseBetweenTranslations: settings.pauseBetweenTranslations,
        timestamp: Date.now()
      });
      setActiveAudioService("Browser TTS")
      setCurrentAudioStep('training')
      
      // Get voices for languages
      const trainingVoice = getVoiceForLanguage(targetLanguage, settings.trainingLanguageVoice)
      const mainVoice = getVoiceForLanguage(nativeLanguage, settings.mainLanguageVoice)

      // Play target language (what user is learning)
      console.log('🔴 DEBUG: Starting target language loop, repeats:', settings.repeatTargetLanguage);
      for (let i = 0; i < settings.repeatTargetLanguage; i++) {
        console.log(`🔴 DEBUG: Target repeat ${i + 1}/${settings.repeatTargetLanguage}`);
        await speak(sourceWord, targetLanguage, trainingVoice)
        if (i < settings.repeatTargetLanguage - 1) {
          await sleep(300)
        }
      }

      // Pause between languages
      setCurrentAudioStep('pause')
      console.log('🔴 DEBUG: Pausing between languages for', settings.pauseBetweenTranslations * 1000, 'ms');
      await sleep(settings.pauseBetweenTranslations * 1000)

      // Play native language (translation)
      setCurrentAudioStep('main')
      console.log('🔴 DEBUG: Starting main language loop, repeats:', settings.repeatMainLanguage);
      for (let i = 0; i < settings.repeatMainLanguage; i++) {
        console.log(`🔴 DEBUG: Main repeat ${i + 1}/${settings.repeatMainLanguage}`);
        await speak(targetWord, nativeLanguage, mainVoice)
        if (i < settings.repeatMainLanguage - 1) {
          await sleep(300)
        }
      }

      // Set to idle after completing this word
      setCurrentAudioStep('idle')
      setIsPlaying(false)

    } catch (error) {
      console.error('Audio playback error:', error)
      setCurrentAudioStep('idle')
      setAutoPlayActive(false)
      setIsPlaying(false)
    } finally {
      // Always reset the guard
      audioCallInProgress.current = false;
    }
  }

  // Stop audio function
  const stopAudio = () => {
    console.log('🛑 Stop audio requested - immediate stop');
    
    // Set stop flag to interrupt any ongoing audio
    stopRequestedRef.current = true;
    
    // Immediately stop all currently playing audio elements
    audioElementsRef.current.forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        console.log('🛑 Stopped audio element');
      } catch (error) {
        console.log('⚠️ Error stopping audio element:', error);
      }
    });
    
    // Clear the audio elements array
    audioElementsRef.current = [];
    
    // Cancel the auto-play loop
    autoPlayRef.current = false
    
    // Stop hybrid audio service - TTS DISABLED
    console.log('Audio stop requested - TTS disabled')
    
    // Cancel any ongoing speech synthesis - TTS DISABLED
    // if (speechSynthesis.speaking) {
    //   speechSynthesis.cancel()
    // }
    
    // Reset all audio states
    setIsPlaying(false)
    setCurrentAudioStep('idle')
    setAutoPlayActive(false)
    
    console.log('✅ Audio stopped immediately and all states reset')
  }

  // Database state
  const [topics, setTopics] = useState<Topic[]>([])
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([])
  const [totalWords, setTotalWords] = useState<number>(0)
  const [currentOffset, setCurrentOffset] = useState<number>(0)
  const [hasMoreWords, setHasMoreWords] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  // Smart preloading cache - load everything invisibly in background
  const [dataCache, setDataCache] = useState<{
    topics: Topic[]
    vocabularyCache: { [key: string]: VocabularyWord[] }
  }>({
    topics: [],
    vocabularyCache: {}
  })

  // Load data from JSON file (reordered topics) on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Load topics from JSON file instead of database to get the reordered version
        const topicsResponse = await fetch('/data/topics.json')
        const topicsData = await topicsResponse.json()
        setTopics(topicsData)
        setDataCache(prev => ({
          ...prev,
          topics: topicsData
        }))
      } catch (error) {
        console.error('Failed to load data:', error)
        // Fallback to database if JSON file fails
        try {
          const topicsData = await getTopics()
          setTopics(topicsData)
          setDataCache(prev => ({
            ...prev,
            topics: topicsData
          }))
        } catch (dbError) {
          console.error('Failed to load data from database:', dbError)
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Smart background preloading - invisible to user
  const preloadVocabularyInBackground = async (nativeLang: string, targetLang: string) => {
    if (!dataCache.topics.length) return
    
    console.log('🔄 Silently preloading vocabulary in background...')
    
    // Preload vocabulary for all topics with these languages
    const preloadPromises = dataCache.topics.slice(0, 5).map(async (topic) => { // Preload first 5 topics
      const cacheKey = `${topic.id}-${targetLang}-${nativeLang}`
      
      if (!dataCache.vocabularyCache[cacheKey]) {
        try {
          const vocabularyResponse = await getVocabularyForTopic(
            topic.id,
            targetLang,
            nativeLang,
            10000,
            0
          )
          
          setDataCache(prev => ({
            ...prev,
            vocabularyCache: {
              ...prev.vocabularyCache,
              [cacheKey]: vocabularyResponse.vocabulary
            }
          }))
          
          console.log(`✅ Cached vocabulary for topic ${topic.id}: ${vocabularyResponse.vocabulary.length} words`)
        } catch (error) {
          console.error(`Failed to cache vocabulary for topic ${topic.id}:`, error)
        }
      }
    })
    
    // Run all preloading in background without blocking UI
    Promise.all(preloadPromises).catch(console.error)
  }
  // Vocabulary is now preloaded in handleTopicSelect before page transition
  /*
  useEffect(() => {
    const loadVocabulary = async () => {
      console.log('🔍 Vocabulary loading effect triggered:', {
        selectedTopic: selectedTopic?.id,
        selectedTopicName: selectedTopic?.name,
        nativeLanguageCode,
        targetLanguageCode,
        nativeLanguage,
        targetLanguage,
        allConditionsMet: !!(selectedTopic && nativeLanguageCode && targetLanguageCode)
      })
      
      if (selectedTopic && nativeLanguageCode && targetLanguageCode) {
        console.log('✅ Loading vocabulary for word training:', {
          topicId: selectedTopic.id,
          topicName: selectedTopic.name,
          trainingLanguage: `${targetLanguage} (${targetLanguageCode})`, // what user wants to learn
          mainLanguage: `${nativeLanguage} (${nativeLanguageCode})` // user's native language for translations
        })
        
        // Clear existing vocabulary to prevent showing old data
        setVocabulary([])
        setCurrentWordIndex(0)
        setIsLoading(true)
        
        try {
          // Load ALL vocabulary words at once instead of just 50
          // This ensures autoplay can continue through all words in the topic
          const vocabularyResponse = await getVocabularyForTopic(
            selectedTopic.id,
            targetLanguage, // Use full language name, not code
            nativeLanguage, // Use full language name, not code
            10000, // Load up to 10,000 words at once (should cover any topic size)
            0 // Start from offset 0
          )
          
          console.log('Vocabulary loaded:', vocabularyResponse.vocabulary.length, 'words out of', vocabularyResponse.totalWords)
          if (vocabularyResponse.vocabulary.length > 0) {
            console.log('Sample vocabulary:', vocabularyResponse.vocabulary.slice(0, 3))
            console.log('First word details:', vocabularyResponse.vocabulary[0])
          }
          setVocabulary(vocabularyResponse.vocabulary)
          setTotalWords(vocabularyResponse.totalWords)
          setCurrentOffset(vocabularyResponse.vocabulary.length) // Set offset to loaded words count
          setHasMoreWords(false) // No more words to load since we loaded everything
          setCurrentWordIndex(0)
          
          // Audio system removed - placeholder for new TTS implementation
          console.log(`🎵 Audio system removed for topic ${selectedTopic.id}: ${selectedTopic.name}`)
          setHasUmbrielAudio(false)
          setUmbrielStatus(`🔄 TTS System Removed - Ready for New Implementation`)
          
          // Reset audio states when new vocabulary is loaded
          setIsPlaying(false)
          setCurrentAudioStep('idle')
          setAutoPlayActive(false)
          autoPlayRef.current = false
        } catch (error) {
          console.error('Failed to load vocabulary:', error)
          setVocabulary([])
        } finally {
          setIsLoading(false)
        }
      } else {
        console.log('❌ Vocabulary loading conditions not met:', {
          hasSelectedTopic: !!selectedTopic,
          hasNativeLanguageCode: !!nativeLanguageCode,
          hasTargetLanguageCode: !!targetLanguageCode,
          selectedTopic: selectedTopic?.name,
          nativeLanguageCode,
          targetLanguageCode
        })
      }
    }
    loadVocabulary()
  }, [selectedTopic, nativeLanguageCode, targetLanguageCode, nativeLanguage, targetLanguage])
  */

  // Function to load more words when approaching end of current batch
  const loadMoreWords = async () => {
    if (!selectedTopic || !hasMoreWords || isLoading) return
    
    try {
      setIsLoading(true)
      console.log('Loading more words from offset:', currentOffset)
      
      const vocabularyResponse = await getVocabularyForTopic(
        selectedTopic.id,
        targetLanguageCode,
        nativeLanguageCode,
        50,
        currentOffset
      )
      
      if (vocabularyResponse.vocabulary.length > 0) {
        console.log('Loaded', vocabularyResponse.vocabulary.length, 'more words')
        // Append new words to existing vocabulary
        setVocabulary(prev => [...prev, ...vocabularyResponse.vocabulary])
        setCurrentOffset(prev => prev + 50)
        setHasMoreWords(vocabularyResponse.hasMore)
      }
    } catch (error) {
      console.error('Failed to load more vocabulary:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-play controller function
  const startAutoPlay = async () => {
    if (!vocabulary.length || !settings.autoPlay) return
    
    console.log('Starting auto-play from word', currentWordIndex + 1)
    autoPlayRef.current = true // Enable auto-play loop
    
    for (let i = currentWordIndex; i < vocabulary.length; i++) {
      // Check if auto-play was cancelled
      if (!autoPlayRef.current) {
        console.log('Auto-play cancelled by user')
        break
      }
      
      const word = vocabulary[i]
      if (!word || !word.sourceWord || !word.targetWord) continue
      
      console.log(`Auto-play: Playing word ${i + 1} of ${vocabulary.length}`)
      
      // Update the display
      setCurrentWordIndex(i)
      
      // Play the word
      await playAudio(word, false)
      
      // Check again if auto-play was cancelled during playback
      if (!autoPlayRef.current) {
        console.log('Auto-play cancelled during playback')
        break
      }
      
      // Pause before next word (except for last word)
      if (i < vocabulary.length - 1) {
        setCurrentAudioStep('pause')
        await sleep(settings.pauseForNextWord * 1000)
      }
    }
    
    // Clean up when done
    autoPlayRef.current = false
    setAutoPlayActive(false)
    setIsPlaying(false)
    setCurrentAudioStep('idle')
    console.log('Auto-play sequence completed')
  }

  // Auto-play effect - only when manually triggered and user has interacted
  useEffect(() => {
    // Prevent auto-play on page load - require user interaction first
    if (autoPlayActive && !isPlaying && vocabulary.length > 0 && hasUserInteracted) {
      console.log('Auto-play triggered by user interaction')
      startAutoPlay()
    } else if (autoPlayActive && !hasUserInteracted) {
      console.log('Auto-play blocked - no user interaction yet')
      setAutoPlayActive(false) // Reset autoplay since user hasn't interacted
    }
  }, [autoPlayActive, hasUserInteracted])

  // Initialize multi-voice audio system - Alnilam + Algenib + Browser TTS
  useEffect(() => {
    console.log('🎵 Multi-voice audio system active: Alnilam (Priority 1) → Algenib (Priority 2) → Browser TTS (Fallback)')
  }, [])
  
  // Load voices for browser TTS fallback
  useEffect(() => {
    console.log('Browser TTS voices loaded for fallback scenarios')
  }, [])

  // Language names mapping for better display
  const getLanguageName = (languageCode: string): string => {
    const nameMap: { [key: string]: string } = {
      'af': 'Afrikaans',
      'am': 'Amharic',
      'ar': 'Arabic',
      'az': 'Azerbaijani',
      'be': 'Belarusian',
      'bg': 'Bulgarian',
      'bn': 'Bengali',
      'br': 'Breton',
      'bs': 'Bosnian',
      'ca': 'Catalan',
      'co': 'Corsican',
      'cs': 'Czech',
      'cy': 'Welsh',
      'da': 'Danish',
      'de': 'German',
      'el': 'Greek',
      'en': 'English',
      'eo': 'Esperanto',
      'es': 'Spanish',
      'et': 'Estonian',
      'eu': 'Basque',
      'fa': 'Persian',
      'fi': 'Finnish',
      'fo': 'Faroese',
      'fr': 'French',
      'ga': 'Irish',
      'gd': 'Scottish Gaelic',
      'gu': 'Gujarati',
      'ha': 'Hausa',
      'he': 'Hebrew',
      'hi': 'Hindi',
      'hr': 'Croatian',
      'hu': 'Hungarian',
      'id': 'Indonesian',
      'ig': 'Igbo',
      'is': 'Icelandic',
      'it': 'Italian',
      'ja': 'Japanese',
      'jv': 'Javanese',
      'ka': 'Georgian',
      'kk': 'Kazakh',
      'km': 'Khmer',
      'kn': 'Kannada',
      'ko': 'Korean',
      'ky': 'Kyrgyz',
      'la': 'Latin',
      'lb': 'Luxembourgish',
      'lo': 'Lao',
      'lt': 'Lithuanian',
      'lv': 'Latvian',
      'mg': 'Malagasy',
      'mk': 'Macedonian',
      'ml': 'Malayalam',
      'mn': 'Mongolian',
      'mr': 'Marathi',
      'ms': 'Malay',
      'mt': 'Maltese',
      'my': 'Myanmar',
      'ne': 'Nepali',
      'nl': 'Dutch',
      'no': 'Norwegian',
      'or': 'Odia',
      'pa': 'Punjabi',
      'pl': 'Polish',
      'ps': 'Pashto',
      'pt': 'Portuguese',
      'ro': 'Romanian',
      'ru': 'Russian',
      'rw': 'Kinyarwanda',
      'sa': 'Sanskrit',
      'si': 'Sinhala',
      'sk': 'Slovak',
      'sl': 'Slovenian',
      'sn': 'Shona',
      'so': 'Somali',
      'sq': 'Albanian',
      'sr': 'Serbian',
      'sv': 'Swedish',
      'sw': 'Swahili',
      'ta': 'Tamil',
      'te': 'Telugu',
      'tg': 'Tajik',
      'th': 'Thai',
      'tk': 'Turkmen',
      'tl': 'Filipino',
      'tr': 'Turkish',
      'uk': 'Ukrainian',
      'ur': 'Urdu',
      'uz': 'Uzbek',
      'vi': 'Vietnamese',
      'xh': 'Xhosa',
      'yo': 'Yoruba',
      'zh': 'Chinese',
      'zu': 'Zulu',
    }
    return nameMap[languageCode] || languageCode.toUpperCase()
  }

  // All 50 languages from Alnilam Audio Library - matching available audio files
  const alnilamLanguageCodes = ['ar', 'bg', 'bn', 'ca', 'cs', 'cy', 'da', 'de', 'el', 'en', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'ga', 'gu', 'he', 'hi', 'hr', 'hu', 'id', 'is', 'it', 'ja', 'ko', 'lt', 'lv', 'mk', 'ml', 'mr', 'mt', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'vi', 'zh']
  
  // Order languages with most common first, then alphabetical
  const topLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh']
  const remainingLanguages = alnilamLanguageCodes
    .filter(code => !topLanguages.includes(code))
    .sort((a, b) => getLanguageName(a).localeCompare(getLanguageName(b)))
  const orderedLanguageCodes = [...topLanguages, ...remainingLanguages]
  
  const enhancedLanguages = orderedLanguageCodes.map(code => ({
    code,
    name: getLanguageName(code)
  }))

  const filteredLanguages = enhancedLanguages.filter((lang) => {
    // Filter by search query
    const matchesSearch = lang.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    // If we're on target language selection, exclude the native language
    if (currentPage === "target" && nativeLanguageCode) {
      return matchesSearch && lang.code !== nativeLanguageCode
    }
    
    return matchesSearch
  })

  // Removed automatic useEffect transitions - handleLanguageSelect now handles all transitions
  /*
  useEffect(() => {
    if (nativeLanguage && currentPage === "native") {
      setIsTransitioning(true)
      setTimeout(() => {
        setQuestionText("choose the language\nyou want to train")
        setCurrentPage("target")
        setIsTransitioning(false)
      }, 300)
    }
  }, [nativeLanguage, currentPage])

  useEffect(() => {
    if (targetLanguage && currentPage === "target") {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage("confirmation")
        setIsTransitioning(false)
      }, 300)
    }
  }, [targetLanguage, currentPage])
  */

  // Get display name for topics (with custom name mappings)
  const getTopicDisplayName = (topicId: number, originalName: string): string => {
    // Custom name mappings for specific topics
    const nameMapping: { [key: number]: string } = {
      8: "Health", // Health & Body Parts → Health
      11: "Weather", // Weather & Nature → Weather (already merged in database)
      12: "Family", // Family & Relationships → Family
      17: "City", // Places Around Town → City
      18: "Travel", // Travel & Tourism → Travel
    }
    
    return nameMapping[topicId] || originalName
  }

  const handleLanguageSelect = (language: { code: string; name: string }) => {
    console.log('Language selected:', language)
    
    // Reset scroll position to top of the container
    const languageGrid = document.querySelector('.language-grid-container')
    if (languageGrid) {
      languageGrid.scrollTop = 0
    }
    
    if (currentPage === "native") {
      setNativeLanguage(language.name)
      setNativeLanguageCode(language.code)
      console.log('Native language set:', language.name, language.code)
      
      // Start fade animation
      setIsTransitioning(true)
      
      // If we already have a target language selected, go back to confirmation
      // Otherwise go to target language selection
      setTimeout(() => {
        if (targetLanguage && targetLanguageCode) {
          setCurrentPage("confirmation")
        } else {
          setQuestionText("I want to learn...")
          setCurrentPage("target")
        }
        setIsTransitioning(false)
      }, 300)
    } else if (currentPage === "target") {
      setTargetLanguage(language.name)
      setTargetLanguageCode(language.code)
      console.log('Target language set:', language.name, language.code)
      
      // Start background preloading immediately (invisible to user)
      preloadVocabularyInBackground(nativeLanguage, language.name)
      
      // Normal transition - no visible loading
      setIsTransitioning(true)
      
      setTimeout(() => {
        setCurrentPage("confirmation")
        setIsTransitioning(false)
      }, 300)
    }
    setSearchQuery("")
  }

  const handleContinue = () => {
    if (currentPage === "confirmation") {
      console.log("Starting language learning journey!")
    }
  }

  // New function specifically for confirmation page language changes
  const handleConfirmationLanguageChange = (type: "native" | "target") => {
    // Start fade animation
    setIsTransitioning(true)
    
    setTimeout(() => {
      if (type === "native") {
        setCurrentPage("native")
        setQuestionText("What language do you speak?")
        // Don't clear the language - we want to show current selection
      } else {
        setCurrentPage("target")
        setQuestionText("I want to learn...")
        // Don't clear the language - we want to show current selection
      }
      setSearchQuery("")
      setIsTransitioning(false)
    }, 300)
  }

  const handleLanguageCardClick = (type: "native" | "target") => {
    // Start fade animation
    setIsTransitioning(true)
    
    setTimeout(() => {
      if (type === "native") {
        setCurrentPage("native")
        setQuestionText("What language do you speak?")
        // Clear the native language so it can be reselected
        setNativeLanguage("")
        setNativeLanguageCode("")
      } else {
        setCurrentPage("target")
        setQuestionText("I want to learn...")
        // Clear the target language so it can be reselected
        setTargetLanguage("")
        setTargetLanguageCode("")
      }
      setSearchQuery("")
      setIsTransitioning(false)
    }, 300)
  }

  const handleTopicSelect = async (topic: Topic) => {
    const cacheKey = `${topic.id}-${targetLanguage}-${nativeLanguage}`
    
    // Check if we have cached vocabulary
    if (dataCache.vocabularyCache[cacheKey]) {
      console.log('✅ Using cached vocabulary - instant transition!')
      
      // Set data from cache instantly
      const cachedVocabulary = dataCache.vocabularyCache[cacheKey]
      setVocabulary(cachedVocabulary)
      setTotalWords(cachedVocabulary.length)
      setCurrentOffset(cachedVocabulary.length)
      setHasMoreWords(false)
      setCurrentWordIndex(0)
      setSelectedTopic(topic)
      
      // Reset audio states
      setIsPlaying(false)
      setCurrentAudioStep('idle')
      setAutoPlayActive(false)
      autoPlayRef.current = false
      
      // Instant transition
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage("learning")
        setIsTransitioning(false)
      }, 150)
      
    } else {
      // Fallback: load data if not cached (should be rare)
      console.log('⚠️ Vocabulary not cached, loading...')
      setIsLoading(true)
      
      try {
        const vocabularyResponse = await getVocabularyForTopic(
          topic.id,
          targetLanguage,
          nativeLanguage,
          10000,
          0
        )
        
        // Cache for future use
        setDataCache(prev => ({
          ...prev,
          vocabularyCache: {
            ...prev.vocabularyCache,
            [cacheKey]: vocabularyResponse.vocabulary
          }
        }))
        
        // Set all data at once
        setVocabulary(vocabularyResponse.vocabulary)
        setTotalWords(vocabularyResponse.totalWords)
        setCurrentOffset(vocabularyResponse.vocabulary.length)
        setHasMoreWords(false)
        setCurrentWordIndex(0)
        setSelectedTopic(topic)
        
        // Reset audio states
        setIsPlaying(false)
        setCurrentAudioStep('idle')
        setAutoPlayActive(false)
        autoPlayRef.current = false
        
        // Transition to learning page
        setIsTransitioning(true)
        setTimeout(() => {
          setCurrentPage("learning")
          setIsTransitioning(false)
          setIsLoading(false)
        }, 150)
        
      } catch (error) {
        console.error('Failed to load vocabulary:', error)
        setIsLoading(false)
        setSelectedTopic(topic)
        setCurrentPage("learning")
      }
    }
  }

  const getCurrentContent = () => {
    // Since vocabulary is now preloaded, we shouldn't see loading states
    if (vocabulary.length === 0) {
      return { 
        sourceWord: `No ${targetLanguage} words found`, 
        targetWord: `Try a different topic or language combination` 
      }
    }
    const currentWord = vocabulary[currentWordIndex] || vocabulary[0]
    return {
      sourceWord: currentWord.sourceWord?.toLowerCase() || '', // Training language word (what user wants to learn) - displayed in lowercase
      targetWord: currentWord.targetWord?.toLowerCase() || ''  // Main language translation (user's native language) - displayed in lowercase
    }
  }

  const handlePrevious = () => {
    if (vocabulary.length > 0) {
      // Stop any current audio and auto-play sequence
      stopAudio()
      
      const prevIndex = currentWordIndex - 1
      
      if (prevIndex >= 0) {
        setCurrentWordIndex(prevIndex)
      } else {
        // Go to the last word in the topic (totalWords - 1)
        // If we don't have all words loaded, we need to implement logic to jump to end
        // For now, just cycle within loaded words
        setCurrentWordIndex(vocabulary.length - 1)
      }
    }
  }

  const handleNext = () => {
    if (vocabulary.length > 0) {
      // Stop any current audio and auto-play sequence
      stopAudio()
      
      const nextIndex = currentWordIndex + 1
      
      // Navigate to next word or cycle back to beginning if at the end
      if (nextIndex < vocabulary.length) {
        setCurrentWordIndex(nextIndex)
      } else {
        // At the end of all words, cycle back to beginning
        setCurrentWordIndex(0)
      }
    }
  }

  const handlePlay = () => {
    // Mark that user has interacted (prevents auto-play on page load)
    setHasUserInteracted(true)
    
    if (isPlaying || autoPlayActive) {
      stopAudio()
    } else {
      const currentWord = vocabulary[currentWordIndex]
      if (currentWord) {
        console.log('Manual play button clicked')
        if (settings.autoPlay) {
          // Start auto-play sequence from current word
          autoPlayRef.current = true
          setAutoPlayActive(true)
        } else {
          // Just play the current word once
          setIsPlaying(true)
          playAudio(currentWord, false).then(() => {
            setIsPlaying(false)
          })
        }
      }
    }
  }

  const handleBackToTopics = () => {
    // Stop any currently playing audio when navigating back
    stopAudio()
    setCurrentPage("confirmation")
  }

  const handleSettingsClick = () => {
    setShowSettings(true)
  }

  const handleSettingsClose = () => {
    setShowSettings(false)
  }

  const updateSetting = (key: string, value: any) => {
    console.log(`Updating setting: ${key} = ${value}`)
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value }
      console.log('New settings:', newSettings)
      return newSettings
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] px-6 sm:px-8 py-[62px] shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl ${isTransitioning ? 'bg-black/50' : 'bg-black/40'}`}>
        {isLoading && (
          <div className="text-center mb-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <p className="text-white/60 text-sm mt-2">Loading...</p>
          </div>
        )}
        
        {currentPage === "learning" && (
          <div className="text-center transition-all duration-500 ease-in-out">
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={handleBackToTopics}
                  className="w-12 h-12 bg-black/20 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-black/30 transition-all duration-300 transform hover:scale-110"
                >
                  <ArrowLeft className="w-6 h-6 text-white/80" />
                </button>

                <div className="flex items-center gap-3">
                  {/* Topic Icon */}
                  {(() => {
                    // First check if topic has an SVG icon in the JSON data
                    if (selectedTopic?.icon) {
                      return (
                        <div 
                          className="w-10 h-10 sm:w-12 sm:h-12" 
                          style={{ color: 'rgba(255,255,255,0.8)' }}
                          dangerouslySetInnerHTML={{ __html: selectedTopic.icon! }}
                        />
                      );
                    }
                    
                    // Fall back to hardcoded iconify icons
                    const iconData = TOPIC_ICONS.find(icon => icon.id === selectedTopic?.id)
                    if (iconData) {
                      if (typeof iconData.icon === 'string') {
                        return <Icon icon={iconData.icon} width="32" height="32" style={{ color: 'rgba(255,255,255,0.8)' }} />
                      }
                      const IconComponent = iconData.icon as any
                      return <IconComponent className="w-8 h-8 text-white/80" />
                    }
                    return <BookOpen className="w-8 h-8 text-white/80" />
                  })()}
                  <h1 className="text-2xl font-medium text-white">{selectedTopic?.name}</h1>
                </div>
                
                <button
                  onClick={handleSettingsClick}
                  className="w-12 h-12 bg-black/20 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-black/30 transition-all duration-300 transform hover:scale-110"
                >
                  <Settings className="w-6 h-6 text-white/80" />
                </button>
              </div>

              {/* Progress indicator */}
              {vocabulary.length > 0 && (
                <div className="mb-6 text-center">
                  <p className="text-white/60 text-sm">
                    {currentWordIndex + 1} of {vocabulary.length} words
                  </p>
                  <div className="w-full bg-black/20 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentWordIndex + 1) / vocabulary.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-6 mb-12">
                <div className={`backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 ${
                  currentAudioStep === 'training' 
                    ? 'bg-blue-500/20 border-blue-400/30 scale-105' 
                    : 'bg-black/20'
                }`}>
                  <div className="text-white/60 text-sm mb-2 flex items-center gap-2">
                    {targetLanguage}
                    {currentAudioStep === 'training' && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    )}
                  </div>
                  <p className="text-white text-2xl font-medium">{getCurrentContent().sourceWord}</p>
                </div>
                <div className={`backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 ${
                  currentAudioStep === 'main' 
                    ? 'bg-blue-500/20 border-blue-400/30 scale-105' 
                    : 'bg-black/20'
                }`}>
                  <div className="text-white/60 text-sm mb-2 flex items-center gap-2">
                    {nativeLanguage}
                    {currentAudioStep === 'main' && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    )}
                  </div>
                  <p className="text-white text-2xl font-medium">{getCurrentContent().targetWord}</p>
                </div>
              </div>

              {vocabulary.length === 0 && !isLoading ? (
                <div className="text-center mb-8">
                  <Button
                    onClick={handleBackToTopics}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-medium rounded-2xl h-12 px-8"
                  >
                    Try Different Topic or Languages
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-8">
                  <button
                    onClick={handlePrevious}
                    className="w-14 h-14 bg-black/20 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-black/30 transition-all duration-300 transform hover:scale-110"
                    disabled={vocabulary.length === 0}
                  >
                    <ChevronLeft className="w-7 h-7 text-white/80" />
                  </button>

                  <button
                    onClick={handlePlay}
                    className={`w-16 h-16 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                      isPlaying || autoPlayActive
                        ? 'bg-red-500/30 hover:bg-red-500/40' 
                        : currentAudioStep === 'training'
                        ? 'bg-blue-500/30 hover:bg-blue-500/40'
                        : currentAudioStep === 'main'
                        ? 'bg-blue-500/30 hover:bg-blue-500/40'
                        : 'bg-black/20 hover:bg-black/30'
                    }`}
                    disabled={vocabulary.length === 0}
                  >
                    {isPlaying || autoPlayActive ? (
                      <Square className="w-8 h-8 text-white/80" />
                    ) : (
                      <Play className="w-8 h-8 text-white/80 ml-1" />
                    )}
                  </button>

                  <button
                    onClick={handleNext}
                    className="w-14 h-14 bg-black/20 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-black/30 transition-all duration-300 transform hover:scale-110"
                    disabled={vocabulary.length === 0}
                  >
                    <ChevronRight className="w-7 h-7 text-white/80" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Single interface - only text changes */}
        {currentPage !== "confirmation" && currentPage !== "learning" && (
          <div className={`text-center mb-12 transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}`}>
            <h1 className="text-3xl font-normal text-white mb-8 transition-all duration-500">{questionText}</h1>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-12 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pl-12 text-base"
                  placeholder="Search languages..."
                />
              </div>
            </div>

            {/* Language Grid */}
            <div className="max-h-96 overflow-y-auto mb-6 language-grid-container">
              <div className="grid grid-cols-3 gap-4">
                {filteredLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language)}
                    className="p-5 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-black/30 transition-all duration-300 transform hover:scale-[1.02] text-center min-h-[75px] flex flex-col items-center justify-center gap-2"
                  >
                    <Icon icon={getFlagIcon(language.code)} className="w-7 h-7" />
                    <p className="text-white font-medium text-sm leading-tight">{language.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Page 3: Confirmation */}
        {currentPage === "confirmation" && (
          <div className="text-center transition-all duration-500 ease-in-out h-full flex flex-col">
            {/* iPhone-style sliding topics interface */}
            <div className="flex-1 mb-6 min-h-0">
              <TopicSlider 
                topics={topics}
                selectedTopic={selectedTopic}
                onTopicSelect={handleTopicSelect}
                TOPIC_ICONS={TOPIC_ICONS}
                getTopicDisplayName={getTopicDisplayName}
              />
            </div>

            {/* Language selector at bottom */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleConfirmationLanguageChange("native")}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-3 flex-1 hover:bg-black/30 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <p className="text-white font-medium text-base">{nativeLanguage}</p>
                </button>
                <div className="flex items-center justify-center">
                  <Languages className="w-6 h-6 text-white/60" />
                </div>
                <button
                  onClick={() => handleConfirmationLanguageChange("target")}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-3 flex-1 hover:bg-black/30 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <p className="text-white font-medium text-base">{targetLanguage}</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-medium text-white">Settings</h2>
                <button
                  onClick={handleSettingsClose}
                  className="w-10 h-10 bg-black/20 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-black/30 transition-all duration-300"
                >
                  <X className="w-5 h-5 text-white/80" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Autoplay Section */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-6">Playback</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Auto-play</p>
                        <p className="text-white/50 text-xs">Automatically play audio when words change</p>
                      </div>
                      <button
                        onClick={() => updateSetting("autoPlay", !settings.autoPlay)}
                        className={`w-12 h-6 rounded-full transition-all duration-300 ${
                          settings.autoPlay 
                            ? "bg-blue-500" 
                            : "bg-black/30 border border-white/20"
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                          settings.autoPlay ? "translate-x-6" : "translate-x-0.5"
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pace Section */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-6">Pace</h3>

                  <div className="space-y-6">
                    <div>
                      <p className="text-white/80 text-sm mb-3">Pronunciation Speed:</p>
                      <div className="flex gap-3">
                        {["Slow", "Normal", "Fast"].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => {
                              console.log(`Pronunciation speed button clicked: ${speed}`)
                              updateSetting("pronunciationSpeed", speed)
                            }}
                            className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                              settings.pronunciationSpeed === speed
                                ? "bg-white/20 border border-white/30 text-white"
                                : "bg-black/20 border border-white/10 text-white/70 hover:bg-black/30"
                            }`}
                          >
                            {speed}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-white/80 text-sm mb-3">Pause Duration between translations:</p>
                      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                        <input
                          type="range"
                          min="0.2"
                          max="10"
                          step="0.1"
                          value={settings.pauseBetweenTranslations}
                          onChange={(e) => updateSetting("pauseBetweenTranslations", Number.parseFloat(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-white/60 text-xs mt-2">
                          <span>0.2s</span>
                          <span className="text-white">{settings.pauseBetweenTranslations}s</span>
                          <span>10s</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-white/80 text-sm mb-3">Pause Duration for the next word:</p>
                      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                        <input
                          type="range"
                          min="0.2"
                          max="10"
                          step="0.1"
                          value={settings.pauseForNextWord}
                          onChange={(e) => updateSetting("pauseForNextWord", Number.parseFloat(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-white/60 text-xs mt-2">
                          <span>0.2s</span>
                          <span className="text-white">{settings.pauseForNextWord}s</span>
                          <span>10s</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-white/80 text-sm mb-3">Repeat Target Language Word:</p>
                      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={settings.repeatTargetLanguage}
                          onChange={(e) => updateSetting("repeatTargetLanguage", Number.parseInt(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-white/60 text-xs mt-2">
                          <span>1x</span>
                          <span className="text-white">{settings.repeatTargetLanguage}x</span>
                          <span>5x</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-white/80 text-sm mb-3">Repeat Main Language Word:</p>
                      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={settings.repeatMainLanguage}
                          onChange={(e) => updateSetting("repeatMainLanguage", Number.parseInt(e.target.value))}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-white/60 text-xs mt-2">
                          <span>1x</span>
                          <span className="text-white">{settings.repeatMainLanguage}x</span>
                          <span>5x</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSettingsClose}
                className="w-full mt-8 bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 text-white font-medium rounded-2xl h-12"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
