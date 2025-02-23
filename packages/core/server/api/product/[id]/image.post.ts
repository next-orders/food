import { createId, repository } from '@next-orders/database'
import sharp from 'sharp'

const ACCEPTED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'webp']
const IMAGE_SIZES = [120, 300, 600, 800]

export default defineEventHandler(async (event) => {
  try {
    const { productsDirectory, channelId } = useRuntimeConfig()
    const storage = useStorage('s3')

    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing id',
      })
    }

    const files = await readMultipartFormData(event)
    const file = files?.[0]
    if (!files?.length || !file) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing file',
      })
    }

    const metadata = await sharp(file.data.buffer as ArrayBuffer).metadata()

    if (!metadata?.format || !ACCEPTED_IMAGE_TYPES.includes(metadata?.format) || !metadata?.width || !metadata?.height) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file type',
      })
    }

    if (metadata.width > 8000 || metadata.height > 8000) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Image has too big dimensions',
      })
    }

    if (metadata.width < 120 || metadata.height < 120) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Image has too small dimensions',
      })
    }

    const mediaId = createId()

    for (const size of IMAGE_SIZES) {
      await sharp(file.data.buffer as ArrayBuffer)
        .resize({ width: size, height: size })
        .toFormat('jpg', { quality: 75 })
        .toBuffer()
        .then((data) => {
          storage.setItemRaw(`${productsDirectory}/${mediaId}/${size}.jpg`, data)
        })

      await sharp(file.data.buffer as ArrayBuffer)
        .resize({ width: size, height: size })
        .toFormat('webp', { quality: 75 })
        .toBuffer()
        .then((data) => {
          storage.setItemRaw(`${productsDirectory}/${mediaId}/${size}.webp`, data)
        })
    }

    await repository.media.create({ id: mediaId })

    const product = await repository.product.find(id)
    if (product?.mediaId) {
      // Remove old images
      for (const size of IMAGE_SIZES) {
        await storage.removeItem(`${productsDirectory}/${product.mediaId}/${size}.jpg`)
        await storage.removeItem(`${productsDirectory}/${product.mediaId}/${size}.webp`)
      }

      await repository.media.delete(product.mediaId)
    }

    await repository.product.patch(id, { mediaId })

    await repository.channel.setAsUpdated(channelId)

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
