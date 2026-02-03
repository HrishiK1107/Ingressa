import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function LandingLayout({ children }: Props) {
  return (
    <div className="min-h-screen w-full bg-bg text-fg">
      <div className="page-pad">{children}</div>
    </div>
  );
}
