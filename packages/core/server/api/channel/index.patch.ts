import { getChannel, patchChannel } from '../../../server/services/db/channel'
import { channelUpdateSchema } from './../../../shared/services/channel'

export default defineEventHandler(async (event) => {
  try {
    const { channelId } = useRuntimeConfig()

    const body = await readBody(event)
    const data = channelUpdateSchema.parse(body)

    const channel = await getChannel(channelId)
    if (!channel) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Channel not found',
      })
    }

    const name = data?.name ? updateLocaleValues(channel.name, { locale: data.locale, value: data.name }) : channel.name
    const description = data?.description ? updateLocaleValues(channel.description, { locale: data.locale, value: data.description }) : channel.description
    const conditions = data?.conditions ? updateLocaleValues(channel.conditions, { locale: data.locale, value: data.conditions }) : channel.conditions

    await patchChannel(channelId, {
      ...data,
      name,
      description,
      conditions,
    } as Partial<Channel>)

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
