"use client";
import React, { useState, useEffect } from "react";
import Card from "@/components/Card";

// User location hook
function useUserLocation() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }),
      () => setLocation({ latitude: null, longitude: null })
    );
  }, []);
  return location;
}

export default function MainPage() {
  // Side panel state
  const [sideOpen, setSideOpen] = useState(false);
  const [sideWidth, setSideWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const [sideCollapsed, setSideCollapsed] = useState(true); // Closed initially

  // Main message state
  const [input, setInput] = useState("");
  const [mainLoading, setMainLoading] = useState(false);
  const [mainCard, setMainCard] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [msgBoxLifted, setMsgBoxLifted] = useState(false);
  const [quoteFading, setQuoteFading] = useState(false);

  // Side message state
  const [sideInput, setSideInput] = useState("");
  const [sideLoading, setSideLoading] = useState(false);
  const [sideMessages, setSideMessages] = useState([]);

  const location = useUserLocation();

  // Responsive side panel width
  useEffect(() => {
    function handleResize() {
      const width = Math.max(320, Math.min(window.innerWidth * 0.4, 600));
      setSideWidth(width);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Panel resizing (for desktop)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || sideCollapsed) return;
      let newWidth = window.innerWidth - e.clientX;
      newWidth = Math.max(320, Math.min(newWidth, 600));
      setSideWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, sideCollapsed]);

  // Keyboard shortcut for collapse
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "q") {
        setSideCollapsed((c) => !c);
        setSideOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Animation CSS
  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("msgbox-fadeup-style")) {
      const style = document.createElement("style");
      style.id = "msgbox-fadeup-style";
      style.innerHTML = `
        .msgbox-rest {
          transition: transform 0.8s linear;
          transform: translateY(0);
          z-index: 4;
        }
        .msgbox-lift {
          transition: transform 0.8s linear;
          transform: translateY(-32px);
          z-index: 4;
        }
        .quote-fade-in {
          opacity: 1;
          transition: opacity 0.8s linear;
        }
        .quote-fade-out {
          opacity: 0;
          transition: opacity 0.8s linear;
        }
        .main-card-appear {
          animation: fadeinCardMain 0.42s ease;
        }
        @keyframes fadeinCardMain {
          from { opacity: 0; transform: translateY(32px);}
          to   { opacity: 1; transform: translateY(0);}
        }
        @media (max-width: 600px) {
          .msgbox-rest, .msgbox-lift {
            width: 96vw !important;
            min-width: 0 !important;
            max-width: 99vw !important;
            left: 0;
            padding: 0.5rem 2vw;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Side section open/close like original, not overlay
  const handleCollapse = () => {
    setSideCollapsed(true);
    setTimeout(() => setSideOpen(false), 240);
  };
  const handleExpand = () => {
    setSideOpen(true);
    setTimeout(() => setSideCollapsed(false), 20);
  };

  // Only translate/fade on send, not on focus
  const handleSendMain = async (e) => {
    e.preventDefault();
    if (!input.trim() || mainLoading) return;
    setMainLoading(true);
    setMainCard(null);
    setShowCard(false);
    setMsgBoxLifted(true);
    setQuoteFading(true);

    setTimeout(async () => {
      try {
        const res = await fetch("/api/query.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: 1,
            prompt: input,
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        });
        const data = await res.json();
        setMainCard(data);
        setShowCard(true);
      } catch {
        setMainCard({ error: "Failed to fetch response." });
        setShowCard(true);
      } finally {
        setMainLoading(false);
        setInput("");
      }
    }, 800);
  };

  // Side Send
  const handleSendSide = async (e) => {
    e.preventDefault();
    if (!sideInput.trim() || sideLoading) return;
    setSideLoading(true);
    setSideMessages((msgs) => [...msgs, { user: sideInput, response: null }]);
    const msgIdx = sideMessages.length;
    try {
      const res = await fetch("/api/query.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 2,
          prompt: sideInput,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });
      const data = await res.json();
      setSideMessages((msgs) =>
        msgs.map((msg, idx) =>
          idx === msgIdx ? { ...msg, response: data.answer || data.error || "No response." } : msg
        )
      );
    } catch {
      setSideMessages((msgs) =>
        msgs.map((msg, idx) =>
          idx === msgIdx ? { ...msg, response: "Failed to fetch response." } : msg
        )
      );
    } finally {
      setSideLoading(false);
      setSideInput("");
    }
  };

  // On page load, side panel is collapsed and closed
  useEffect(() => {
    setSideOpen(false);
    setSideCollapsed(true);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        background: "#f6f8fa",
      }}
    >
      {/* Main Content */}
      <main
        style={{
          width: `calc(100vw - ${(sideOpen && !sideCollapsed) ? sideWidth : 0}px)`,
          transition: "width 0.2s ease",
          height: "100vh",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 0,
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Smoothly disappearing heading */}
        {!mainCard && (
          <div
            className={quoteFading ? "quote-fade-out" : "quote-fade-in"}
            style={{
              position: "absolute",
              top: "32%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "2.4rem",
              fontWeight: 700,
              color: "#222",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              userSelect: "none",
              zIndex: 2,
            }}
          >
            Beyond the Surface : The Real Cost
          </div>
        )}
        {/* Input bar with send button */}
        <form
          className={msgBoxLifted ? "msgbox-lift" : "msgbox-rest"}
          style={{
            width: "100%",
            maxWidth: 500,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 1px 8px 0 #1a237e16",
            padding: "0.5rem 1.2rem",
            zIndex: 6,
          }}
          onSubmit={handleSendMain}
          autoComplete="off"
        >
          <input
            style={{
              border: "none",
              width: "100%",
              height: 42,
              fontSize: 18,
              outline: "none",
              background: "transparent",
              color: "#222",
            }}
            type="text"
            placeholder="Start your query..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={mainLoading}
          />
          <button
            style={{
              background: "none",
              border: "none",
              padding: "0 0 0 10px",
              cursor: !input.trim() || mainLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
            }}
            type="submit"
            aria-label="Send"
            disabled={!input.trim() || mainLoading}
            tabIndex={0}
          >
            <svg height={22} width={22} viewBox="0 0 20 20" fill={input.trim() ? "#1976D2" : "#b0b8c1"}>
              <path d="M2.01 10.384l14.093-6.246c.822-.364 1.621.435 1.257 1.257l-6.247 14.093c-.367.829-1.553.834-1.926.008l-2.068-4.683a.65.65 0 0 1 .276-.827l6.624-3.883-7.222 2.937a.65.65 0 0 1-.827-.277l-2.96-4.625c-.49-.765.356-1.647 1.123-1.448z" />
            </svg>
          </button>
        </form>
        {/* Card (response) */}
        {showCard && (
          <div
            className="main-card-appear"
            style={{
              width: "100%",
              maxWidth: 500,
              marginTop: 22,
              minHeight: 80,
              zIndex: 2,
            }}
          >
            {mainLoading ? (
              <div style={{ padding: "2rem", color: "#888", textAlign: "center" }}>Loading...</div>
            ) : mainCard ? (
              <Card {...mainCard} />
            ) : null}
          </div>
        )}
      </main>
      {/* Slide Button (expand/collapse) */}
      <button
        style={{
          position: "fixed",
          top: "50%",
          right: sideCollapsed ? 14 : sideWidth + 14,
          transform: "translateY(-50%)",
          zIndex: 35,
          background: "#f6f8fa",
          border: "1.5px solid #e0e0e0",
          borderRadius: 9,
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 14px 0 rgba(60,64,67,0.10)",
          cursor: "pointer",
          transition: "right 0.24s ease, box-shadow 0.2s",
          padding: 0,
          opacity: 1,
        }}
        onClick={sideCollapsed ? handleExpand : handleCollapse}
        aria-label={sideCollapsed ? "Show General Talk" : "Hide General Talk"}
        title={sideCollapsed ? "Show General Talk" : "Hide General Talk"}
      >
        <svg width={26} height={26} viewBox="0 0 20 20" fill="none">
          <path
            d="M7 4l5 6-5 6"
            stroke="#555"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: !sideCollapsed ? "rotate(0deg)" : "rotate(180deg)",
              transformOrigin: "50% 50%",
              transition: "transform 0.2s",
            }}
          />
        </svg>
      </button>
      {/* Side Section: General Talk */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: sideWidth,
          minWidth: 320,
          maxWidth: 600,
          background: "#fff",
          boxShadow: (!sideCollapsed)
            ? "rgba(60,64,67,0.12) 0px 1.5px 12px 0px"
            : "none",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          zIndex: 30,
          transform: sideCollapsed
            ? `translateX(${sideWidth - 40}px)`
            : "translateX(0)",
          opacity: !sideCollapsed ? 1 : 0,
          pointerEvents: !sideCollapsed ? "all" : "none",
          transition:
            "transform 0.24s ease, width 0.2s ease, opacity 0.15s",
          borderLeft: "1px solid #ececec",
        }}
        tabIndex={!sideCollapsed ? 0 : -1}
        aria-hidden={sideCollapsed}
      >
        {/* Drag Resizer, disabled when collapsed */}
        {!sideCollapsed && (
          <div
            style={{
              width: 6,
              cursor: sideCollapsed ? "default" : "ew-resize",
              background: sideCollapsed ? "transparent" : "rgba(0,0,0,0.08)",
              position: "absolute",
              left: -3,
              top: 0,
              bottom: 0,
              zIndex: 31,
            }}
            onMouseDown={() => !sideCollapsed && setIsResizing(true)}
            title="Resize"
          />
        )}
        {!sideCollapsed && (
          <button
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: "#888",
              zIndex: 32,
              opacity: 0.85,
            }}
            onClick={handleCollapse}
            aria-label="Collapse"
            title="Collapse"
          >
            ×
          </button>
        )}
        {!sideCollapsed && (
          <>
            <div
              style={{
                padding: "1.2rem 1.5rem 1rem 1.5rem",
                fontWeight: 600,
                fontSize: 19,
                borderBottom: "1px solid #ececec",
                background: "#fafbfc",
              }}
            >
              General Talk
            </div>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.2rem",
                fontSize: 15.5,
                color: "#314660",
                background: "#f7fafd",
              }}
            >
              <p style={{ margin: 0, color: "#777" }}>
                Welcome to the General Talk section! You can use this space to chat, ask questions, or discuss anything related to climate change.
              </p>
              <div style={{ marginTop: 18 }}>
                {sideMessages.map((msg, idx) => (
                  <div key={idx} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        color: "#1976d2",
                        marginBottom: 4,
                        fontWeight: 500,
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.user}
                    </div>
                    {msg.response ? (
                      <div
                        style={{
                          fontSize: 15.5,
                          color: "#222",
                          background: "#fff",
                          padding: "0.7rem 1rem",
                          borderRadius: 7,
                          boxShadow: "0 1px 4px 0 #1a237e0e",
                        }}
                      >
                        {msg.response}
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: 15,
                          color: "#888",
                          padding: "0.7rem 1rem",
                        }}
                      >
                        Loading...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Side panel query input and send button */}
            <form
              style={{
                width: "100%",
                background: "#f6f8fa",
                padding: "1rem 1.2rem",
                borderTop: "1px solid #ececec",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              onSubmit={handleSendSide}
              autoComplete="off"
            >
              <input
                style={{
                  border: "none",
                  background: "#fff",
                  borderRadius: 6,
                  fontSize: 16,
                  padding: "0.6rem 1rem",
                  flex: 1,
                  outline: "none",
                  boxShadow: "0 0.5px 7px 0 rgba(60,64,67,0.07)",
                  color: "#222",
                }}
                type="text"
                placeholder="Type a message..."
                value={sideInput}
                onChange={(e) => setSideInput(e.target.value)}
                disabled={sideLoading}
              />
              <button
                style={{
                  background: "none",
                  border: "none",
                  padding: "0 0 0 10px",
                  cursor: !sideInput.trim() || sideLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                type="submit"
                aria-label="Send"
                disabled={!sideInput.trim() || sideLoading}
                tabIndex={0}
              >
                <svg height={22} width={22} viewBox="0 0 20 20" fill={sideInput.trim() ? "#1976D2" : "#b0b8c1"}>
                  <path d="M2.01 10.384l14.093-6.246c.822-.364 1.621.435 1.257 1.257l-6.247 14.093c-.367.829-1.553.834-1.926.008l-2.068-4.683a.65.65 0 0 1 .276-.827l6.624-3.883-7.222 2.937a.65.65 0 0 1-.827-.277l-2.96-4.625c-.49-.765.356-1.647 1.123-1.448z" />
                </svg>
              </button>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}