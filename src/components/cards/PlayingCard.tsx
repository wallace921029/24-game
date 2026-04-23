import { CardBack } from './CardBack'
import { CardFront } from './CardFront'
import type { PlayingCardProps } from './card.types'

export function PlayingCard({
  suit,
  rank,
  face,
  size = 'md',
  backVariant = 'geometric',
  className,
  style,
}: PlayingCardProps) {
  if (face === 'back') {
    return (
      <CardBack 
        size={size} 
        variant={backVariant} 
        className={[className, 'game-card-shadow'].join(' ')} 
        style={style} 
      />
    )
  }
  return (
    <CardFront 
      suit={suit} 
      rank={rank} 
      size={size} 
      className={[className, 'game-card-shadow'].join(' ')} 
      style={style} 
    />
  )
}
