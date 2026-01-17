import { create } from "zustand";
import type { NodeInfo } from "../types/nodes";

type NodeState = {
    nodes: NodeInfo[];
    loading: boolean;

    setNodes: (nodes: NodeInfo[]) => void;
    setLoading: (v: boolean) => void;

    selectedNode: NodeInfo | null;
    setSelectedNode: (n: NodeInfo | null) => void;
};

export const useNodeStore = create<NodeState>((set) => ({
    nodes: [],
    loading: false,

    setNodes: (nodes) => set({ nodes }),
    setLoading: (loading) => set({ loading }),

    selectedNode: null,
    setSelectedNode: (selectedNode) => set({ selectedNode }),
}));