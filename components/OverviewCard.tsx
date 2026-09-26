import React from 'react';
import { StatCard, StatCardProps } from './ui/StatCard';

export const OverviewCard: React.FC<StatCardProps> = (props) => {
  return <StatCard {...props} />;
};
