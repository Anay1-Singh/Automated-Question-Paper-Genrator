import AuthLayout from '../components/auth/AuthLayout'
import SignupForm from '../components/auth/SignupForm'

export default function Signup() {
  return (
    <AuthLayout
      headline="Create your account"
      subtitle="Start generating curriculum-aligned university exam papers using Bloom's Taxonomy in seconds."
    >
      <SignupForm />
    </AuthLayout>
  )
}
