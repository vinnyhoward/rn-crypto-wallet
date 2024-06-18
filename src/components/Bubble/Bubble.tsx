import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
// import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { ThemeType } from "../../styles/theme";

interface BubbleContainerProps {
  smallBubble?: boolean;
  theme: ThemeType;
}

const BubbleContainer = styled.View<BubbleContainerProps>`
  background-color: ${({ theme }) => theme.colors.dark};
  padding: ${({ theme, smallBubble }) =>
    smallBubble ? "0px" : theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.extraLarge};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.grey};
  margin: 5px;
  height: ${({ smallBubble }) => (smallBubble ? "40px" : "60px")};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: ${({ smallBubble }) => (smallBubble ? "100px" : "150px")};
`;

const BubbleText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

const BubbleNumber = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

const Line = styled.Text`
  background-color: ${({ theme }) => theme.colors.grey};
  height: 50%;
  width: 2px;
`;

interface BubbleProps {
  word: string;
  number: number;
  smallBubble?: boolean;
  hideDetails?: boolean;
  onPress?: () => void;
}

const Bubble = ({
  word,
  number,
  smallBubble = false,
  hideDetails = false,
  onPress,
}: BubbleProps) => {
  const num = number.toString();
  return (
    <TouchableOpacity onPress={onPress}>
      <BubbleContainer smallBubble={smallBubble}>
        {!hideDetails ? <BubbleNumber>{num}</BubbleNumber> : null}
        {!hideDetails ? <Line></Line> : null}
        <BubbleText>{word}</BubbleText>
      </BubbleContainer>
    </TouchableOpacity>
  );
};

export default Bubble;
