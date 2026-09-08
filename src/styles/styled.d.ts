import "styled-components";
import type { ThemeType } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}

import "styled-components/native";
declare module "styled-components/native" {
  export interface DefaultTheme extends ThemeType {}
}
