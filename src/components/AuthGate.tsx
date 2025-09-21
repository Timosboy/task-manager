import * as React from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

function Gate({ children }: {children: React.ReactNode}) {
  return <>{children}</>
}

const AuthGate = withAuthenticator(Gate)

export default AuthGate
