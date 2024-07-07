import React, { useEffect, useRef } from "react";
import { Animated, Easing, ViewProps } from "react-native";
import Svg, { Path } from "react-native-svg";
import styled from "styled-components/native";

interface SpinnerProps extends ViewProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  duration?: number;
}

const Container = styled.View<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const CleanArcSpinner: React.FC<SpinnerProps> = ({
  size = 40,
  color = "#007AFF",
  strokeWidth = 4,
  duration = 1000,
  ...props
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue, duration]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const arc = circumference * 0.75;

  return (
    <Container size={size} {...props}>
      <AnimatedSvg
        width={size}
        height={size}
        style={{ transform: [{ rotate: spin }] }}
      >
        <Path
          d={`
            M ${size / 2}, ${strokeWidth / 2}
            A ${radius}, ${radius} 0 1 1 ${size / 2 - 0.1}, ${strokeWidth / 2}
          `}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
        />
      </AnimatedSvg>
    </Container>
  );
};

export default CleanArcSpinner;
