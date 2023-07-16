"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { examBoards, levels, subjects } from "@/lib/constants"
import { capitalizeWords } from "@/lib/stringFuncs"
import { searchFormSchema } from "@/lib/validations/form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Inputs = z.infer<typeof searchFormSchema>

export function SearchForm() {
  const router = useRouter()
  const form = useForm<Inputs>({
    resolver: zodResolver(searchFormSchema),
  })

  function onSubmit(data: Inputs) {
    router.push(`${data.level}/${data.subject}/${data.examboard}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/3 space-y-8">
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem value={level} key={level}>
                      {capitalizeWords(level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem value={subject} key={subject}>
                      {capitalizeWords(subject)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="examboard"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Exam Board" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {examBoards.map((examboard) => (
                    <SelectItem value={examboard} key={examboard}>
                      {capitalizeWords(examboard.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="outline"
          className="w-full transition-none"
        >
          Search 🔍
        </Button>
      </form>
    </Form>
  )
}