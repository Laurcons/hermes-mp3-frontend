import classNames from 'classnames';
import { PropsWithChildren } from 'react';

export default function A({
  noExternalIcon,
  className,
  href,
  children,
  ...props
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  noExternalIcon?: boolean;
}) {
  return (
    <a
      {...props}
      href={href}
      className={classNames('text-blue-500', className)}
    >
      {href?.startsWith('http') && !noExternalIcon && (
        <i className="bi-box-arrow-up-right text-xs ml-2 mr-1"></i>
      )}
      {children}
    </a>
  );
}
