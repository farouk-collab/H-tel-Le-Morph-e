export default function SectionTitle({ eyebrow, title, text, className = '' }) {
  return (
    <div className={`max-w-3xl ${className}`.trim()}>
      <p className="text-xs uppercase tracking-[0.35em] text-black/50">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-4xl md:text-5xl">{title}</h2>
      {text ? <p className="mt-4 text-sm leading-7 text-black/75 md:text-base">{text}</p> : null}
    </div>
  )
}

