"use client"

import { FC, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/app/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"

import ReCAPTCHA from "react-google-recaptcha"
import supabase from "@/app/lib/supabase"
import { verifyCaptcha } from "@/app/auth/ServerActions"
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert"

const formSchema = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  body: z.string().min(20, { message: "Enter at least 20 characters" }),
})

interface ContactFormProps {}

const ContactForm: FC<ContactFormProps> = ({}) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [isVerified, setIsverified] = useState<boolean>(false)
  const [isFeedbackSent, setIsFeedbackSent] = useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  // once the captcha is submitted by the user, run this
  async function handleCaptchaSubmission(token: string | null) {
    // Server function to verify captcha
    await verifyCaptcha(token)
      .then(() => setIsverified(true))
      .catch(() => setIsverified(false))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // send feedback to the server
    await supabase
      .from("feedback")
      .insert({ email: values.email, body: values.body })

    // reset the form state to allow for new submissions
    recaptchaRef.current?.reset()
    form.reset({ email: "", body: "" })
    setIsFeedbackSent(true)
    setIsverified(false)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 w-2/3 md:w-1/2 lg:w-1/3"
      >
        <h1>Contact us</h1>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="johndoe@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts and suggestions here..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ReCAPTCHA
          sitekey="6LcLLQcnAAAAAMfvKjD_lKxykZMYpvQh7-2Pi7hH"
          ref={recaptchaRef}
          onChange={handleCaptchaSubmission}
        />
        <Button type="submit" disabled={!isVerified}>
          Submit feedback
        </Button>
        {isFeedbackSent ? (
          <Alert variant="default" className="bg-green-500 dark:bg-green-700">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              We appreciate you taking your time to fill in this form, we will
              get back to you shortly.
            </AlertDescription>
          </Alert>
        ) : null}
      </form>
    </Form>
  )
}

export default ContactForm