// Use a tuple type [string, string] to satisfy expo-linear-gradient
export const COMMUNITY_GRADIENTS: Record<string, [string, string]> = {
  "Violet": ['#7B6EF6', '#4FD1C5'],
  "Sunset": ['#FF6B6B', '#FF8E53'],
  "Ocean": ['#0891B2', '#0D9488'],
  "Rose": ['#DB2777', '#E11D48'],
  "Amber": ['#D97706', '#EA580C'],
  "Dream": ['#9333EA', '#E879F9'],
};

export const getGradient = (name: string): [string, string] => {
  return COMMUNITY_GRADIENTS[name] || COMMUNITY_GRADIENTS["Violet"];
};