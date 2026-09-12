import { Form, Head } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import AuthField, {
    authControlClassName,
    authLinkClassName,
} from '@/components/auth-field';
import AuthSubmitButton from '@/components/auth-submit-button';
import TextLink from '@/components/text-link';
import { Input } from '@/components/ui/input';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password" />

            {status && (
                <div className="text-gold-400 mb-4 text-center text-sm font-medium">
                    {status}
                </div>
            )}

            <Form {...email.form()} className="flex flex-col gap-5 sm:gap-6">
                {({ processing, errors }) => (
                    <>
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
                                autoComplete="off"
                                autoFocus
                                placeholder="Email Address"
                                className={authControlClassName}
                            />
                        </AuthField>

                        <AuthSubmitButton
                            processing={processing}
                            data-test="email-password-reset-link-button"
                        >
                            Email password reset link
                        </AuthSubmitButton>
                    </>
                )}
            </Form>

            <div className="mt-6 space-x-1 text-center text-sm text-white/60">
                <span>Or, return to</span>
                <TextLink href={login()} className={authLinkClassName}>
                    log in
                </TextLink>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link.',
};
