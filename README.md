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

1. **User posts message**: User writes in their native language
2. **English detection**: Bot checks if message is already in English
3. **Automatic translation**: If not English, bot translates it to English
4. **Public reply**: Translation is posted as a reply visible to all users

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

3. Run bot:

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

**Translation is enabled by default** - your non-English messages will be automatically translated to English.

**To disable translation:**

- Run `/disable_translate` to stop automatic translation

**To re-enable translation:**

- Run `/enable_translate` to resume automatic translation

**To check your status:**

- Run `/status` to see if translation is enabled or disabled


# API Integration

The bot uses io.net's Translate Agent API for LLM-based translation:


**Current limitations:**
- User settings are lost on bot restart
- No persistent storage across deployments
