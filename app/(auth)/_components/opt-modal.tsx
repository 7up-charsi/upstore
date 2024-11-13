'use client';

import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ResendCode } from './resend-code';
import { Loader2Icon } from 'lucide-react';
import { FormValues } from './auth-form';
import { toast } from 'react-toastify';
import React from 'react';

interface OptModalProps {
  isSignUp: boolean;
  sendOTP: () => Promise<void>;
}

const displayName = 'OptModal';

export const OptModal = (props: OptModalProps) => {
  const { isSignUp, sendOTP } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);

  const signUpReturn = useSignUp();
  const signInReturn = useSignIn();

  const form = useFormContext<FormValues>();

  const [isOpen, setIsOpen] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      setIsLoading(true);
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      const code = formData.get('code')?.toString();

      if (!code || code.length < 6) {
        inputRef.current?.focus();
        return;
      }

      dismissToasts();

      if (isSignUp) {
        if (signUpReturn.isLoaded) {
          await signUpReturn.signUp.attemptEmailAddressVerification({
            code,
          });

          signUpReturn.setActive({
            session: signUpReturn.signUp?.createdSessionId,
            redirectUrl: '/',
          });
        }
      } else {
        if (signInReturn.isLoaded) {
          await signInReturn.signIn.attemptFirstFactor({
            strategy: 'email_code',
            code,
          });

          signInReturn.setActive({
            session: signInReturn.signIn?.createdSessionId,
            redirectUrl: '/',
          });
        }
      }

      // do not need setIsLoading(false) here because i dont want to stop loading on success signIn/signUp
    } catch (error) {
      setIsLoading(false);

      if (isClerkAPIResponseError(error)) {
        toast.error(error.errors[0].longMessage, {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          closeButton: false,
          toastId: 'otp-modal-otp-error',
        });

        return;
      }

      toast.error('Failed to verify otp', {
        toastId: 'otp-modal-failed-error',
      });
    }
  };

  return (
    <Dialog
      modal
      open={isOpen}
      onOpenChange={(open) => {
        if (isLoading) return;

        setIsOpen(open);

        // remove all toasts related to OTPModal
        if (!open) {
          dismissToasts();
        }
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="w-full max-w-sm rounded-lg max-md:w-[calc(100%-20px)]"
      >
        <DialogHeader className="sm:text-center">
          <DialogTitle>Enter Your OTP</DialogTitle>
          <DialogDescription>
            We have sent code to{' '}
            <span className="ml-1 font-mono text-foreground">
              {form.getValues().email}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-5 flex max-w-max flex-col items-center justify-center"
        >
          <InputOTP ref={inputRef} name="code" maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot
                index={0}
                className="h-[clamp(36px,10vw,48px)] w-[clamp(36px,10vw,48px)] text-[clamp(16px,5vw,24px)]"
              />
              <InputOTPSlot
                index={1}
                className="h-[clamp(36px,10vw,48px)] w-[clamp(36px,10vw,48px)] text-[clamp(16px,5vw,24px)]"
              />
              <InputOTPSlot
                index={2}
                className="h-[clamp(36px,10vw,48px)] w-[clamp(36px,10vw,48px)] text-[clamp(16px,5vw,24px)]"
              />
              <InputOTPSlot
                index={3}
                className="h-[clamp(36px,10vw,48px)] w-[clamp(36px,10vw,48px)] text-[clamp(16px,5vw,24px)]"
              />
              <InputOTPSlot
                index={4}
                className="h-[clamp(36px,10vw,48px)] w-[clamp(36px,10vw,48px)] text-[clamp(16px,5vw,24px)]"
              />
              <InputOTPSlot
                index={5}
                className="h-[clamp(36px,10vw,48px)] w-[clamp(36px,10vw,48px)] text-[clamp(16px,5vw,24px)]"
              />
            </InputOTPGroup>
          </InputOTP>

          <Button
            type="submit"
            className="mt-5 w-full"
            disabled={isLoading}
          >
            Submit{' '}
            {isLoading ? (
              <Loader2Icon className="ml-2 animate-spin" />
            ) : null}
          </Button>
        </form>

        <ResendCode sendOTP={sendOTP} isLoading={isLoading} />

        {/* this is at the end of content because i dont want to place intial focus on close button */}
        <DialogCloseButton />
      </DialogContent>
    </Dialog>
  );
};

OptModal.displayName = displayName;

const dismissToasts = () => {
  toast.dismiss('otp-modal-otp-error');
  toast.dismiss('otp-modal-failed-error');
};
