import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Image,
  Megaphone,
  Plus,
  Sparkles,
  Trash2,
  Type,
  Video,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { DropdownItem, DropdownMenu } from '../common/DropdownMenu'
import { FormField } from '../form/FormField'
import { ImageField } from '../form/ImageField'
import { Input } from '../form/Input'
import { NumberInput } from '../form/NumberInput'
import { RichTextEditor } from '../form/RichTextEditor'
import { Select } from '../form/Select'
import { Textarea } from '../form/Textarea'
import {
  BLOCK_TYPES,
  CTA_TONE_OPTIONS,
  IMAGE_WIDTH_OPTIONS,
  RECENT_SOURCE_OPTIONS,
  emptyBlock,
  type BlockType,
  type PageBlock,
} from './blockSchema'

/**
 * Builds a page out of blocks.
 *
 * Replaces a single rich-text box that could only hold prose. It also fixes the
 * failure that prompted it: with one Content editor far down the form, copy
 * typed into Summary instead never appeared on the page, and nothing said why.
 * Blocks are visible, named and in order, so an empty page looks empty here too.
 *
 * Reordering is up/down buttons rather than drag: the list is short, buttons
 * work on a phone and with a keyboard, and drag-and-drop for four items is a
 * dependency and an accessibility problem in exchange for nothing.
 */

const BLOCK_ICON: Record<BlockType, LucideIcon> = {
  text: Type,
  image: Image,
  video: Video,
  cta: Megaphone,
  recent: Sparkles,
}

const BLOCK_LABEL: Record<BlockType, string> = {
  text: 'Text',
  image: 'Image',
  video: 'Video',
  cta: 'Call to action',
  recent: 'Recent items',
}

/** A one-line summary, so a collapsed list still says what is on the page. */
function describe(block: PageBlock): string {
  switch (block.type) {
    case 'text':
      return block.heading || stripTags(block.body) || 'Empty'
    case 'image':
      return block.caption || block.image.alt || (block.image.id ? 'Image' : 'No image chosen')
    case 'video':
      return block.heading || block.caption || block.url || 'No link yet'
    case 'cta':
      return block.heading || 'Untitled panel'
    case 'recent': {
      const source = RECENT_SOURCE_OPTIONS.find((option) => option.value === block.source)
      return `${block.count} × ${source?.label ?? block.source}`
    }
  }
}

/** The editor stores HTML; a summary line wants words. */
function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
}

export function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: PageBlock[]
  onChange: (blocks: PageBlock[]) => void
}) {
  function update(index: number, changes: Partial<PageBlock>) {
    onChange(
      blocks.map((block, i) => (i === index ? ({ ...block, ...changes } as PageBlock) : block)),
    )
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= blocks.length) return

    const next = [...blocks]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved as PageBlock)
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {blocks.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          This page has no content yet. Add a block to start building it.
        </p>
      )}

      {blocks.map((block, index) => {
        const Icon = BLOCK_ICON[block.type]

        return (
          <div key={block.id} className="rounded-lg border border-slate-200">
            <header className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2">
              <GripVertical size={14} className="shrink-0 text-slate-300" aria-hidden="true" />
              <Icon size={14} className="shrink-0 text-slate-500" aria-hidden="true" />
              <Badge tone="neutral">{BLOCK_LABEL[block.type]}</Badge>
              <span className="min-w-0 flex-1 truncate text-xs text-slate-500">
                {describe(block)}
              </span>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Move ${BLOCK_LABEL[block.type]} block up`}
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <ChevronUp size={15} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Move ${BLOCK_LABEL[block.type]} block down`}
                disabled={index === blocks.length - 1}
                onClick={() => move(index, 1)}
              >
                <ChevronDown size={15} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Remove ${BLOCK_LABEL[block.type]} block`}
                onClick={() => onChange(blocks.filter((_, i) => i !== index))}
              >
                <Trash2 size={15} />
              </Button>
            </header>

            <div className="space-y-4 p-4">
              {block.type === 'text' && (
                <>
                  <FormField label="Heading" description="Optional.">
                    <Input
                      value={block.heading ?? ''}
                      onChange={(event) => update(index, { heading: event.target.value })}
                      placeholder="e.g. Who qualifies"
                    />
                  </FormField>
                  <FormField label="Text">
                    <RichTextEditor
                      value={block.body}
                      onChange={(value) => update(index, { body: value })}
                    />
                  </FormField>
                </>
              )}

              {block.type === 'image' && (
                <>
                  <FormField label="Image" required>
                    <ImageField
                      value={block.image.id ? block.image : null}
                      onChange={(value) =>
                        update(index, { image: value ?? { id: '', url: '', alt: '' } })
                      }
                      aspect="video"
                    />
                  </FormField>
                  <FormField
                    label="Caption"
                    description="Printed under the picture, and used as the alt text when the file has none."
                  >
                    <Input
                      value={block.caption ?? ''}
                      onChange={(event) => update(index, { caption: event.target.value })}
                    />
                  </FormField>
                  <FormField label="Width">
                    <Select
                      value={block.width}
                      onChange={(event) =>
                        update(index, { width: event.target.value as typeof block.width })
                      }
                      options={IMAGE_WIDTH_OPTIONS}
                    />
                  </FormField>
                </>
              )}

              {block.type === 'video' && (
                <>
                  <FormField
                    label="Video link"
                    required
                    description="A YouTube or Vimeo address. Paste it straight from the player."
                  >
                    <Input
                      value={block.url}
                      onChange={(event) => update(index, { url: event.target.value })}
                      placeholder="https://www.youtube.com/watch?v=…"
                      type="url"
                    />
                  </FormField>
                  <FormField label="Heading" description="Optional.">
                    <Input
                      value={block.heading ?? ''}
                      onChange={(event) => update(index, { heading: event.target.value })}
                    />
                  </FormField>
                  <FormField label="Caption" description="Printed under the player.">
                    <Input
                      value={block.caption ?? ''}
                      onChange={(event) => update(index, { caption: event.target.value })}
                    />
                  </FormField>
                </>
              )}

              {block.type === 'cta' && (
                <>
                  <FormField label="Heading" required>
                    <Input
                      value={block.heading}
                      onChange={(event) => update(index, { heading: event.target.value })}
                      placeholder="Ready to start?"
                    />
                  </FormField>
                  <FormField label="Supporting line">
                    <Textarea
                      rows={2}
                      value={block.body ?? ''}
                      onChange={(event) => update(index, { body: event.target.value })}
                    />
                  </FormField>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Button text" required>
                      <Input
                        value={block.buttonLabel}
                        onChange={(event) => update(index, { buttonLabel: event.target.value })}
                      />
                    </FormField>
                    <FormField
                      label="Button goes to"
                      required
                      description="A site path like /contact, or a full URL."
                    >
                      <Input
                        value={block.buttonHref}
                        onChange={(event) => update(index, { buttonHref: event.target.value })}
                      />
                    </FormField>
                  </div>
                  <FormField label="Style">
                    <Select
                      value={block.tone}
                      onChange={(event) =>
                        update(index, { tone: event.target.value as typeof block.tone })
                      }
                      options={CTA_TONE_OPTIONS}
                    />
                  </FormField>
                </>
              )}

              {block.type === 'recent' && (
                <>
                  <FormField
                    label="Show"
                    description="Pulled live from the site, so this stays current without anyone editing the page again."
                  >
                    <Select
                      value={block.source}
                      onChange={(event) =>
                        update(index, { source: event.target.value as typeof block.source })
                      }
                      options={RECENT_SOURCE_OPTIONS}
                    />
                  </FormField>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Heading" description="Optional.">
                      <Input
                        value={block.heading ?? ''}
                        onChange={(event) => update(index, { heading: event.target.value })}
                        placeholder="From the blog"
                      />
                    </FormField>
                    <FormField label="How many">
                      <NumberInput
                        value={block.count}
                        onChange={(value) =>
                          update(index, { count: value === '' ? 3 : Number(value) })
                        }
                        min={1}
                        max={12}
                      />
                    </FormField>
                  </div>
                </>
              )}
            </div>
          </div>
        )
      })}

      <DropdownMenu
        trigger={
          <Button type="button" variant="secondary" size="sm" icon={Plus}>
            Add block
          </Button>
        }
      >
        {BLOCK_TYPES.map((entry) => (
          <DropdownItem
            key={entry.type}
            icon={BLOCK_ICON[entry.type]}
            onSelect={() => onChange([...blocks, emptyBlock(entry.type)])}
          >
            {entry.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </div>
  )
}
