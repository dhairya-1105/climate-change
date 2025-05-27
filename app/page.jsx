"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Card from "@/components/card";

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

const NAVBAR_HEIGHT = 72; // px

export default function MainPage() {
  // THEME COLORS
  const mainBg = "#1A2420";
  const cardBg = "#384D48";
  const cardAlt = "#4A5D57";
  const textMain = "#F5F5F5";
  const textSub = "#D0D0D0";

  // Side panel state
  const [sideOpen, setSideOpen] = useState(false);
  const [sideWidth, setSideWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const [sideCollapsed, setSideCollapsed] = useState(true);

  // Main message state
  const [input, setInput] = useState("");
  const [mainLoading, setMainLoading] = useState(false);
  const [mainCard, setMainCard] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [msgBoxLifted, setMsgBoxLifted] = useState(false);
  const [quoteFading, setQuoteFading] = useState(false);
  const [contentSlideUp, setContentSlideUp] = useState(false);
  const [cardAppear, setCardAppear] = useState(false);

  // Side message state
  const [sideInput, setSideInput] = useState("");
  const [sideLoading, setSideLoading] = useState(false);
  const [sideMessages, setSideMessages] = useState([]);

  // User & cards
  const [userEmail, setUserEmail] = useState(null);
  const [username, setUsername] = useState("");
  const [userCards, setUserCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(true);

  const location = useUserLocation();

  // Fetch user auth info and cards
  useEffect(() => {
    async function fetchUserAndCards() {
      setCardsLoading(true);
      try {
        const authRes = await fetch("/api/auth", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!authRes.ok) { setUserEmail(null); setUserCards([]); setCardsLoading(false); return; }
        const authData = await authRes.json();
        if (!authData.isLoggedIn) { setUserEmail(null); setUserCards([]); setCardsLoading(false); return; }
        setUserEmail(authData.user.email);
        setUsername(authData.user.name || authData.user.email);

        const cardsRes = await fetch(`/api/cards?email=${encodeURIComponent(authData.user.email)}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (cardsRes.ok) {
          const cardsData = await cardsRes.json();
          setUserCards(Array.isArray(cardsData) ? cardsData.filter(Boolean) : []);
        } else {
          setUserCards([]);
        }
      } catch {
        setUserEmail(null); setUserCards([]);
      }
      setCardsLoading(false);
    }
    fetchUserAndCards();
  }, []);

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
  useEffect(() => {
    setSideOpen(false);
    setSideCollapsed(true);
  }, []);

  // Animation CSS (use only the transitions you had, plus slide-up and card appear)
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
        .slide-up-content {
          opacity: 1;
          transform: translateY(90px);
          transition: transform 0.7s cubic-bezier(.23,1.07,.37,1.01), opacity 0.7s cubic-bezier(.23,1.07,.37,1.01);
        }
        .slide-up-content.slide {
          opacity: 1;
          transform: translateY(0px);
        }
        .main-card-appear-below {
          animation: fadeinCardBelow 0.55s cubic-bezier(.23,1.07,.37,1.01);
        }
        @keyframes fadeinCardMain {
          from { opacity: 0; transform: translateY(32px);}
          to   { opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeinCardBelow {
          from { opacity: 0; transform: translateY(56px);}
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

  // Slide up content block after sending a message
  useEffect(() => {
    if (showCard) {
      setTimeout(() => setContentSlideUp(true), 80);
      setTimeout(() => setCardAppear(true), 400);
    } else {
      setContentSlideUp(false);
      setCardAppear(false);
    }
  }, [showCard]);

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
    setContentSlideUp(false);
    setCardAppear(false);

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

        // If data contains a new card, save it to DB and update recent
        if (
          data &&
          data.card &&
          typeof data.card === "object" &&
          userEmail
        ) {
          // Save card to DB
          await fetch("/api/createCard.js", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...data.card,
              email: userEmail,
            }),
          });
          // Add new card to top of recent cards state
          setUserCards((prev) => [data.card, ...prev].slice(0, 3));
        }

        setMainCard(data.card || data); // If card field, use it, else fallback
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

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        background: mainBg,
      }}
    >
      {/* Main Content */}
      <main
        style={{
          width: `calc(100vw - ${(sideOpen && !sideCollapsed) ? sideWidth : 0}px)`,
          transition: "width 0.2s ease",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          minWidth: 0,
          position: "relative",
          boxSizing: "border-box",
          background: mainBg,
          paddingTop: `${NAVBAR_HEIGHT + 16}px`,
        }}
      >
        {/* Quote Heading */}
        <div
          className={quoteFading ? "quote-fade-out" : "quote-fade-in"}
          style={{
            fontSize: "2.4rem",
            fontWeight: 700,
            color: textMain,
            marginBottom: 48,
            marginTop: 10,
            letterSpacing: "0.01em",
            textAlign: "center",
            zIndex: 2,
            width: "100%",
            userSelect: "none",
          }}
        >
          Beyond the Surface : The Real Cost
        </div>

        {/* All content below quote block */}
        <div
          className={`slide-up-content${contentSlideUp ? " slide" : ""}`}
          style={{
            width: "100%",
            maxWidth: 540,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: 1,
          }}
        >
          {/* Input bar with send button */}
          <form
            className={msgBoxLifted ? "msgbox-lift" : "msgbox-rest"}
            style={{
              width: "100%",
              maxWidth: 500,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              background: cardBg,
              borderRadius: 8,
              boxShadow: "0 1px 8px 0 #1a237e16",
              padding: "0.5rem 1.2rem",
              zIndex: 6,
              color: textMain,
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
                color: textMain,
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
              <svg height={22} width={22} viewBox="0 0 20 20" fill={input.trim() ? "#9BC53D" : "#b0b8c1"}>
                <path d="M2.01 10.384l14.093-6.246c.822-.364 1.621.435 1.257 1.257l-6.247 14.093c-.367.829-1.553.834-1.926.008l-2.068-4.683a.65.65 0 0 1 .276-.827l6.624-3.883-7.222 2.937a.65.65 0 0 1-.8"/>
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
              ) : mainCard && typeof mainCard === "object" && mainCard !== null && mainCard.hasOwnProperty("rating") ? (
                <Card card={mainCard} />
              ) : mainCard && mainCard.error ? (
                <div style={{ color: "#ff6666", background: cardBg, borderRadius: 8, padding: "1.2rem", textAlign: "center" }}>{mainCard.error}</div>
              ) : null}
            </div>
          )}

          {/* Recent cards section */}
          <div style={{
            width: "100%",
            maxWidth: 540,
            marginTop: 36,
          }}>
            <h2 style={{
              color: textMain,
              fontSize: 22,
              fontWeight: 600,
              marginBottom: 16,
              letterSpacing: "0.01em",
            }}>
              Your Recent Analyses
            </h2>
            {cardsLoading ? (
              <div style={{
                background: cardBg,
                color: textSub,
                borderRadius: 10,
                padding: "2rem",
                textAlign: "center"
              }}>
                Loading...
              </div>
            ) : (userCards && userCards.length > 0 ? (
              userCards.slice(0, 3).map((card, idx) => (
                card && typeof card === "object" && card.hasOwnProperty("rating") ? (
                  <div
                    key={card._id || idx}
                    className={cardAppear && idx === 0 ? "main-card-appear-below" : ""}
                    style={{
                      marginBottom: 24,
                      background: cardBg,
                      borderRadius: 14,
                      boxShadow: "0 1px 8px 0 #1a237e16",
                      overflow: "hidden",
                    }}
                  >
                    <Card card={card} />
                  </div>
                ) : null
              ))
            ) : (
              <div style={{
                background: cardBg,
                color: textSub,
                borderRadius: 10,
                padding: "2rem",
                textAlign: "center"
              }}>
                No recent analyses found.
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Slide Button (expand/collapse) */}
      <button
        style={{
          position: "fixed",
          top: "50%",
          right: sideCollapsed ? 14 : sideWidth + 14,
          transform: "translateY(-50%)",
          zIndex: 35,
          background: mainBg,
          border: "1.5px solid #384D48",
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
            stroke="#9BC53D"
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
          background: cardBg,
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
          borderLeft: `1px solid ${cardAlt}`,
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
              background: sideCollapsed ? "transparent" : "#4A5D57",
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
              color: "#9BC53D",
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
                borderBottom: `1px solid ${cardAlt}`,
                background: cardBg,
                color: textMain,
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
                color: textMain,
                background: cardAlt,
              }}
            >
              <p style={{ margin: 0, color: textSub }}>
                Welcome to the General Talk section! You can use this space to chat, ask questions, or discuss anything related to climate change.
              </p>
              <div style={{ marginTop: 18 }}>
                {sideMessages.map((msg, idx) => (
                  <div key={idx} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        color: "#9BC53D",
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
                          color: textMain,
                          background: cardBg,
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
                          color: textSub,
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
                background: cardAlt,
                padding: "1rem 1.2rem",
                borderTop: `1px solid ${cardAlt}`,
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
                  background: cardBg,
                  borderRadius: 6,
                  fontSize: 16,
                  padding: "0.6rem 1rem",
                  flex: 1,
                  outline: "none",
                  boxShadow: "0 0.5px 7px 0 rgba(60,64,67,0.07)",
                  color: textMain,
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
                <svg height={22} width={22} viewBox="0 0 20 20" fill={sideInput.trim() ? "#9BC53D" : "#b0b8c1"}>
                  <path d="M2.01 10.384l14.093-6.246c.822-.364 1.621.435 1.257 1.257l-6.247 14.093c-.367.829-1.553.834-1.926.008l-2.068-4.683a.65.65 0 0 1 .276-.827l6.624-3.883-7.222 2.937a.65.65 0 0 1-.8"/>
                </svg>
              </button>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}