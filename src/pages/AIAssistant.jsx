import {
  useEffect,
  useRef,
  useState,
} from "react";

import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

import { askAI } from "../services/aiService";

import "../styles/aiassistant.css";

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "👋 Hello! I'm the MyMediExpress AI Health Assistant.\n\nDescribe your symptoms and I'll provide general health information.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  function getCurrentTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function handleSend() {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const question = message;

    setMessage("");

    setLoading(true);

    try {
      const reply = await askAI(question);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: reply,
          time: getCurrentTime(),
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            "Sorry, AI service is currently unavailable.",
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }
return (
  <div className="ai-page">

    <div className="ai-header">
      <h1>🤖 MyMediExpress AI Assistant</h1>

      <p>
        Ask health-related questions and receive
        general health information.
      </p>
    </div>

    <div className="chat-box">

      {messages.map((msg, index) => (

        <div
          key={index}
          className={`message-row ${
            msg.sender === "user"
              ? "user-row"
              : "ai-row"
          }`}
        >

          <div className="avatar">
            {msg.sender === "user"
              ? "👤"
              : "🤖"}
          </div>

          <div
            className={`message-bubble ${
              msg.sender === "user"
                ? "user-bubble"
                : "ai-bubble"
            }`}
          >

            {msg.sender === "ai" ? (
  <ReactMarkdown>
    {msg.text}
  </ReactMarkdown>
) : (
  <p>{msg.text}</p>
)}

            <small>{msg.time}</small>

          </div>

        </div>

      ))}

{loading && (

  <div className="message-row ai-row">

    <div className="avatar">
      🤖
    </div>

    <div className="message-bubble ai-bubble">

      <div className="typing">

        <span></span>
        <span></span>
        <span></span>

      </div>

    </div>

  </div>

)}
      <div ref={chatEndRef}></div>

    </div>

    <div className="chat-input">

      <input
        type="text"
        placeholder="Describe your symptoms..."
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        onKeyDown={handleKeyDown}
      />

      <button onClick={handleSend}>
        Send
      </button>

    </div>

    <div className="quick-actions">

      <Link
        to="/order-medicine"
        className="quick-btn"
      >
        💊 Order Medicine
      </Link>

      <Link
        to="/contact"
        className="quick-btn"
      >
        📞 Contact
      </Link>

    </div>

  </div>
);
}

export default AIAssistant;