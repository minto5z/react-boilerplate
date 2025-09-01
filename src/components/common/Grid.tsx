import React from 'react';
import { cn } from '../../utils/helpers';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    '2xl'?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  };
  autoFit?: boolean;
  minItemWidth?: string;
}

const colsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

const gapMap = {
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

export function Grid({
  children,
  cols = 1,
  gap = 'md',
  responsive,
  autoFit = false,
  minItemWidth,
  className,
  ...props
}: GridProps) {
  const getResponsiveClasses = () => {
    const classes = [colsMap[cols]];
    
    if (responsive) {
      if (responsive.sm) classes.push(`sm:grid-cols-${responsive.sm}`);
      if (responsive.md) classes.push(`md:grid-cols-${responsive.md}`);
      if (responsive.lg) classes.push(`lg:grid-cols-${responsive.lg}`);
      if (responsive.xl) classes.push(`xl:grid-cols-${responsive.xl}`);
      if (responsive['2xl']) classes.push(`2xl:grid-cols-${responsive['2xl']}`);
    }
    
    return classes.join(' ');
  };

  const gridStyle = autoFit && minItemWidth 
    ? { 
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
        gap: gap === 'xs' ? '0.5rem' : gap === 'sm' ? '1rem' : gap === 'md' ? '1.5rem' : gap === 'lg' ? '2rem' : '3rem'
      }
    : undefined;

  return (
    <div
      className={cn(
        'grid',
        !autoFit && getResponsiveClasses(),
        !autoFit && gapMap[gap],
        className
      )}
      style={gridStyle}
      {...props}
    >
      {children}
    </div>
  );
}

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  responsive?: {
    sm?: { colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12; rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 };
    md?: { colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12; rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 };
    lg?: { colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12; rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 };
    xl?: { colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12; rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 };
  };
}

const colSpanMap = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  12: 'col-span-12',
};

const rowSpanMap = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
  4: 'row-span-4',
  5: 'row-span-5',
  6: 'row-span-6',
};

export function GridItem({
  children,
  colSpan,
  rowSpan,
  responsive,
  className,
  ...props
}: GridItemProps) {
  const getResponsiveClasses = () => {
    const classes = [];
    
    if (colSpan) classes.push(colSpanMap[colSpan]);
    if (rowSpan) classes.push(rowSpanMap[rowSpan]);
    
    if (responsive) {
      if (responsive.sm?.colSpan) classes.push(`sm:col-span-${responsive.sm.colSpan}`);
      if (responsive.sm?.rowSpan) classes.push(`sm:row-span-${responsive.sm.rowSpan}`);
      if (responsive.md?.colSpan) classes.push(`md:col-span-${responsive.md.colSpan}`);
      if (responsive.md?.rowSpan) classes.push(`md:row-span-${responsive.md.rowSpan}`);
      if (responsive.lg?.colSpan) classes.push(`lg:col-span-${responsive.lg.colSpan}`);
      if (responsive.lg?.rowSpan) classes.push(`lg:row-span-${responsive.lg.rowSpan}`);
      if (responsive.xl?.colSpan) classes.push(`xl:col-span-${responsive.xl.colSpan}`);
      if (responsive.xl?.rowSpan) classes.push(`xl:row-span-${responsive.xl.rowSpan}`);
    }
    
    return classes.join(' ');
  };

  return (
    <div
      className={cn(
        getResponsiveClasses(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Professional responsive container
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-9xl',
  full: 'max-w-full',
};

const paddingMap = {
  none: '',
  sm: 'px-4 py-2',
  md: 'px-6 py-4',
  lg: 'px-8 py-6',
};

export function Container({
  children,
  size = 'lg',
  padding = 'md',
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        sizeMap[size],
        paddingMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}