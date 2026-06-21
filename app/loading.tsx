import AnimatedBackdrop from '@/components/layout/animated-backdrop'

export default function Loading() {
  return (
    <section className="page">
      <AnimatedBackdrop />
      <div className="container" aria-busy="true" aria-live="polite">
        <div className="skeleton skeleton-eyebrow" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line skeleton-medium" />
        <div className="home-grid">
          <div className="card">
            <div className="skeleton-stack">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-short" />
            </div>
          </div>
          <div className="card">
            <div className="skeleton-stack">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-medium" />
            </div>
          </div>
          <div className="card">
            <div className="skeleton-stack">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-button" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}