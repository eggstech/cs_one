import { LucideProps } from "lucide-react";

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      {...props}
    >
      <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm-48,80H112a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Zm-28,48a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h36A8,8,0,0,1,132,160Z" />
    </svg>
  ),
  facebook: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  zalo: (props: LucideProps) => (
     <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M4.75 5.23a1.53 1.53 0 0 1 .02-1.95 1.48 1.48 0 0 1 2-.04L12 8.5l5.23-5.26a1.48 1.48 0 0 1 2 .04 1.53 1.53 0 0 1 .02 1.95l-5.25 5.27L19.25 16a1.53 1.53 0 0 1-.02 1.95 1.48 1.48 0 0 1-2 .04L12 12.72l-5.23 5.27a1.48 1.48 0 0 1-2-.04 1.53 1.53 0 0 1-.02-1.95l5.25-5.27L4.75 5.23z"/>
    </svg>
  ),
};
