/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';
import { Textarea, Input, TextareaProps, InputProps } from '@chakra-ui/react';

interface IMESafeInputProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'textarea' | 'input';
  inputProps?: InputProps;
  textareaProps?: TextareaProps;
}

export const IMESafeInput: React.FC<IMESafeInputProps> = ({ 
  value, 
  onChange, 
  type = 'input',
  inputProps = {},
  textareaProps = {}
}) => {
  const [localValue, setLocalValue] = useState(value);
  const isComposingRef = useRef(false);

  useEffect(() => {
    if (!isComposingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    isComposingRef.current = false;
    const newValue = e.currentTarget.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    if (!isComposingRef.current) {
      onChange(newValue);
    }
  };

  const commonProps = {
    value: localValue,
    onChange: handleChange,
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
  };

  if (type === 'textarea') {
    return <Textarea {...textareaProps} {...commonProps} />;
  }

  return <Input {...inputProps} {...commonProps} />;
};
