"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Language, Topic, VocabularyWord, VocabularyResponse, getLanguages, getTopics, getVocabularyForTopic } from "@/lib/database"
import {
  Search,
  Languages,
  MessageCircle,
  Calculator,
  Clock,
  Sun,
  AlertTriangle,
  Users,
  Heart,
  User,
  Activity,
  Briefcase,
  Globe,
  UtensilsCrossed,
  ChefHat,
  Home,
  ShoppingCart,
  Shirt,
  Wrench,
  Smartphone,
  MapPin,
  Car,
  Gamepad2,
  Palette,
  Wifi,
  Shapes,
  Leaf,
  Dog,
  Cloud,
  GraduationCap,
  Rocket,
  BookOpen,
  Church,
  Scale,
  Shield,
  Sparkles,
  Radio,
  PartyPopper,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Square,
  Settings,
  ArrowLeft,
} from "lucide-react"

// Topic icon mapping for our new 39 topics
const TOPIC_ICONS = [
  { id: 1, icon: MessageCircle }, // Greetings
  { id: 2, icon: Calculator }, // Numbers
  { id: 3, icon: Clock }, // Time & Dates
  { id: 4, icon: AlertTriangle }, // Emergency & Safety
  { id: 5, icon: ShoppingCart }, // Shopping & Money
  { id: 6, icon: UtensilsCrossed }, // Food, Drinks & Restaurants
  { id: 7, icon: MapPin }, // Directions & Transportation
  { id: 8, icon: Heart }, // Health & Body Parts
  { id: 9, icon: Home }, // Home & Household Items
  { id: 10, icon: Shirt }, // Clothing & Personal Style
  { id: 11, icon: Sun }, // Weather & Seasons
  { id: 12, icon: Users }, // Family & Relationships
  { id: 13, icon: Heart }, // Emotions & Feelings
  { id: 14, icon: User }, // Personality & Character
  { id: 15, icon: Activity }, // Hobbies & Leisure Activities
  { id: 16, icon: Gamepad2 }, // Sports & Fitness
  { id: 17, icon: MapPin }, // Places Around Town
  { id: 18, icon: Car }, // Travel & Tourism
  { id: 19, icon: Shapes }, // Colors & Shapes
  { id: 20, icon: Leaf }, // Nature
  { id: 21, icon: Activity }, // Actions
  { id: 22, icon: BookOpen }, // Adjectives
  { id: 23, icon: Palette }, // Arts & Entertainment
  { id: 24, icon: Smartphone }, // Technology & Gadgets
  { id: 25, icon: Briefcase }, // Work & Professions
  { id: 26, icon: GraduationCap }, // Education & School Life
  { id: 27, icon: Radio }, // Communication & Media
  { id: 28, icon: Leaf }, // Environment & Sustainability
  { id: 29, icon: Briefcase }, // Business & Economics
  { id: 30, icon: BookOpen }, // Common Collocations
  { id: 31, icon: Wifi }, // Slang & Modern Expressions
  { id: 32, icon: Rocket }, // Science & Technology
  { id: 33, icon: Calculator }, // Mathematics & Geometry
  { id: 34, icon: BookOpen }, // History & Culture
  { id: 35, icon: Scale }, // Politics & Law
  { id: 36, icon: Church }, // Religion & Philosophy
  { id: 37, icon: Sparkles }, // Mythology & Fantasy
  { id: 38, icon: PartyPopper }, // Celebrations & Holidays
  { id: 39, icon: BookOpen }, // Advanced Communication & Formal Language
  { id: 40, icon: Globe }, // Cultural Integration & Global Perspectives
]

type PageState = "native" | "target" | "confirmation" | "learning"

export function LanguageSelector() {
  const [currentPage, setCurrentPage] = useState<PageState>("native")
  const [nativeLanguage, setNativeLanguage] = useState("")
  const [nativeLanguageCode, setNativeLanguageCode] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("")
  const [targetLanguageCode, setTargetLanguageCode] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showLanguageList, setShowLanguageList] = useState(false)
  const [questionText, setQuestionText] = useState("What language do you speak?")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    autoPlay: true, // Always on by default
    trainingLanguageVoice: "Female" as "Female" | "Male",
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
  const [autoPlayActive, setAutoPlayActive] = useState(false)
  
  // Ref to track auto-play state for cancellation
  const autoPlayRef = useRef(false)

  // TTS Language code mapping
  const getLanguageCode = (languageName: string): string => {
    const languageMap: { [key: string]: string } = {
      'English': 'en-US',
      'Spanish': 'es-ES',
      'French': 'fr-FR',
      'German': 'de-DE',
      'Italian': 'it-IT',
      'Portuguese': 'pt-PT',
      'Dutch': 'nl-NL',
      'Russian': 'ru-RU',
      'Chinese': 'zh-CN',
      'Japanese': 'ja-JP',
      'Korean': 'ko-KR',
      'Arabic': 'ar-SA',
      'Hindi': 'hi-IN',
      'Turkish': 'tr-TR',
      'Polish': 'pl-PL',
      'Swedish': 'sv-SE',
      'Norwegian': 'no-NO',
      'Danish': 'da-DK',
      'Finnish': 'fi-FI',
      'Greek': 'el-GR',
      'Hebrew': 'he-IL',
      'Thai': 'th-TH',
      'Vietnamese': 'vi-VN',
      'Indonesian': 'id-ID',
      'Malay': 'ms-MY',
      'Czech': 'cs-CZ',
      'Hungarian': 'hu-HU',
      'Romanian': 'ro-RO',
      'Bulgarian': 'bg-BG',
      'Croatian': 'hr-HR',
      'Serbian': 'sr-RS',
      'Slovak': 'sk-SK',
      'Slovenian': 'sl-SI',
      'Estonian': 'et-EE',
      'Latvian': 'lv-LV',
      'Lithuanian': 'lt-LT',
      'Ukrainian': 'uk-UA',
      'Bengali': 'bn-BD',
      'Urdu': 'ur-PK',
      'Persian': 'fa-IR',
    }
    return languageMap[languageName] || 'en-US'
  }

  // Get available voices for a language
  const getVoiceForLanguage = (languageCode: string, gender: 'Female' | 'Male'): SpeechSynthesisVoice | null => {
    const voices = speechSynthesis.getVoices()
    
    // Filter voices by language
    const languageVoices = voices.filter(voice => 
      voice.lang.startsWith(languageCode.split('-')[0])
    )
    
    if (languageVoices.length === 0) {
      // Fallback to any voice for the language
      return voices.find(voice => voice.lang.startsWith(languageCode.split('-')[0])) || null
    }
    
    // Try to find preferred gender
    const genderKeywords = gender === 'Female' ? ['female', 'woman', 'girl'] : ['male', 'man', 'boy']
    const preferredVoice = languageVoices.find(voice => 
      genderKeywords.some(keyword => voice.name.toLowerCase().includes(keyword))
    )
    
    return preferredVoice || languageVoices[0]
  }

  // Speech speed mapping
  const getSpeedRate = (speed: string): number => {
    switch (speed) {
      case 'Slow': return 0.7
      case 'Fast': return 1.3
      default: return 1.0 // Normal
    }
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
        const utterance = new SpeechSynthesisUtterance(trimmedText)
        utterance.lang = languageCode
        utterance.rate = getSpeedRate(settings.pronunciationSpeed)
        
        if (voice) {
          utterance.voice = voice
        }

        utterance.onend = () => resolve()
        utterance.onerror = (error) => {
          console.error('Speech synthesis error:', error)
          reject(error)
        }

        speechSynthesis.speak(utterance)
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

  // Main audio playback function
  const playAudio = async (word: any, autoPlay = false) => {
    if (!word || isPlaying) return

    // Enhanced validation for word data
    const sourceWord = word.sourceWord || word.training_word || ''
    const targetWord = word.targetWord || word.main_word || ''

    if (!sourceWord || typeof sourceWord !== 'string' || sourceWord.trim().length === 0) {
      console.warn('No valid source word found in:', word)
      return
    }
    if (!targetWord || typeof targetWord !== 'string' || targetWord.trim().length === 0) {
      console.warn('No valid target word found in:', word)
      return
    }

    console.log('Playing audio for:', { 
      sourceWord, 
      targetWord, 
      targetLanguage, 
      nativeLanguage,
      currentWordIndex,
      autoPlay,
      vocabularyLength: vocabulary.length
    })

    setIsPlaying(true)
    if (autoPlay) {
      setAutoPlayActive(true)
    }

    try {
      const trainingLangCode = getLanguageCode(targetLanguage)
      const mainLangCode = getLanguageCode(nativeLanguage)
      
      const trainingVoice = getVoiceForLanguage(trainingLangCode, settings.trainingLanguageVoice)
      const mainVoice = getVoiceForLanguage(mainLangCode, settings.mainLanguageVoice)

      // Ensure we have clean, valid strings
      const trainingWord = String(sourceWord).trim()
      const mainWord = String(targetWord).trim()

      // Training language repetitions
      for (let i = 0; i < settings.repeatTargetLanguage; i++) {
        setCurrentAudioStep('training')
        await speak(trainingWord, trainingLangCode, trainingVoice)
        
        if (i < settings.repeatTargetLanguage - 1) {
          await sleep(300) // Small pause between repetitions
        }
      }

      // Pause between languages
      setCurrentAudioStep('pause')
      await sleep(settings.pauseBetweenTranslations * 1000)

      // Main language repetitions
      for (let i = 0; i < settings.repeatMainLanguage; i++) {
        setCurrentAudioStep('main')
        await speak(mainWord, mainLangCode, mainVoice)
        
        if (i < settings.repeatMainLanguage - 1) {
          await sleep(300) // Small pause between repetitions
        }
      }

      // Set to idle after completing this word
      setCurrentAudioStep('idle')
      setIsPlaying(false) // Always reset isPlaying when done with a word

    } catch (error) {
      console.error('Audio playback error:', error)
      setCurrentAudioStep('idle')
      setAutoPlayActive(false)
      setIsPlaying(false)
    }
  }

  // Stop audio function
  const stopAudio = () => {
    console.log('Stopping audio...')
    
    // Cancel the auto-play loop
    autoPlayRef.current = false
    
    // Cancel any ongoing speech synthesis
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }
    
    // Reset all audio states
    setIsPlaying(false)
    setCurrentAudioStep('idle')
    setAutoPlayActive(false)
    
    console.log('Audio stopped and states reset')
  }

  // Database state
  const [languages, setLanguages] = useState<Language[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([])
  const [totalWords, setTotalWords] = useState<number>(0)
  const [currentOffset, setCurrentOffset] = useState<number>(0)
  const [hasMoreWords, setHasMoreWords] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load data from database on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [languagesData, topicsData] = await Promise.all([
          getLanguages(),
          getTopics()
        ])
        setLanguages(languagesData)
        setTopics(topicsData)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Load vocabulary when topic and languages are selected
  useEffect(() => {
    const loadVocabulary = async () => {
      if (selectedTopic && nativeLanguageCode && targetLanguageCode) {
        console.log('Loading vocabulary for word training:', {
          topicId: selectedTopic.id,
          topicName: selectedTopic.name,
          trainingLanguage: `${targetLanguage} (${targetLanguageCode})`, // what user wants to learn
          mainLanguage: `${nativeLanguage} (${nativeLanguageCode})` // user's native language for translations
        })
        setIsLoading(true)
        try {
          // Simple approach: use the API's English bridge logic
          // This will give us training language words with main language translations
          const vocabularyResponse = await getVocabularyForTopic(
            selectedTopic.id,
            targetLanguageCode, // training language as source
            nativeLanguageCode, // main language as target  
            50,
            0 // Start from offset 0
          )
          
          console.log('Vocabulary loaded:', vocabularyResponse.vocabulary.length, 'words out of', vocabularyResponse.totalWords)
          if (vocabularyResponse.vocabulary.length > 0) {
            console.log('Sample vocabulary:', vocabularyResponse.vocabulary.slice(0, 3))
          }
          setVocabulary(vocabularyResponse.vocabulary)
          setTotalWords(vocabularyResponse.totalWords)
          setCurrentOffset(50) // Next offset to load
          setHasMoreWords(vocabularyResponse.hasMore)
          setCurrentWordIndex(0)
          
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
      }
    }
    loadVocabulary()
  }, [selectedTopic, nativeLanguageCode, targetLanguageCode, nativeLanguage, targetLanguage])

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

  // Auto-play effect - simplified
  useEffect(() => {
    // This effect only starts auto-play when manually triggered
    if (autoPlayActive && !isPlaying && vocabulary.length > 0) {
      console.log('Auto-play triggered')
      startAutoPlay()
    }
  }, [autoPlayActive])

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      // Voices are loaded asynchronously
      speechSynthesis.getVoices()
    }
    
    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices
    
    return () => {
      speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const filteredLanguages = languages.filter((lang) => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    if (nativeLanguage && currentPage === "native") {
      setTimeout(() => {
        setQuestionText("choose the language\nyou want to train")
        setCurrentPage("target")
      }, 300)
    }
  }, [nativeLanguage, currentPage])

  useEffect(() => {
    if (targetLanguage && currentPage === "target") {
      setTimeout(() => {
        setCurrentPage("confirmation")
      }, 300)
    }
  }, [targetLanguage, currentPage])

  const handleLanguageSelect = (language: Language) => {
    console.log('Language selected:', language)
    if (currentPage === "native") {
      setNativeLanguage(language.name)
      setNativeLanguageCode(language.code)
      console.log('Native language set:', language.name, language.code)
    } else if (currentPage === "target") {
      setTargetLanguage(language.name)
      setTargetLanguageCode(language.code)
      console.log('Target language set:', language.name, language.code)
    }
    setShowLanguageList(false)
    setSearchQuery("")
  }

  const handleContinue = () => {
    if (currentPage === "confirmation") {
      console.log("Starting language learning journey!")
    }
  }

  const handleSearchClick = () => {
    setShowLanguageList(true)
  }

  const canContinue = () => {
    return currentPage === "confirmation"
  }

  const handleLanguageCardClick = (type: "native" | "target") => {
    if (type === "native") {
      setCurrentPage("native")
      setQuestionText("What language do you speak?")
    } else {
      setCurrentPage("target")
      setQuestionText("choose the language\nyou want to train")
    }
    setShowLanguageList(true)
  }

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic)
    setCurrentPage("learning")
  }

  const getCurrentContent = () => {
    if (isLoading) {
      return { sourceWord: "Loading...", targetWord: "Loading..." }
    }
    if (vocabulary.length === 0) {
      return { 
        sourceWord: `No ${targetLanguage} words found`, 
        targetWord: `Try a different topic or language combination` 
      }
    }
    const currentWord = vocabulary[currentWordIndex] || vocabulary[0]
    return {
      sourceWord: currentWord.sourceWord, // Training language word (what user wants to learn)
      targetWord: currentWord.targetWord  // Main language translation (user's native language)
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
      
      // Check if we need to load more words (when approaching end of current batch)
      if (nextIndex >= vocabulary.length - 10 && hasMoreWords && !isLoading) {
        loadMoreWords()
      }
      
      // Navigate to next word or cycle back to beginning if at the end of all words
      if (nextIndex < totalWords) {
        // If we have the next word loaded, go to it
        if (nextIndex < vocabulary.length) {
          setCurrentWordIndex(nextIndex)
        } else {
          // Word not loaded yet, but should be loading - wait a moment
          console.log('Waiting for more words to load...')
        }
      } else {
        // Reached the end of all words in the topic, cycle back to beginning
        setCurrentWordIndex(0)
      }
    }
  }

  const handlePlay = () => {
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
    setCurrentPage("confirmation")
  }

  const handleSettingsClick = () => {
    setShowSettings(true)
  }

  const handleSettingsClose = () => {
    setShowSettings(false)
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
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

                <h1 className="text-2xl font-medium text-white">{selectedTopic?.name}</h1>

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
                    {currentWordIndex + 1} of {totalWords} words
                  </p>
                  <div className="w-full bg-black/20 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentWordIndex + 1) / totalWords) * 100}%` }}
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
                    {targetLanguage} (training)
                    {currentAudioStep === 'training' && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    )}
                  </div>
                  <p className="text-white text-2xl font-medium">{getCurrentContent().sourceWord}</p>
                </div>
                <div className={`backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 ${
                  currentAudioStep === 'main' 
                    ? 'bg-green-500/20 border-green-400/30 scale-105' 
                    : 'bg-black/20'
                }`}>
                  <div className="text-white/60 text-sm mb-2 flex items-center gap-2">
                    {nativeLanguage} (main)
                    {currentAudioStep === 'main' && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
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
                      isPlaying 
                        ? 'bg-red-500/30 hover:bg-red-500/40' 
                        : currentAudioStep === 'training'
                        ? 'bg-blue-500/30 hover:bg-blue-500/40'
                        : currentAudioStep === 'main'
                        ? 'bg-green-500/30 hover:bg-green-500/40'
                        : 'bg-black/20 hover:bg-black/30'
                    }`}
                    disabled={vocabulary.length === 0}
                  >
                    {isPlaying ? (
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
          <div className="text-center mb-12">
            <h1 className="text-3xl font-normal text-white mb-12 transition-all duration-500">{questionText}</h1>

            {/* Search Icon */}
            <div className="mb-12">
              <button
                onClick={handleSearchClick}
                className="w-20 h-20 bg-black/20 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-black/30 transition-all duration-300 transform hover:scale-110 hover:shadow-lg mx-auto"
              >
                <Search className="w-8 h-8 text-white/80" />
              </button>
            </div>
          </div>
        )}

        {/* Page 3: Confirmation */}
        {currentPage === "confirmation" && (
          <div className="text-center transition-all duration-500 ease-in-out">
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-10">
                <button
                  onClick={() => handleLanguageCardClick("native")}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex-1 hover:bg-black/30 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <p className="text-white/60 text-sm mb-2">main language</p>
                  <p className="text-white font-medium text-lg">{nativeLanguage}</p>
                </button>
                <div className="flex items-center justify-center">
                  <Languages className="w-6 h-6 text-white/60" />
                </div>
                <button
                  onClick={() => handleLanguageCardClick("target")}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex-1 hover:bg-black/30 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <p className="text-white/60 text-sm mb-2">training language</p>
                  <p className="text-white font-medium text-lg">{targetLanguage}</p>
                </button>
              </div>

              <div className="mb-6">
                <h2 className="text-white text-xl font-medium mb-8">Survival Pack</h2>
                <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto hide-scrollbar">
                  {topics.map((topic) => {
                    const iconData = TOPIC_ICONS.find(icon => icon.id === topic.id)
                    const IconComponent = iconData?.icon || MessageCircle
                    return (
                      <button
                        key={topic.id}
                        onClick={() => handleTopicSelect(topic)}
                        className={`bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-left hover:bg-black/30 transition-all duration-300 transform hover:scale-[1.02] ${
                          selectedTopic?.id === topic.id ? "bg-white/20 border-white/30" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <IconComponent className="w-5 h-5 text-white/80" />
                        </div>
                        <p className="text-white/90 text-sm font-medium leading-tight">{topic.name}</p>
                        <p className="text-white/60 text-xs mt-1">{topic.wordCount} words</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Language Selection Modal */}
        {showLanguageList && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 w-full max-w-md max-h-[80vh] overflow-hidden">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-12 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 pl-12 text-base"
                    placeholder="Search languages..."
                    autoFocus
                  />
                </div>
              </div>

              <div className="overflow-y-auto max-h-96 space-y-2">
                {filteredLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 hover:bg-white/10`}
                  >
                    <span className="text-white">{language.name}</span>
                    <span className="text-white/60 text-sm ml-2">({language.wordCount.toLocaleString()} words)</span>
                  </button>
                ))}
              </div>

              <Button
                onClick={() => setShowLanguageList(false)}
                className="w-full mt-4 bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 text-white font-medium rounded-2xl h-12"
              >
                Close
              </Button>
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
                  <ChevronLeft className="w-5 h-5 text-white/80" />
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

                {/* Voice Section */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-6">Voice</h3>

                  <div className="space-y-6">
                    <div>
                      <p className="text-white/80 text-sm mb-3">Training Language Voice:</p>
                      <div className="flex gap-3">
                        {["Female", "Male"].map((voice) => (
                          <button
                            key={voice}
                            onClick={() => updateSetting("trainingLanguageVoice", voice)}
                            className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                              settings.trainingLanguageVoice === voice
                                ? "bg-white/20 border border-white/30 text-white"
                                : "bg-black/20 border border-white/10 text-white/70 hover:bg-black/30"
                            }`}
                          >
                            {voice}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-white/80 text-sm mb-3">Main Language Voice:</p>
                      <div className="flex gap-3">
                        {["Male", "Female"].map((voice) => (
                          <button
                            key={voice}
                            onClick={() => updateSetting("mainLanguageVoice", voice)}
                            className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                              settings.mainLanguageVoice === voice
                                ? "bg-white/20 border border-white/30 text-white"
                                : "bg-black/20 border border-white/10 text-white/70 hover:bg-black/30"
                            }`}
                          >
                            {voice}
                          </button>
                        ))}
                      </div>
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
                            onClick={() => updateSetting("pronunciationSpeed", speed)}
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
