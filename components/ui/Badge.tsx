
import React from 'react';
import { Severity } from '../../types';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  severity: Severity;
}

const severityStyles: { [key in Severity]: string } = {
  [Severity.Critical]: 'bg-red-900 border-red-700 text-red-200',
  [Severity.High]: 'bg-orange-900 border-orange-700 text-orange-200',
  [Severity.Medium]: 'bg-yellow-900 border-yellow-700 text-yellow-200',
  [Severity.Low]: 'bg-blue-900 border-blue-700 text-blue-200',
  [Severity.Informational]: 'bg-gray-700 border-gray-500 text-gray-300',
};

export const Badge: React.FC<BadgeProps> = ({ severity, className, ...props }) => {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${severityStyles[severity]} ${className}`}
      {...props}
    >
      {severity}
    </div>
  );
};
