import { useCallback } from 'react'

import { ApiError } from '../../api'
import { useToast } from '../../hooks/useToast'
import type { ContentStatus } from '../../types'

interface Publishable {
  id: string
  status: ContentStatus
}

/**
 * Publish and unpublish from a listing row.
 *
 * The alternative is opening the record, changing a select and saving — three
 * steps to take one answer off the website, which is exactly the moment
 * somebody is in a hurry. Unpublishing returns the record to `draft` rather
 * than deleting it: taking something down and throwing it away are different
 * intentions, and only one of them is reversible.
 *
 * Shared by the blog, FAQ and review lists so the wording and the failure
 * behaviour are the same in all three.
 */
export function usePublishToggle<T extends Publishable>(
  save: (id: string, status: ContentStatus) => Promise<unknown>,
  noun: string,
) {
  const toast = useToast()

  return useCallback(
    async (record: T) => {
      const next: ContentStatus = record.status === 'published' ? 'draft' : 'published'

      try {
        await save(record.id, next)
        toast.success(next === 'published' ? `Published this ${noun}.` : `Unpublished this ${noun}.`)
      } catch (error) {
        toast.error(`Could not update this ${noun}`, {
          description: error instanceof ApiError ? error.message : 'Please try again.',
        })
      }
    },
    [save, noun, toast],
  )
}
