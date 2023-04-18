import { InputHTMLAttributes, PropsWithChildren } from 'react';

export default function Input(
  props: InputHTMLAttributes<unknown> & PropsWithChildren,
) {
  return (
    <input
      className="border rounded p-2 px-3 border-green-700 w-full"
      {...props}
    />
  );
}
