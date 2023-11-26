type IconName =
  | 'play'
  | 'stop'
  | 'remove'

type IconProps = {
  name: IconName
  fill?: string
  color?: string
  size?: string
  stroke?: string
  strokeWidth?: string
  transform?: string
  width?: string
  height?: string
  onClick?(): void
}

export const Icon = ({width, height, fill, stroke, strokeWidth, transform, ...rest}: IconProps) => (
  <svg
    className="icon"
    width="width"
    height="height"
    {...rest}
  >
    <use
      xlinkHref={`#${name}`}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      transform={transform}
    />
  </svg>
)
