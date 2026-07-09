import { Bell, Menu } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function AdminTopbar({
  navigate,
  setActiveSection,
  onOpenMenu,
  activeSectionLabel,
  notificationCount = 0,
  notifications = [],
  onOpenNotification,
  onMarkAllNotificationsAsRead,
}) {
  const [isNotificationPreviewOpen, setIsNotificationPreviewOpen] = useState(false)
  const previewRef = useRef(null)
  const previewNotifications = useMemo(
    () => notifications.filter((item) => item.isUnread).slice(0, 5),
    [notifications],
  )

  useEffect(() => {
    if (!isNotificationPreviewOpen) return

    const handlePointerDown = (event) => {
      if (previewRef.current && !previewRef.current.contains(event.target)) {
        setIsNotificationPreviewOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsNotificationPreviewOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isNotificationPreviewOpen])

  useEffect(() => {
    setIsNotificationPreviewOpen(false)
  }, [activeSectionLabel])

  return (
    <header className="rounded-[30px] border border-[#7a2230]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,246,244,0.92))] px-6 py-6 shadow-[0_20px_80px_rgba(122,34,48,0.08)] backdrop-blur">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex items-center gap-3 lg:hidden">
            <button type="button" onClick={onOpenMenu} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#7a2230]/12 bg-white text-[#7a2230]">
              <Menu size={18} />
            </button>
            <div className="min-w-0 rounded-full border border-[#7a2230]/10 bg-white/85 px-4 py-2">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#a07a82]">Section active</p>
              <p className="truncate text-sm font-semibold text-[#7a2230]">{activeSectionLabel}{notificationCount > 0 && activeSectionLabel === 'Notifications' ? ` (${notificationCount})` : ''}</p>
            </div>
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#a07a82]">Back-office independant</p>
          <h1 className="mt-3 font-serif text-5xl text-[#2f1b1f]">Pilotage hotelier</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#7a5c61]">
            Gerez les operations, le contenu, les messages et les paiements depuis une interface dediee qui ne depend plus de la navigation du site client.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div ref={previewRef} className="relative">
            <button type="button" onClick={() => setIsNotificationPreviewOpen((current) => !current)} className="relative rounded-full border border-[#7a2230]/12 bg-white px-5 py-3 text-sm font-semibold text-[#6d4a51] transition hover:border-[#7a2230]/30 hover:text-[#7a2230]">
              <span className="inline-flex items-center gap-2">
                <Bell size={16} />
                Notifications
              </span>
              {notificationCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex min-w-6 items-center justify-center rounded-full bg-[#7a2230] px-1.5 py-1 text-[11px] font-bold leading-none text-white">
                  {notificationCount}
                </span>
              ) : null}
            </button>
            {isNotificationPreviewOpen ? (
              <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-[min(92vw,24rem)] rounded-[28px] border border-[#7a2230]/10 bg-[linear-gradient(180deg,#fffdfc_0%,#fff4f2_100%)] p-4 shadow-[0_24px_80px_rgba(122,34,48,0.14)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#a07a82]">Notifications</p>
                    <p className="mt-1 text-sm font-semibold text-[#2f1b1f]">{notificationCount} non lue{notificationCount > 1 ? 's' : ''}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onMarkAllNotificationsAsRead?.()
                    }}
                    disabled={!notificationCount}
                    className="rounded-full border border-[#7a2230]/14 bg-white px-3 py-2 text-[11px] font-semibold text-[#7a2230] transition hover:bg-[#fff3f1] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Tout lire
                  </button>
                </div>
                <div className="mt-4 grid gap-3">
                  {previewNotifications.length ? previewNotifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => {
                        onOpenNotification?.(notification)
                        setIsNotificationPreviewOpen(false)
                      }}
                      className="rounded-[20px] border border-[#7a2230]/10 bg-white/80 p-4 text-left transition hover:border-[#7a2230]/28 hover:bg-white"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a2230]">{notification.category}</p>
                          <p className="mt-2 text-sm font-semibold text-[#2f1b1f]">{notification.title}</p>
                          <p className="mt-1 text-xs leading-6 text-[#7a5c61]">{notification.description}</p>
                        </div>
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#7a2230]" />
                      </div>
                    </button>
                  )) : <p className="rounded-[20px] border border-[#7a2230]/10 bg-white/80 px-4 py-5 text-sm text-[#7a5c61]">Aucune notification non lue.</p>}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('notifications')
                    setIsNotificationPreviewOpen(false)
                  }}
                  className="mt-4 w-full rounded-2xl bg-[#7a2230] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5d1824]"
                >
                  Voir toutes les notifications
                </button>
              </div>
            ) : null}
          </div>
          <button type="button" onClick={() => navigate('/')} className="rounded-full border border-[#7a2230]/12 bg-white px-5 py-3 text-sm font-semibold text-[#6d4a51] transition hover:border-[#7a2230]/30 hover:text-[#7a2230]">
            Voir le site
          </button>
          <button type="button" onClick={() => setActiveSection('payments')} className="rounded-full bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5d1824]">
            Aller aux paiements
          </button>
        </div>
      </div>
    </header>
  )
}
