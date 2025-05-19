import { cn } from "@/lib/utils";

const Icons = {
  logo: ({ className }: { className?: string }) => (
    <svg
      width="187"
      height="187"
      viewBox="0 0 187 187"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
    >
      <path
        d="M98.625 0.375L102.625 1.125L105.319 1.94531C107.349 2.56313 109.298 3.42057 111.125 4.5L111.823 4.89648C114.434 6.37826 116.881 8.13067 119.125 10.125L121.75 12.625L124.375 15.875L127 20L129 24.125L131.25 30L133.5 34.875L136.125 39.125L139.75 43.5L142.75 46.625L147.125 50.125L149.458 51.5771C151.647 52.9394 153.964 54.0855 156.375 55L162.25 57.25C164.912 58.4146 167.471 59.8014 169.9 61.3955L170.25 61.625L171.458 62.6494C174.479 65.2109 177.255 68.0484 179.75 71.125L179.819 71.2344C181.52 73.9071 183.002 76.7131 184.25 79.625L185.75 84.875L185.988 86.1602C186.246 87.5502 186.375 88.9613 186.375 90.375V95.625C186.125 98.3712 185.672 101.095 185.019 103.774L184.75 104.875L183.125 109.125L181.125 112.75C179.045 115.746 176.745 118.583 174.245 121.239L174 121.5L172.099 123.056C170.618 124.267 169.047 125.363 167.399 126.335C165.802 127.277 164.137 128.099 162.418 128.795L159.75 129.875L154.875 131.75L149.875 134.25L145.625 137.125L142.5 139.75L139.375 142.875L137.25 145.5L135.625 147.875L133.875 150.375L132.25 153.5L131.25 156L128.125 163.875L126.301 167.172C125.352 168.887 124.26 170.52 123.035 172.051C121.93 173.432 120.721 174.726 119.419 175.923L116.75 178.375L115.057 179.547C112.941 181.011 110.679 182.253 108.307 183.249C106.522 183.999 104.681 184.607 102.801 185.069L102.45 185.156C99.4926 185.884 96.4638 186.284 93.4189 186.352L92.375 186.375H90.375L87.625 186L84.125 185.375L80.75 184.375L76.625 182.625L76.335 182.455C73.1158 180.571 70.0377 178.455 67.125 176.125C64.7967 173.88 62.682 171.423 60.8086 168.786L60.25 168L57.875 163.5L55.875 158.375L55.1025 156.676C53.5364 153.23 51.7051 149.912 49.625 146.75L46 142.375C43.0877 139.546 39.9603 136.947 36.6455 134.603L36.5 134.5L34.9971 133.677C32.5023 132.311 29.9133 131.124 27.25 130.125L22.25 128.125C19.6722 126.878 17.2147 125.395 14.9092 123.696L13.625 122.75C11.2137 120.671 9.00328 118.37 7.02344 115.877L6.625 115.375L3.875 110.75L2 106.5L1.74023 105.68C0.833217 102.819 0.249215 99.8656 0 96.875V90.375C0.249512 87.5472 0.748131 84.7469 1.49023 82.0068L2 80.125L2.80762 78.1328C3.51778 76.3811 4.37709 74.6932 5.375 73.0879C6.29049 71.6152 7.31974 70.2159 8.4541 68.9043L10.75 66.25L11.3857 65.6875C13.8741 63.4835 16.5469 61.4968 19.375 59.75L24.75 57L30.625 54.75C33.9525 53.1694 37.1423 51.3127 40.1602 49.2002L40.625 48.875L44.25 45.875L47.125 42.75L50.25 38.625L52.875 34.5L54.5 31L56.625 26.375C57.4565 23.7973 58.5282 21.3035 59.8252 18.9258L60.125 18.375L63.75 13.375C66.0786 10.8801 68.6286 8.60148 71.3682 6.56641L71.625 6.375C74.3694 4.71175 77.259 3.30061 80.2578 2.1582L81 1.875L85.25 0.75C87.7439 0.251223 90.2809 3.01444e-06 92.8242 0H94.875L98.625 0.375ZM93 73C81.9543 73 73 81.9543 73 93C73 104.046 81.9543 113 93 113C104.046 113 113 104.046 113 93C113 81.9543 104.046 73 93 73Z"
        fill="url(#paint0_linear_6_11)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_6_11"
          x1="180.75"
          y1="9.12503"
          x2="38.5"
          y2="150"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0A0A0A" />
          <stop offset="0.224652" stopColor="#2979FF" />
          <stop offset="0.403948" stopColor="#7782D4" />
          <stop offset="0.516045" stopColor="#B37DC9" />
          <stop offset="0.641213" stopColor="#EE769E" />
          <stop offset="0.758205" stopColor="#FF7C87" />
          <stop offset="0.86052" stopColor="#E88072" />
          <stop offset="0.981424" stopColor="#FF6D00" />
        </linearGradient>
      </defs>
    </svg>
  ),
  google: ({ className }: { className?: string }) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn("size-4", className)}
    >
      <g>
        <path
          d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.48a4.7 4.7 0 01-2.04 3.08v2.56h3.3c1.93-1.78 3.06-4.4 3.06-7.43z"
          fill="#4285F4"
        />
        <path
          d="M10 20c2.7 0 4.97-.89 6.63-2.41l-3.3-2.56c-.92.62-2.1.99-3.33.99-2.56 0-4.73-1.73-5.5-4.07H1.09v2.6A10 10 0 0010 20z"
          fill="#34A853"
        />
        <path
          d="M4.5 12.95A5.99 5.99 0 013.67 10c0-.99.18-1.95.5-2.95V4.45H1.09A10 10 0 000 10c0 1.64.39 3.19 1.09 4.55l3.41-2.6z"
          fill="#FBBC05"
        />
        <path
          d="M10 3.96c1.47 0 2.78.51 3.81 1.51l2.85-2.85C14.97 1.12 12.7 0 10 0A10 10 0 001.09 4.45l3.41 2.6C5.27 5.69 7.44 3.96 10 3.96z"
          fill="#EA4335"
        />
      </g>
    </svg>
  ),
  chatGpt: ({ className }: { className?: string }) => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-4", className)}
    >
      <g>
        <circle cx="16" cy="16" r="16" fill="#10A37F" />
        <path
          d="M16 8.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm0 13.5a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"
          fill="#fff"
        />
        <path
          d="M16 11.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 7.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
          fill="#fff"
        />
      </g>
    </svg>
  ),
  meta: ({ className }: { className?: string }) => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-4", className)}
    >
      <g>
        <circle cx="16" cy="16" r="16" fill="#F5C26B" />
        <path
          d="M10 22c0-4 2-8 6-8s6 4 6 8"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <ellipse cx="16" cy="18" rx="2" ry="1" fill="#fff" />
        <circle cx="14" cy="15" r="1" fill="#fff" />
        <circle cx="18" cy="15" r="1" fill="#fff" />
      </g>
    </svg>
  ),
  claude: ({ className }: { className?: string }) => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-4", className)}
    >
      <g>
        <circle cx="16" cy="16" r="16" fill="#FFB300" />
        <rect x="10" y="10" width="12" height="12" rx="6" fill="#fff" />
        <rect x="14" y="14" width="4" height="4" rx="2" fill="#FFB300" />
      </g>
    </svg>
  ),
  gemini: () => (
    <svg
      width="52"
      height="60"
      viewBox="0 0 52 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_dddd_1_4143)">
        <path
          d="M5 22C5 10.402 14.402 1 26 1C37.598 1 47 10.402 47 22C47 33.598 37.598 43 26 43C14.402 43 5 33.598 5 22Z"
          fill="white"
        />
        <g clipPath="url(#clip0_1_4143)">
          <path
            d="M26 34C25.5426 30.9809 24.131 28.1874 21.9718 26.0282C19.8126 23.869 17.0191 22.4574 14 22C17.0191 21.5426 19.8126 20.131 21.9718 17.9718C24.131 15.8126 25.5426 13.0191 26 10C26.4575 13.0191 27.8692 15.8125 30.0283 17.9717C32.1875 20.1308 34.9809 21.5425 38 22C34.9809 22.4575 32.1875 23.8692 30.0283 26.0283C27.8692 28.1875 26.4575 30.9809 26 34Z"
            fill="url(#paint0_linear_1_4143)"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_dddd_1_4143"
          x="0"
          y="0"
          width="52"
          height="60"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1_4143"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="1.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_1_4143"
            result="effect2_dropShadow_1_4143"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="7" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_dropShadow_1_4143"
            result="effect3_dropShadow_1_4143"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="12" />
          <feGaussianBlur stdDeviation="2.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"
          />
          <feBlend
            mode="normal"
            in2="effect3_dropShadow_1_4143"
            result="effect4_dropShadow_1_4143"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect4_dropShadow_1_4143"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1_4143"
          x1="13.9999"
          y1="2410"
          x2="1663.52"
          y2="739.48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1C7DFF" />
          <stop offset="0.52021" stopColor="#1C69FF" />
          <stop offset="1" stopColor="#F0DCD6" />
        </linearGradient>
        <clipPath id="clip0_1_4143">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(14 10)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
};

export default Icons;
