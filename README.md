# Multilingual Chat Translation Bot

A production-ready translation bot for Towns that automatically translates non-English user messages to English when enabled.

# Features

- **Per-user translation settings**: Each user can enable/disable translation for their messages
- **Automatic translation**: When enabled, non-English messages are automatically translated to English
- **English detection**: Bot skips translation of messages already in English
- **Public translations**: Translations are posted as replies visible to all users
- **Simple commands**: Easy-to-use slash commands for managing settings
- **No cache needed**: Simple architecture without complex caching
- **Spam prevention**: Bot ignores bot messages and empty messages
- **LLM-powered**: Uses io.net Translate Agent for high-quality translations

## How It Works

1. **User enables translation**: User runs `/enable_translate` to opt-in
2. **User posts message**: User writes in their native language
3. **English detection**: Bot checks if message is already in English
4. **Automatic translation**: If not English, bot translates it to English
5. **Public reply**: Translation is posted as a reply visible to all users

## Slash Commands

| Command | Description |
|---------|-------------|
| `/status` | Check your translation status |
| `/enable_translate` | Enable automatic translation of your messages to English |
| `/disable_translate` | Disable automatic translation of your messages |

# Setup

1. Copy `.env.sample` to `.env` and fill in your credentials:

   ```bash
   cp .env.sample .env
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Run the bot:

   ```bash
   bun run dev
   ```

# Environment Variables

Required variables in `.env`:

- `APP_PRIVATE_DATA` - Your Towns app private data (base64 encoded)
- `JWT_SECRET` - JWT secret for webhook authentication
- `IO_API_KEY` - Your io.net API key for translation service
- `PORT` - Port to run the bot on (optional, defaults to 5123)

# Usage

Once the bot is running, installed to a space and added to a channel:

**To enable translation:**

1. Run `/enable_translate` in the channel
2. Your non-English messages will now be automatically translated to English
3. The translation appears as a reply to your original message
4. All users can see both your original message and the translation

**To check your status:**

- Run `/status` to see if translation is enabled or disabled

**To disable translation:**

- Run `/disable_translate` to stop automatic translation


# Important Notes

- **Opt-in only**: Translation is disabled by default - users must enable it
- **Public translations**: Translations are visible to all users in the channel
- **English target**: All translations are to English only
- **English detection**: Bot automatically skips translation of English messages
- **Bot messages**: The bot ignores messages from other bots and empty messages
- **Per-user settings**: Each user controls their own translation preference


# API Integration

The bot uses io.net's Translate Agent API for LLM-based translation:

**Current limitations:**
- User settings are lost on bot restart
- No persistent storage across deployments
