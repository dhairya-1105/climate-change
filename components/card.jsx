"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Card({ card, onSuggestedQuestionClick }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 80) return '#7FB069';
    if (rating >= 60) return '#9BC53D';
    if (rating >= 40) return '#FFA500';
    return '#FF6B6B';
  };

  const truncateText = (text, maxLength = 200) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const parseCitations = (citations) => {
    if (!citations) return [];
    return citations.map((c) => {
      if (typeof c === "object" && c.label && c.url) return { label: c.label, url: c.url };
      const match = typeof c === "string" && c.match(/^\[(.*)\]\((.*)\)$/);
      if (match) return { label: match[1], url: match[2] };
      return { label: c?.toString() || "Source", url: "#" };
    });
  };

  const parseRecommendations = (recs) => {
    if (!recs) return [];
    return recs.map((rec) => {
      if (typeof rec === "object" && rec.label) return { label: rec.label };
      if (typeof rec === "object" && rec.text) return { label: rec.text };
      if (typeof rec === "string") return { label: rec };
      return { label: "Recommendation" };
    });
  };

  let mainText = card.text || card.final_response || "";
  if (!mainText && Array.isArray(card.sub_answers) && card.sub_answers.length > 0)
    mainText = card.sub_answers.join("\n\n---\n\n");

  const createdAt = card.createdAt || card.date || card.timestamp || "";
  const citations = parseCitations(card.citations);
  const recommendations = parseRecommendations(card.recommendations);
  const questions = card.suggestedQuestions || card.suggested_questions || [];
  const productName = card.productName;

  return (
    <div
      className="w-full rounded-xl shadow-lg border p-6 mb-4 transition-all duration-200 hover:shadow-xl"
      style={{
        backgroundColor: '#384D48',
        borderColor: '#4A5D57',
        width: "100%",
        minWidth: 0,
        maxWidth: "100%"
      }}
    >
      {/* Header with Rating and Date and Product Name */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-lg"
            style={{
              backgroundColor: getRatingColor(card.rating),
              color: '#1A2B24'
            }}
          >
            {typeof card.rating !== "undefined" && card.rating !== null ? card.rating : "N/A"}
          </div>
          <div>
            <div className="text-sm font-medium" style={{ color: '#D0D0D0' }}>
              Analysis Score
            </div>
            <div className="text-xs" style={{ color: '#B0B0B0' }}>
              {formatDate(createdAt)}
            </div>
            {productName && (
              <div className="text-xs" style={{ color: '#9BC53D', fontWeight: 600, marginTop: 2 }}>
                Product: {productName}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Text */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3" style={{ color: '#F5F5F5' }}>
          Analysis
        </h3>
        <div
          className="leading-relaxed"
          style={{ color: '#E8E8E8' }}
        >
          {isExpanded ? (
            <ReactMarkdown>{mainText}</ReactMarkdown>
          ) : (
            <ReactMarkdown>{truncateText(mainText)}</ReactMarkdown>
          )}
          {mainText && mainText.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 text-sm font-medium hover:underline transition-colors duration-200"
              style={{ color: '#9BC53D' }}
            >
              {isExpanded ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>
      </div>

      {/* Citations */}
      {citations && citations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-base font-semibold mb-3" style={{ color: '#F5F5F5' }}>
            Sources & Citations
          </h4>
          <div className="grid gap-2">
            {citations.map((citation, index) => (
              <div
                key={index}
                className="flex items-center p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] group"
                style={{
                  backgroundColor: '#4A5D57',
                  borderColor: '#6B7A73',
                  width: "100%",
                  wordBreak: "break-all"
                }}
              >
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium group-hover:underline"
                    style={{ color: '#F5F5F5' }}
                  >
                    {citation.label}
                  </div>
                  <div
                    className="text-sm mt-1 truncate"
                    style={{ color: '#B0B0B0' }}
                  >
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#B0B0B0', textDecoration: "none", wordBreak: "break-all" }}
                    >
                      {citation.url}
                    </a>
                  </div>
                </div>
                <div
                  className="ml-3 text-xs px-2 py-1 rounded rotate-[-90deg]"
                  style={{
                    backgroundColor: '#7FB069',
                    color: '#1A2B24',
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    fontWeight: 600
                  }}
                >
                  Source
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-base font-semibold mb-3" style={{ color: '#F5F5F5' }}>
            Recommendations
          </h4>
          <div className="grid gap-2">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-center p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] group"
                style={{
                  backgroundColor: '#4A5D57',
                  borderColor: '#6B7A73',
                  width: "100%"
                }}
              >
                <div className="flex-1">
                  <div
                    className="font-medium group-hover:underline"
                    style={{ color: '#F5F5F5' }}
                  >
                    {rec.label}
                  </div>
                </div>
                <div
                  className="ml-3 text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: '#9BC53D',
                    color: '#1A2B24'
                  }}
                >
                  Recommendation
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Questions */}
      {questions && questions.length > 0 && (
        <div>
          <h4 className="text-base font-semibold mb-3" style={{ color: '#F5F5F5' }}>
            Suggested Questions
          </h4>
          <div className="space-y-2">
            {(showAllQuestions ? questions : questions.slice(0, 3)).map((question, index) => (
              <button
                key={index}
                className="w-full text-left p-3 rounded-lg border transition-all duration-200 hover:scale-[1.01] group"
                style={{
                  backgroundColor: '#4A5D57',
                  borderColor: '#6B7A73',
                  cursor: "pointer"
                }}
                onClick={() => {
                  if (typeof onSuggestedQuestionClick === "function") {
                    onSuggestedQuestionClick(question);
                  }
                }}
              >
                <div
                  className="font-medium group-hover:underline"
                  style={{ color: '#F5F5F5' }}
                >
                  {question}
                </div>
              </button>
            ))}
            {questions.length > 3 && (
              <button
                onClick={() => setShowAllQuestions(!showAllQuestions)}
                className="w-full text-center py-2 text-sm font-medium hover:underline transition-colors duration-200"
                style={{ color: '#9BC53D' }}
              >
                {showAllQuestions ? 'Show Less' : `Show ${questions.length - 3} More Questions`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}