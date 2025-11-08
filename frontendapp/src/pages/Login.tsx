import { LoginForm } from "@/components/login-form"

export default function Login() {
  return (
    <div className="relative flex min-h-svh bg-black w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm ">
        <LoginForm />
      </div>
      <div className="absolute top-0 left-0 right-0 bg-linear-to-r from-transparent via-purple-400 to-transparent">

                <p className="text-black text-center">jjhk</p>
            </div>
    </div>
  )
}