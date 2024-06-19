import { useState } from "react";
import { SafeAreaView } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import { useSelector, useDispatch } from "react-redux";
import { authenticate, isAuthEnrolled } from "../../../store/biometricsSlice";
import type { AppDispatch, RootState } from "../../../store";
import Button from "../../../components/Button/Button";
import { ROUTES } from "../../../constants/routes";
import { ThemeType } from "../../../styles/theme";
import { ErrorContainer } from "../../../components/Styles/Errors.styles";

const SafeAreaContainer = styled(SafeAreaView)<{ theme: ThemeType }>`
  flex: 1;
  justify-content: flex-end;
  background-color: ${(props) => props.theme.colors.primary};
`;

const ContentContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.View<{ theme: ThemeType }>`
  padding: ${(props) => props.theme.spacing.large};
`;

const Title = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: 32px;
  color: ${(props) => props.theme.fonts.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

const Subtitle = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openRegular};
  font-size: ${(props) => props.theme.fonts.sizes.large};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

const ButtonContainer = styled.View<{ theme: ThemeType }>`
  padding-left: ${(props) => props.theme.spacing.large};
  padding-right: ${(props) => props.theme.spacing.large};
  padding-bottom: ${(props) => props.theme.spacing.large};
  padding-top: ${(props) => props.theme.spacing.small};
`;

const ExpoImage = styled(Image)`
  flex: 1;
  width: 100%;
`;

const ImageContainer = styled.View<{ theme: ThemeType }>`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const SecondaryButtonContainer = styled.TouchableOpacity`
  padding: 10px 20px;
  border-radius: 5px;
  align-items: center;
  height: 60px;
  justify-content: center;
  width: 100%;
  border-radius: ${(props) => props.theme.borderRadius.large};
`;

const SecondaryButtonText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.header};
  color: ${(props) => props.theme.fonts.colors.primary};
`;

const ErrorView = styled.View<{ theme: ThemeType }>`
  height: 85px;
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

export const ErrorText = styled.Text<{ theme: ThemeType }>`
  font-family: ${(props) => props.theme.fonts.families.openBold};
  font-size: ${(props) => props.theme.fonts.sizes.normal};
  color: ${(props) => props.theme.colors.white};
`;

export default function Biometrics() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { chain } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [checkedEnrollment, setCheckEnrollment] = useState(false);

  const isEnrolled = useSelector(
    (state: RootState) => state.biometrics.isEnrolled
  );

  useFocusEffect(() => {
    setLoading(false);
  });

  const handleEnrollAuthentication = async () => {
    dispatch(authenticate());
    setCheckEnrollment(true);
  };

  return (
    <SafeAreaContainer>
      <ContentContainer>
        <ImageContainer>
          <ExpoImage
            source={require("../../../assets/images/biometrics.png")}
            contentFit="cover"
          />
        </ImageContainer>

        <TextContainer>
          <Title>FaceID Permission</Title>
          <Subtitle>
            For enhanced security, enable FaceID to ensure that only you can
            access your wallet and authenticate transactions quickly and safely.
          </Subtitle>
        </TextContainer>
      </ContentContainer>
      <ButtonContainer>
        {checkedEnrollment && (
          <ErrorView>
            <ErrorContainer>
              <ErrorText>
                You don't have biometrics on your device or it is not enabled
              </ErrorText>
            </ErrorContainer>
          </ErrorView>
        )}
        <Button
          loading={loading}
          onPress={handleEnrollAuthentication}
          title="Allow FaceID"
        />
        <SecondaryButtonContainer
          onPress={() =>
            router.push({
              pathname: ROUTES.walletCreatedSuccessfully,
              params: { successState: "IMPORTED_WALLET" },
            })
          }
        >
          <SecondaryButtonText>Skip for now</SecondaryButtonText>
        </SecondaryButtonContainer>
      </ButtonContainer>
    </SafeAreaContainer>
  );
}
