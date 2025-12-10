import { type ClassValue, clsx } from 'classnames'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

