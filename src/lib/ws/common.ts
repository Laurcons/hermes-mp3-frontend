import { toast } from 'react-toastify';

export function handleWsError() {
  return (err: any) => {
    toast.error(err.message);
  };
}
