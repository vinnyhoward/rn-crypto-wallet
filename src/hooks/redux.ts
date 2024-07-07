import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { GeneralStatus } from "../store/types";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useLoadingState = () => {
  const activeEthIndex = useSelector(
    (state: RootState) => state.ethereum.activeIndex
  );
  const activeSolIndex = useSelector(
    (state: RootState) => state.solana.activeIndex
  );

  const ethLoading = useSelector((state: RootState) =>
    state.ethereum.addresses.length !== 0
      ? state.ethereum.addresses[activeEthIndex].status ===
        GeneralStatus.Loading
      : false
  );
  const solLoading = useSelector((state: RootState) =>
    state.solana.addresses.length !== 0
      ? state.solana.addresses[activeSolIndex].status === GeneralStatus.Loading
      : false
  );

  return ethLoading || solLoading;
};
