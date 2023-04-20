import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import IAmNotARobot from '../components/IAmNotARobot';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Cookies from 'js-cookie';
import { axios, handleErrors } from '../lib/axios';

interface Values {
  captcha: string | null;
  teamCode: string;
}

export default function HomePage() {
  const navigate = useNavigate();

  const handleSubmit = async (values: Values) => {
    try {
      const res = await axios.post('/session', {
        recaptchaToken: values.captcha,
        teamCode: values.teamCode,
      });
      Cookies.set('token', res.data.token);
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
              {({ form }: any) => {
                return (
                  <IAmNotARobot
                    onChange={(tok) => form.setFieldValue('captcha', tok)}
                  />
                );
              }}
            </Field>
            <div className="mb-2">
              <label className="block">Codul echipei</label>
              <Field name="teamCode" as={Input} placeholder="XXXXXX" required />
            </div>
            <Button type="submit" isLoading={form.isSubmitting}>
              Să incepem!
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
