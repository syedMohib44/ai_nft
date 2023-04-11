export const typeOfTokens = ['zakat', 'matic', 'eth'] as const;
export type typeOfToken = typeof typeOfTokens[number];