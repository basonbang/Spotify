"use client";

import qs from "query-string";
import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Input from "./Input";

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>(""); // input value
  const debouncedValue = useDebounce<string>(value, 500);

  useEffect(() => {
    const query = {
      title: debouncedValue,
    };

    // construct new URL for search page with search query
    const url = qs.stringifyUrl({
      url: '/search',
      query: query
    })

    // navigate to the new constructed URL
    router.push(url);
  }, [debouncedValue, router]);

  return ( 
    <Input placeholder="What do you want to listen to?" value={value} onChange={(e) => setValue(e.target.value)}/>
   );
}
 
export default SearchInput;