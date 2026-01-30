/**
 * Multilingual Chat Translation Bot
 * 
 * Features:
 * - Users can enable/disable automatic translation of their messages to English
 * - When enabled, bot translates user's message to English and posts as reply
 * - All users can see the translated message
 * - Foreign users can write in their native language
 * - No cache needed - simple per-user settings
 */

import { makeTownsBot } from '@towns-protocol/bot'
import commands from './commands'
import { getTranslationService } from './translationService'

// Initialize translation service
const translationService = getTranslationService()

// Store user translation preferences
// Map: userId -> boolean (true = enabled, false = disabled)
const userTranslationSettings = new Map<string, boolean>()

// Store bot user ID to ignore bot messages
let botUserId: string | null = null

const bot = await makeTownsBot(process.env.APP_PRIVATE_DATA!, process.env.JWT_SECRET!, {
    commands,
})

// Get bot user ID after initialization
botUserId = bot.botId
console.log(`🤖 Bot initialized with ID: ${botUserId}`)

/**
 * Check if a message should be ignored
 * - Ignore bot messages
 * - Ignore empty messages
 */
function shouldIgnoreMessage(message: string, authorId: string): boolean {
    // Ignore bot messages
    if (authorId === botUserId) {
        return true
    }

    // Ignore empty messages
    if (!message || message.trim().length === 0) {
        return true
    }

    return false
}

/**
 * Check if text is likely English
 * Simple heuristic: if most characters are ASCII (English alphabet), it's likely English
 */
function isLikelyEnglish(text: string): boolean {
    // Remove common non-English characters and check if text is mostly ASCII
    const asciiChars = text.replace(/[^\x00-\x7F]/g, '').length
    const totalChars = text.length
    // If 80% or more characters are ASCII, consider it English
    return totalChars > 0 && (asciiChars / totalChars) >= 0.8
}

/**
 * Handle incoming messages
 * If user has translation enabled, translate non-English text to English and post as reply
 */
bot.onMessage(async (handler, { message, channelId, eventId, userId }) => {
    try {
        // Check if message should be ignored
        if (shouldIgnoreMessage(message, userId)) {
            console.log(`⏭ Message ignored (bot/command/empty): "${message.substring(0, 30)}${message.length > 30 ? '...' : ''}"`)
            return
        }

        // Check if user has translation enabled (enabled by default)
        const translationEnabled = userTranslationSettings.get(userId) ?? true
        if (!translationEnabled) {
            console.log(`⏭ Translation disabled for user ${userId}`)
            return
        }

        // Check if text is already in English
        if (isLikelyEnglish(message)) {
            console.log(`⏭ Message is already in English, skipping translation`)
            return
        }

        console.log(`📝 Message from user ${userId} (translation enabled): "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`)

        // Translate message to English
        console.log(`🌐 Translating message to English...`)
        const translationResult = await translationService.translate({
            text: message,
        })

        if (!translationResult.success) {
            console.error(`❌ Translation failed for message ${eventId}:`, translationResult.error)
            return
        }

        console.log(`✅ Translation successful: "${translationResult.translatedText?.substring(0, 50)}${translationResult.translatedText && translationResult.translatedText.length > 50 ? '...' : ''}"`)

        // Send translation as a reply to the original message
        await handler.sendMessage(
            channelId,
            `🌐 ${translationResult.translatedText}`,
            { replyId: eventId }
        )
        console.log(`📤 Translation sent to channel ${channelId}`)
    } catch (error) {
        console.error('❌ Error handling message:', error)
    }
})

/**
 * Slash command: /status
 * Check translation status
 */
bot.onSlashCommand('status', async (handler, { channelId, userId, eventId }) => {
    console.log(`ℹ️ /status command executed by user ${userId} in channel ${channelId}`)
    
    const translationEnabled = userTranslationSettings.get(userId) ?? true
    const status = translationEnabled ? '✅ Enabled' : '❌ Disabled'
    
    await handler.sendMessage(channelId, `Translation: ${status}`, { replyId: eventId })
})

/**
 * Slash command: /enable_translate
 * Enable automatic translation for the user
 */
bot.onSlashCommand('enable_translate', async (handler, { channelId, userId, eventId }) => {
    console.log(`✅ /enable_translate command executed by user ${userId} in channel ${channelId}`)
    
    userTranslationSettings.set(userId, true)
    
    await handler.sendMessage(channelId, '✅ Translation enabled', { replyId: eventId })
})

/**
 * Slash command: /disable_translate
 * Disable automatic translation for the user
 */
bot.onSlashCommand('disable_translate', async (handler, { channelId, userId, eventId }) => {
    console.log(`❌ /disable_translate command executed by user ${userId} in channel ${channelId}`)
    
    userTranslationSettings.set(userId, false)
    
    await handler.sendMessage(channelId, '❌ Translation disabled', { replyId: eventId })
})

const app = bot.start()

// After your /webhook route
app.get('/.well-known/agent-metadata.json', async (c) => {
    return c.json(await bot.getIdentityMetadata())
})

export default app
