'use client';

import * as React from 'react';

const useFormField = () => {
  const itemContext = React.useContext(FormItemContext);

  const { id } = itemContext;

  return {
    ...itemContext,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
  };
};

type FormItemContextValue = {
  id: string;
  error: boolean;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = ({
  error,
  children,
}: {
  error: boolean;
  children?: React.ReactNode;
}) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id, error }}>
      <div className="space-y-1">{children}</div>
    </FormItemContext.Provider>
  );
};
FormItem.displayName = 'FormItem';

const FormLabel = ({ children }: { children: React.ReactNode }) => {
  const { formItemId } = useFormField();

  return (
    <label
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      htmlFor={formItemId}
    >
      {children}
    </label>
  );
};
FormLabel.displayName = 'FormLabel';

const FormControl = ({
  children,
}: {
  children: (props: {
    id: string;
    'aria-describedby': string;
    'aria-invalid': boolean;
    'data-error': boolean;
    className: string;
  }) => React.ReactNode;
}) => {
  const { error, formItemId, formDescriptionId } = useFormField();

  return children({
    id: formItemId,
    'aria-describedby': `${formDescriptionId}`,
    'aria-invalid': !!error,
    'data-error': !!error,
    className: 'data-[error=true]:ring-destructive',
  });
};
FormControl.displayName = 'FormControl';

const FormHelperText = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { formDescriptionId, error } = useFormField();

  return (
    <div
      id={formDescriptionId}
      data-error={!!error}
      className="h-5 truncate text-[0.8rem] leading-none text-muted-foreground data-[error=true]:text-destructive"
    >
      {children}
    </div>
  );
};
FormHelperText.displayName = 'FormHelperText';

export { FormItem, FormLabel, FormControl, FormHelperText };
