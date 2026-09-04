interface IconProps {
  size?: number
  className?: string
}

function TrashIcon({ size = 30, className }: IconProps) {
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
        d="M19 33C18.45 33 17.9792 32.8042 17.5875 32.4125C17.1958 32.0208 17 31.55 17 31V18H16V16H21V15H27V16H32V18H31V31C31 31.55 30.8042 32.0208 30.4125 32.4125C30.0208 32.8042 29.55 33 29 33H19ZM29 18H19V31H29V18ZM21 29H23V20H21V29ZM25 29H27V20H25V29Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default TrashIcon