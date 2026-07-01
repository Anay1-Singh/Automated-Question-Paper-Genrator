import AuthLayout from '../components/auth/AuthLayout'
import LoginForm from '../components/auth/LoginForm'

export default function Login() {
  return (
    <AuthLayout
      headline="Welcome Back"
      subtitle="Continue building syllabus-compliant, balanced, and high-fidelity university question papers with AI."
    >
      <LoginForm />
    </AuthLayout>
  )
}
