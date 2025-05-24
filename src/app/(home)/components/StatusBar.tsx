import React from "react";

export default function StatusBar() {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
      <span className="text-lg font-bold">2:42</span>
      <div className="flex items-center gap-1.5">
        <div className="text-black">
          {/* 커스텀 모바일 신호 아이콘 (iOS 스타일) */}
          <svg
            width="18"
            height="12"
            viewBox="0 0 18 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0" y="7" width="3" height="5" rx="0.5" fill="black" />
            <rect x="5" y="5" width="3" height="7" rx="0.5" fill="black" />
            <rect x="10" y="3" width="3" height="9" rx="0.5" fill="black" />
            <rect x="15" y="1" width="3" height="11" rx="0.5" fill="black" />
          </svg>
        </div>
        <div className="text-black">
          {/* 커스텀 와이파이 아이콘 (iOS 스타일) */}
          <svg
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 9.5C8.55228 9.5 9 9.94772 9 10.5C9 11.0523 8.55228 11.5 8 11.5C7.44772 11.5 7 11.0523 7 10.5C7 9.94772 7.44772 9.5 8 9.5Z"
              fill="black"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.20404 6.28645C3.92105 5.56888 4.90041 5 8.00478 5C11.1092 5 12.0786 5.56888 12.7956 6.28645C13.0799 6.57162 13.0799 7.02899 12.7956 7.31416C12.5114 7.59932 12.0553 7.59932 11.7711 7.31416C11.2738 6.81666 10.6422 6.5 8.00478 6.5C5.3674 6.5 4.73578 6.81666 4.23848 7.31416C3.95426 7.59932 3.49826 7.59932 3.21404 7.31416C2.92983 7.02899 2.92983 6.57162 3.20404 6.28645Z"
              fill="black"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.913799 4.00192C2.50221 2.37888 4.69391 1.5 8 1.5C11.3061 1.5 13.4978 2.37888 15.0862 4.00192C15.3713 4.28654 15.3713 4.74453 15.0862 5.02916C14.8011 5.31379 14.344 5.31379 14.0589 5.02916C12.7022 3.64587 10.8939 3 8 3C5.10608 3 3.29779 3.64587 1.94108 5.02916C1.65598 5.31379 1.19891 5.31379 0.913799 5.02916C0.628693 4.74453 0.628693 4.28654 0.913799 4.00192Z"
              fill="black"
            />
          </svg>
        </div>
        <div className="text-black">
          {/* 커스텀 배터리 아이콘 (iOS 스타일) */}
          <svg
            width="24"
            height="12"
            viewBox="0 0 24 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="20"
              height="11"
              rx="2.5"
              stroke="black"
            />
            <rect x="2" y="2" width="17" height="8" rx="1.5" fill="black" />
            <path
              d="M23 4V8C23.8284 8 24.5 7.32843 24.5 6.5V5.5C24.5 4.67157 23.8284 4 23 4Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
