import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import SectionTitle from '../components/ui/SectionTitle'
import { useSiteData } from '../context/SiteDataContext'
import { apiGet, apiPost } from '../lib/api'

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toLocalized(fr, en) {
  return { fr: fr.trim(), en: (en || fr).trim() }
}

function splitList(value) {
  return String(value || '').split(',').map((item) => item.trim()).filter(Boolean)
}

function uniqueList(items) {
  return Array.from(new Set(items.filter(Boolean)))
}

function getFormImages(form) {
  return uniqueList([form.image.trim(), ...splitList(form.gallery)])
}

function removeImageFromForm(current, imageToRemove) {
  const currentImage = current.image.trim()
  const remaining = getFormImages(current).filter((item) => item !== imageToRemove)
  const nextImage = currentImage === imageToRemove ? (remaining[0] || '') : currentImage
  const nextGallery = remaining.filter((item) => item !== nextImage)

  return {
    ...current,
    image: nextImage,
    gallery: nextGallery.join(', '),
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function emptyRoomForm() {
  return {
    id: null,
    nameFr: '',
    nameEn: '',
    price: '',
    size: '',
    capacity: '2',
    image: '',
    gallery: '',
    descriptionFr: '',
    descriptionEn: '',
    amenitiesFr: '',
    amenitiesEn: '',
    highlightsFr: '',
    highlightsEn: '',
    featured: false,
  }
}

function emptySpaceForm() {
  return {
    id: null,
    titleFr: '',
    titleEn: '',
    textFr: '',
    textEn: '',
    descriptionFr: '',
    descriptionEn: '',
    image: '',
    gallery: '',
    highlightsFr: '',
    highlightsEn: '',
    accent: 'from-[#f7d7de] to-[#7a2230]',
  }
}

function FormImageGallery({ images, mainImage, onRemove, emptyText }) {
  if (!images.length) {
    return <p className="text-xs leading-6 text-black/45">{emptyText}</p>
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {images.map((image, index) => {
        const isMain = image === mainImage

        return (
          <div key={`${image}-${index}`} className="overflow-hidden rounded-[24px] border border-black/10 bg-[#fbf6f4]">
            <img src={image} alt="Aperçu" className="h-32 w-full object-cover" />
            <div className="flex items-center justify-between gap-3 p-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">{isMain ? 'Image principale' : 'Galerie'}</p>
                <p className="mt-1 truncate text-xs text-black/60">{image.startsWith('data:image') ? 'Image téléversée' : image}</p>
              </div>
              <button type="button" onClick={() => onRemove(image)} className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600">
                Supprimer
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AdminLoginCard() {
  const { login, loading } = useSiteData()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await login(email, password)

    if (!result.ok) {
      setError(result.message)
      return
    }

    setError('')
  }

  return (
    <section className="section-wrap py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] bg-[#7a2230] p-8 text-white shadow-2xl shadow-black/10">
          <SectionTitle eyebrow="Admin" title="Connexion à l’administration" text="Cet accès s’appuie désormais sur l’API locale du projet, avec stockage serveur des données sensibles." />
          <div className="mt-8 rounded-[24px] border border-white/15 bg-white/10 p-5 text-sm leading-7 text-white/80">
            Compte initial : <strong>hotellemorphee8@gmail.com</strong> / <strong>admin123</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[32px] bg-white p-8 shadow-2xl shadow-black/10">
          <p className="text-xs uppercase tracking-[0.35em] text-black/45">Back-office</p>
          <h2 className="mt-3 font-serif text-4xl text-[#171717]">Bienvenue</h2>
          <div className="mt-8 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-black/80">Email</label>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-2xl border border-black/10 px-4" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-black/80">Mot de passe</label>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-2xl border border-black/10 px-4" />
            </div>
            {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
            <button type="submit" disabled={loading} className="rounded-2xl bg-[#7a2230] py-3 text-sm font-semibold text-white disabled:opacity-60">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

const HOTEL_FACTS = {
  roomCount: 14,
  ventilatedRooms: 3,
  airConditionedRooms: 11,
  eventSpaceCount: 3,
}

function AdminDashboard() {
  const navigate = useNavigate()
  const { user, authToken, logout, rooms, spaces, addRoom, updateRoom, deleteRoom, addSpace, updateSpace, deleteSpace } = useSiteData()
  const [roomForm, setRoomForm] = useState(emptyRoomForm())
  const [spaceForm, setSpaceForm] = useState(emptySpaceForm())
  const [adminReservations, setAdminReservations] = useState([])
  const [adminPayments, setAdminPayments] = useState([])
  const [flash, setFlash] = useState('')
  const [isUploadingRoomImages, setIsUploadingRoomImages] = useState(false)
  const [isUploadingSpaceImages, setIsUploadingSpaceImages] = useState(false)

  const roomFormImages = useMemo(() => getFormImages(roomForm), [roomForm])
  const spaceFormImages = useMemo(() => getFormImages(spaceForm), [spaceForm])

  const stats = useMemo(() => ([
    { label: 'Chambres', value: HOTEL_FACTS.roomCount, hint: `${rooms.length} types gérés (${HOTEL_FACTS.airConditionedRooms} climatisées, ${HOTEL_FACTS.ventilatedRooms} ventilées)` },
    { label: 'Salles & espaces', value: HOTEL_FACTS.eventSpaceCount, hint: '5 espaces/services gérés dans l’admin' },
    { label: 'Réservations', value: adminReservations.length, hint: 'Chambres et salles confondues' },
    { label: 'Paiements', value: adminPayments.length, hint: 'Transactions enregistrées' },
  ]), [rooms.length, spaces.length, adminReservations.length, adminPayments.length])

  const loadAdminData = async () => {
    if (!authToken) return

    try {
      const [reservationsData, paymentsData] = await Promise.all([
        apiGet('/api/admin/reservations', authToken),
        apiGet('/api/admin/payments', authToken),
      ])
      setAdminReservations(reservationsData.reservations || [])
      setAdminPayments(paymentsData.payments || [])
    } catch {
      setAdminReservations([])
      setAdminPayments([])
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [authToken])

  const showFlash = (message) => {
    setFlash(message)
    window.clearTimeout(showFlash.timeoutId)
    showFlash.timeoutId = window.setTimeout(() => setFlash(''), 2500)
  }

  const handleImagesSelected = async (event, setForm, setLoadingFlag) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    setLoadingFlag(true)

    try {
      const dataUrls = await Promise.all(files.map((file) => readFileAsDataUrl(file)))
      setForm((current) => {
        const mergedImages = uniqueList([...getFormImages(current), ...dataUrls])
        const nextMainImage = current.image || mergedImages[0] || ''

        return {
          ...current,
          image: nextMainImage,
          gallery: mergedImages.filter((item) => item !== nextMainImage).join(', '),
        }
      })
    } finally {
      setLoadingFlag(false)
      event.target.value = ''
    }
  }

  const handleRemoveRoomImage = (image) => {
    setRoomForm((current) => removeImageFromForm(current, image))
  }

  const handleRemoveSpaceImage = (image) => {
    setSpaceForm((current) => removeImageFromForm(current, image))
  }

  const handleEditRoom = (room) => {
    setRoomForm({
      id: room.id,
      nameFr: room.name?.fr || '',
      nameEn: room.name?.en || '',
      price: String(room.price || ''),
      size: room.size || '',
      capacity: String(room.capacity || 2),
      image: room.image || '',
      gallery: uniqueList(room.gallery || []).filter((item) => item !== room.image).join(', '),
      descriptionFr: room.description?.fr || '',
      descriptionEn: room.description?.en || '',
      amenitiesFr: (room.amenities || []).map((item) => item.fr || item).join(', '),
      amenitiesEn: (room.amenities || []).map((item) => item.en || item).join(', '),
      highlightsFr: (room.highlights?.fr || []).join(', '),
      highlightsEn: (room.highlights?.en || []).join(', '),
      featured: Boolean(room.featured),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEditSpace = (space) => {
    setSpaceForm({
      id: space.id,
      titleFr: space.title?.fr || '',
      titleEn: space.title?.en || '',
      textFr: space.text?.fr || '',
      textEn: space.text?.en || '',
      descriptionFr: space.description?.fr || '',
      descriptionEn: space.description?.en || '',
      image: space.image || '',
      gallery: uniqueList(space.gallery || []).filter((item) => item !== space.image).join(', '),
      highlightsFr: (space.highlights?.fr || []).join(', '),
      highlightsEn: (space.highlights?.en || []).join(', '),
      accent: space.accent || 'from-[#f7d7de] to-[#7a2230]',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmitRoom = async (event) => {
    event.preventDefault()
    const nameFr = roomForm.nameFr.trim()
    const image = roomForm.image.trim()

    if (!nameFr || !image) {
      showFlash('Le nom de la chambre et l’image principale sont obligatoires.')
      return
    }

    const amenitiesFr = splitList(roomForm.amenitiesFr)
    const amenitiesEn = splitList(roomForm.amenitiesEn)
    const highlightsFr = splitList(roomForm.highlightsFr)
    const highlightsEn = splitList(roomForm.highlightsEn)

    const payload = {
      slug: slugify(roomForm.nameFr),
      name: toLocalized(roomForm.nameFr, roomForm.nameEn),
      price: Number(roomForm.price || 0),
      size: roomForm.size.trim() || '20 m2',
      capacity: Number(roomForm.capacity || 2),
      description: toLocalized(roomForm.descriptionFr, roomForm.descriptionEn),
      amenities: amenitiesFr.map((item, index) => ({ fr: item, en: amenitiesEn[index] || item })),
      image,
      gallery: uniqueList([image, ...splitList(roomForm.gallery)]),
      featured: roomForm.featured,
      highlights: {
        fr: highlightsFr,
        en: highlightsEn.length ? highlightsEn : highlightsFr,
      },
    }

    try {
      if (roomForm.id) {
        await updateRoom(roomForm.id, payload)
        showFlash('Chambre mise à jour avec succès.')
      } else {
        await addRoom(payload)
        showFlash('Chambre ajoutée avec succès.')
      }
      setRoomForm(emptyRoomForm())
    } catch (error) {
      showFlash(error.message)
    }
  }

  const handleSubmitSpace = async (event) => {
    event.preventDefault()
    const titleFr = spaceForm.titleFr.trim()
    const image = spaceForm.image.trim()

    if (!titleFr || !image) {
      showFlash('Le nom de la salle et l’image principale sont obligatoires.')
      return
    }

    const highlightsFr = splitList(spaceForm.highlightsFr)
    const highlightsEn = splitList(spaceForm.highlightsEn)

    const payload = {
      slug: slugify(spaceForm.titleFr),
      title: toLocalized(spaceForm.titleFr, spaceForm.titleEn),
      text: toLocalized(spaceForm.textFr, spaceForm.textEn),
      description: toLocalized(spaceForm.descriptionFr, spaceForm.descriptionEn),
      image,
      gallery: uniqueList([image, ...splitList(spaceForm.gallery)]),
      accent: spaceForm.accent.trim() || 'from-[#f7d7de] to-[#7a2230]',
      highlights: {
        fr: highlightsFr,
        en: highlightsEn.length ? highlightsEn : highlightsFr,
      },
    }

    try {
      if (spaceForm.id) {
        await updateSpace(spaceForm.id, payload)
        showFlash('Salle mise à jour avec succès.')
      } else {
        await addSpace(payload)
        showFlash('Salle ajoutée avec succès.')
      }
      setSpaceForm(emptySpaceForm())
    } catch (error) {
      showFlash(error.message)
    }
  }

  const handleDeleteRoom = async (id) => {
    try {
      await deleteRoom(id)
      if (Number(roomForm.id) === Number(id)) {
        setRoomForm(emptyRoomForm())
      }
      showFlash('Chambre supprimée.')
    } catch (error) {
      showFlash(error.message)
    }
  }

  const handleDeleteSpace = async (id) => {
    try {
      await deleteSpace(id)
      if (Number(spaceForm.id) === Number(id)) {
        setSpaceForm(emptySpaceForm())
      }
      showFlash('Salle supprimée.')
    } catch (error) {
      showFlash(error.message)
    }
  }

  const handleCancelReservation = async (reservationId) => {
    try {
      await apiPost(`/api/admin/reservations/${reservationId}/cancel`, {}, authToken)
      await loadAdminData()
      showFlash('Réservation annulée.')
    } catch (error) {
      showFlash(error.message)
    }
  }

  return (
    <main className="section-wrap py-12">
      <div className="flex flex-col gap-4 rounded-[32px] bg-white p-8 shadow-xl shadow-black/5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-black/45">Administration sécurisée</p>
          <h1 className="mt-3 font-serif text-5xl">Tableau de bord</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/70">Connecté en tant que <strong>{user?.email}</strong>. Les chambres, salles, réservations et paiements sont pilotés par l’API locale du projet.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => navigate('/')} className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-black/80">Voir le site</button>
          <button type="button" onClick={logout} className="rounded-full bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white">Déconnexion</button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[24px] bg-white p-5 shadow-lg shadow-black/5">
            <p className="text-xs uppercase tracking-[0.25em] text-black/40">{stat.label}</p>
            <p className="mt-3 font-serif text-4xl">{stat.value}</p>
            <p className="mt-2 text-xs leading-5 text-black/50">{stat.hint}</p>
          </div>
        ))}
      </div>

      {flash ? <div className="mt-6 rounded-2xl bg-green-50 px-5 py-4 text-sm text-green-700">{flash}</div> : null}

      <div className="mt-10 grid gap-10">
        <section className="grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <form onSubmit={handleSubmitRoom} className="rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-3xl">{roomForm.id ? 'Modifier une chambre' : 'Ajouter une chambre'}</h2>
              {roomForm.id ? <button type="button" onClick={() => setRoomForm(emptyRoomForm())} className="text-sm font-semibold text-[#7a2230]">Annuler</button> : null}
            </div>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={roomForm.nameFr} onChange={(e) => setRoomForm((s) => ({ ...s, nameFr: e.target.value }))} placeholder="Nom FR" className="h-12 rounded-2xl border border-black/10 px-4" />
                <input value={roomForm.nameEn} onChange={(e) => setRoomForm((s) => ({ ...s, nameEn: e.target.value }))} placeholder="Nom EN" className="h-12 rounded-2xl border border-black/10 px-4" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <input value={roomForm.price} onChange={(e) => setRoomForm((s) => ({ ...s, price: e.target.value }))} placeholder="Prix" className="h-12 rounded-2xl border border-black/10 px-4" />
                <input value={roomForm.size} onChange={(e) => setRoomForm((s) => ({ ...s, size: e.target.value }))} placeholder="Taille" className="h-12 rounded-2xl border border-black/10 px-4" />
                <input value={roomForm.capacity} onChange={(e) => setRoomForm((s) => ({ ...s, capacity: e.target.value }))} placeholder="Capacité" className="h-12 rounded-2xl border border-black/10 px-4" />
              </div>
              <input value={roomForm.image} onChange={(e) => setRoomForm((s) => ({ ...s, image: e.target.value }))} placeholder="Image principale" className="h-12 rounded-2xl border border-black/10 px-4" />
              <input value={roomForm.gallery} onChange={(e) => setRoomForm((s) => ({ ...s, gallery: e.target.value }))} placeholder="Autres images, séparées par des virgules" className="h-12 rounded-2xl border border-black/10 px-4" />
              <label className="rounded-2xl border border-dashed border-black/15 p-4 text-sm text-black/70">
                <span className="mb-2 block font-medium text-black/80">Téléverser des images</span>
                <input type="file" accept="image/*" multiple onChange={(event) => handleImagesSelected(event, setRoomForm, setIsUploadingRoomImages)} className="block w-full text-sm" />
                <span className="mt-2 block text-xs text-black/45">{isUploadingRoomImages ? 'Chargement des images...' : 'Tu peux supprimer les anciennes images juste en dessous puis en ajouter de nouvelles.'}</span>
              </label>
              <div className="rounded-[24px] border border-black/10 p-4">
                <p className="mb-3 text-sm font-semibold text-black/80">Images actuelles de la chambre</p>
                <FormImageGallery images={roomFormImages} mainImage={roomForm.image.trim()} onRemove={handleRemoveRoomImage} emptyText="Aucune image sélectionnée pour cette chambre." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <textarea value={roomForm.descriptionFr} onChange={(e) => setRoomForm((s) => ({ ...s, descriptionFr: e.target.value }))} placeholder="Description FR" className="min-h-[120px] rounded-2xl border border-black/10 p-4" />
                <textarea value={roomForm.descriptionEn} onChange={(e) => setRoomForm((s) => ({ ...s, descriptionEn: e.target.value }))} placeholder="Description EN" className="min-h-[120px] rounded-2xl border border-black/10 p-4" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={roomForm.amenitiesFr} onChange={(e) => setRoomForm((s) => ({ ...s, amenitiesFr: e.target.value }))} placeholder="Équipements FR" className="h-12 rounded-2xl border border-black/10 px-4" />
                <input value={roomForm.amenitiesEn} onChange={(e) => setRoomForm((s) => ({ ...s, amenitiesEn: e.target.value }))} placeholder="Amenities EN" className="h-12 rounded-2xl border border-black/10 px-4" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={roomForm.highlightsFr} onChange={(e) => setRoomForm((s) => ({ ...s, highlightsFr: e.target.value }))} placeholder="Points forts FR" className="h-12 rounded-2xl border border-black/10 px-4" />
                <input value={roomForm.highlightsEn} onChange={(e) => setRoomForm((s) => ({ ...s, highlightsEn: e.target.value }))} placeholder="Highlights EN" className="h-12 rounded-2xl border border-black/10 px-4" />
              </div>
              <label className="flex items-center gap-3 rounded-2xl border border-black/10 p-4 text-sm">
                <input type="checkbox" checked={roomForm.featured} onChange={(e) => setRoomForm((s) => ({ ...s, featured: e.target.checked }))} />
                Afficher en chambre mise en avant
              </label>
              <button type="submit" className="rounded-2xl bg-[#7a2230] py-3 text-sm font-semibold text-white">{roomForm.id ? 'Mettre à jour la chambre' : 'Enregistrer la chambre'}</button>
            </div>
          </form>

          <section className="rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-black/40">Gestion chambres</p>
                <h2 className="mt-2 font-serif text-3xl">Chambres visibles pendant la modification</h2>
              </div>
              <span className="rounded-full bg-[#f7eaea] px-4 py-2 text-sm font-semibold text-[#7a2230]">{rooms.length} chambre{rooms.length > 1 ? 's' : ''}</span>
            </div>
            <div className="mt-6 grid gap-4">
              {rooms.map((room) => (
                <article key={room.id} className="rounded-[28px] border border-black/8 bg-[#fffdfc] p-5 shadow-lg shadow-black/5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl">{room.name?.fr ?? room.name}</h3>
                      <p className="mt-1 text-sm text-black/60">{Number(room.price || 0).toLocaleString('fr-FR')} XOF / nuit</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEditRoom(room)} className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black/80">Modifier</button>
                      <button type="button" onClick={() => handleDeleteRoom(room.id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">Supprimer</button>
                    </div>
                  </div>
                  {room.image ? <img src={room.image} alt={room.name?.fr ?? room.name} className="mt-4 h-44 w-full rounded-[18px] object-cover" /> : null}
                  <p className="mt-3 text-sm leading-7 text-black/70">{room.description?.fr ?? room.description}</p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <form onSubmit={handleSubmitSpace} className="rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-3xl">{spaceForm.id ? 'Modifier une salle' : 'Ajouter une salle'}</h2>
              {spaceForm.id ? <button type="button" onClick={() => setSpaceForm(emptySpaceForm())} className="text-sm font-semibold text-[#7a2230]">Annuler</button> : null}
            </div>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={spaceForm.titleFr} onChange={(e) => setSpaceForm((s) => ({ ...s, titleFr: e.target.value }))} placeholder="Titre FR" className="h-12 rounded-2xl border border-black/10 px-4" />
                <input value={spaceForm.titleEn} onChange={(e) => setSpaceForm((s) => ({ ...s, titleEn: e.target.value }))} placeholder="Titre EN" className="h-12 rounded-2xl border border-black/10 px-4" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <textarea value={spaceForm.textFr} onChange={(e) => setSpaceForm((s) => ({ ...s, textFr: e.target.value }))} placeholder="Texte court FR" className="min-h-[110px] rounded-2xl border border-black/10 p-4" />
                <textarea value={spaceForm.textEn} onChange={(e) => setSpaceForm((s) => ({ ...s, textEn: e.target.value }))} placeholder="Short text EN" className="min-h-[110px] rounded-2xl border border-black/10 p-4" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <textarea value={spaceForm.descriptionFr} onChange={(e) => setSpaceForm((s) => ({ ...s, descriptionFr: e.target.value }))} placeholder="Description FR" className="min-h-[120px] rounded-2xl border border-black/10 p-4" />
                <textarea value={spaceForm.descriptionEn} onChange={(e) => setSpaceForm((s) => ({ ...s, descriptionEn: e.target.value }))} placeholder="Description EN" className="min-h-[120px] rounded-2xl border border-black/10 p-4" />
              </div>
              <input value={spaceForm.image} onChange={(e) => setSpaceForm((s) => ({ ...s, image: e.target.value }))} placeholder="Image principale" className="h-12 rounded-2xl border border-black/10 px-4" />
              <input value={spaceForm.gallery} onChange={(e) => setSpaceForm((s) => ({ ...s, gallery: e.target.value }))} placeholder="Autres images, séparées par des virgules" className="h-12 rounded-2xl border border-black/10 px-4" />
              <input value={spaceForm.accent} onChange={(e) => setSpaceForm((s) => ({ ...s, accent: e.target.value }))} placeholder="Classe accent Tailwind" className="h-12 rounded-2xl border border-black/10 px-4" />
              <label className="rounded-2xl border border-dashed border-black/15 p-4 text-sm text-black/70">
                <span className="mb-2 block font-medium text-black/80">Téléverser des images</span>
                <input type="file" accept="image/*" multiple onChange={(event) => handleImagesSelected(event, setSpaceForm, setIsUploadingSpaceImages)} className="block w-full text-sm" />
                <span className="mt-2 block text-xs text-black/45">{isUploadingSpaceImages ? 'Chargement des images...' : 'Tu peux aussi retirer les anciennes images d’une salle avant d’en ajouter de nouvelles.'}</span>
              </label>
              <div className="rounded-[24px] border border-black/10 p-4">
                <p className="mb-3 text-sm font-semibold text-black/80">Images actuelles de la salle</p>
                <FormImageGallery images={spaceFormImages} mainImage={spaceForm.image.trim()} onRemove={handleRemoveSpaceImage} emptyText="Aucune image sélectionnée pour cette salle." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={spaceForm.highlightsFr} onChange={(e) => setSpaceForm((s) => ({ ...s, highlightsFr: e.target.value }))} placeholder="Points forts FR" className="h-12 rounded-2xl border border-black/10 px-4" />
                <input value={spaceForm.highlightsEn} onChange={(e) => setSpaceForm((s) => ({ ...s, highlightsEn: e.target.value }))} placeholder="Highlights EN" className="h-12 rounded-2xl border border-black/10 px-4" />
              </div>
              <button type="submit" className="rounded-2xl bg-[#7a2230] py-3 text-sm font-semibold text-white">{spaceForm.id ? 'Mettre à jour la salle' : 'Enregistrer la salle'}</button>
            </div>
          </form>

          <section className="rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-black/40">Gestion salles</p>
                <h2 className="mt-2 font-serif text-3xl">Salles & espaces</h2>
              </div>
              <span className="rounded-full bg-[#f7eaea] px-4 py-2 text-sm font-semibold text-[#7a2230]">{spaces.length} espace{spaces.length > 1 ? 's' : ''}</span>
            </div>
            <div className="mt-6 grid gap-4">
              {spaces.map((space) => (
                <article key={space.id} className="rounded-[28px] border border-black/8 bg-[#fffdfc] p-5 shadow-lg shadow-black/5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl">{space.title?.fr ?? space.title}</h3>
                      <p className="mt-1 text-sm text-black/60">{space.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEditSpace(space)} className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black/80">Modifier</button>
                      <button type="button" onClick={() => handleDeleteSpace(space.id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">Supprimer</button>
                    </div>
                  </div>
                  {space.image ? <img src={space.image} alt={space.title?.fr ?? space.title} className="mt-4 h-44 w-full rounded-[18px] object-cover" /> : null}
                  <p className="mt-3 text-sm leading-7 text-black/70">{space.description?.fr ?? space.description}</p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="grid gap-8 xl:grid-cols-2">
          <section className="rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
            <h2 className="font-serif text-3xl">Réservations reçues</h2>
            <div className="mt-6 grid gap-3">
              {adminReservations.length ? adminReservations.map((reservation) => (
                <div key={reservation.id} className="rounded-2xl border border-black/10 p-4 text-sm leading-7 text-black/75">
                  <p><strong>Client :</strong> {reservation.userName || reservation.userEmail || 'Non renseigné'}</p>
                  <p><strong>Chambre :</strong> {reservation.roomName}</p>
                  <p><strong>Période :</strong> {reservation.checkIn || '...'} au {reservation.checkOut || '...'}</p>
                  <p><strong>Statut :</strong> {reservation.status || 'pending'}</p>
                  {reservation.status !== 'canceled' && reservation.paymentStatus !== 'completed' ? (
                    <button type="button" onClick={() => handleCancelReservation(reservation.id)} className="mt-3 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">
                      Annuler la réservation
                    </button>
                  ) : reservation.status === 'canceled' ? <p className="mt-3 text-xs text-red-600">Réservation déjà annulée.</p> : <p className="mt-3 text-xs text-black/55">Réservation payée : annulation manuelle uniquement.</p>}
                </div>
              )) : <p className="text-sm text-black/55">Aucune réservation enregistrée.</p>}
            </div>
          </section>

          <section className="rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
            <h2 className="font-serif text-3xl">Paiements</h2>
            <div className="mt-6 grid gap-3">
              {adminPayments.length ? adminPayments.map((payment) => (
                <div key={payment.id} className="rounded-2xl border border-black/10 p-4 text-sm leading-7 text-black/75">
                  <p><strong>Référence :</strong> {payment.reference}</p>
                  <p><strong>Montant :</strong> {Number(payment.amount || 0).toLocaleString('fr-FR')} XOF</p>
                  <p><strong>Canal :</strong> {payment.provider}</p>
                  <p><strong>Statut :</strong> {payment.status}</p>
                </div>
              )) : <p className="text-sm text-black/55">Aucun paiement enregistré.</p>}
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}

export default function AdminPage() {
  const navigate = useNavigate()
  const { user, isAdmin, logout } = useSiteData()

  return (
    <div className="min-h-screen bg-[#f7eaea] text-[#171717]">
      <Navbar onBookNow={() => navigate('/#reservation')} isAdminAuthenticated={!!isAdmin} onLogout={logout} />
      {!user ? <AdminLoginCard /> : isAdmin ? <AdminDashboard /> : (
        <main className="section-wrap py-20">
          <div className="rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
            <h1 className="font-serif text-4xl">Accès refusé</h1>
            <p className="mt-4 text-sm leading-7 text-black/70">Ce compte n’a pas les droits d’administration.</p>
          </div>
        </main>
      )}
      <Footer />
    </div>
  )
}





