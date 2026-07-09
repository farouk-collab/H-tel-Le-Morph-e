import { useMemo, useState } from 'react'
import AdminDashboardCard from './AdminDashboardCard'

function toneClasses(tone) {
  switch (tone) {
    case 'success':
      return 'border-[#b9e4c8] bg-[#eef9f2] text-[#17603a]'
    case 'warning':
      return 'border-[#f1d39f] bg-[#fff7e8] text-[#9a5b00]'
    case 'danger':
      return 'border-[#efc2ca] bg-[#fff1f3] text-[#b4233c]'
    default:
      return 'border-[#dfbcc4] bg-[#f8ecef] text-[#7a2230]'
  }
}

export default function AdminNotificationsPanel({ notifications, onOpenNotification, onMarkAsRead, onMarkAllAsRead }) {
  const [priorityFilter, setPriorityFilter] = useState('all')
  const unreadCount = notifications.filter((item) => item.isUnread).length
  const urgentCount = notifications.filter((item) => item.tone === 'danger' || item.tone === 'warning').length
  const filteredNotifications = useMemo(() => {
    if (priorityFilter === 'all') return notifications
    return notifications.filter((item) => item.tone === priorityFilter)
  }, [notifications, priorityFilter])

  return (
    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
      <AdminDashboardCard
        title="Centre de notifications"
        eyebrow="Supervision"
        actions={(
          <button
            type="button"
            onClick={onMarkAllAsRead}
            disabled={!unreadCount}
            className="rounded-full border border-[#7a2230]/14 bg-white px-4 py-2 text-xs font-semibold text-[#7a2230] transition hover:bg-[#fff3f1] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tout marquer comme lu
          </button>
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-[#7a2230]/10 bg-[#fff8f7] p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#a07a82]">A lire</p>
            <p className="mt-3 font-serif text-4xl text-[#2f1b1f]">{unreadCount}</p>
            <p className="mt-2 text-sm leading-6 text-[#7a5c61]">Elements recents a verifier en priorite.</p>
          </div>
          <div className="rounded-[24px] border border-[#7a2230]/10 bg-[#fff8f7] p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#a07a82]">Prioritaires</p>
            <p className="mt-3 font-serif text-4xl text-[#2f1b1f]">{urgentCount}</p>
            <p className="mt-2 text-sm leading-6 text-[#7a5c61]">Paiements en attente, annulations ou demandes chaudes.</p>
          </div>
        </div>
      </AdminDashboardCard>

      <AdminDashboardCard title="Flux recent" eyebrow="Evenements">
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            ['all', 'Tout'],
            ['danger', 'Critique'],
            ['warning', 'En attente'],
            ['success', 'Valide'],
            ['default', 'Info'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPriorityFilter(value)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                priorityFilter === value
                  ? 'bg-[#7a2230] text-white'
                  : 'border border-[#7a2230]/14 bg-white text-[#7a2230] hover:bg-[#fff3f1]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="grid gap-4">
          {filteredNotifications.length ? filteredNotifications.map((notification) => (
            <article key={notification.id} className="rounded-[24px] border border-[#7a2230]/10 bg-[#fff8f7] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${toneClasses(notification.tone)}`}>
                      {notification.category}
                    </span>
                    {notification.isUnread ? (
                      <span className="rounded-full border border-[#dfbcc4] bg-[#f8ecef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a2230]">
                        Nouveau
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-[#2f1b1f]">{notification.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6d4a51]">{notification.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {notification.actionLabel ? (
                      <button
                        type="button"
                        onClick={() => onOpenNotification?.(notification)}
                        className="rounded-full border border-[#7a2230]/14 bg-white px-4 py-2 text-xs font-semibold text-[#7a2230] transition hover:bg-[#fff3f1]"
                      >
                        {notification.actionLabel}
                      </button>
                    ) : null}
                    {notification.isUnread ? (
                      <button
                        type="button"
                        onClick={() => onMarkAsRead?.(notification.id)}
                        className="rounded-full border border-[#dfbcc4] bg-[#f8ecef] px-4 py-2 text-xs font-semibold text-[#7a2230] transition hover:bg-[#f4dbe0]"
                      >
                        Marquer comme lu
                      </button>
                    ) : null}
                  </div>
                </div>
                <p className="text-xs text-[#8d6c72]">{notification.whenLabel}</p>
              </div>
            </article>
          )) : <p className="text-sm text-[#7a5c61]">Aucune notification pour ce filtre.</p>}
        </div>
      </AdminDashboardCard>
    </div>
  )
}
