import React, { useState, useRef, useEffect } from 'react';

export default function Assistant({ onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: "Hello! I'm Campus360 Assistant. How can I help?" }
  ]);
  const [input, setInput] = useState('');
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages]);

  function send(text) {
    if (!text || !text.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, from: 'bot', text: "Demo: try 'Open Dashboard' or 'How to use feedback'." }]);
    }, 600);
  }

  return (
    <div className="assistant" role="dialog" aria-label="Campus360 Assistant">
      <div className="assistant-header">
        <div>Campus360 Assistant</div>
        <button className="btn-ghost" onClick={onClose} aria-label="Close assistant">✕</button>
      </div>

      <div className="assistant-body" ref={bodyRef}>
        {messages.map(m => (
          <div key={m.id} className={`assistant-msg ${m.from}`}>{m.text}</div>
        ))}
      </div>

      <div className="assistant-actions">
        <button className="pill" onClick={() => send('How to start the app')}>How to start</button>
        <button className="pill" onClick={() => send('Where to login')}>Where to login</button>
        <button className="pill" onClick={() => send('Show features')}>Features</button>
      </div>

      <div className="assistant-input">
        <input placeholder="Ask the assistant..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} />
        <button className="btn" onClick={() => send(input)}>Send</button>
      </div>
    </div>
  );
}
