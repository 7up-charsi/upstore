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
import {
  FormControl,
  FormHelperText,
  FormItem,
  FormLabel,
} from './ui/form';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { ResendCode } from './resend-code';
import { Loader2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Link from 'next/link';
import React from 'react';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email(),
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .optional(),
});

export type FormValues = z.input<typeof formSchema>;

interface AuthFormProps {
  isSignUp?: boolean;
}

const displayName = 'AuthForm';

export const AuthForm = (props: AuthFormProps) => {
  const { isSignUp } = props;

  const signUpReturn = useSignUp();
  const signInReturn = useSignIn();

  const [isLoading, setIsLoading] = React.useState(false);
  const [verification, setVerification] = React.useState(false);

  const {
    register,
    reset,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: isSignUp ? '' : undefined,
      lastName: isSignUp ? '' : undefined,
      email: '',
    },
  });

  const sendOTP = async () => {
    const values = getValues();

    if (isSignUp) {
      if (signUpReturn.isLoaded) {
        await signUpReturn.signUp.create({
          firstName: values.firstName,
          lastName: values.lastName,
          emailAddress: values.email,
        });

        await signUpReturn.signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });
      }
    } else {
      if (signInReturn.isLoaded) {
        await signInReturn.signIn.create({
          strategy: 'email_code',
          identifier: values.email,
        });
      }
    }
  };

  const onFormSubmit = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      await sendOTP();

      setVerification(true);
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        error.errors.forEach((error) => {
          if (error.meta?.paramName === 'email_address') {
            setError('email', { message: error.longMessage });
            return;
          }
          if (error.meta?.paramName === 'first_name') {
            setError('firstName', { message: error.longMessage });
            return;
          }
          if (error.meta?.paramName === 'last_name') {
            setError('lastName', { message: error.longMessage });
            return;
          }
        });

        return;
      }

      toast.error(
        `Failed to Sign ${isSignUp ? 'Up' : 'In'}. Please try again.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onOTPSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      setIsLoading(true);
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      const code = formData.get('code');

      if (!code) {
        return;
      }

      if (isSignUp) {
        if (signUpReturn.isLoaded) {
          await signUpReturn.signUp.attemptEmailAddressVerification({
            code: code.toString(),
          });
        }
      } else {
        if (signInReturn.isLoaded) {
          await signInReturn.signIn.attemptFirstFactor({
            strategy: 'email_code',
            code: code.toString(),
          });
        }
      }

      // router.push('/');
    } catch (error) {
      console.log(error);
      toast.error('Failed to verify otp');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <article className="w-full max-w-sm rounded p-5 shadow-md ring-1 ring-border">
        <h2 className="mb-5 text-center text-2xl font-bold">
          Sign {isSignUp ? 'Up' : 'In'}
        </h2>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          {isSignUp && (
            <>
              <FormItem error={!!errors.firstName}>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  {(props) => (
                    <Input {...register('firstName')} {...props} />
                  )}
                </FormControl>
                <FormHelperText>
                  {errors.firstName?.message}
                </FormHelperText>
              </FormItem>

              <FormItem error={!!errors.lastName}>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  {(props) => (
                    <Input {...register('lastName')} {...props} />
                  )}
                </FormControl>
                <FormHelperText>
                  {errors.lastName?.message}
                </FormHelperText>
              </FormItem>
            </>
          )}

          <FormItem error={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <FormControl>
              {(props) => <Input {...register('email')} {...props} />}
            </FormControl>
            <FormHelperText>{errors.email?.message}</FormHelperText>
          </FormItem>

          <div className="mt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={isLoading}
              onClick={() => {
                reset();
              }}
            >
              Reset
            </Button>

            <Button type="submit" disabled={isLoading}>
              Sign {isSignUp ? 'Up' : 'In'}
              {isLoading ? (
                <Loader2Icon className="ml-3 animate-spin" />
              ) : null}
            </Button>
          </div>
        </form>

        <p className="mt-10 text-balance text-center text-muted-foreground">
          {isSignUp ? (
            <>Already have an account?</>
          ) : (
            <>Don&apos;t have an account?</>
          )}

          <Link
            href={isSignUp ? '/sign-in' : '/sign-up'}
            className="ml-3 text-foreground transition-colors hover:underline data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
            data-disabled={isLoading}
            onMouseDown={(e) => {
              if (isLoading) e.preventDefault();
            }}
          >
            Sign {isSignUp ? 'In' : 'Up'}
          </Link>
        </p>
      </article>

      {verification && (
        <Dialog modal defaultOpen>
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
              onSubmit={onOTPSubmit}
              className="mx-auto mt-5 flex max-w-max flex-col items-center justify-center"
            >
              <InputOTP name="code" maxLength={6}>
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

            {/* at the end of content because i dont want to place intial focus on close button */}
            <DialogCloseButton />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

AuthForm.displayName = displayName;
