import { Upload } from 'lucide-react'
import AdminDashboardCard from './AdminDashboardCard'
import AdminFormImageGallery from './AdminFormImageGallery'

export default function AdminRoomsPanel({
  roomForm,
  setRoomForm,
  handleSubmitRoom,
  handleImagesSelected,
  setIsUploadingRoomImages,
  isUploadingRoomImages,
  roomFormImages,
  removeImageFromForm,
  rooms,
  handleEditRoom,
  handleDeleteRoom,
  emptyRoomForm,
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <AdminDashboardCard title={roomForm.id ? 'Modifier une chambre' : 'Nouvelle chambre'} eyebrow="Catalogue">
        <form onSubmit={handleSubmitRoom} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input value={roomForm.nameFr} onChange={(e) => setRoomForm((s) => ({ ...s, nameFr: e.target.value }))} placeholder="Nom FR" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
            <input value={roomForm.nameEn} onChange={(e) => setRoomForm((s) => ({ ...s, nameEn: e.target.value }))} placeholder="Nom EN" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <input value={roomForm.price} onChange={(e) => setRoomForm((s) => ({ ...s, price: e.target.value }))} placeholder="Prix" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
            <input value={roomForm.size} onChange={(e) => setRoomForm((s) => ({ ...s, size: e.target.value }))} placeholder="Taille" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
            <input value={roomForm.capacity} onChange={(e) => setRoomForm((s) => ({ ...s, capacity: e.target.value }))} placeholder="Capacite" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          </div>
          <input value={roomForm.image} onChange={(e) => setRoomForm((s) => ({ ...s, image: e.target.value }))} placeholder="Image principale" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          <input value={roomForm.gallery} onChange={(e) => setRoomForm((s) => ({ ...s, gallery: e.target.value }))} placeholder="Galerie, separee par des virgules" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          <label className="rounded-[22px] border border-dashed border-[#d9b7be] bg-[#fff8f7] p-4 text-sm text-[#7a5c61]">
            <span className="mb-3 flex items-center gap-2 font-semibold text-[#4e2c32]"><Upload size={16} /> Televerser des images</span>
            <input type="file" accept="image/*" multiple onChange={(event) => handleImagesSelected(event, setRoomForm, setIsUploadingRoomImages)} className="block w-full text-sm" />
            <span className="mt-2 block text-xs text-[#8d6c72]">{isUploadingRoomImages ? 'Chargement des images...' : 'Les images importees sont ajoutees a la galerie et peuvent devenir l image principale.'}</span>
          </label>
          <AdminFormImageGallery images={roomFormImages} mainImage={roomForm.image.trim()} onRemove={(image) => setRoomForm((current) => removeImageFromForm(current, image))} emptyText="Aucune image selectionnee pour cette chambre." />
          <div className="grid gap-4 md:grid-cols-2">
            <textarea value={roomForm.descriptionFr} onChange={(e) => setRoomForm((s) => ({ ...s, descriptionFr: e.target.value }))} placeholder="Description FR" className="min-h-[120px] rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] p-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
            <textarea value={roomForm.descriptionEn} onChange={(e) => setRoomForm((s) => ({ ...s, descriptionEn: e.target.value }))} placeholder="Description EN" className="min-h-[120px] rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] p-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input value={roomForm.amenitiesFr} onChange={(e) => setRoomForm((s) => ({ ...s, amenitiesFr: e.target.value }))} placeholder="Equipements FR" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
            <input value={roomForm.amenitiesEn} onChange={(e) => setRoomForm((s) => ({ ...s, amenitiesEn: e.target.value }))} placeholder="Amenities EN" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input value={roomForm.highlightsFr} onChange={(e) => setRoomForm((s) => ({ ...s, highlightsFr: e.target.value }))} placeholder="Points forts FR" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
            <input value={roomForm.highlightsEn} onChange={(e) => setRoomForm((s) => ({ ...s, highlightsEn: e.target.value }))} placeholder="Highlights EN" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] p-4 text-sm text-[#5c3b42]">
            <input type="checkbox" checked={roomForm.featured} onChange={(e) => setRoomForm((s) => ({ ...s, featured: e.target.checked }))} />
            Chambre mise en avant
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-2xl bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5d1824]">{roomForm.id ? 'Mettre a jour' : 'Enregistrer'}</button>
            {roomForm.id ? <button type="button" onClick={() => setRoomForm(emptyRoomForm())} className="rounded-2xl border border-[#7a2230]/14 bg-white px-5 py-3 text-sm font-semibold text-[#7a2230] transition hover:bg-[#fff3f1]">Reinitialiser</button> : null}
          </div>
        </form>
      </AdminDashboardCard>

      <AdminDashboardCard title="Chambres publiees" eyebrow="Inventaire" actions={<span className="rounded-full bg-[#f4dbe0] px-4 py-2 text-sm font-semibold text-[#7a2230]">{rooms.length} chambre{rooms.length > 1 ? 's' : ''}</span>}>
        <div className="grid gap-4">
          {rooms.map((room) => (
            <article key={room.id} className="rounded-[24px] border border-[#7a2230]/10 bg-[#fff8f7] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#2f1b1f]">{room.name?.fr ?? room.name}</h3>
                  <p className="mt-1 text-sm text-[#7a5c61]">{Number(room.price || 0).toLocaleString('fr-FR')} XOF / nuit</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleEditRoom(room)} className="rounded-full border border-[#7a2230]/14 bg-white px-4 py-2 text-sm font-semibold text-[#7a2230] transition hover:bg-[#fff3f1]">Modifier</button>
                  <button type="button" onClick={() => handleDeleteRoom(room.id)} className="rounded-full border border-[#d79aa5] bg-[#fff1f3] px-4 py-2 text-sm font-semibold text-[#b4233c] transition hover:bg-[#ffe4e8]">Supprimer</button>
                </div>
              </div>
              {room.image ? <img src={room.image} alt={room.name?.fr ?? room.name} className="mt-4 h-44 w-full rounded-[18px] object-cover" /> : null}
              <p className="mt-3 text-sm leading-7 text-[#6d4a51]">{room.description?.fr ?? room.description}</p>
            </article>
          ))}
        </div>
      </AdminDashboardCard>
    </div>
  )
}
