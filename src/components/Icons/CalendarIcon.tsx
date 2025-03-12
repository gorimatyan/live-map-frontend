import React from "react";

type Props = React.SVGProps<SVGSVGElement>;

export const CalendarIcon = (props: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
      {...props}
    >
      <path d="M6 2a1 1 0 0 1 2 0v1h8V2a1 1 0 1 1 2 0v1h3a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3V2zM3 8v11h18V8H3zm2-3v1a1 1 0 1 1-2 0V5h2zm16 0h-2v1a1 1 0 1 0 2 0V5zM7 12h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" />
    </svg>
  );
};