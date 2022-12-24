import create from "zustand/vanilla";
import createReact from "zustand";

export type BlastComponent = {
  elementType: string;
  props: Record<string, any>;
  children: BlastComponent[];
};

export type BlastStore = {
  tree: BlastComponent | null;
  setTree: (tree: BlastComponent) => void;
};

export const remoteBlastTree = create<BlastStore>()((set) => ({
  tree: null,
  setTree: (tree: BlastComponent) => set({ tree }),
}));

export const useRemoteBlastTree = createReact(remoteBlastTree);
