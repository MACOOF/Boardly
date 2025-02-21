"use client";
import { Search } from "lucide-react";
import qs from "query-string";
import {useDebounceCallback,useDebounceValue} from "usehooks-ts"
import { useRouter } from "next/navigation";
import { useEffect, useState ,ChangeEvent} from "react";
import { Input } from "@/components/ui/input";

export const SearchInput = () => { 
  const router = useRouter();
  const [value, setValue] = useState("");
  const debounce = useDebounceCallback(setValue,500);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    debounce(e.target.value);
  }

  useEffect(() => {

    const url = qs.stringifyUrl({
      url:"/",
      query: {
        Search:value,
      },
    },{skipEmptyString:true,skipNull:true});

    router.push(url);
  },[value,router])
  return (
    <div className="w-full relative">
      <Search 
        className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
      />
      <Input 
        className="w-full max-w-[516px] pl-9"
        placeholder="Search boards..."
        onChange={handleChange}
      />
    </div>
  )
};