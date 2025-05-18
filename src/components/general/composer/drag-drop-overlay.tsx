import { ReactNode } from "react";
import { Paperclip } from "lucide-react";

interface DragDropOverlayProps {
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
}

const DragDropOverlay = ({
  icon = (
    <Paperclip
      style={{ width: 56, height: 56, color: "#fff", opacity: 0.95 }}
    />
  ),
  title = "Drag and drop anywhere on the screen",
  subtitle = "Accepts images and PDFs",
}: DragDropOverlayProps) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.7)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      flexDirection: "column",
    }}
  >
    {icon}
    <div
      style={{
        fontWeight: 700,
        fontSize: "1.6rem",
        textAlign: "center",
        color: "#fff",
        marginTop: 16,
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontSize: "1rem",
        color: "#eee",
        textAlign: "center",
        marginTop: 8,
      }}
    >
      {subtitle}
    </div>
  </div>
);

export default DragDropOverlay;
