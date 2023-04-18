import ReCAPTCHA from 'react-google-recaptcha';
import { ReCAPTCHAProps } from 'react-google-recaptcha';
import { config } from '../lib/config';
import { useState } from 'react';

export default function IAmNotARobot(props: Omit<ReCAPTCHAProps, 'sitekey'>) {
  if (!config.recaptchaSiteKey) {
    const [isLoading, setIsLoading] = useState(false);
    return (
      <div className="p-3 flex gap-3">
        <input
          type="checkbox"
          id="iamnotarobot"
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              props.onChange?.('DUMMY_KEY_THAT_ALWAYS_WORKS');
              setIsLoading(false);
            }, 500);
          }}
          disabled={isLoading}
        />
        <label
          htmlFor="iamnotarobot"
          className={isLoading ? 'text-gray-600' : ''}
        >
          Nu sunt un robot
        </label>
      </div>
    );
  }
  return <ReCAPTCHA sitekey={config.recaptchaSiteKey} hl="ro" {...props} />;
}
