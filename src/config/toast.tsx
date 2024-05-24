import { BaseToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ backgroundColor: "#8878F4" }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 14,
        color: "white",
      }}
      text2Style={{
        color: "white",
      }}
    />
  ),
};
