import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import toast from 'react-hot-toast'

const MsgContainer = ({ chatUserId, onBack }) => {
  const { token } = useSelector((state) => state.auth)
  const { userData } = useSelector((state) => state.user)
  const { socket } = useSelector((state) => state.socketIo)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [msgText, setMsgText] = useState("")
  const [sending, setSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [readMessages, setReadMessages] = useState({})  // messageId -> boolean
  const bottomRef = useRef(null)
  const typingTimeout = useRef(null)

  const getAllMessages = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get-all-message/${chatUserId}`,
        { headers: { Authorization: "Bearer " + token } }
      )
      if (!response.data.success) throw new Error("Couldn't fetch messages")
      setMessages(response.data.allMessages || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!msgText.trim()) return
    try {
      setSending(true)
      // Stop typing emit
      if (socket) socket.emit("stop-typing", { receiverId: chatUserId })

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/send-message`,
        { receiverId: chatUserId, message: msgText },
        { headers: { Authorization: "Bearer " + token } }
      )
      if (!response.data.success) throw new Error("Couldn't send message")
      setMessages(prev => [...prev, response.data.newMessage])
      setMsgText("")
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Couldn't send message!")
    } finally {
      setSending(false)
    }
  }

  // Typing emit with debounce
  const handleTyping = (e) => {
    setMsgText(e.target.value)
    if (!socket) return

    socket.emit("typing", { receiverId: chatUserId })

    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", { receiverId: chatUserId })
    }, 1500) // 1.5 sec baad automatically stop
  }

  const formatTime = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Fetch messages when chat changes
  useEffect(() => {
    if (chatUserId) {
      setMessages([])
      setIsTyping(false)
      getAllMessages()
    }
  }, [chatUserId])

  // Socket listeners
  useEffect(() => {
    if (!socket) return

    // Incoming message
    const handleMessage = (data) => {
      if (data?.senderId?.toString() === chatUserId?.toString()) {
        setMessages(prev => [...prev, data])
        // Tell sender we read it
        socket.emit("message-read", {
          senderId: chatUserId,
          messageId: data._id
        })
      }
    }

    // Typing
    const handleTypingStart = ({ senderId }) => {
      if (senderId?.toString() === chatUserId?.toString()) setIsTyping(true)
    }
    const handleTypingStop = ({ senderId }) => {
      if (senderId?.toString() === chatUserId?.toString()) setIsTyping(false)
    }

    // Read receipt
    const handleRead = ({ messageId }) => {
      setReadMessages(prev => ({ ...prev, [messageId]: true }))
    }

    socket.on("new-message", handleMessage)
    socket.on("typing", handleTypingStart)
    socket.on("stop-typing", handleTypingStop)
    socket.on("message-read", handleRead)

    return () => {
      socket.off("new-message", handleMessage)
      socket.off("typing", handleTypingStart)
      socket.off("stop-typing", handleTypingStop)
      socket.off("message-read", handleRead)
    }
  }, [chatUserId, socket])

  // Mark messages as read when chat opens
  useEffect(() => {
    if (!socket || !chatUserId || messages.length === 0) return
    const unread = messages.filter(m => m.senderId?.toString() === chatUserId?.toString())
    unread.forEach(m => {
      socket.emit("message-read", { senderId: chatUserId, messageId: m._id })
    })
  }, [messages, chatUserId])

  if (!chatUserId) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3"
        style={{ background: 'linear-gradient(160deg,#f0e7ff 0%,#fce7f3 50%,#e7f3ff 100%)' }}>
        <div style={{ fontSize: '56px' }}>👀</div>
        <h2 className="text-xl font-bold" style={{ color: '#7c3aed' }}>Nobody here but us chickens</h2>
        <p className="text-sm" style={{ color: '#9b7ec8' }}>Pick someone from the left and start chatting!</p>
        <p className="text-xs" style={{ color: '#b0a0d0' }}>or stare at this screen awkwardly. your call. 🤷</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col"
      style={{ background: 'linear-gradient(160deg,#f0e7ff 0%,#fce7f3 50%,#e7f3ff 100%)' }}>

      {/* mobile back button */}
      <div className="flex items-center gap-3 px-4 py-3 md:hidden flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.85)', borderBottom: '1.5px solid rgba(200,180,255,0.35)' }}>
        <button onClick={onBack}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(124,58,237,0.1)', border: 'none', cursor: 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-sm font-semibold" style={{ color: '#3a2d6e' }}>Back</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div className="h-10 rounded-2xl animate-pulse"
                style={{ width: `${180 + i * 20}px`, background: 'rgba(200,180,255,0.4)' }} />
            </div>
          ))
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 h-full">
            <div style={{ fontSize: '40px' }}>💬</div>
            <p className="text-sm" style={{ color: '#9b7ec8' }}>No messages yet — say hi!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId?.toString() === userData?._id?.toString()
            const isRead = readMessages[msg._id]
            return (
              <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div>
                  <div className="px-4 py-2 rounded-2xl text-sm"
                    style={{
                      maxWidth: '320px',
                      background: isMe ? 'linear-gradient(135deg,#7c3aed,#ec4899)' : 'rgba(255,255,255,0.92)',
                      color: isMe ? 'white' : '#3a2d6e',
                      borderBottomRightRadius: isMe ? '4px' : '18px',
                      borderBottomLeftRadius: isMe ? '18px' : '4px',
                      border: isMe ? 'none' : '1px solid rgba(200,180,255,0.4)',
                    }}>
                    {msg.message}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 text-xs px-1 ${isMe ? 'justify-end' : 'justify-start'}`}
                    style={{ color: '#b0a0d0' }}>
                    {formatTime(msg.createdAt)}
                    {isMe && (
                      <span style={{
                        fontSize: '12px',
                        color: isRead ? '#10b981' : '#7c3aed'  // green = read, purple = delivered
                      }}>✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl flex gap-1 items-center"
              style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(200,180,255,0.4)' }}>
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 rounded-full inline-block"
                  style={{
                    background: '#9b7ec8',
                    animation: 'bounce 1s infinite',
                    animationDelay: `${i * 0.2}s`
                  }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 flex gap-3 items-center"
        style={{ background: 'rgba(255,255,255,0.85)', borderTop: '1.5px solid rgba(200,180,255,0.35)' }}>
        <input
          type="text"
          value={msgText}
          onChange={handleTyping}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 rounded-2xl text-sm outline-none"
          style={{ border: '2px solid #e0d7ff', background: '#faf8ff', color: '#3a2d6e' }}
        />
        <button onClick={sendMessage} disabled={sending || !msgText.trim()}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg,#7c3aed,#ec4899)', border: 'none',
            cursor: 'pointer', opacity: sending || !msgText.trim() ? 0.6 : 1
          }}>
          {sending ? (
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export default MsgContainer