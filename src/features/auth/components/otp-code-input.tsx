import { useEffect, useMemo, useRef, type ClipboardEvent, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

interface OtpCodeInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  length?: number
}

export function OtpCodeInput({
  value,
  onChange,
  disabled = false,
  length = 6,
}: OtpCodeInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const digits = useMemo(() => {
    const normalized = value.replace(/\D/g, '').slice(0, length)

    return Array.from({ length }, (_, index) => normalized[index] ?? '')
  }, [length, value])

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  function focusInput(index: number) {
    inputRefs.current[index]?.focus()
    inputRefs.current[index]?.select()
  }

  function updateDigit(index: number, nextDigit: string) {
    const nextDigits = [...digits]
    nextDigits[index] = nextDigit
    onChange(nextDigits.join(''))
  }

  function handleChange(index: number, nextValue: string) {
    const digit = nextValue.replace(/\D/g, '').slice(-1)

    updateDigit(index, digit)

    if (digit && index < length - 1) {
      focusInput(index + 1)
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace') {
      if (digits[index]) {
        event.preventDefault()
        updateDigit(index, '')
        return
      }

      if (index > 0) {
        event.preventDefault()
        updateDigit(index - 1, '')
        focusInput(index - 1)
      }
      return
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      focusInput(index - 1)
      return
    }

    if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault()
      focusInput(index + 1)
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()

    const pastedValue = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)

    if (!pastedValue) {
      return
    }

    onChange(pastedValue)
    focusInput(Math.min(pastedValue.length, length - 1))
  }

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputRefs.current[index] = node
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Verification code digit ${index + 1}`}
          className={cn(
            'h-14 w-12 rounded-xl border border-input bg-background text-center text-xl font-semibold text-foreground shadow-xs outline-none transition-[border-color,box-shadow] focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60 sm:w-14',
          )}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  )
}
