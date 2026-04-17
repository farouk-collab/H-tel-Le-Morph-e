import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'

export default function Hero({ booking, setBooking, onSearch }) {
  const { language } = useLanguage()

  return (
    <section id="accueil" className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,10,10,.78), rgba(10,10,10,.34)), url('/images/hero.jpeg')",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(122,34,48,0.28),transparent_30%)]" />

      <div className="section-wrap relative grid min-h-[92vh] items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          className="max-w-2xl text-white"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-6 inline-flex items-center gap-4 rounded-[28px] border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <img src="/images/logo-hotel-le-morphee.jpg" alt="Logo Hôtel Le Morphée" className="h-16 w-16 rounded-full bg-white object-cover shadow-lg" />
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-white/65">Hôtel Le Morphée</p>
              <p className="mt-1 text-sm text-white/85">Lomé-Totsi</p>
            </div>
          </div>

          <p className="mb-4 text-xs uppercase tracking-[0.45em] text-white/65">
            {language === 'fr' ? 'Totsi | Lomé | Hôtel business' : 'Totsi | Lome | Business hotel'}
          </p>
          <h2 className="font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">
            {language === 'fr' ? 'Hôtel Le Morphée à Lomé.' : 'Hôtel Le Morphée in Lome.'}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
            {language === 'fr'
              ? 'Situé rue 168 TOT à Lomé-Totsi, l’Hôtel Le Morphée dispose de 14 chambres, d’une salle de conférence, d’une place des fêtes et d’une esplanade pour les séjours, les rendez-vous professionnels et les moments à partager.'
              : 'Located on Rue 168 TOT in Lome-Totsi, Hôtel Le Morphée offers 14 rooms, a conference room, an event venue and an esplanade for stays, business appointments and shared moments.'}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={onSearch} className="rounded-full bg-white px-6 py-3 font-semibold text-black shadow-xl shadow-black/10">
              {language === 'fr' ? 'Vérifier la disponibilité' : 'Check availability'}
            </button>
            <a href="/#chambres" className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white backdrop-blur-sm">
              {language === 'fr' ? 'Voir les chambres' : 'View rooms'}
            </a>
          </div>
        </motion.div>

        <motion.div
          className="rounded-[30px] border border-white/15 bg-white/90 p-5 shadow-2xl backdrop-blur-md sm:p-7"
          initial={{ opacity: 0, y: 48, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          whileHover={{ rotateX: -6, rotateY: 6, y: -8 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-black/50">{language === 'fr' ? 'Réservation' : 'Reservation'}</p>
          <h3 className="mt-2 font-serif text-3xl">{language === 'fr' ? 'Préparez votre séjour à Totsi' : 'Plan your stay in Totsi'}</h3>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              {language === 'fr' ? "Date d'arrivée" : 'Arrival date'}
              <input type="date" value={booking.checkIn} onChange={(event) => setBooking((state) => ({ ...state, checkIn: event.target.value }))} className="rounded-2xl border border-black/10 bg-white px-4 py-3" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              {language === 'fr' ? 'Date de départ' : 'Departure date'}
              <input type="date" value={booking.checkOut} onChange={(event) => setBooking((state) => ({ ...state, checkOut: event.target.value }))} className="rounded-2xl border border-black/10 bg-white px-4 py-3" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              {language === 'fr' ? 'Nombre de personnes' : 'Guests'}
              <select value={booking.guests} onChange={(event) => setBooking((state) => ({ ...state, guests: event.target.value }))} className="rounded-2xl border border-black/10 bg-white px-4 py-3">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </label>
            <button type="button" onClick={onSearch} className="rounded-2xl bg-[#7a2230] py-3 font-semibold text-white shadow-xl shadow-[#7a2230]/20 hover:bg-[#54131d]">
              {language === 'fr' ? 'Rechercher' : 'Search'}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
