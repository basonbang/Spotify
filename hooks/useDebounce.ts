import { useEffect, useState } from "react";

/* 
  Delays the updating of a value until a specified amount of time has passed without any new updates
*/

// Generic function, takes a value to be debounced that is the same type as one passed to function, and optional delay
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // Run every time value or delay changes
  useEffect( () => {

    // Updates debounced value after specified delay, otherwise defaults to 500 milliseconds
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay || 500);

    // cleanup function: clears timer to prevent side effects
    return () => {
      clearTimeout(timer);
    }
  } , [value, delay]);

  return debouncedValue;
};

export default useDebounce;