import React, { useEffect, useState } from "react";

// Frame provides the shared phone-container and screen. Children render inside screen-frame
export default function Frame({ children, footer = null }) {
  const [stage, setStage] = useState("enter");

  useEffect(() => {
    setStage("exit");
    const t = setTimeout(() => setStage("enter"), 20);
    return () => clearTimeout(t);
  }, [children]);

  return (
    <div className="phone-container">
      <div className="screen">
        <div className={`screen-frame ${stage}`}>{children}</div>
      </div>
      {footer}
    </div>
  );
}
