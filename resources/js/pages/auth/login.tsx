import { Form, Head } from '@inertiajs/react';
import { Lock, Mail } from 'lucide-react';
import AuthField, {
    authControlClassName,
    authLinkClassName,
} from '@/components/auth-field';
import AuthSubmitButton from '@/components/auth-submit-button';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            {status && (
                <div className="text-gold-400 mb-4 text-center text-sm font-medium">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5 sm:gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-3 sm:gap-4">
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
                                    autoFocus
                                    tabIndex={1}
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
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className={authControlClassName}
                                />
                            </AuthField>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="data-[state=checked]:border-gold-400 data-[state=checked]:bg-gold-400 data-[state=checked]:text-royal-950 border-white/25"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm text-white/70"
                                >
                                    Remember me
                                </Label>
                            </div>

                            {canResetPassword && (
                                <TextLink
                                    href={request()}
                                    className={`text-sm ${authLinkClassName}`}
                                    tabIndex={5}
                                >
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>

                        <AuthSubmitButton
                            processing={processing}
                            tabIndex={4}
                            data-test="login-button"
                        >
                            Log In
                        </AuthSubmitButton>
                    </>
                )}
            </Form>

            <div className="mt-6">
                <PasskeyVerify separatorPlacement="before" />
            </div>

            <div className="mt-6 text-center text-sm text-white/60">
                Not a member yet?{' '}
                <TextLink
                    href={register()}
                    className={`font-semibold ${authLinkClassName}`}
                    tabIndex={5}
                >
                    Join the Club
                </TextLink>
            </div>
        </>
    );
}

Login.layout = {
    title: 'Welcome back',
    description: 'Log in to keep building your cashflow future.',
};
