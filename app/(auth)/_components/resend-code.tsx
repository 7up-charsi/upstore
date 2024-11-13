'use client';

import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import React from 'react';

interface ResendCodeProps {
  sendOTP: () => Promise<void>;
  isLoading: boolean;
}

const displayName = 'ResendCode';

export const ResendCode = (props: ResendCodeProps) => {
  const { sendOTP, isLoading } = props;

  const [canResend, setCanResend] = React.useState(false);
  const [seconds, setSeconds] = React.useState(60);
  const [innerLoading, setInnerLoading] = React.useState(false);

  const timerRef = React.useRef<NodeJS.Timeout>();

  const countDown = () => {
    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);

          return prev;
        }

        return prev - 1;
      });
    }, 1000);
  };

  React.useEffect(() => {
    countDown();

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <p className="text-center text-sm">
      Didn&apos;t get a code?{' '}
      <Button
        onClick={async () => {
          if (!canResend) return;

          setInnerLoading(true);

          await sendOTP();

          setCanResend(false);
          setSeconds(60);
          countDown();

          setInnerLoading(false);
        }}
        variant="link"
        disabled={isLoading || !canResend}
        className=""
      >
        Resend
      </Button>
      {canResend ? null : (
        <span className="inline-block w-10"> {seconds} </span>
      )}{' '}
      {innerLoading ? (
        <Loader2Icon className="ml-2 inline animate-spin" />
      ) : null}
    </p>
  );
};

ResendCode.displayName = displayName;
