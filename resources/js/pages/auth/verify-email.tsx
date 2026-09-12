import { Form, Head } from '@inertiajs/react';
import { authLinkClassName } from '@/components/auth-field';
import AuthSubmitButton from '@/components/auth-submit-button';
import TextLink from '@/components/text-link';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div className="text-gold-400 mb-4 text-center text-sm font-medium">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <Form {...send.form()} className="flex flex-col gap-5 sm:gap-6">
                {({ processing }) => (
                    <>
                        <AuthSubmitButton processing={processing}>
                            Resend verification email
                        </AuthSubmitButton>

                        <TextLink
                            href={logout()}
                            className={`mx-auto block text-sm ${authLinkClassName}`}
                        >
                            Log out
                        </TextLink>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Email verification',
    description:
        'Please verify your email address by clicking on the link we just emailed to you.',
};
