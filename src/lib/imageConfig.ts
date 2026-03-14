/**
 * Learning method images.
 * Override any image via environment variables for dynamic updates
 * without a code deployment.
 */
export const LEARNING_METHOD_IMAGES = {
  storyBased:
    process.env.NEXT_PUBLIC_IMG_STORY || '/images/story-based-coding.png',
  ageBased:
    process.env.NEXT_PUBLIC_IMG_AGE || '/images/aged-based-coding.png',
  cardBased:
    process.env.NEXT_PUBLIC_IMG_CARD || '/images/card-based-coading.png',
  gameBased:
    process.env.NEXT_PUBLIC_IMG_GAME || '/images/game-based-coding.png',
  puzzleBased:
    process.env.NEXT_PUBLIC_IMG_PUZZLE || '/images/puzzle-based-coding.png',
} as const
