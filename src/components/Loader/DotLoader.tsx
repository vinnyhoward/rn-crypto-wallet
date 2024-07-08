import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, ViewProps } from "react-native";
import styled from "styled-components/native";

interface LoaderProps extends ViewProps {
  size?: number;
  color?: string;
  dotCount?: number;
  duration?: number;
}

const Container = styled.View<{ size: number }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: ${(props) => props.size}px;
`;

const Dot = styled(Animated.View)<{ size: number; color: string }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
  background-color: ${(props) => props.color};
`;

const PulseDotLoader: React.FC<LoaderProps> = ({
  size = 50,
  color = "#007AFF",
  dotCount = 3,
  duration = 500,
  ...props
}) => {
  const animations = useRef(
    Array(dotCount)
      .fill(0)
      .map(() => new Animated.Value(0))
  );

  useEffect(() => {
    const animationSequence = animations.current.map((anim, index) =>
      Animated.sequence([
        Animated.delay(index * (duration / dotCount)),
        Animated.timing(anim, {
          toValue: 1,
          duration: duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    Animated.loop(Animated.parallel(animationSequence)).start();
  }, [dotCount, duration]);

  const dotSize = size / (dotCount * 2);

  return (
    <Container size={size} {...props}>
      {animations.current.map((anim, index) => (
        <Dot
          key={index}
          size={dotSize}
          color={color}
          style={{
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.5],
                }),
              },
            ],
            opacity: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          }}
        />
      ))}
    </Container>
  );
};

export default PulseDotLoader;
