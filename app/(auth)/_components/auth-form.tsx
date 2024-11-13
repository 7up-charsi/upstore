'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { OptModal } from './opt-modal';
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
  const [verifying, setVerifying] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: isSignUp ? '' : undefined,
      lastName: isSignUp ? '' : undefined,
      email: '',
    },
  });

  const sendOTP = async () => {
    const values = form.getValues();

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

      setVerifying(true);
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        if (isSignUp) {
          error.errors.forEach((error) => {
            if (error.meta?.paramName === 'email_address') {
              form.setError('email', { message: error.longMessage });
              return;
            }
            if (error.meta?.paramName === 'first_name') {
              form.setError('firstName', {
                message: error.longMessage,
              });
              return;
            }
            if (error.meta?.paramName === 'last_name') {
              form.setError('lastName', {
                message: error.longMessage,
              });
              return;
            }
          });
        } else {
          form.setError('email', {
            message: error.errors[0].longMessage,
          });
        }

        return;
      }

      toast.error(
        `Failed to Sign ${isSignUp ? 'Up' : 'In'}. Please try again.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <article className="w-full max-w-sm">
        <h2 className="mb-5 text-center text-2xl font-bold">
          Sign {isSignUp ? 'Up' : 'In'}
        </h2>

        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          {isSignUp && (
            <>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={isLoading}
              onClick={() => {
                form.reset();
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

      {verifying && (
        <OptModal isSignUp={!!isSignUp} sendOTP={sendOTP} />
      )}
    </Form>
  );
};

AuthForm.displayName = displayName;
