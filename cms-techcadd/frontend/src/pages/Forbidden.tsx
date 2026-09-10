import { Link } from 'react-router-dom'
import { Home, ShieldOff } from 'lucide-react'

import { ROLE_LABELS } from '../config/access'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { useAuth } from '../hooks/useAuth'

export default function Forbidden() {
  const { session } = useAuth()

  return (
    <Card className="mx-auto max-w-xl p-8 text-center sm:p-12">
      <span className="mx-auto grid size-14 place-items-center rounded-xl bg-amber-50 text-amber-600">
        <ShieldOff size={26} aria-hidden="true" />
      </span>

      <p className="mt-4 text-sm font-semibold tracking-widest text-slate-400">ERROR 403</p>
      <h2 className="mt-1 text-xl font-semibold text-slate-900">You don&apos;t have access</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
        {session
          ? `This section is not part of the ${ROLE_LABELS[session.role]} role. Ask an administrator if you need access to it.`
          : 'Sign in with an account that has permission for this section.'}
      </p>

      <Link to="/" className="mt-6 inline-block">
        <Button icon={Home}>Back to dashboard</Button>
      </Link>
    </Card>
  )
}
