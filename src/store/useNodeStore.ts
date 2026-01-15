import { create } from "zustand";
import type { NodeInfo } from "../types/nodes";

type NodeState = {
    nodes: NodeInfo[];
    selectedNode: NodeInfo | null;

    setNodes: (nodes: NodeInfo[]) => void;
    setSelectedNode: (node: NodeInfo | null) => void;
};

export const useNodeStore = create<NodeState>((set) => ({
    nodes: [],
    selectedNode: null,

    setNodes: (nodes) => set({ nodes }),
    setSelectedNode: (node) => set({ selectedNode: node }),
}));