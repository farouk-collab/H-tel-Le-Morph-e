import { ExternalLink, MapPin, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionTitle from '../ui/SectionTitle'

export default function ContactSection() {
  return (
    <section id="contact" className="section-wrap grid gap-8 py-20 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <SectionTitle
          eyebrow="Contact"
          title="Retrouvez l’hôtel à Totsivi"
          text="Les coordonnées ci-dessous reprennent les informations publiques disponibles pour l’Hôtel Le Morphée à Lomé."
        />

        <div className="mt-8 grid gap-4">
          {[
            ['Adresse', 'Rue 168 TOT, Lomé-Totsi, deuxième von à gauche après l’Église Catholique'],
            ['Téléphone', '(+228) 92 72 72 78'],
            ['Autres numéros', '(+228) 22 25 77 60 / (+228) 93 07 08 61'],
            ['Email', 'lemorphee28@gmail.com / hotellemorphee8@gmail.com'],
            ['Repère', 'Près de la paroisse Saint-Esprit de Totsi et du marché de Totsi'],
          ].map(([title, text], index) => (
            <motion.div
              key={title}
              className="rounded-[24px] bg-white p-5 shadow-lg shadow-black/5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              whileHover={{ y: -4, rotateX: -3, rotateY: 3 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-1 text-sm text-black/75">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="overflow-hidden rounded-[32px] bg-white p-3 shadow-2xl shadow-black/10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -6, rotateX: -4, rotateY: 4 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="overflow-hidden rounded-[28px] border border-black/5">
          <div className="flex items-center justify-between bg-[linear-gradient(135deg,#7f1d2d,#d8a2ad)] px-5 py-4 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/70">Localisation</p>
              <h3 className="mt-2 font-serif text-3xl">Rue 168 TOT, Totsivi</h3>
            </div>
            <MapPin className="shrink-0" size={22} />
          </div>

          <iframe
            title="Carte Hôtel Le Morphée"
            src="https://www.openstreetmap.org/export/embed.html?bbox=1.1815%2C6.1937%2C1.1870%2C6.1978&layer=mapnik&marker=6.19584%2C1.18426"
            className="h-[360px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          <div className="flex flex-col gap-3 bg-[#fcf6f7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-black/75">
              Coordonnées : 6.19584, 1.18426
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.openstreetmap.org/?mlat=6.19584&mlon=1.18426#map=18/6.19584/1.18426"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black"
              >
                <ExternalLink size={16} />
                Ouvrir la carte
              </a>
              <a
                href="tel:+22892727278"
                className="inline-flex items-center gap-2 rounded-full bg-[#7a2230] px-4 py-2 text-sm font-semibold text-white"
              >
                <Phone size={16} />
                Appeler
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

