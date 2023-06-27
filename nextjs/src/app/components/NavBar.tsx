"use client"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { nameToPath } from "@/app/lib/stringFuncs"

const navPages = [
  "About Us",
  "Contact Us",
  "Products And Services",
  "Login",
  "Sign Up",
]

export default function NavBar() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])
  return (
    // conditional rendering of a mobile or desktop nav bar
    <nav>
      {isMobile ? (
        <div className="flex flex-col justify-center items-center py-2">
          <Link href="/">
            <Button variant="ghost" className="text-4xl">
              CMT
            </Button>
          </Link>
          {navPages.map((page) => (
            <Link href={nameToPath(page)} key={page}>
              <Button variant="ghost">{page}</Button>
            </Link>
          ))}
        </div>
      ) : (
        <div>
          <div className="mx-auto w-full p-4 py-6 lg:py-8 flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" className="text-4xl">
                  CMT
                </Button>
              </Link>
              {navPages.slice(0, 3).map((page) => (
                <Link href={nameToPath(page)} key={page}>
                  <Button variant="ghost">{page}</Button>
                </Link>
              ))}
            </div>
            <div className="flex items-center">
              {navPages.slice(3, 5).map((page) => (
                <Link href={nameToPath(page)} key={page}>
                  <Button variant="ghost">{page}</Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
