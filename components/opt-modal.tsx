'use client';

import {
  Dialog,
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
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ResendCode } from './resend-code';
import { Loader2Icon } from 'lucide-react';
import { FormValues } from './auth-form';
import { toast } from 'react-toastify';
import { Button } from './ui/button';
import React from 'react';

interface OptModalProps {
  isSignUp: boolean;
  sendOTP: () => Promise<void>;
}

const displayName = 'OptModal';

export const OptModal = (props: OptModalProps) => {
  const { isSignUp, sendOTP } = props;

  const router = useRouter();

  const signUpReturn = useSignUp();
  const signInReturn = useSignIn();

  const { getValues } = useFormContext<FormValues>();

  const [isOpen, setIsOpen] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [code, setCode] = React.useState('');

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      setIsLoading(true);
      event.preventDefault();

      if (isSignUp) {
        if (signUpReturn.isLoaded) {
          await signUpReturn.signUp.attemptEmailAddressVerification({
            code,
          });
        }
      } else {
        if (signInReturn.isLoaded) {
          await signInReturn.signIn.attemptFirstFactor({
            strategy: 'email_code',
            code,
          });
        }
      }

      router.push('/');
    } catch (error) {
      console.log(error);
      toast.error('Failed to verify otp');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      modal
      open={isOpen}
      onOpenChange={(open) => {
        if (isLoading) return;

        setIsOpen(open);
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
              {getValues().email}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-5 flex max-w-max flex-col items-center justify-center"
        >
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup className="">
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
      </DialogContent>
    </Dialog>
  );
};

OptModal.displayName = displayName;
