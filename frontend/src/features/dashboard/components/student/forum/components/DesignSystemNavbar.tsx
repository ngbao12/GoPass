import React from 'react';

export function DesignSystemNavbar() {
  return (
    <nav className="bg-white border-b border-[var(--gopass-border)] shadow-sm">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--gopass-primary)] rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2L3 7V13C3 16.31 6.69 19 10 19C13.31 19 17 16.31 17 13V7L10 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 12L7 9.5L8 8.5L10 10.5L13 7.5L14 8.5L10 12Z" fill="var(--gopass-primary)"/>
                </svg>
              </div>
              <span className="text-[var(--gopass-text)]">GoPass</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex items-center gap-8">
            <a 
              href="#" 
              className="text-[var(--gopass-text)] hover:text-[var(--gopass-primary)] transition-colors px-4 py-2"
            >
              Trang chủ
            </a>
            <a 
              href="#" 
              className="text-[var(--gopass-text)] hover:text-[var(--gopass-primary)] transition-colors px-4 py-2"
            >
              Luyện tập
            </a>
            <a 
              href="#" 
              className="text-[var(--gopass-text)] hover:text-[var(--gopass-primary)] transition-colors px-4 py-2"
            >
              Đề thi
            </a>
            <a 
              href="#" 
              className="text-[var(--gopass-primary)] px-4 py-2 bg-[var(--gopass-primary)]/10 rounded-lg transition-colors"
            >
              Diễn đàn
            </a>
            <a 
              href="#" 
              className="text-[var(--gopass-text)] hover:text-[var(--gopass-primary)] transition-colors px-4 py-2"
            >
              Kết quả
            </a>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-[var(--gopass-text)] hover:text-[var(--gopass-primary)] transition-colors">
              Đăng nhập
            </button>
            <button className="px-6 py-2 bg-[var(--gopass-primary)] text-white rounded-lg hover:bg-[var(--gopass-primary-hover)] transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}