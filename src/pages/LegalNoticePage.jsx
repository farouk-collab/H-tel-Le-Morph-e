import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'

export default function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-[#f7eaea] text-[#171717]">
      <Navbar />
      <main className="section-wrap py-16">
        <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
          <p className="text-xs uppercase tracking-[0.35em] text-black/45">Informations légales</p>
          <h1 className="mt-3 font-serif text-5xl">Mentions légales</h1>
          <div className="mt-8 space-y-6 text-sm leading-8 text-black/75">
            <p><strong>Éditeur :</strong> Hôtel Le Morphée.</p>
            <p><strong>Adresse :</strong> Rue 168 TOT, Lomé-Totsi, deuxième von à gauche après l’Église Catholique.</p>
            <p><strong>Téléphones :</strong> (+228) 92 72 72 78, (+228) 22 25 77 60, (+228) 93 07 08 61.</p>
            <p><strong>Emails :</strong> lemorphee28@gmail.com, hotellemorphee8@gmail.com.</p>
            <p><strong>Directeur de publication :</strong> l’équipe de gestion de l’Hôtel Le Morphée.</p>
            <p><strong>Objet du site :</strong> présentation de l’hôtel, gestion des réservations et information client.</p>
            <p><strong>Propriété intellectuelle :</strong> les textes, images et éléments visuels du site restent protégés. Toute réutilisation nécessite l’accord du titulaire des droits.</p>
            <p><strong>Paiement :</strong> des moyens de paiement électroniques peuvent être proposés via des partenaires techniques compatibles Flooz, TMoney et PayGate.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
