// src/layouts/Loader.jsx
import React from "react";
import { useColorMode } from "@chakra-ui/react";

export default function Loader({
  message = "Đang tải dữ liệu",
  subMessage = "Vui lòng chờ trong giây lát",
  variant = "page",
  statCount = 4,
  rowCount = 6,
  showTable = true,
}) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <div
      className={`loader loader--${variant} ${isDark ? "is-dark" : "is-light"}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* ── HEADER: SPINNER & TEXT ── */}
      <div className="loader__header">
        <div className="loader__spinner" aria-hidden="true">
          <svg viewBox="0 0 50 50" width="28" height="28">
            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="3" className="loader__spinner-track" />
            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="3" strokeLinecap="round" className="loader__spinner-arc" />
          </svg>
        </div>
        <div className="loader__text">
          <span className="loader__text-main">{message}</span>
          {subMessage && <span className="loader__text-sub">{subMessage}</span>}
        </div>
      </div>

      {/* ── SKELETON ── */}
      <div className="loader__skeleton">
        {/* Stats */}
        <div className="loader__stats">
          {Array.from({ length: statCount }).map((_, i) => (
            <div key={i} className="sk-stat" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="sk-stat__icon sk-block" />
              <div className="sk-stat__lines">
                <div className="sk-line sk-line--sm" />
                <div className="sk-line sk-line--lg" />
              </div>
            </div>
          ))}
        </div>

        {/* List */}
        {showTable && (
          <div className="loader__list">
            {Array.from({ length: rowCount }).map((_, i) => (
              <div key={i} className="sk-row" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="sk-row__avatar sk-block" />
                <div className="sk-row__lines">
                  <div className="sk-line sk-line--md" />
                  <div className="sk-line sk-line--sm" />
                </div>
                <div className="sk-row__badge sk-block" />
                <div className="sk-row__btns">
                  <div className="sk-row__btn sk-block" />
                  <div className="sk-row__btn sk-row__btn--icon sk-block" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          STYLES
          ═══════════════════════════════════════════════════════════ */}
      <style>{`
        /* ═══════════════════════════════════════════════════════════
           THEME TOKENS (Đồng bộ với UI Gấu Phim)
           ═══════════════════════════════════════════════════════════ */
        .loader {
          --accent:           #f97316; 
          --accent-glow:      rgba(249, 115, 22, 0.15);
          --accent-soft:      rgba(249, 115, 22, 0.1);
          
          --bg-card:          #ffffff;
          --bg-skeleton:      #f1f5f9;
          --bg-skeleton-hl:   #e2e8f0;
          --border:           #e2e8f0;
          
          --text-main:        #0f172a;
          --text-sub:         #64748b;
          --shadow:           0 1px 2px rgba(0, 0, 0, 0.02);

          /* FIX LỖI BỊ CHE: Thêm padding-top lớn để đẩy nội dung xuống thấp */
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start; /* Đổi từ center sang flex-start */
          padding-top: 80px; /* Khoảng trống an toàn với Header */
          padding-bottom: 40px;
          padding-left: 24px;
          padding-right: 24px;
          gap: 32px;
          position: relative;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: transparent;
        }

        /* Dark mode */
        .loader.is-dark {
          --accent:           #fb923c;
          --accent-glow:      rgba(251, 146, 60, 0.2);
          --accent-soft:      rgba(251, 146, 60, 0.08);
          
          --bg-card:          rgba(30, 41, 59, 0.3); /* Card hơi trong suốt tạo chiều sâu */
          --bg-skeleton:      #1e293b;
          --bg-skeleton-hl:   #334155;
          --border:           rgba(51, 65, 85, 0.5); /* Viền mờ */
          
          --text-main:        #f8fafc;
          --text-sub:         #94a3b8;
          --shadow:           0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .loader--section { min-height: 400px; padding-top: 40px; }
        .loader--inline  { min-height: auto; padding: 24px; gap: 24px; justify-content: center;}

        /* ═══════════════════════════════════════════════════════════
           HEADER (Spinner + Text)
           ═══════════════════════════════════════════════════════════ */
        .loader__header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
          margin-top: 20px; /* Đẩy nhẹ xuống cho cân đối */
        }

        .loader__spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: var(--bg-card);
          border-radius: 50%;
          box-shadow: 0 0 20px var(--accent-glow), var(--shadow); /* Thêm hiệu ứng phát sáng */
          border: 1px solid var(--border);
        }

        .loader__spinner-track {
          stroke: var(--bg-skeleton-hl);
        }

        .loader__spinner-arc {
          stroke: var(--accent);
          stroke-dasharray: 90, 150;
          stroke-dashoffset: 0;
          transform-origin: center;
          animation: spinnerSpin 1.2s linear infinite,
                     spinnerDash 1.6s ease-in-out infinite;
        }

        @keyframes spinnerSpin {
          100% { transform: rotate(360deg); }
        }

        @keyframes spinnerDash {
          0%   { stroke-dasharray: 1, 150;  stroke-dashoffset: 0; }
          50%  { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
          100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
        }

        .loader__text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .loader__text-main {
          color: var(--text-main);
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .loader__text-sub {
          color: var(--text-sub);
          font-size: 13px;
        }

        /* ═══════════════════════════════════════════════════════════
           SKELETON
           ═══════════════════════════════════════════════════════════ */
        .loader__skeleton {
          width: 100%;
          max-width: 1100px; 
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sk-block, .sk-line {
          background: var(--bg-skeleton);
          position: relative;
          overflow: hidden;
          animation: skeletonPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.5; background-color: var(--bg-skeleton); }
          50%      { opacity: 1; background-color: var(--bg-skeleton-hl); }
        }

        .sk-block { border-radius: 8px; }
        .sk-line { height: 10px; border-radius: 4px; }

        /* ── Stats ── */
        .loader__stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .sk-stat {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: var(--shadow);
          opacity: 0;
          animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .sk-stat__icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
        }

        .sk-stat__lines {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sk-line--sm { width: 40%; }
        .sk-line--lg { width: 75%; height: 14px; }

        /* ── List rows ── */
        .loader__list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sk-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: var(--shadow);
          opacity: 0;
          animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .sk-row__avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .sk-row__lines {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sk-line--md { width: 45%; height: 12px; }

        .sk-row__badge {
          width: 80px;
          height: 26px;
          border-radius: 999px;
          flex-shrink: 0;
        }

        .sk-row__btns {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .sk-row__btn {
          width: 64px;
          height: 32px;
          border-radius: 8px;
        }

        .sk-row__btn--icon { width: 32px; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ═══════════════════════════════════════════════════════════
           RESPONSIVE
           ═══════════════════════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .loader__stats { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .loader { padding-top: 40px; padding-bottom: 32px; }
          .sk-row { padding: 12px 16px; }
          .sk-row__badge { display: none; }
          .sk-row__btn { width: 48px; height: 28px; }
          .sk-row__btn--icon { width: 28px; }
        }

        @media (max-width: 480px) {
          .loader__stats { grid-template-columns: 1fr; }
          .sk-stat { padding: 16px; }
        }

        /* ═══════════════════════════════════════════════════════════
           ACCESSIBILITY
           ═══════════════════════════════════════════════════════════ */
        @media (prefers-reduced-motion: reduce) {
          .loader__spinner-arc,
          .sk-block, .sk-line,
          .sk-stat, .sk-row {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            background-color: var(--bg-skeleton-hl) !important;
          }
        }
      `}</style>
    </div>
  );
}