import { images } from '@/api/constant/images'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import authService from '@/services/authService'
import useUserStore from '@/stores/userStore'
import type { ApiError } from '@/api/client'

const loginSchema = z.object({
  phone: z.string().min(1, "Telefon raqam kiritilishi shart"),
  password: z.string().min(1, "Parol kiritilishi shart"),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const setUserToken = useUserStore((s) => s.actions.setUserToken)
  const setUserInfo = useUserStore((s) => s.actions.setUserInfo)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const res = await authService.login(values)

      // Token olish — bir nechta format qo'llab-quvvatlanadi
      const accessToken = res.access ?? res.token ?? res.access_token ?? ''
      if (!accessToken) {
        toast.error("Serverdan token kelmadi")
        return
      }

      // Role tekshiruvi — admin yoki is_admin bo'lishi kerak
      const role = res.role ?? res.user?.role ?? ''
      const isAdmin = res.is_admin ?? res.user?.is_admin ?? true // agar server role qaytarmasa ruxsat beramiz
      if (role && role !== 'admin' && !isAdmin) {
        toast.error("Siz admin emassiz. Kirish ruxsati yo'q.")
        return
      }

      setUserToken({ accessToken, refreshToken: res.refresh })
      setUserInfo({
        id: res.user?.id,
        phone: res.user?.phone ?? values.phone,
        name: res.user?.name ?? 'Admin',
      })

      toast.success("Muvaffaqiyatli kirdingiz!")
      navigate('/dashboard')
    } catch (err) {
      const apiErr = err as ApiError
      toast.error(apiErr?.message ?? "Xatolik yuz berdi")
    }
  }

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-base-100 px-6 sm:px-12">

      <div
        className="flex flex-col lg:flex-row w-full max-w-5xl rounded-2xl overflow-hidden bg-white"
        style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}
      >
        {/* Form */}
        <div className="w-full lg:w-120 shrink-0 px-10 py-14">
          <img
            src={images.loginPageLogo}
            alt="Shafmet logo"
            className="w-52 mb-7"
          />

          <h1 className="text-4xl font-bold mb-3">Login Bo'limi</h1>

          <p className="text-sm text-gray-900 leading-relaxed mb-7">
            Siz login qilishingiz uchun admin bo'lishingiz va sizda maxsus kod
            bo'lishi kerak.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

            {/* Telefon */}
            <div className="relative">
              <label
                htmlFor="phone"
                className="absolute -top-2 left-3 bg-white px-1 text-[11px] text-gray-800 z-10"
              >
                Telefon Raqamingiz
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+998 90 555 20 33"
                className={`w-full h-13 border rounded px-4 text-sm outline-none transition-colors ${errors.phone
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-400 focus:border-blue-600'
                  }`}
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Parol */}
            <div className="relative">
              <label
                htmlFor="password"
                className="absolute -top-2 left-3 bg-white px-1 text-[11px] text-gray-800 z-10"
              >
                Parolingiz
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="************"
                className={`w-full h-13 border rounded px-4 pr-12 text-sm outline-none transition-colors ${errors.password
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-400 focus:border-blue-600'
                  }`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-800 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded transition-colors"
            >
              {isSubmitting ? 'Yuklanmoqda...' : 'Kirish'}
            </button>

          </form>
        </div>

        {/* Rasm */}
        <div className="hidden lg:flex items-center justify-center flex-1 bg-blue-50 p-8">
          <img
            src={images.LoginPageImage}
            alt="Login illustration"
            className="w-full max-h-125 object-contain"
          />
        </div>
      </div>

    </section>
  )
}

export default LoginPage
