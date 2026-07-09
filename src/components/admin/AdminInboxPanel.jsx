import { useMemo, useState } from 'react'
import AdminDashboardCard from './AdminDashboardCard'
import { downloadCsv } from '../../lib/csv'

export default function AdminInboxPanel({ adminContacts, adminNewsletters }) {
  const [contactSearch, setContactSearch] = useState('')
  const [newsletterSearch, setNewsletterSearch] = useState('')

  const filteredContacts = useMemo(() => {
    const query = contactSearch.trim().toLowerCase()
    if (!query) return adminContacts

    return adminContacts.filter((contact) => (
      [contact.name, contact.email, contact.phone, contact.message]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    ))
  }, [adminContacts, contactSearch])

  const filteredNewsletters = useMemo(() => {
    const query = newsletterSearch.trim().toLowerCase()
    if (!query) return adminNewsletters

    return adminNewsletters.filter((newsletter) => (
      [newsletter.email, newsletter.status]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    ))
  }, [adminNewsletters, newsletterSearch])

  const exportContacts = () => {
    downloadCsv(`contacts-hotel-le-morphee-${new Date().toISOString().slice(0, 10)}.csv`, filteredContacts.map((contact) => ({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      message: contact.message || '',
      status: contact.status || '',
      source: contact.source || '',
      created_at: contact.createdAt || '',
    })))
  }

  const exportNewsletters = () => {
    downloadCsv(`newsletters-hotel-le-morphee-${new Date().toISOString().slice(0, 10)}.csv`, filteredNewsletters.map((newsletter) => ({
      email: newsletter.email,
      status: newsletter.status || '',
      source: newsletter.source || '',
      consent: newsletter.consent ? 'true' : 'false',
      created_at: newsletter.createdAt || '',
      updated_at: newsletter.updatedAt || '',
    })))
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <AdminDashboardCard
        title="Messages de contact"
        eyebrow="Inbox"
        actions={(
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={exportContacts} disabled={!filteredContacts.length} className="rounded-full border border-[#7a2230]/14 bg-white px-4 py-2 text-xs font-semibold text-[#7a2230] transition hover:bg-[#fff3f1] disabled:cursor-not-allowed disabled:opacity-50">
              Export CSV
            </button>
            <span className="rounded-full bg-[#f4dbe0] px-4 py-2 text-sm font-semibold text-[#7a2230]">{filteredContacts.length} message{filteredContacts.length > 1 ? 's' : ''}</span>
          </div>
        )}
      >
        <div className="mb-4 grid gap-3">
          <input
            value={contactSearch}
            onChange={(e) => setContactSearch(e.target.value)}
            placeholder="Rechercher par nom, email, telephone ou message"
            className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-sm text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white"
          />
        </div>
        <div className="grid gap-4">
          {filteredContacts.length ? filteredContacts.map((contact) => (
            <article key={contact.id} className="rounded-[24px] border border-[#7a2230]/10 bg-[#fff8f7] p-5 text-sm leading-7 text-[#6d4a51]">
              <p><strong className="text-[#3f252a]">Nom :</strong> {contact.name}</p>
              <p><strong className="text-[#3f252a]">Email :</strong> {contact.email}</p>
              {contact.phone ? <p><strong className="text-[#3f252a]">Telephone :</strong> {contact.phone}</p> : null}
              <p><strong className="text-[#3f252a]">Message :</strong> {contact.message}</p>
              <p><strong className="text-[#3f252a]">Recu le :</strong> {new Date(contact.createdAt).toLocaleString('fr-FR')}</p>
            </article>
          )) : <p className="text-sm text-[#7a5c61]">{adminContacts.length ? 'Aucun message ne correspond a cette recherche.' : 'Aucun message recu.'}</p>}
        </div>
      </AdminDashboardCard>

      <AdminDashboardCard
        title="Inscriptions newsletter"
        eyebrow="CRM leger"
        actions={(
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={exportNewsletters} disabled={!filteredNewsletters.length} className="rounded-full border border-[#7a2230]/14 bg-white px-4 py-2 text-xs font-semibold text-[#7a2230] transition hover:bg-[#fff3f1] disabled:cursor-not-allowed disabled:opacity-50">
              Export CSV
            </button>
            <span className="rounded-full bg-[#f4dbe0] px-4 py-2 text-sm font-semibold text-[#7a2230]">{filteredNewsletters.length} inscription{filteredNewsletters.length > 1 ? 's' : ''}</span>
          </div>
        )}
      >
        <div className="mb-4 grid gap-3">
          <input
            value={newsletterSearch}
            onChange={(e) => setNewsletterSearch(e.target.value)}
            placeholder="Rechercher par email ou statut"
            className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-sm text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white"
          />
        </div>
        <div className="grid gap-4">
          {filteredNewsletters.length ? filteredNewsletters.map((newsletter) => (
            <article key={newsletter.id} className="rounded-[24px] border border-[#7a2230]/10 bg-[#fff8f7] p-5 text-sm leading-7 text-[#6d4a51]">
              <p><strong className="text-[#3f252a]">Email :</strong> {newsletter.email}</p>
              <p><strong className="text-[#3f252a]">Statut :</strong> {newsletter.status}</p>
              <p><strong className="text-[#3f252a]">Inscrit le :</strong> {new Date(newsletter.createdAt).toLocaleString('fr-FR')}</p>
            </article>
          )) : <p className="text-sm text-[#7a5c61]">{adminNewsletters.length ? 'Aucune inscription ne correspond a cette recherche.' : 'Aucune inscription enregistree.'}</p>}
        </div>
      </AdminDashboardCard>
    </div>
  )
}
