import { Form, Head } from '@inertiajs/react';
import { Lock, Mail } from 'lucide-react';
import AuthField, { authControlClassName } from '@/components/auth-field';
import AuthSubmitButton from '@/components/auth-submit-button';
import PasswordInput from '@/components/password-input';
import { Input } from '@/components/ui/input';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Reset password" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex flex-col gap-5 sm:gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-3 sm:gap-4">
                            <AuthField
                                htmlFor="email"
                                label="Email"
                                icon={Mail}
                                error={errors.email}
                            >
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    readOnly
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
                                    autoComplete="new-password"
                                    autoFocus
                                    placeholder="New Password"
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
                                    autoComplete="new-password"
                                    placeholder="Confirm Password"
                                    passwordrules={passwordRules}
                                    className={authControlClassName}
                                />
                            </AuthField>
                        </div>

                        <AuthSubmitButton
                            processing={processing}
                            data-test="reset-password-button"
                        >
                            Reset password
                        </AuthSubmitButton>
                    </>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset password',
    description: 'Please enter your new password below.',
};
