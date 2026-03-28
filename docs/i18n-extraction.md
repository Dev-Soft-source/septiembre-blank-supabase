
# Text Extraction for Hotel-Living Multilingual Support

## Overview
This document describes the text extraction process for implementing multilingual support using react-i18next.

## Setup Complete
- ✅ react-i18next integrated
- ✅ i18next-scanner configured
- ✅ Initial translation structure created
- ✅ Extraction scripts ready

## How to Extract Texts

### Option 1: Run the extraction script
```bash
node scripts/extract-texts.js
```

### Option 2: Run scanner directly
```bash
npx i18next-scanner --config i18next-scanner.config.js
```

## File Structure
```
src/i18n/
├── config.ts              # i18n configuration
└── locales/
    └── en.json            # English translations (base)
```

## Translation File Organization
The translations are organized into logical modules:
- `common` - Common UI elements (buttons, labels, etc.)
- `navigation` - Navigation menu items
- `booking` - Booking flow related texts
- `dashboard` - Dashboard interface texts
- `faq` - FAQ page content
- `auth` - Authentication forms
- `hotel` - Hotel detail pages
- `forms` - Form validation messages
- `filters` - Search and filter options

## Next Steps
1. Run the extraction to get all translatable texts
2. Review and organize the extracted content
3. Prepare for machine translation
4. Implement translation usage in components

## Usage in Components
```typescript
import { useTranslation } from '@/hooks/useTranslation';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <div>{t('common.loading')}</div>;
};
```

## Scope Limitation
This setup is strictly limited to:
- Integration of react-i18next
- Text extraction configuration
- Initial translation file structure
- No modifications to existing functionality
