import { galleryApi } from '../../api'
import { createResourceHooks } from '../shared/createResourceHooks'

export const albumHooks = createResourceHooks('gallery', galleryApi)
