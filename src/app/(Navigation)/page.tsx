import { Metadata } from "next"

import { SearchForm } from "@/components/SearchForm"

export const metadata: Metadata = {
  title: "Edu Mentor Me",
  description: "Start learning with us today!",
  keywords: ["tutoring", "tutor", "a level", "gcse"],
  icons: "/emm.jpeg",
}

const page = () => {
  return (
    <div className="flex flex-grow flex-col items-center justify-center space-y-4 overflow-y-auto">
      <SearchForm />
    </div>
  )
}
export default page