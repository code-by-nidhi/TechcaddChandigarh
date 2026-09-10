import { useState } from 'react'
import { ChevronLeft, ChevronRight, ImagePlus, Trash2 } from 'lucide-react'

import { assetUrl } from '../../api/client'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/form/Input'
import { MediaPicker } from '../../components/media/MediaPicker'
import type { MediaRef } from '../../types'

export type EventPhoto = MediaRef & { caption?: string }

/**
 * The event's photographs, in the order the page shows them.
 *
 * An event page is mostly a record of something that already happened, and
 * pictures are what carry that — a paragraph describing a summit convinces
 * nobody it took place. So this is the main thing on the form, not an
 * afterthought beside a cover image.
 *
 * Left/right buttons rather than drag: the set is short, they work on a phone
 * and with a keyboard, and drag-and-drop for a dozen thumbnails is a
 * dependency and an accessibility problem in exchange for nothing.
 */
export function EventPhotos({
  photos,
  onChange,
}: {
  photos: EventPhoto[]
  onChange: (photos: EventPhoto[]) => void
}) {
  const [pickerOpen, setPickerOpen] = useState(false)

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= photos.length) return

    const next = [...photos]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved as EventPhoto)
    onChange(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {photos.length === 0
            ? 'No photographs yet.'
            : `${photos.length} photo${photos.length === 1 ? '' : 's'}, shown in this order.`}
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          icon={ImagePlus}
          onClick={() => setPickerOpen(true)}
        >
          Add photos
        </Button>
      </div>

      {photos.length > 0 && (
        <ul className="space-y-3">
          {photos.map((photo, index) => (
            <li
              key={`${photo.id}-${index}`}
              className="flex items-center gap-3 rounded-lg border border-slate-200 p-2"
            >
              <img
                src={assetUrl(photo.url)}
                alt=""
                className="size-16 shrink-0 rounded object-cover"
                loading="lazy"
              />

              {/*
                * A caption per placement, not per file: the same photo used on
                * two events is captioned differently for each, and the media
                * library's alt text describes the image rather than the moment.
                */}
              <div className="min-w-0 flex-1">
                <Input
                  value={photo.caption ?? ''}
                  onChange={(event) =>
                    onChange(
                      photos.map((entry, i) =>
                        i === index ? { ...entry, caption: event.target.value } : entry,
                      ),
                    )
                  }
                  placeholder="Caption — also the alt text for this photo"
                  aria-label={`Caption for photo ${index + 1}`}
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Move photo ${index + 1} earlier`}
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <ChevronLeft size={15} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Move photo ${index + 1} later`}
                disabled={index === photos.length - 1}
                onClick={() => move(index, 1)}
              >
                <ChevronRight size={15} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Remove photo ${index + 1}`}
                onClick={() => onChange(photos.filter((_, i) => i !== index))}
              >
                <Trash2 size={15} />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        multiple
        onSelect={(items) => {
          // Appended rather than replacing, so a second trip to the library
          // adds to the set instead of discarding what is already there.
          onChange([...photos, ...items.map((item) => ({ ...item, caption: item.alt ?? '' }))])
          setPickerOpen(false)
        }}
      />
    </div>
  )
}
