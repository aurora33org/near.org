"use client";

import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { AlertCircle, AlertTriangle, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@cms/components/ui/button";

const CALLOUT_TYPES = [
  { value: "info", label: "Info", icon: AlertCircle, color: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800" },
  { value: "warning", label: "Warning", icon: AlertTriangle, color: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800" },
  { value: "success", label: "Success", icon: CheckCircle, color: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" },
  { value: "error", label: "Error", icon: XCircle, color: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800" },
];

export function CalloutView({
  node,
  updateAttributes,
  deleteNode,
}: any) {
  const calloutType = node.attrs.type || "info";
  const typeConfig = CALLOUT_TYPES.find((t) => t.value === calloutType) || CALLOUT_TYPES[0];
  const Icon = typeConfig.icon;

  return (
    <NodeViewWrapper>
      <div className={`rounded-lg border-2 ${typeConfig.color} p-4 mb-2`}>
        {/* Type selector toolbar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Icon size={18} className="flex-shrink-0" />
            <div className="flex gap-1 flex-wrap">
              {CALLOUT_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => updateAttributes({ type: t.value })}
                  className={`px-2 py-1 text-xs font-medium rounded transition ${
                    calloutType === t.value
                      ? "bg-current/20 text-current"
                      : "hover:bg-current/10 text-muted-foreground"
                  }`}
                  title={t.label}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={deleteNode}
            className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
          >
            <Trash2 size={14} />
          </Button>
        </div>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none">
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
