import { mutation } from "@/convex/_generated/server";
import { useMutation } from "convex/react";
import { useState } from "react";

export const useApiMutation = (mutationFunction:any) => {
  const [isLoading,setLoading] = useState(false);
  const apiMutation = useMutation(mutationFunction);

  const mutate = (payload:any) => {
    setLoading(true);
    return apiMutation(payload)
           .finally(()=>setLoading(false))
           .then((result)=>{
            return result;
           })
           .catch((error)=>{
            throw error;
           });
  };


  return {
    mutate,isLoading
  }
}