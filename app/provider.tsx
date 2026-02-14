// provider.tsx
"use client";

import React, { useEffect } from 'react'
import axios from 'axios';
// import { useUser } from '@clerk/nextjs';


function Provider({ children }: any) {
     

    useEffect(() => {
        CreateNewUser();
    }, []); 

    const CreateNewUser=async ()=>{
        const result=await axios.post('/api/user',{});

        console.log(result.data);
    }


  return (
    <>{children}</>
  )
}

export default Provider