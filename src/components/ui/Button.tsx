import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import LoadingIcon from './LoadingIcon';

export interface OwnButtonProps {
  isLoading?: boolean;
}

export default function Button(
  props: ButtonHTMLAttributes<unknown> & OwnButtonProps & PropsWithChildren,
) {
  const { isLoading: _, ...buttonProps } = props;
  return (
    <>
      <button
        className="border rounded p-2 px-3 border-green-900 bg-green-300 whitespace-nowrap"
        {...buttonProps}
      >
        <div className="flex gap-2 align-center">
          {props.children}
          {props.isLoading && <LoadingIcon />}
        </div>
      </button>
    </>
  );
}
