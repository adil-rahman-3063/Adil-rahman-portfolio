'use client';
import React, { useState, useRef, useEffect } from 'react';

const MAX_USER_MESSAGES = 50;
const MAX_CHAR_LENGTH = 500;

export default function InteractiveChatSection({ onGetQuote, onAccessProjects, onNavigateSection }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const activeInputRef = useRef(null);

  const userMessagesCount = messages.filter((m) => m.role === 'user').length;
  const isLimitReached = userMessagesCount >= MAX_USER_MESSAGES;

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (chatStarted) {
      scrollToBottom();
      if (activeInputRef.current) {
        activeInputRef.current.focus({ preventScroll: true });
      }
    }
  }, [messages, isLoading, chatStarted]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading || isLimitReached) return;

    // Truncate to maximum characters if needed
    const safeText = text.slice(0, MAX_CHAR_LENGTH);

    const userMessage = { role: 'user', content: safeText };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputValue('');
    setChatStarted(true);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply || 'Thanks for asking! Feel free to reach out directly to Adil on WhatsApp at +91 9207114070.';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: replyText,
          whatsAppUrl: data.whatsAppUrl,
          leadSubmitted: data.leadSubmitted,
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm here to help! Adil is a full-stack developer specializing in **Flutter mobile apps**, **modern web applications**, and **custom & Shopify e-commerce stores**. You can reach him directly on WhatsApp at [+91 9207114070](https://wa.me/919207114070) or submit a quote request below!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setChatStarted(false);
    setInputValue('');
  };

  // Helper to render markdown-like text in beige bubble
  const renderFormattedText = (content) => {
    const lines = content.split('\n');
    return lines.map((line, lineIdx) => {
      // Parse markdown bold and links
      const parts = line.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

      return (
        <p key={lineIdx} className="bubble-paragraph">
          {parts.filter(Boolean).map((part, i) => {
            if (/^\*\*[^*]+\*\*$/.test(part)) {
              return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
            if (linkMatch) {
              return (
                <a
                  key={i}
                  href={linkMatch[2]}
                  target="_blank"
                  rel="noreferrer"
                  className="chat-bubble-link"
                >
                  {linkMatch[1]}
                </a>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  // Helper to detect action pills for AI messages based on discussed topics
  const renderActionPills = (message) => {
    const content = message.content || '';
    const lower = content.toLowerCase();
    const actions = [];

    // Lead submitted badge
    if (message.leadSubmitted) {
      actions.push(
        <span key="submitted-badge" className="chat-action-pill lead-success-pill">
          ✓ Details Sent to Adil
        </span>
      );
    }

    // Direct WhatsApp Lead Action
    if (message.whatsAppUrl) {
      actions.push(
        <a
          key="wa-lead-btn"
          href={message.whatsAppUrl}
          target="_blank"
          rel="noreferrer"
          className="chat-action-pill wa-highlight-pill"
        >
          💬 Message on WhatsApp (+91 9207114070)
        </a>
      );
    }

    // Reviews & Testimonials topic
    if (
      lower.includes('review') ||
      lower.includes('testimonial') ||
      lower.includes('feedback') ||
      lower.includes('rating') ||
      lower.includes('client review')
    ) {
      actions.push(
        <button
          key="reviews-nav-btn"
          onClick={() => onNavigateSection?.(7)}
          className="chat-action-pill"
        >
          ⭐ Go to Reviews Section
        </button>
      );
    }

    // Projects & Work Archive topic
    if (
      lower.includes('project') ||
      lower.includes('archive') ||
      lower.includes('zmr') ||
      lower.includes('viewpick') ||
      lower.includes('c-alert') ||
      lower.includes('poshan') ||
      lower.includes('red parrot') ||
      lower.includes('t2 autohaus') ||
      lower.includes('issaa') ||
      lower.includes('apps built')
    ) {
      actions.push(
        <button
          key="proj-btn"
          onClick={() => onNavigateSection?.(4) || onAccessProjects?.()}
          className="chat-action-pill"
        >
          📂 Go to Projects Section
        </button>
      );
    }

    // Tech Stack & Skills topic
    if (
      lower.includes('skill') ||
      lower.includes('skills') ||
      lower.includes('tech stack') ||
      lower.includes('technologies') ||
      lower.includes('languages') ||
      lower.includes('flutter') ||
      lower.includes('dart') ||
      lower.includes('supabase') ||
      lower.includes('firebase')
    ) {
      actions.push(
        <button
          key="skills-nav-btn"
          onClick={() => onNavigateSection?.(3)}
          className="chat-action-pill"
        >
          ⚡ Go to Tech Stack Section
        </button>
      );
    }

    // Experience & Education topic
    if (
      lower.includes('experience') ||
      lower.includes('education') ||
      lower.includes('b.tech') ||
      lower.includes('degree') ||
      lower.includes('university') ||
      lower.includes('career')
    ) {
      actions.push(
        <button
          key="exp-nav-btn"
          onClick={() => onNavigateSection?.(2)}
          className="chat-action-pill"
        >
          🎓 Go to Experience & Education
        </button>
      );
    }

    // About Adil / Bio topic
    if (
      lower.includes('about adil') ||
      lower.includes('who is adil') ||
      lower.includes('bio') ||
      lower.includes('background')
    ) {
      actions.push(
        <button
          key="about-nav-btn"
          onClick={() => onNavigateSection?.(1)}
          className="chat-action-pill"
        >
          👤 Go to About Section
        </button>
      );
    }

    // Blog / Articles topic
    if (
      lower.includes('blog') ||
      lower.includes('article') ||
      lower.includes('writeup')
    ) {
      actions.push(
        <button
          key="blog-nav-btn"
          onClick={() => onNavigateSection?.(6)}
          className="chat-action-pill"
        >
          📰 Go to Articles Section
        </button>
      );
    }

    // Quote & Hire Inquiry
    if (
      !message.leadSubmitted &&
      (lower.includes('quote') || lower.includes('estimate') || lower.includes('scope') || lower.includes('hire') || lower.includes('rate') || lower.includes('cost'))
    ) {
      actions.push(
        <button
          key="quote-btn"
          onClick={() => onGetQuote?.('General Project Inquiry')}
          className="chat-action-pill"
        >
          📝 Request a Quote
        </button>
      );
    }

    // WhatsApp Direct Link
    if (
      !message.whatsAppUrl &&
      (lower.includes('whatsapp') || lower.includes('+91 9207114070') || lower.includes('call him'))
    ) {
      actions.push(
        <a
          key="wa-btn"
          href="https://wa.me/919207114070"
          target="_blank"
          rel="noreferrer"
          className="chat-action-pill"
        >
          💬 WhatsApp Adil (+91 9207114070)
        </a>
      );
    }

    if (actions.length === 0) return null;

    return <div className="chat-actions-row">{actions}</div>;
  };

  return (
    <div className="chat-section-root">
      {!chatStarted ? (
        /* INITIAL SEARCH / PROMPT VIEWPORT */
        <div className="chat-initial-card">
          <div className="chat-header-row">
            <span className="chat-badge">// INTERACTIVE ASSISTANT</span>
            <span className="chat-status-indicator">
              <span className="pulsing-dot" /> Online
            </span>
          </div>

          <h2 className="chat-main-title">Let's talk about your project.</h2>
          <p className="chat-subtitle">
            Tell me about your mobile app, website, e-commerce store, or software ideas — or ask about Adil's work and skills.
          </p>

          {/* Big Input Bar */}
          <div className="big-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell me about your project idea, or ask about Adil's work..."
              className="big-chat-input"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="big-send-btn"
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="scroll-hint-row">
            <span>Press Enter ↵ to chat</span>
            <span className="scroll-hint-sep">·</span>
            <span>Or scroll down to explore services & projects ↓</span>
          </div>
        </div>
      ) : (
        /* ACTIVE APPLE-STYLE CHAT VIEWPORT */
        <div className="active-chat-window">
          {/* Chat Window Header */}
          <div className="active-chat-header">
            <div className="chat-assistant-info">
              <div className="chat-avatar-circle">AR</div>
              <div>
                <h3 className="chat-assistant-name">Adil Rahman's Assistant</h3>
                <span className="chat-assistant-status">
                  <span className="pulsing-dot" /> AI Connected · Ask anything
                </span>
              </div>
            </div>

            <div className="chat-header-actions">
              <button onClick={handleResetChat} className="chat-reset-btn" title="Clear conversation">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: '5px' }}>
                  <path
                    d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C8.04 21 4.67 18.45 3.42 14.8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path d="M3 8V12H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                New Chat
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div ref={messagesContainerRef} className="active-messages-container">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`message-row ${m.role === 'user' ? 'message-user' : 'message-assistant'}`}
              >
                {m.role === 'assistant' && (
                  <div className="assistant-bubble-avatar">AR</div>
                )}

                <div className="bubble-wrapper">
                  <div className={`chat-bubble ${m.role === 'user' ? 'bubble-user' : 'bubble-assistant'}`}>
                    {renderFormattedText(m.content)}
                  </div>

                  {m.role === 'assistant' && renderActionPills(m)}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="message-row message-assistant">
                <div className="assistant-bubble-avatar">AR</div>
                <div className="chat-bubble bubble-assistant bubble-typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Input Bar */}
          {isLimitReached ? (
            <div className="active-chat-limit-bar">
              <span className="limit-text">
                Session limit reached ({MAX_USER_MESSAGES} messages). Let's continue on WhatsApp!
              </span>
              <a
                href="https://wa.me/919207114070"
                target="_blank"
                rel="noreferrer"
                className="limit-wa-btn"
              >
                💬 WhatsApp Adil (+91 9207114070)
              </a>
            </div>
          ) : (
            <div className="active-chat-input-bar">
              <input
                ref={activeInputRef}
                type="text"
                maxLength={MAX_CHAR_LENGTH}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your reply or follow-up question..."
                className="active-chat-input"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="active-send-btn"
                aria-label="Send message"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        .chat-section-root {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 8px 12px 24px;
          position: relative;
          z-index: 2;
          box-sizing: border-box;
        }

        @media (min-width: 600px) {
          .chat-section-root {
            padding: 16px 20px 36px;
          }
        }

        @media (min-width: 1100px) {
          .chat-section-root {
            padding: 24px 40px 50px;
          }
        }

        /* ─── INITIAL SEARCH CARD ─── */
        .chat-initial-card {
          background: linear-gradient(135deg, rgba(46, 28, 25, 0.88) 0%, rgba(35, 21, 19, 0.96) 100%);
          border: 1.5px solid rgba(232, 223, 208, 0.25);
          border-radius: 18px;
          padding: 22px 16px;
          max-width: 960px;
          width: 100%;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
        }

        @media (min-width: 600px) {
          .chat-initial-card {
            padding: 32px 24px;
            border-radius: 20px;
          }
        }

        @media (min-width: 768px) {
          .chat-initial-card {
            padding: 44px 40px;
          }
        }

        .chat-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 12px;
        }

        @media (min-width: 600px) {
          .chat-header-row {
            margin-bottom: 16px;
          }
        }

        .chat-badge {
          font-family: var(--font-mono);
          font-size: 10px;
          color: #8D6E63;
          letter-spacing: 0.8px;
          font-weight: bold;
        }

        @media (min-width: 600px) {
          .chat-badge {
            font-size: 11px;
            letter-spacing: 1px;
          }
        }

        .chat-status-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: #A5D6A7;
          background: rgba(46, 125, 50, 0.15);
          border: 1px solid rgba(129, 199, 132, 0.3);
          border-radius: 20px;
          padding: 2px 8px;
        }

        @media (min-width: 600px) {
          .chat-status-indicator {
            font-size: 11px;
            padding: 3px 10px;
          }
        }

        .pulsing-dot {
          width: 6px;
          height: 6px;
          background-color: #66BB6A;
          border-radius: 50%;
          display: inline-block;
          animation: pulseDot 1.8s infinite;
        }

        @media (min-width: 600px) {
          .pulsing-dot {
            width: 7px;
            height: 7px;
          }
        }

        @keyframes pulseDot {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 8px #66BB6A; }
          100% { transform: scale(0.9); opacity: 0.8; }
        }

        .chat-main-title {
          font-family: var(--font-header);
          font-size: 20px;
          line-height: 1.25;
          color: #FAF6EE;
          font-weight: bold;
          margin: 0 0 8px 0;
          letter-spacing: 0.2px;
        }

        @media (min-width: 480px) {
          .chat-main-title {
            font-size: 24px;
            margin-bottom: 10px;
          }
        }

        @media (min-width: 768px) {
          .chat-main-title {
            font-size: 36px;
            margin-bottom: 12px;
          }
        }

        .chat-subtitle {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #BCAAA4;
          line-height: 1.5;
          max-width: 680px;
          margin: 0 0 16px 0;
        }

        @media (min-width: 600px) {
          .chat-subtitle {
            font-size: 13.5px;
            margin-bottom: 22px;
          }
        }

        @media (min-width: 768px) {
          .chat-subtitle {
            font-size: 15px;
            margin-bottom: 26px;
          }
        }

        /* Big Input Line */
        .big-input-wrapper {
          position: relative;
          width: 100%;
          max-width: 820px;
          display: flex;
          align-items: center;
          margin-top: 8px;
        }

        @media (min-width: 600px) {
          .big-input-wrapper {
            margin-top: 12px;
          }
        }

        .big-chat-input {
          width: 100%;
          background: rgba(250, 246, 238, 0.08);
          border: 1.5px solid rgba(141, 110, 99, 0.4);
          border-radius: 28px;
          padding: 13px 48px 13px 16px;
          font-family: var(--font-mono);
          font-size: 13px;
          color: #FAF6EE;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          box-sizing: border-box;
        }

        @media (min-width: 600px) {
          .big-chat-input {
            border-radius: 32px;
            padding: 16px 56px 16px 20px;
            font-size: 14px;
          }
        }

        @media (min-width: 768px) {
          .big-chat-input {
            border: 2px solid rgba(141, 110, 99, 0.4);
            border-radius: 36px;
            font-size: 15px;
            padding: 18px 68px 18px 24px;
          }
        }

        .big-chat-input::placeholder {
          color: rgba(188, 170, 164, 0.55);
        }

        .big-chat-input:focus {
          border-color: #8D6E63;
          background: rgba(250, 246, 238, 0.12);
          box-shadow: 0 0 0 3px rgba(141, 110, 99, 0.25), 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .big-send-btn {
          position: absolute;
          right: 6px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%);
          color: #FAF6EE;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s, opacity 0.2s, background 0.2s;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
        }

        @media (min-width: 600px) {
          .big-send-btn {
            right: 8px;
            width: 42px;
            height: 42px;
          }
        }

        .big-send-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          background: #4E342E;
        }

        .big-send-btn:not(:disabled):hover {
          transform: scale(1.08);
          background: linear-gradient(135deg, #A1887F 0%, #8D6E63 100%);
        }

        .scroll-hint-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 14px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: rgba(188, 170, 164, 0.65);
          flex-wrap: wrap;
          justify-content: center;
        }

        @media (min-width: 600px) {
          .scroll-hint-row {
            gap: 8px;
            margin-top: 18px;
            font-size: 11px;
          }
        }

        .scroll-hint-sep {
          color: rgba(141, 110, 99, 0.5);
        }

        /* ─── ACTIVE CHAT WINDOW (APPLE iMESSAGE STYLE) ─── */
        .active-chat-window {
          background: linear-gradient(180deg, rgba(35, 21, 19, 0.96) 0%, rgba(26, 14, 13, 0.99) 100%);
          border: 1.5px solid rgba(232, 223, 208, 0.28);
          border-radius: 16px;
          max-width: 960px;
          width: 100%;
          height: clamp(340px, calc(100dvh - 180px), 540px);
          display: flex;
          flex-direction: column;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          overflow: hidden;
          animation: chatWindowExpand 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          margin-bottom: 8px;
        }

        @media (min-width: 600px) {
          .active-chat-window {
            border-radius: 20px;
            height: clamp(440px, 68vh, 580px);
            margin-bottom: 0;
          }
        }

        @keyframes chatWindowExpand {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .active-chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(141, 110, 99, 0.2);
          background: rgba(46, 28, 25, 0.65);
          flex-shrink: 0;
        }

        @media (min-width: 600px) {
          .active-chat-header {
            padding: 14px 18px;
          }
        }

        .chat-assistant-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chat-avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8D6E63 0%, #5D4037 100%);
          color: #FAF6EE;
          font-family: var(--font-header);
          font-size: 11px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(232, 223, 208, 0.3);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          flex-shrink: 0;
        }

        @media (min-width: 600px) {
          .chat-avatar-circle {
            width: 36px;
            height: 36px;
            font-size: 13px;
          }
        }

        .chat-assistant-name {
          font-family: var(--font-header);
          font-size: 13px;
          color: #FAF6EE;
          margin: 0;
          font-weight: bold;
          line-height: 1.2;
        }

        @media (min-width: 600px) {
          .chat-assistant-name {
            font-size: 14px;
          }
        }

        .chat-assistant-status {
          font-family: var(--font-mono);
          font-size: 10px;
          color: #A5D6A7;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        @media (min-width: 600px) {
          .chat-assistant-status {
            font-size: 11px;
            gap: 5px;
          }
        }

        .chat-reset-btn {
          background: rgba(250, 246, 238, 0.06);
          border: 1px solid rgba(141, 110, 99, 0.3);
          border-radius: 16px;
          padding: 5px 10px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: #BCAAA4;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s;
          white-space: nowrap;
        }

        @media (min-width: 600px) {
          .chat-reset-btn {
            padding: 6px 14px;
            font-size: 11px;
            border-radius: 18px;
          }
        }

        .chat-reset-btn:hover {
          background: rgba(141, 110, 99, 0.2);
          color: #FAF6EE;
          border-color: #8D6E63;
        }

        /* Messages area */
        .active-messages-container {
          flex: 1;
          padding: 14px 12px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (min-width: 600px) {
          .active-messages-container {
            padding: 18px 16px;
            gap: 14px;
          }
        }

        .message-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          width: 100%;
        }

        @media (min-width: 600px) {
          .message-row {
            gap: 10px;
          }
        }

        .message-user {
          justify-content: flex-end;
        }

        .message-assistant {
          justify-content: flex-start;
        }

        .assistant-bubble-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #5D4037;
          color: #FAF6EE;
          font-family: var(--font-header);
          font-size: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 2px;
        }

        @media (min-width: 600px) {
          .assistant-bubble-avatar {
            width: 28px;
            height: 28px;
            font-size: 10px;
            margin-bottom: 4px;
          }
        }

        .bubble-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 88%;
        }

        @media (min-width: 600px) {
          .bubble-wrapper {
            max-width: 80%;
          }
        }

        @media (min-width: 900px) {
          .bubble-wrapper {
            max-width: 72%;
          }
        }

        .chat-bubble {
          padding: 10px 14px;
          font-family: var(--font-mono);
          font-size: 12.5px;
          line-height: 1.5;
          word-break: break-word;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        @media (min-width: 600px) {
          .chat-bubble {
            padding: 12px 18px;
            font-size: 13.5px;
            line-height: 1.55;
          }
        }

        /* User Bubble: Espresso / Warm Brown */
        .bubble-user {
          background: linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%);
          color: #FAF6EE;
          border-radius: 16px 16px 4px 16px;
          align-self: flex-end;
        }

        @media (min-width: 600px) {
          .bubble-user {
            border-radius: 18px 18px 4px 18px;
          }
        }

        /* Assistant Bubble: Warm Beige / Cream (Apple iMessage style) */
        .bubble-assistant {
          background: #FAF6EE;
          color: #231513;
          border: 1px solid #E8DFD0;
          border-radius: 16px 16px 16px 4px;
          align-self: flex-start;
        }

        @media (min-width: 600px) {
          .bubble-assistant {
            border-radius: 18px 18px 18px 4px;
          }
        }

        .bubble-paragraph {
          margin: 0;
        }

        .bubble-paragraph + .bubble-paragraph {
          margin-top: 6px;
        }

        @media (min-width: 600px) {
          .bubble-paragraph + .bubble-paragraph {
            margin-top: 8px;
          }
        }

        .chat-bubble-link {
          color: #5D4037;
          font-weight: bold;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .chat-bubble-link:hover {
          color: #8D6E63;
        }

        /* Action buttons below assistant message */
        .chat-actions-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
        }

        @media (min-width: 600px) {
          .chat-actions-row {
            gap: 8px;
            margin-top: 8px;
          }
        }

        .chat-action-pill {
          background: rgba(250, 246, 238, 0.1);
          border: 1px solid rgba(141, 110, 99, 0.4);
          border-radius: 14px;
          padding: 5px 10px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: #FAF6EE;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: background 0.2s, border-color 0.2s;
          line-height: 1.3;
        }

        @media (min-width: 600px) {
          .chat-action-pill {
            padding: 6px 12px;
            font-size: 11px;
            border-radius: 16px;
          }
        }

        .chat-action-pill:hover {
          background: #8D6E63;
          border-color: #FAF6EE;
          color: #FAF6EE;
        }

        .lead-success-pill {
          background: rgba(76, 175, 80, 0.15) !important;
          border-color: #4CAF50 !important;
          color: #A5D6A7 !important;
          cursor: default;
          font-weight: bold;
        }

        .wa-highlight-pill {
          background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%) !important;
          border-color: #81C784 !important;
          color: #FFFFFF !important;
          font-weight: bold;
          box-shadow: 0 4px 12px rgba(46, 125, 50, 0.35);
        }
        .wa-highlight-pill:hover {
          background: linear-gradient(135deg, #388E3C 0%, #2E7D32 100%) !important;
          transform: translateY(-1px);
        }

        /* Typing Dots */
        .bubble-typing {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px 14px;
          width: fit-content;
        }

        @media (min-width: 600px) {
          .bubble-typing {
            gap: 5px;
            padding: 14px 18px;
          }
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background-color: #8D6E63;
          border-radius: 50%;
          animation: typingBounce 1.4s infinite ease-in-out both;
        }

        @media (min-width: 600px) {
          .typing-dot {
            width: 7px;
            height: 7px;
          }
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.1); opacity: 1; }
        }

        /* Active Bottom Input Bar */
        .active-chat-input-bar {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 8px 12px;
          background: rgba(35, 21, 19, 0.98);
          border-top: 1px solid rgba(141, 110, 99, 0.25);
          gap: 8px;
          flex-shrink: 0;
          width: 100%;
          box-sizing: border-box;
          position: relative;
          z-index: 10;
        }

        @media (min-width: 600px) {
          .active-chat-input-bar {
            padding: 12px 16px;
            gap: 10px;
          }
        }

        .active-chat-input {
          flex: 1 1 0%;
          min-width: 0;
          width: 100%;
          background: rgba(250, 246, 238, 0.08);
          border: 1.5px solid rgba(141, 110, 99, 0.3);
          border-radius: 24px;
          padding: 10px 14px;
          font-family: var(--font-mono);
          font-size: 13px;
          color: #FAF6EE;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }

        @media (min-width: 600px) {
          .active-chat-input {
            border-radius: 28px;
            padding: 12px 20px;
            font-size: 13.5px;
          }
        }

        .active-chat-input:focus {
          border-color: #8D6E63;
          background: rgba(250, 246, 238, 0.12);
        }

        .active-chat-input::placeholder {
          color: rgba(188, 170, 164, 0.5);
        }

        .active-send-btn {
          width: 36px;
          height: 36px;
          min-width: 36px;
          min-height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%);
          color: #FAF6EE;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.15s, opacity 0.2s;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          z-index: 11;
        }

        @media (min-width: 600px) {
          .active-send-btn {
            width: 40px;
            height: 40px;
            min-width: 40px;
            min-height: 40px;
          }
        }

        .active-send-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .active-send-btn:not(:disabled):hover {
          transform: scale(1.06);
        }

        .active-send-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .active-send-btn:not(:disabled):hover {
          transform: scale(1.06);
        }

        /* Limit Reached Bar */
        .active-chat-limit-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(35, 21, 19, 0.95);
          border-top: 1px solid rgba(141, 110, 99, 0.3);
          text-align: center;
          flex-shrink: 0;
        }

        @media (min-width: 600px) {
          .active-chat-limit-bar {
            flex-direction: row;
            justify-content: space-between;
            padding: 14px 20px;
          }
        }

        .limit-text {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #BCAAA4;
        }

        @media (min-width: 600px) {
          .limit-text {
            font-size: 12px;
          }
        }

        .limit-wa-btn {
          background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
          border: 1px solid #81C784;
          border-radius: 20px;
          padding: 6px 14px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: bold;
          color: #FFFFFF;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
          white-space: nowrap;
        }

        @media (min-width: 600px) {
          .limit-wa-btn {
            padding: 8px 18px;
            font-size: 12px;
          }
        }

        .limit-wa-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(46, 125, 50, 0.45);
        }
      `}</style>
    </div>
  );
}
