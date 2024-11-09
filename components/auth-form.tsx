'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { signInSchema, signUpSchema } from '@/zod/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUser } from '@/actions/user.actions';
import { Loader2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Link from 'next/link';
import React from 'react';

interface AuthFormProps {
  isSignUp?: boolean;
}

const displayName = 'AuthForm';

type FormValues = {
  email: string;
  fullName?: string;
};

export const AuthForm = (props: AuthFormProps) => {
  const { isSignUp } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [accountId, setAccountId] = React.useState<string | null>(
    null,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: {
      fullName: isSignUp ? '' : undefined,
      email: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);

      const user = await createUser({
        email: values.email,
        fullName: values.fullName ? values.fullName : '',
      });

      setAccountId(user.accountId);
    } catch (error) {
      console.log(error);
      if (isSignUp) {
        toast.error('Failed to Sign up. Please try again.');
      } else {
        toast.error('Failed to Sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="w-full max-w-sm rounded p-5 shadow-md ring-1 ring-border">
      <h2 className="mb-5 text-center text-2xl font-bold">
        Sign {isSignUp ? 'Up' : 'In'}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {isSignUp && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              onClick={() => {
                form.reset();
              }}
            >
              Reset
            </Button>

            <Button type="submit">
              Sign {isSignUp ? 'Up' : 'In'}
              {isLoading ? (
                <Loader2Icon className="ml-3 animate-spin" />
              ) : null}
            </Button>
          </div>
        </form>
      </Form>

      <p className="mt-10 text-balance text-center text-muted-foreground">
        {isSignUp ? (
          <>Already have an account?</>
        ) : (
          <>Don&apos;t have an account?</>
        )}

        <Link
          href={isSignUp ? '/sign-in' : '/sign-up'}
          className="ml-3 transition-colors hover:text-foreground hover:underline"
        >
          Sign {isSignUp ? 'In' : 'Up'}
        </Link>
      </p>
    </article>
  );
};

AuthForm.displayName = displayName;
