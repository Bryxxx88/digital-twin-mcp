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
  const latestUserMessageRef = useRef<HTMLDivElement>(null)
  
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 400) // Match animation duration
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

  return (
    <>
      {/* Chat Launcher */}
      {!isOpen && (
        <button 
          className="chat-launcher"
          onClick={() => setIsOpen(true)}
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
            <button 
              className="chat-close-btn"
              onClick={handleClose}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

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
