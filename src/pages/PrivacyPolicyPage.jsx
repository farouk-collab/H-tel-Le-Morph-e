import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f7eaea] text-[#171717]">
      <Navbar />
      <main className="section-wrap py-16">
        <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
          <p className="text-xs uppercase tracking-[0.35em] text-black/45">Conformité</p>
          <h1 className="mt-3 font-serif text-5xl">Politique de confidentialité</h1>
          <div className="mt-8 space-y-6 text-sm leading-8 text-black/75">
            <p>Cette page présente les informations minimales de transparence sur les données collectées via le site de l’Hôtel Le Morphée.</p>
            <p><strong>Responsable du traitement :</strong> Hôtel Le Morphée, Lomé-Totsi.</p>
            <p><strong>Données concernées :</strong> identité, email, téléphone, contenu de demande, réservation, historique de paiement.</p>
            <p><strong>Finalités :</strong> gérer les demandes de réservation, suivre les paiements, répondre aux demandes clients et administrer le site.</p>
            <p><strong>Base légale :</strong> exécution de mesures précontractuelles, exécution contractuelle, intérêt légitime pour la gestion du service.</p>
            <p><strong>Destinataires :</strong> personnel habilité de l’hôtel et prestataires techniques de paiement quand un paiement est initié.</p>
            <p><strong>Conservation :</strong> les données sont conservées pendant la durée nécessaire à la gestion de la réservation, du paiement et des obligations administratives applicables.</p>
            <p><strong>Droits :</strong> vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à l’hôtel via les contacts publiés sur le site.</p>
            <p><strong>Paiement :</strong> les paiements Flooz et TMoney sont préparés via un connecteur PayGate. Les identifiants de paiement et références de transaction peuvent être enregistrés pour le suivi comptable.</p>
            <p><strong>Cookies et stockage local :</strong> le site peut utiliser un stockage local technique pour maintenir la session utilisateur côté navigateur. Aucun bandeau cookies marketing n’est actuellement déployé.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
