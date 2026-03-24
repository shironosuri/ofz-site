import './content-register.css'

export function ContentRegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="content-register">
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 2rem 4rem' }}>
        {children}
      </div>
    </div>
  )
}
