import { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import styled, { useTheme } from "styled-components/native";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import Button from "../../../components/Button/Button";
import { identifyAddress } from "../../../utils/identifyAddress";
import { ThemeType } from "../../../styles/theme";
import QRCodeCamera from "../../../assets/svg/qr-code-camera.svg";
import CloseIcon from "../../../assets/svg/close.svg";

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

const CameraContainer = styled(CameraView)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const CloseIconContainer = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  left: 20px;
  padding: 10px;
`;

export default function Camera() {
  const theme = useTheme();
  const { chain } = useLocalSearchParams();
  const chainName = chain as string;
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useFocusEffect(() => {
    setLoading(false);
  });

  if (!permission) {
    return <View></View>;
  }

  const onBarcodeScanned = (data: BarcodeScanningResult) => {
    setLoading(true);
    if (!data) {
      return;
    }
    if (data.data !== "") {
      const routeName = !chainName ? identifyAddress(data.data) : chainName;
      return router.push({
        pathname: `token/send/${routeName}`,
        params: {
          toAddress: data.data,
        },
      });
    }
  };

  if (permission.status === "denied") {
    return (
      <SafeAreaContainer>
        <ContentContainer>
          <ImageContainer>
            <ExpoImage
              source={require("../../../assets/images/camera.png")}
              contentFit="cover"
            />
          </ImageContainer>

          <TextContainer>
            <Title>Camera Access Denied</Title>
            <Subtitle>
              To enable camera access, go to your device settings and allow
              camera access to scan QR codes for easy token transactions.
            </Subtitle>
          </TextContainer>
        </ContentContainer>
        <ButtonContainer>
          <Button
            loading={loading}
            onPress={!loading && requestPermission}
            title="Try Again"
          />
        </ButtonContainer>
      </SafeAreaContainer>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaContainer>
        <ContentContainer>
          <ImageContainer>
            <ExpoImage
              source={require("../../../assets/images/camera.png")}
              contentFit="cover"
            />
          </ImageContainer>

          <TextContainer>
            <Title>Allow Camera Access</Title>
            <Subtitle>
              Allow camera access to quickly scan QR codes for easy token
              transactions.
            </Subtitle>
          </TextContainer>
        </ContentContainer>
        <ButtonContainer>
          <Button
            loading={loading}
            onPress={requestPermission}
            title="Enable Camera"
          />
          <SecondaryButtonContainer onPress={() => router.back()}>
            <SecondaryButtonText>Go Back</SecondaryButtonText>
          </SecondaryButtonContainer>
        </ButtonContainer>
      </SafeAreaContainer>
    );
  }

  return (
    <CameraContainer
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
      onBarcodeScanned={(data: BarcodeScanningResult) =>
        loading ? onBarcodeScanned(null) : onBarcodeScanned(data)
      }
    >
      <CloseIconContainer onPress={() => router.back()}>
        <CloseIcon width={30} height={30} fill={theme.colors.white} />
      </CloseIconContainer>
      <QRCodeCamera width={250} height={250} fill={theme.colors.white} />
    </CameraContainer>
  );
}
