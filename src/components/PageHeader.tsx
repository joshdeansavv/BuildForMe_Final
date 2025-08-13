import React from "react";

interface PageHeaderProps {
  title: string;
  highlight?: string;
  subtitle?: string;
  centered?: boolean;
  containerClassName?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  highlight,
  subtitle,
  centered = true,
  containerClassName,
}) => {
  return (
    <section className="relative pt-10 sm:pt-14 lg:pt-18 xl:pt-20 pb-10 sm:pb-14 lg:pb-18 xl:pb-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className={`max-w-6xl mx-auto ${centered ? "text-center" : ""} ${containerClassName || ""}`}>
          <div className="space-y-3 lg:space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
              {title}
              {highlight ? (
                <span className="block gradient-text-animated">{highlight}</span>
              ) : null}
            </h1>
            {subtitle ? (
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto text-wrap-balance">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHeader;


