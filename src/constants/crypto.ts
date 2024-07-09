import { PixelRatio, Platform } from "react-native";

function getDevicePerformanceScore(): number {
  const pixelRatio = PixelRatio.get();
  const isIOS = Platform.OS === "ios";

  let score = pixelRatio * 1000;
  if (isIOS) score *= 1.2;

  return Math.floor(score);
}

function determineIterations(): number {
  const performanceScore = getDevicePerformanceScore();

  if (performanceScore > 50000) return 10000;
  if (performanceScore > 30000) return 7500;
  if (performanceScore > 20000) return 5000;
  return 2500;
}

export const PBKDF2_ITERATIONS = determineIterations();
