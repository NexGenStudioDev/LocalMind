import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const PageLayout: React.FC<Props> = ({ title, subtitle, children }) => {
  return (
    <div className="pt-24 px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {subtitle && (
          <p className="text-zinc-400 mt-2">{subtitle}</p>
        )}
      </div>

      {children}
    </div>
  );
};

export default PageLayout;
