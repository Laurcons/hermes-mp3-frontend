import ReCAPTCHA from 'react-google-recaptcha';
import { ReCAPTCHAProps } from 'react-google-recaptcha';
import { config } from '../lib/config';

export default function IAmNotARobot(props: Omit<ReCAPTCHAProps, 'sitekey'>) {
  if (!config.recaptchaSiteKey) {
    return (
      <div className="p-3 flex gap-3">
        <input
          type="checkbox"
          id="iamnotarobot"
          onClick={() =>
            setTimeout(
              () => props.onChange?.('DUMMY_KEY_THAT_ALWAYS_WORKS'),
              500,
            )
          }
        />
        <label htmlFor="iamnotarobot">Nu sunt un robot</label>
      </div>
    );
  }
  return <ReCAPTCHA sitekey={config.recaptchaSiteKey} hl="ro" {...props} />;
}
