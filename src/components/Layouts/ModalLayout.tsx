import { router } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { ThemeType } from "../../styles/theme";
import CloseIcon from "../../assets/svg/close.svg";


const ModalView = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-start;
  padding: ${(props) => props.theme.spacing.large};
`;

const TopBar = styled.View<{ theme: ThemeType }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.lightDark};
`;

const IconTouch = styled.TouchableHighlight`
  padding: 20px;
`;

const ModalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();

  return (
    <ModalView>
      <TopBar>
        <IconTouch onPress={() => router.back()}>
          <CloseIcon width={25} height={25} fill={theme.colors.white} />
        </IconTouch>
      {children}
    </ModalView>
  );
};

export default ModalLayout;
