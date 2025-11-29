// /app/DigitalTwinChat.tsx
'use client'
import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function DigitalTwinChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm John Bryx's AI assistant. Ask me anything about his experience, skills, or projects."
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set())
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState<number | null>(null)
  const [showVoiceSettings, setShowVoiceSettings] = useState(false)
  const [voiceRate, setVoiceRate] = useState(0.9)
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isListening, setIsListening] = useState(false)
  const latestUserMessageRef = useRef<HTMLDivElement>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const recognitionRef = useRef<any>(null)
  
  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'
        
        recognition.onstart = () => {
          console.log('Speech recognition started')
        }
        
        recognition.onresult = (event: any) => {
          console.log('Speech recognition result received')
          const transcript = event.results[0][0].transcript
          console.log('Transcript:', transcript)
          setInput(transcript)
        }
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }
        
        recognition.onend = () => {
          console.log('Speech recognition ended')
          setIsListening(false)
        }
        
        recognitionRef.current = recognition
      } else {
        console.warn('Speech recognition not supported in this browser')
        alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.log('Error stopping recognition:', e)
        }
      }
    }
  }, [])

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      setAvailableVoices(voices)
      // Try to select an English voice by default
      const englishVoice = voices.find(v => v.lang.startsWith('en-'))
      if (englishVoice) {
        setSelectedVoice(englishVoice)
      }
    }
    
    loadVoices()
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory')
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed)
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 1) { // Only save if there are more than just the initial message
      localStorage.setItem('chatHistory', JSON.stringify(messages))
    }
  }, [messages])

  const handleClose = () => {
    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setCurrentSpeakingIndex(null)
    }
    
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 400) // Match animation duration
  }

  const clearHistory = () => {
    const initialMessage = {
      role: 'assistant' as const,
      content: "Hi! I'm John Bryx's AI assistant. Ask me anything about his experience, skills, or projects."
    }
    setMessages([initialMessage])
    localStorage.removeItem('chatHistory')
    setShowHistory(false)
  }
  
  // Auto-scroll to latest user message whenever messages change
  useEffect(() => {
    if (latestUserMessageRef.current) {
      latestUserMessageRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  }, [messages])
  
  const allQuestions = [
    "Tell me about yourself",
    "What are your greatest strengths?",
    "Why should we hire you?",
    "What's your experience with full-stack development?",
    "Describe a challenging project you've worked on",
    "What technologies are you most proficient in?",
    "How do you stay updated with new technologies?",
    "Tell me about your problem-solving approach",
    "What's your experience with team collaboration?",
    "Where do you see yourself in 5 years?",
    "What's your approach to learning new frameworks?",
    "Describe your most significant achievement",
    "How do you handle tight deadlines?",
    "What's your experience with database design?",
    "Tell me about a time you debugged a complex issue",
    "What motivates you as a developer?",
    "How do you ensure code quality?",
    "What's your experience with version control?"
  ]
  
  const getRandomQuestions = (count: number, used: Set<string>) => {
    const available = allQuestions.filter(q => !used.has(q))
    
    // If we've used most questions, use all questions
    if (available.length < count) {
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, count)
    }
    
    // Shuffle and pick random questions
    const shuffled = [...available].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }
  
  const [suggestedQuestions, setSuggestedQuestions] = useState(() => 
    getRandomQuestions(4, new Set())
  )

  const handleSuggestionClick = async (question: string) => {
    if (isLoading) return
    
    setInput('')
    setShowSuggestions(false)
    
    // Mark this question as used and get new suggestions
    const newUsed = new Set([...usedQuestions, question])
    setUsedQuestions(newUsed)
    setSuggestedQuestions(getRandomQuestions(4, newUsed))
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: question }])
    setIsLoading(true)

    // Show typing animation after a brief delay
    setTimeout(() => {
      setIsTyping(true)
    }, 400)

    try {
      // Call the API
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'query',
          query: question
        })
      })

      const data = await response.json()

      setIsTyping(false)
      if (data.success && data.data?.answer) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.data.answer
        }])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Error:', error)
      setIsTyping(false)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setShowSuggestions(false)
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    // Show typing animation after a brief delay
    setTimeout(() => {
      setIsTyping(true)
    }, 400)

    try {
      // Call the API
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'query',
          query: userMessage
        })
      })

      const data = await response.json()

      setIsTyping(false)
      if (data.success && data.data?.answer) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.data.answer
        }])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Error:', error)
      setIsTyping(false)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLauncherClick = () => {
    setIsOpen(true)
  }

  const speakMessage = (text: string, messageIndex: number) => {
    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(text)
    speechSynthesisRef.current = utterance
    
    // Configure voice settings
    utterance.rate = voiceRate
    utterance.pitch = 1
    utterance.volume = 1
    if (selectedVoice) {
      utterance.voice = selectedVoice
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true)
      setCurrentSpeakingIndex(messageIndex)
    }
    
    utterance.onend = () => {
      setIsSpeaking(false)
      setCurrentSpeakingIndex(null)
    }
    
    utterance.onerror = () => {
      setIsSpeaking(false)
      setCurrentSpeakingIndex(null)
    }
    
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setCurrentSpeakingIndex(null)
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setIsListening(true)
        recognitionRef.current.start()
        console.log('Starting speech recognition...')
      } catch (error) {
        console.error('Failed to start recognition:', error)
        setIsListening(false)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        setIsListening(false)
        recognitionRef.current.stop()
        console.log('Stopping speech recognition...')
      } catch (error) {
        console.error('Failed to stop recognition:', error)
      }
    }
  }

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  return (
    <>
      {/* Chat Launcher */}
      {!isOpen && (
        <button 
          className="chat-launcher"
          onClick={handleLauncherClick}
          aria-label="Open chat with digital twin"
        >
          <span className="chat-launcher-text">chat with my digital twin</span>
          <span className="chat-launcher-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`chat-floating-window ${isClosing ? 'closing' : ''}`}>
          <div className="chat-floating-header">
            <div className="chat-header-info">
              <div className="chat-header-title">Digital Twin</div>
              <div className="chat-header-status">
                <span className="status-indicator-small"></span>
                <span>Online</span>
              </div>
            </div>
            <div className="chat-header-actions">
              <button 
                className="chat-history-btn"
                onClick={() => {
                  setShowHistory(!showHistory)
                  setShowVoiceSettings(false)
                }}
                aria-label="Chat history"
                title="Chat history"
              >
                ⋮
              </button>
              <button 
                className="chat-voice-settings-btn"
                onClick={() => {
                  setShowVoiceSettings(!showVoiceSettings)
                  setShowHistory(false)
                }}
                aria-label="Voice settings"
                title="Voice settings"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </button>
              <button 
                className="chat-close-btn"
                onClick={handleClose}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {showHistory && (
            <div className="chat-history-panel">
              <div className="chat-history-header">
                <h3>Chat History</h3>
                <button 
                  className="close-history-btn"
                  onClick={() => setShowHistory(false)}
                  aria-label="Close history"
                >
                  ✕
                </button>
              </div>
              <div className="chat-history-content">
                {messages.length <= 1 ? (
                  <p className="no-history">No chat history yet. Start a conversation!</p>
                ) : (
                  messages.map((message, index) => (
                    <div key={index} className={`history-message ${message.role}`}>
                      <div className="history-message-label">
                        {message.role === 'user' ? 'You' : 'Digital Twin'}
                      </div>
                      <div className="history-message-text">
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="chat-history-footer">
                <button 
                  className="clear-history-btn"
                  onClick={clearHistory}
                >
                  Clear Chat History
                </button>
              </div>
            </div>
          )}

          {showVoiceSettings && (
            <div className="chat-voice-settings-panel">
              <div className="chat-voice-settings-header">
                <h3>Voice Settings</h3>
                <button 
                  className="close-voice-settings-btn"
                  onClick={() => setShowVoiceSettings(false)}
                  aria-label="Close voice settings"
                >
                  ✕
                </button>
              </div>
              <div className="chat-voice-settings-content">
                <div className="voice-setting-group">
                  <label htmlFor="voiceSpeed">Speech Speed: {voiceRate.toFixed(1)}x</label>
                  <input
                    id="voiceSpeed"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceRate}
                    onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                    className="voice-speed-slider"
                  />
                  <div className="speed-labels">
                    <span>0.5x</span>
                    <span>1.0x</span>
                    <span>2.0x</span>
                  </div>
                </div>
                <div className="voice-setting-group">
                  <label htmlFor="voiceSelect">Voice</label>
                  <select
                    id="voiceSelect"
                    value={selectedVoice?.name || ''}
                    onChange={(e) => {
                      const voice = availableVoices.find(v => v.name === e.target.value)
                      if (voice) setSelectedVoice(voice)
                    }}
                    className="voice-select"
                  >
                    {availableVoices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="chat-messages" id="chatMessages">
            {messages.map((message, index) => {
              const isLastUserMessage = 
                message.role === 'user' && 
                index === messages.length - 1 ||
                (message.role === 'user' && 
                 index === messages.length - 2 && 
                 messages[messages.length - 1]?.role === 'assistant')
              
              return (
                <div 
                  key={index} 
                  className={`message ${message.role}`}
                  ref={isLastUserMessage ? latestUserMessageRef : null}
                >
                  <div className="message-content">
                    <p>{message.content}</p>
                    {message.role === 'assistant' && (
                      <button
                        className={`voice-btn ${currentSpeakingIndex === index ? 'speaking' : ''}`}
                        onClick={() => {
                          if (currentSpeakingIndex === index) {
                            stopSpeaking()
                          } else {
                            speakMessage(message.content, index)
                          }
                        }}
                        aria-label={currentSpeakingIndex === index ? 'Stop speaking' : 'Read message aloud'}
                        title={currentSpeakingIndex === index ? 'Stop' : 'Listen'}
                      >
                        {currentSpeakingIndex === index ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1"/>
                            <rect x="14" y="4" width="4" height="16" rx="1"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
            
            {isTyping && (
              <div className="message assistant loading">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {showSuggestions && !isLoading && messages[messages.length - 1]?.role === 'assistant' && (
            <div className="chat-suggestions-compact">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}
          
          <form className="chat-input-form" onSubmit={handleSubmit}>
            <button
              type="button"
              className={`chat-mic-btn ${isListening ? 'listening' : ''}`}
              onClick={() => {
                if (isListening) {
                  stopListening()
                } else {
                  startListening()
                }
              }}
              disabled={isLoading}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              title={isListening ? 'Stop listening' : 'Voice input'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
            <input 
              type="text" 
              className="chat-input" 
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                if (e.target.value.length > 0) {
                  setShowSuggestions(false)
                }
              }}
              onFocus={() => {
                if (input.length === 0) {
                  setShowSuggestions(true)
                }
              }}
              onBlur={() => {
                // Delay to allow suggestion click to register
                setTimeout(() => setShowSuggestions(false), 150)
              }}
              placeholder="Ask me anything about John Bryx..."
              disabled={isLoading}
              required
            />
            <button type="submit" className="chat-send-btn" disabled={isLoading}>
              Enter
            </button>
          </form>
        </div>
      )}
    </>
  )
}
