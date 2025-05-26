"use client";
import React, { useState, useRef, useEffect } from "react";

// SVG for send icon (simple paper plane)
const SendIcon = ({ size = 22, color = "#1976D2" }) => (
  <svg
    height={size}
    width={size}
    viewBox="0 0 20 20"
    fill={color}
    style={{ display: "block" }}
  >
    <path d="M2.01 10.384l14.093-6.246c.822-.364 1.621.435 1.257 1.257l-6.247 14.093c-.367.829-1.553.834-1.926.008l-2.068-4.683a.65.65 0 0 1 .276-.827l6.624-3.883-7.222 2.937a.65.65 0 0 1-.827-.277l-2.068-4.683c-.366-.826.182-1.742 1.184-1.74z" />
  </svg>
);

// SVG for chevron icon that points right or left
const ChevronIcon = ({ right = false, size = 26, color = "#555" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    style={{ display: "block", transition: "transform 0.2s" }}
  >
    <path
      d="M7 4l5 6-5 6"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: right ? "rotate(0deg)" : "rotate(180deg)",
        transformOrigin: "50% 50%",
        transition: "transform 0.2s",
      }}
    />
  </svg>
);

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    position: "relative",
    background: "#f6f8fa",
  },
  main: (sideOpen, sideCollapsed, sideWidth) => ({
    // Now, main width is computed based on right section width
    width: `calc(100vw - ${sideOpen && !sideCollapsed ? sideWidth : 0}px)`,
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
  }),
  side: (open, width, collapsed) => ({
    position: "fixed",
    top: 0,
    right: 0,
    height: "100vh",
    width: width,
    minWidth: 320,
    maxWidth: 600,
    background: "#fff",
    boxShadow: open
      ? "rgba(60,64,67,0.12) 0px 1.5px 12px 0px"
      : "none",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    zIndex: 30,
    transform: collapsed
      ? `translateX(${width - 40}px)`
      : "translateX(0)",
    opacity: open || collapsed ? 1 : 0,
    pointerEvents: open || collapsed ? "all" : "none",
    transition:
      "transform 0.24s ease, width 0.2s ease, opacity 0.15s",
    borderLeft: "1px solid #ececec",
  }),
  resizer: (collapsed) => ({
    width: 6,
    cursor: collapsed ? "default" : "ew-resize",
    background: collapsed ? "transparent" : "rgba(0,0,0,0.08)",
    position: "absolute",
    left: -3,
    top: 0,
    bottom: 0,
    zIndex: 31,
  }),
  heading: (show, disappeared) => ({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0px)" : "translateY(-18px)",
    transition: "all 0.6s cubic-bezier(.7,1.7,.3,.7)",
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
    ...(disappeared ? { display: "none" } : {}),
  }),
  inputBar: {
    marginTop: 48,
    width: "100%",
    maxWidth: 500,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 0.5px 7px 0 rgba(60,64,67,0.08)",
    padding: "0.5rem 1.2rem",
  },
  input: {
    border: "none",
    width: "100%",
    height: 42,
    fontSize: 18,
    outline: "none",
    background: "transparent",
    color: "#222",
  },
  sendBtn: {
    background: "none",
    border: "none",
    padding: "0 0 0 10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  generalTalkTitle: {
    padding: "1.2rem 1.5rem 1rem 1.5rem",
    fontWeight: 600,
    fontSize: 19,
    borderBottom: "1px solid #ececec",
    background: "#fafbfc",
  },
  generalTalkContent: {
    flex: 1,
    overflowY: "auto",
    padding: "1.2rem",
  },
  closeBtn: {
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
  },
  sideInputBar: {
    width: "100%",
    background: "#f6f8fa",
    padding: "1rem 1.2rem",
    borderTop: "1px solid #ececec",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  sideInput: {
    border: "none",
    background: "#fff",
    borderRadius: 6,
    fontSize: 16,
    padding: "0.6rem 1rem",
    flex: 1,
    outline: "none",
    boxShadow: "0 0.5px 7px 0 rgba(60,64,67,0.07)",
    color: "#222",
  },
  // Expand/collapse button: rectangular, always visible right of the panel, vertically centered
  slideBtn: (collapsed, width) => ({
    position: "fixed",
    top: "50%",
    right: collapsed ? 14 : width + 14,
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
    transition:
      "right 0.24s ease, box-shadow 0.2s",
    padding: 0,
    opacity: 1,
  }),
};

export default function MainPage() {
  // State for the side panel
  const [sideOpen, setSideOpen] = useState(true);
  const [sideWidth, setSideWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const [sideCollapsed, setSideCollapsed] = useState(false);

  // For heading disappearance and input
  const [input, setInput] = useState("");
  const [headingShow, setHeadingShow] = useState(true);
  const [headingDisappeared, setHeadingDisappeared] = useState(false);

  // For side query input
  const [sideQuery, setSideQuery] = useState("");

  const sideRef = useRef();

  // Handle disappearance of heading
  useEffect(() => {
    if (input && headingShow) {
      setHeadingShow(false);
      setTimeout(() => setHeadingDisappeared(true), 600);
    }
  }, [input, headingShow]);

  // Handle panel resizing
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

  // Enable keyboard shortcut (Ctrl+G) to toggle collapse
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "q") {
        setSideCollapsed((c) => !c);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Stubs for send actions (replace with actual logic)
  const handleSendMain = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setInput("");
  };

  const handleSendSide = (e) => {
    e.preventDefault();
    if (!sideQuery.trim()) return;
    setSideQuery("");
  };

  // Collapsing: slide panel to right but keep it in DOM,
  // show expand button outside panel, chevron icon right when expanded, left when collapsed.
  const handleCollapse = () => setSideCollapsed(true);
  const handleExpand = () => setSideCollapsed(false);

  return (
    <div style={styles.container}>
      {/* Main Content */}
      <main style={styles.main(sideOpen, sideCollapsed, sideWidth)}>
        <div style={{ position: "absolute", top: 22, right: 32 }} />
        {/* Smoothly disappearing heading */}
        <div style={styles.heading(headingShow, headingDisappeared)}>
          Beyond the Surface : The Real Cost
        </div>
        {/* Input bar with send button */}
        <form
          style={styles.inputBar}
          onSubmit={handleSendMain}
          autoComplete="off"
        >
          <input
            style={styles.input}
            type="text"
            placeholder="Start your query..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => {
              if (!input && headingShow) setHeadingShow(false);
            }}
          />
          <button
            style={styles.sendBtn}
            type="submit"
            aria-label="Send"
            disabled={!input.trim()}
            tabIndex={0}
          >
            <SendIcon color={input.trim() ? "#1976D2" : "#b0b8c1"} />
          </button>
        </form>
      </main>

      {/* Slide Button (expand/collapse) */}
      <button
        style={styles.slideBtn(sideCollapsed, sideWidth)}
        onClick={sideCollapsed ? handleExpand : handleCollapse}
        aria-label={sideCollapsed ? "Show General Talk" : "Hide General Talk"}
        title={sideCollapsed ? "Show General Talk" : "Hide General Talk"}
      >
        {/* Chevron points right when collapsed (to expand), left when open (to collapse) */}
        <ChevronIcon right={!sideCollapsed} />
      </button>

      {/* Side Section: General Talk */}
      <aside
        ref={sideRef}
        style={styles.side(sideOpen || sideCollapsed, sideWidth, sideCollapsed)}
        tabIndex={sideOpen ? 0 : -1}
        aria-hidden={!sideOpen}
      >
        {/* Drag Resizer, disabled when collapsed */}
        {!sideCollapsed && (
          <div
            style={styles.resizer(sideCollapsed)}
            onMouseDown={() => !sideCollapsed && setIsResizing(true)}
            title="Resize"
          />
        )}
        {!sideCollapsed && (
          <button
            style={styles.closeBtn}
            onClick={handleCollapse}
            aria-label="Collapse"
            title="Collapse"
          >
            ×
          </button>
        )}
        {!sideCollapsed && (
          <>
            <div style={styles.generalTalkTitle}>General Talk</div>
            <div style={styles.generalTalkContent}>
              <p>
                Welcome to the General Talk section! You can use this space to chat, ask questions, or discuss anything related to climate change.
              </p>
            </div>
            {/* Side panel query input and send button */}
            <form
              style={styles.sideInputBar}
              onSubmit={handleSendSide}
              autoComplete="off"
            >
              <input
                style={styles.sideInput}
                type="text"
                placeholder="Type a message..."
                value={sideQuery}
                onChange={(e) => setSideQuery(e.target.value)}
              />
              <button
                style={styles.sendBtn}
                type="submit"
                aria-label="Send"
                disabled={!sideQuery.trim()}
                tabIndex={0}
              >
                <SendIcon color={sideQuery.trim() ? "#1976D2" : "#b0b8c1"} />
              </button>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}