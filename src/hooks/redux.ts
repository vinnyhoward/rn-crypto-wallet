import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { GeneralStatus } from "../store/types";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useLoadingState = () => {
  const ethLoading = useSelector(
    (state: RootState) => state.wallet.ethereum.status === GeneralStatus.Loading
  );
  const solLoading = useSelector(
    (state: RootState) => state.wallet.solana.status === GeneralStatus.Loading
  );

  return ethLoading || solLoading;
};
