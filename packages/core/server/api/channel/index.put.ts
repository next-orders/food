import { createChannel, getChannel } from '../../../server/services/db/channel'
import { createWorkingDays } from '../../../server/services/db/work'
import { channelCreateSchema } from './../../../shared/services/channel'

export default defineEventHandler(async (event) => {
  try {
    const { channelId } = useRuntimeConfig()

    // Guard: If channel already exists
    const channel = await getChannel(channelId)
    if (channel) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Channel already exists',
      })
    }

    const body = await readBody(event)
    const data = channelCreateSchema.parse(body)

    const name = updateLocaleValues([], { locale: data.defaultLocale as Locale, value: data.name })

    await createChannel({
      id: channelId,
      slug: channelId,
      name,
      currencyCode: data.currencyCode as CurrencyCode,
      countryCode: data.countryCode as CountryCode,
      defaultLocale: data.defaultLocale as Locale,
      timeZone: data.timeZone as TimeZone,
      description: [],
      conditions: [],
      phone: null,
      minAmountForDelivery: null,
      isActive: true,
      isDeliveryAvailable: true,
      isPickupAvailable: true,
    })

    // Working days
    await createWorkingDays([
      {
        index: 0,
        day: 'SUNDAY',
        open: '00:00',
        close: '00:00',
        isActive: true,
      },
      {
        index: 1,
        day: 'MONDAY',
        open: '00:00',
        close: '00:00',
        isActive: true,
      },
      {
        index: 2,
        day: 'TUESDAY',
        open: '00:00',
        close: '00:00',
        isActive: true,
      },
      {
        index: 3,
        day: 'WEDNESDAY',
        open: '00:00',
        close: '00:00',
        isActive: true,
      },
      {
        index: 4,
        day: 'THURSDAY',
        open: '00:00',
        close: '00:00',
        isActive: true,
      },
      {
        index: 5,
        day: 'FRIDAY',
        open: '00:00',
        close: '00:00',
        isActive: true,
      },
      {
        index: 6,
        day: 'SATURDAY',
        open: '00:00',
        close: '00:00',
        isActive: true,
      }])

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
