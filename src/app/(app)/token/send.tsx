import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { useDispatch } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { ThemeType } from "../../../styles/theme";
import type { AppDispatch } from "../../../store";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.dark};
  justify-content: flex-end;
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.large};
`;

export default function SendPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useLocalSearchParams();
  const theme = useTheme();

  return (
    <SafeAreaContainer>
      <ContentContainer></ContentContainer>
    </SafeAreaContainer>
  );
}
