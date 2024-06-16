import { FC } from "react";
import { Dimensions, View } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { ThemeType } from "../../styles/theme";

const CryptoInfoCardContainer = styled(MotiView)<{
  theme: ThemeType;
  hideBackground: boolean;
}>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme, hideBackground }) =>
    hideBackground ? "transparent" : theme.colors.lightDark};
  border-radius: ${(props) => props.theme.borderRadius.large};
  height: 75px;
  padding: ${(props) => props.theme.spacing.medium};
  padding-left: 20px;
  padding-right: 27.5px;
  width: 100%;
  opacity: 0.95;
`;

const Spacer = ({ width = 16 }) => <View style={{ width }} />;

const width = Dimensions.get("window").width * 0.6;
const CryptoInfoCardSkeleton: FC<{ hideBackground?: boolean }> = ({
  hideBackground,
}) => {
  const theme = useTheme();
  return (
    <CryptoInfoCardContainer
      transition={{
        type: "timing",
      }}
      hideBackground={hideBackground}
    >
      <Skeleton
        colors={[
          theme.colors.grey,
          theme.colors.dark,
          theme.colors.dark,
          theme.colors.grey,
        ]}
        radius="round"
        height={35}
        width={35}
      />
      <Spacer />
      <Skeleton
        height={35}
        colors={[
          theme.colors.grey,
          theme.colors.dark,
          theme.colors.dark,
          theme.colors.grey,
        ]}
        width={width}
      />
      <Spacer />
      <Skeleton
        height={35}
        colors={[
          theme.colors.grey,
          theme.colors.dark,
          theme.colors.dark,
          theme.colors.grey,
        ]}
        width={35}
      />
    </CryptoInfoCardContainer>
  );
};

export default CryptoInfoCardSkeleton;
