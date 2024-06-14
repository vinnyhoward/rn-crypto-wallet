import React, { useEffect } from "react";
import { router } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { ThemeType } from "../../styles/theme";
import SettingsIcon from "../../assets/svg/settings.svg";
import QRCodeIcon from "../../assets/svg/qr-code.svg";
import DownArrowIcon from "../../assets/svg/down-arrow.svg";
import { ROUTES } from "../../constants/routes";

interface ThemeComponent {
  theme: ThemeType;
}

const Container = styled.View<ThemeComponent>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: ${(props) => props.theme.spacing.medium};
  padding-right: ${(props) => props.theme.spacing.medium};
  margin-top: 60px;
`;

const LeftContainer = styled.View<ThemeComponent>``;

const CenterContainer = styled.TouchableOpacity<ThemeComponent>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const RightContainer = styled.View<ThemeComponent>``;

const HeaderText = styled.Text<ThemeComponent>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.colors.white};
`;

const IconTouchContainer = styled.TouchableOpacity`
  padding: 10px;
`;

const Header: React.FC<{
  navigation: any;
  options: any;
  route: any;
}> = ({ navigation, options, route }) => {
  const theme = useTheme();
  const activeAccountName = useSelector(
    (state: RootState) => state.wallet.activeAccountName
  );

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: activeAccountName,
  //   });
  //   console.log(navigation);
  // }, [activeAccountName]);

  return (
    <Container>
      <LeftContainer>
        <IconTouchContainer onPress={() => router.push(ROUTES.settings)}>
          <SettingsIcon width={25} height={25} fill={theme.colors.primary} />
        </IconTouchContainer>
      </LeftContainer>
      <CenterContainer onPress={() => router.push(ROUTES.accounts)}>
        <HeaderText>{activeAccountName}</HeaderText>
        <DownArrowIcon width={30} height={30} fill={theme.colors.white} />
      </CenterContainer>
      <RightContainer>
        <IconTouchContainer onPress={() => router.push(ROUTES.camera)}>
          <QRCodeIcon width={25} height={25} fill={theme.colors.primary} />
        </IconTouchContainer>
      </RightContainer>
    </Container>
  );
};

export default Header;
