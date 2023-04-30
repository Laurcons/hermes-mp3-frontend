import { useNavigate, useSearchParams } from 'react-router-dom';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import CookieManager from '@/lib/cookie-manager';
import { axios, handleErrors } from '@/lib/axios';
import Layout from '@/components/Layout';
import IAmNotARobot from '@/components/IAmNotARobot';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface Values {
  captcha: string | null;
  teamCode: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (values: Values) => {
    try {
      const res = await axios.post('/session', {
        recaptchaToken: values.captcha,
        teamCode: values.teamCode,
      });
      CookieManager.set('token', res.data.token);
      navigate('/chat');
    } catch (err: any) {
      handleErrors(err);
    }
  };

  return (
    <Layout>
      <p>Bine ai venit la Hermes MP3 Experience!</p>
      <Formik
        initialValues={{
          captcha: null,
          teamCode: '',
        }}
        onSubmit={handleSubmit}
      >
        {(form: FormikProps<any>) => (
          <Form>
            <Field name="captcha" required>
              {/* i would have typed this shit but god knows what type this mf has, it's not even in the typedef :sob: */}
              {({ form }: any) => {
                return (
                  <IAmNotARobot
                    onChange={(tok) => form.setFieldValue('captcha', tok)}
                  />
                );
              }}
            </Field>
            <Button type="submit" isLoading={form.isSubmitting}>
              Să incepem!
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
