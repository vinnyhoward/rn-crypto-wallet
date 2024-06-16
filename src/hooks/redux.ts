import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useLoadingState = () => {
  const ethLoading = useSelector(
    (state: RootState) => state.wallet.ethereum.status === "loading"
  );
  const solLoading = useSelector(
    (state: RootState) => state.wallet.solana.status === "loading"
  );

  return ethLoading || solLoading;
};
