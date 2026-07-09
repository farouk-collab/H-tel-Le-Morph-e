import { Upload } from 'lucide-react'
import AdminDashboardCard from './AdminDashboardCard'
import AdminFormImageGallery from './AdminFormImageGallery'

export default function AdminSpacesPanel({
  spaceForm,
  setSpaceForm,
  handleSubmitSpace,
  handleImagesSelected,
  setIsUploadingSpaceImages,
  isUploadingSpaceImages,
  spaceFormImages,
  removeImageFromForm,
  spaces,
  handleEditSpace,
  handleDeleteSpace,
  emptySpaceForm,
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <AdminDashboardCard title={spaceForm.id ? 'Modifier une salle' : 'Nouvelle salle'} eyebrow="Evenementiel">
        <form onSubmit={handleSubmitSpace} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input value={spaceForm.titleFr} onChange={(e) => setSpaceForm((s) => ({ ...s, titleFr: e.target.value }))} placeholder="Titre FR" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
            <input value={spaceForm.titleEn} onChange={(e) => setSpaceForm((s) => ({ ...s, titleEn: e.target.value }))} placeholder="Titre EN" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <textarea value={spaceForm.textFr} onChange={(e) => setSpaceForm((s) => ({ ...s, textFr: e.target.value }))} placeholder="Texte court FR" className="min-h-[110px] rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] p-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
            <textarea value={spaceForm.textEn} onChange={(e) => setSpaceForm((s) => ({ ...s, textEn: e.target.value }))} placeholder="Short text EN" className="min-h-[110px] rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] p-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <textarea value={spaceForm.descriptionFr} onChange={(e) => setSpaceForm((s) => ({ ...s, descriptionFr: e.target.value }))} placeholder="Description FR" className="min-h-[120px] rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] p-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
            <textarea value={spaceForm.descriptionEn} onChange={(e) => setSpaceForm((s) => ({ ...s, descriptionEn: e.target.value }))} placeholder="Description EN" className="min-h-[120px] rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] p-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          </div>
          <input value={spaceForm.image} onChange={(e) => setSpaceForm((s) => ({ ...s, image: e.target.value }))} placeholder="Image principale" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          <input value={spaceForm.gallery} onChange={(e) => setSpaceForm((s) => ({ ...s, gallery: e.target.value }))} placeholder="Galerie, separee par des virgules" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          <input value={spaceForm.accent} onChange={(e) => setSpaceForm((s) => ({ ...s, accent: e.target.value }))} placeholder="Classe accent Tailwind" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          <label className="rounded-[22px] border border-dashed border-[#d9b7be] bg-[#fff8f7] p-4 text-sm text-[#7a5c61]">
            <span className="mb-3 flex items-center gap-2 font-semibold text-[#4e2c32]"><Upload size={16} /> Televerser des images</span>
            <input type="file" accept="image/*" multiple onChange={(event) => handleImagesSelected(event, setSpaceForm, setIsUploadingSpaceImages)} className="block w-full text-sm" />
            <span className="mt-2 block text-xs text-[#8d6c72]">{isUploadingSpaceImages ? 'Chargement des images...' : 'Les fichiers importes alimentent la galerie de la salle.'}</span>
          </label>
          <AdminFormImageGallery images={spaceFormImages} mainImage={spaceForm.image.trim()} onRemove={(image) => setSpaceForm((current) => removeImageFromForm(current, image))} emptyText="Aucune image selectionnee pour cette salle." />
          <div className="grid gap-4 md:grid-cols-2">
            <input value={spaceForm.highlightsFr} onChange={(e) => setSpaceForm((s) => ({ ...s, highlightsFr: e.target.value }))} placeholder="Points forts FR" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
            <input value={spaceForm.highlightsEn} onChange={(e) => setSpaceForm((s) => ({ ...s, highlightsEn: e.target.value }))} placeholder="Highlights EN" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-2xl bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5d1824]">{spaceForm.id ? 'Mettre a jour' : 'Enregistrer'}</button>
            {spaceForm.id ? <button type="button" onClick={() => setSpaceForm(emptySpaceForm())} className="rounded-2xl border border-[#7a2230]/14 bg-white px-5 py-3 text-sm font-semibold text-[#7a2230] transition hover:bg-[#fff3f1]">Reinitialiser</button> : null}
          </div>
        </form>
      </AdminDashboardCard>

      <AdminDashboardCard title="Salles et espaces" eyebrow="Catalogue" actions={<span className="rounded-full bg-[#f4dbe0] px-4 py-2 text-sm font-semibold text-[#7a2230]">{spaces.length} espace{spaces.length > 1 ? 's' : ''}</span>}>
        <div className="grid gap-4">
          {spaces.map((space) => (
            <article key={space.id} className="rounded-[24px] border border-[#7a2230]/10 bg-[#fff8f7] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#2f1b1f]">{space.title?.fr ?? space.title}</h3>
                  <p className="mt-1 text-sm text-[#7a5c61]">{space.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleEditSpace(space)} className="rounded-full border border-[#7a2230]/14 bg-white px-4 py-2 text-sm font-semibold text-[#7a2230] transition hover:bg-[#fff3f1]">Modifier</button>
                  <button type="button" onClick={() => handleDeleteSpace(space.id)} className="rounded-full border border-[#d79aa5] bg-[#fff1f3] px-4 py-2 text-sm font-semibold text-[#b4233c] transition hover:bg-[#ffe4e8]">Supprimer</button>
                </div>
              </div>
              {space.image ? <img src={space.image} alt={space.title?.fr ?? space.title} className="mt-4 h-44 w-full rounded-[18px] object-cover" /> : null}
              <p className="mt-3 text-sm leading-7 text-[#6d4a51]">{space.description?.fr ?? space.description}</p>
            </article>
          ))}
        </div>
      </AdminDashboardCard>
    </div>
  )
}
