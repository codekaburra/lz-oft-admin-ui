import { FC, PropsWithChildren } from "react";

interface CardProps {
  title?: string;
  subTitle?: string;
}

export const Card: FC<PropsWithChildren<CardProps>> = ({ title, subTitle, children }) => {
  return (
    <div className="max-w mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="rounded-xl bg-white p-4 shadow sm:p-7 dark:bg-neutral-900">
        <div className="mb-8 text-center">
          <h4 className="text-lg font-bold text-gray-800 md:text-xl dark:text-neutral-200">
            {title}
            <p className="text-sm text-gray-600 dark:text-neutral-400">{subTitle}</p>
          </h4>
        </div>
        {children}
      </div>
    </div>
  );
};
