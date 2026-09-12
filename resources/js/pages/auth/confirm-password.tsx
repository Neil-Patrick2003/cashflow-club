import { Form, Head } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import AuthField, { authControlClassName } from '@/components/auth-field';
import AuthSubmitButton from '@/components/auth-submit-button';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirm password" />

            <div className="mb-6">
                <PasskeyVerify
                    routes={{
                        options: confirmOptions(),
                        submit: confirmStore(),
                    }}
                    label="Confirm with passkey"
                    loadingLabel="Confirming..."
                    separator="Or confirm with password"
                />
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5 sm:gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <AuthField
                            htmlFor="password"
                            label="Password"
                            icon={Lock}
                            error={errors.password}
                        >
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                autoFocus
                                className={authControlClassName}
                            />
                        </AuthField>

                        <AuthSubmitButton
                            processing={processing}
                            data-test="confirm-password-button"
                        >
                            Confirm password
                        </AuthSubmitButton>
                    </>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Confirm password',
    description:
        'This is a secure area of the application. Please confirm your password before continuing.',
};
