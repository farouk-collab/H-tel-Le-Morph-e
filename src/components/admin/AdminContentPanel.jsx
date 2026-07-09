import AdminDashboardCard from './AdminDashboardCard'

export default function AdminContentPanel({
  testimonialForm,
  setTestimonialForm,
  handleSubmitTestimonial,
  testimonials,
  handleEditTestimonial,
  handleDeleteTestimonial,
  emptyTestimonialForm,
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <AdminDashboardCard title={testimonialForm.id ? 'Modifier un temoignage' : 'Ajouter un temoignage'} eyebrow="Contenu">
        <form onSubmit={handleSubmitTestimonial} className="grid gap-4">
          <input value={testimonialForm.name} onChange={(e) => setTestimonialForm((s) => ({ ...s, name: e.target.value }))} placeholder="Nom du client" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          <div className="grid gap-4 md:grid-cols-2">
            <input value={testimonialForm.roleFr} onChange={(e) => setTestimonialForm((s) => ({ ...s, roleFr: e.target.value }))} placeholder="Role FR" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
            <input value={testimonialForm.roleEn} onChange={(e) => setTestimonialForm((s) => ({ ...s, roleEn: e.target.value }))} placeholder="Role EN" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <textarea value={testimonialForm.textFr} onChange={(e) => setTestimonialForm((s) => ({ ...s, textFr: e.target.value }))} placeholder="Texte FR" className="min-h-[160px] rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] p-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
            <textarea value={testimonialForm.textEn} onChange={(e) => setTestimonialForm((s) => ({ ...s, textEn: e.target.value }))} placeholder="Text EN" className="min-h-[160px] rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] p-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-2xl bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5d1824]">{testimonialForm.id ? 'Mettre a jour' : 'Enregistrer'}</button>
            {testimonialForm.id ? <button type="button" onClick={() => setTestimonialForm(emptyTestimonialForm())} className="rounded-2xl border border-[#7a2230]/14 bg-white px-5 py-3 text-sm font-semibold text-[#7a2230] transition hover:bg-[#fff3f1]">Reinitialiser</button> : null}
          </div>
        </form>
      </AdminDashboardCard>

      <AdminDashboardCard title="Temoignages publies" eyebrow="Vitrine" actions={<span className="rounded-full bg-[#f4dbe0] px-4 py-2 text-sm font-semibold text-[#7a2230]">{testimonials.length} avis</span>}>
        <div className="grid gap-4">
          {testimonials.map((testimonial) => (
            <article key={testimonial.id} className="rounded-[24px] border border-[#7a2230]/10 bg-[#fff8f7] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#2f1b1f]">{testimonial.name}</h3>
                  <p className="mt-1 text-sm text-[#7a5c61]">{testimonial.role?.fr || 'Client'}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleEditTestimonial(testimonial)} className="rounded-full border border-[#7a2230]/14 bg-white px-4 py-2 text-sm font-semibold text-[#7a2230] transition hover:bg-[#fff3f1]">Modifier</button>
                  <button type="button" onClick={() => handleDeleteTestimonial(testimonial.id)} className="rounded-full border border-[#d79aa5] bg-[#fff1f3] px-4 py-2 text-sm font-semibold text-[#b4233c] transition hover:bg-[#ffe4e8]">Supprimer</button>
                </div>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#6d4a51]">{testimonial.text?.fr || ''}</p>
            </article>
          ))}
        </div>
      </AdminDashboardCard>
    </div>
  )
}
