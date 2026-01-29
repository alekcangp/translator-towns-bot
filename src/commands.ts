import type { BotCommand } from '@towns-protocol/bot'

/**
 * Bot Commands
 * These commands will be registered to the bot as soon as the bot is initialized
 * and will be available in the slash command autocomplete.
 */
const commands = [
    {
        name: 'status',
        description: 'Check your translation status',
    },
    {
        name: 'enable_translate',
        description: 'Enable automatic translation of your messages to English',
    },
    {
        name: 'disable_translate',
        description: 'Disable automatic translation of your messages',
    },
] as const satisfies BotCommand[]

export default commands
