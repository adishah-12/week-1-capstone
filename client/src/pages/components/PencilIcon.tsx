interface IconProps {
  size?: number
  className?: string
}

function PencilIcon({ size = 30, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M17 31H18.425L28.2 21.225L26.775 19.8L17 29.575V31ZM15 33V28.75L28.2 15.575C28.4 15.3917 28.6208 15.25 28.8625 15.15C29.1042 15.05 29.3583 15 29.625 15C29.8917 15 30.15 15.05 30.4 15.15C30.65 15.25 30.8667 15.4 31.05 15.6L32.425 17C32.625 17.1833 32.7708 17.4 32.8625 17.65C32.9542 17.9 33 18.15 33 18.4C33 18.6667 32.9542 18.9208 32.8625 19.1625C32.7708 19.4042 32.625 19.625 32.425 19.825L19.25 33H15ZM27.475 20.525L26.775 19.8L28.2 21.225L27.475 20.525Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default PencilIcon