"use client"

import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/app/_api/auth'
import { useRouter } from 'next/navigation'
 
const formSchema = z.object({
  firstName: z.string().min(2).regex(/^\S*$/, "The string must not contain spaces"),
  lastName: z.string().min(2).regex(/^\S*$/, "The string must not contain spaces"),
  userName: z.string().min(2).max(50).regex(/^\S*$/, "The string must not contain spaces"),
  email: z.string().includes("@").regex(/^\S*$/, "The string must not contain spaces"),
  password: z.string().min(4).regex(/^\S*$/, "The string must not contain spaces"),
  role: z.enum(["User", "Admin"]),
})

const RegistrationForm = () => {
    const { register } = useAuth();
    const routeModule = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          userName: "",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "User",
        },
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        const res = await register(values);
        console.log(res)
        if (res.success) {
            routeModule.push('/login');
        }
      }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 registrationForm">
            {Object.entries(formSchema.shape).map(([key, _]) => (
            <FormField
              key={key}
              control={form.control}
              name={key as keyof z.infer<typeof formSchema>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{key}</FormLabel>
                  <FormControl>
                    <Input type={key==="password" ? "password" : "text"} placeholder={key} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />  
            ))}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  )
}

export default RegistrationForm