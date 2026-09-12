import { Form, Head } from '@inertiajs/react';
import { Lock, Mail, User } from 'lucide-react';
import AuthField, {
    authControlClassName,
    authLinkClassName,
} from '@/components/auth-field';
import AuthSubmitButton from '@/components/auth-submit-button';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Input } from '@/components/ui/input';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Register" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5 sm:gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-3 sm:gap-4">
                            <AuthField
                                htmlFor="name"
                                label="Full name"
                                icon={User}
                                error={errors.name}
                            >
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    placeholder="Full Name"
                                    className={authControlClassName}
                                />
                            </AuthField>

                            <AuthField
                                htmlFor="email"
                                label="Email address"
                                icon={Mail}
                                error={errors.email}
                            >
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    placeholder="Email Address"
                                    className={authControlClassName}
                                />
                            </AuthField>

                            <AuthField
                                htmlFor="password"
                                label="Password"
                                icon={Lock}
                                error={errors.password}
                            >
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    placeholder="Create Password"
                                    passwordrules={passwordRules}
                                    className={authControlClassName}
                                />
                            </AuthField>

                            <AuthField
                                htmlFor="password_confirmation"
                                label="Confirm password"
                                icon={Lock}
                                error={errors.password_confirmation}
                            >
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    placeholder="Confirm Password"
                                    passwordrules={passwordRules}
                                    className={authControlClassName}
                                />
                            </AuthField>
                        </div>

                        <AuthSubmitButton
                            processing={processing}
                            tabIndex={5}
                            data-test="register-user-button"
                        >
                            Create Account
                        </AuthSubmitButton>
                    </>
                )}
            </Form>

            <div className="mt-6 text-center text-sm text-white/60">
                Already a member?{' '}
                <TextLink
                    href={login()}
                    className={`font-semibold ${authLinkClassName}`}
                    tabIndex={6}
                >
                    Log in
                </TextLink>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Create your account',
    description: 'Start your journey to financial freedom today.',
};
