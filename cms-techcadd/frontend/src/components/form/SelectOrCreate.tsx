import { useRef, useState } from 'react'
import { Check, X } from 'lucide-react'

import { Button } from '../common/Button'
import { Spinner } from '../feedback/Spinner'
import { Input } from './Input'
import { Select, type SelectOption } from './Select'

/**
 * A dropdown that can also make the thing it is choosing from.
 *
 * Filing a post under a category that does not exist yet used to mean
 * abandoning the form, creating the category on its own page, and coming back —
 * which is how posts end up under whatever category happened to be in the list.
 *
 * The two callers store their categories very differently — the blog keeps rows
 * with ids, FAQs keep a plain string on the record — so `onCreate` returns the
 * value to select rather than this component assuming either. For the blog that
 * means creating a row and handing back its id; for FAQs it is just the trimmed
 * name, and nothing is written until the FAQ itself is saved.
 */

/**
 * The sentinel for "create one".
 *
 * Deliberately not something an id or a category name could ever be: a real
 * value colliding with this would make that option un-selectable, and the bug
 * would only appear for whoever named a category the wrong thing.
 */
const CREATE = '__create__'

interface SelectOrCreateProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  /** Leading blank entry, e.g. "Uncategorised". */
  placeholder?: string
  /** Wording for the create entry and its input, e.g. "category". */
  noun?: string
  /**
   * Creates the new entry and returns the value to select.
   *
   * Rejecting leaves the input open with the message, so a duplicate name is
   * something the editor can correct rather than losing what they typed.
   */
  onCreate: (name: string) => Promise<string>
  invalid?: boolean
  disabled?: boolean
}

export function SelectOrCreate({
  value,
  onChange,
  options,
  placeholder,
  noun = 'category',
  onCreate,
  invalid,
  disabled,
}: SelectOrCreateProps) {
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function startCreating() {
    setName('')
    setError(null)
    setCreating(true)
    // Focused on the next frame: the input does not exist until this render
    // has committed.
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  async function confirm() {
    const trimmed = name.trim()
    if (!trimmed) {
      setError(`Give the ${noun} a name.`)
      return
    }

    setBusy(true)
    setError(null)
    try {
      onChange(await onCreate(trimmed))
      setCreating(false)
      setName('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : `Could not create the ${noun}.`)
    } finally {
      setBusy(false)
    }
  }

  if (creating) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={`New ${noun} name`}
            aria-label={`New ${noun} name`}
            invalid={Boolean(error)}
            disabled={busy}
            onKeyDown={(event) => {
              // Enter must not submit the form this sits inside — it would save
              // the post while the editor is still naming a category.
              if (event.key === 'Enter') {
                event.preventDefault()
                void confirm()
              }
              if (event.key === 'Escape') {
                event.preventDefault()
                setCreating(false)
              }
            }}
          />

          <Button
            type="button"
            size="sm"
            onClick={() => void confirm()}
            disabled={busy}
            aria-label={`Create this ${noun}`}
          >
            {busy ? <Spinner /> : <Check size={16} />}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setCreating(false)}
            disabled={busy}
            aria-label="Cancel"
          >
            <X size={16} />
          </Button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  }

  return (
    <Select
      value={value}
      invalid={invalid}
      disabled={disabled}
      placeholder={placeholder}
      options={[...options, { value: CREATE, label: `+ New ${noun}…` }]}
      onChange={(event) => {
        if (event.target.value === CREATE) startCreating()
        else onChange(event.target.value)
      }}
    />
  )
}
