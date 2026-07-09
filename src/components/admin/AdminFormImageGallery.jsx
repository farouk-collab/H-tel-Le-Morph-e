export default function AdminFormImageGallery({ images, mainImage, onRemove, emptyText }) {
  if (!images.length) {
    return <p className="text-xs leading-6 text-[#7a5c61]">{emptyText}</p>
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {images.map((image, index) => {
        const isMain = image === mainImage

        return (
          <div key={`${image}-${index}`} className="overflow-hidden rounded-[22px] border border-[#7a2230]/10 bg-[#fff8f7]">
            <img src={image} alt="Apercu" className="h-32 w-full object-cover" />
            <div className="flex items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a07a82]">{isMain ? 'Image principale' : 'Galerie'}</p>
                <p className="mt-1 truncate text-xs text-[#7a5c61]">{image.startsWith('data:image') ? 'Image televersee' : image}</p>
              </div>
              <button type="button" onClick={() => onRemove(image)} className="rounded-full border border-[#d79aa5] bg-[#fff1f3] px-3 py-2 text-xs font-semibold text-[#b4233c] transition hover:bg-[#ffe4e8]">
                Supprimer
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
