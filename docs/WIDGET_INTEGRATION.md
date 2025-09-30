# Campus SARTHI Widget Integration Guide

## Overview

The Campus SARTHI widget is an embeddable chat interface that can be integrated into any website. It provides multilingual support, voice input, and seamless communication with the Campus SARTHI backend.

## Quick Start

### 1. Include the Widget Script

Add the widget loader script to your HTML page:

\`\`\`html
<script src="https://your-domain.com/widget-loader.js"></script>
\`\`\`

### 2. Initialize the Widget

Initialize the widget with your configuration:

\`\`\`html
<script>
  CampusSarthi.init({
    host: 'https://your-domain.com',
    apiKey: 'your-api-key',
    defaultLang: 'en'
  });
</script>
\`\`\`

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `host` | string | Yes | - | Your Campus SARTHI host URL |
| `apiKey` | string | Yes | - | Your API authentication key |
| `elId` | string | No | Auto-generated | Custom element ID for the widget container |
| `defaultLang` | string | No | `'en'` | Default language (`en`, `pa`, `te`, `bn`) |
| `theme` | string | No | `'light'` | Widget theme (`light`, `dark`) |
| `position` | string | No | `'bottom-right'` | Widget position on screen |

## Position Options

- `bottom-right` - Bottom right corner (default)
- `bottom-left` - Bottom left corner
- `top-right` - Top right corner
- `top-left` - Top left corner

## API Methods

### `CampusSarthi.init(options)`

Initialize a new widget instance.

\`\`\`javascript
CampusSarthi.init({
  host: 'https://your-domain.com',
  apiKey: 'your-api-key',
  defaultLang: 'en'
});
\`\`\`

### `CampusSarthi.destroy(elId)`

Destroy a widget instance.

\`\`\`javascript
CampusSarthi.destroy('campus-sarthi-widget-123456');
\`\`\`

### `CampusSarthi.getInstances()`

Get all active widget instances.

\`\`\`javascript
const instances = CampusSarthi.getInstances();
console.log(instances);
\`\`\`

### `CampusSarthi.updateConfig(elId, newConfig)`

Update widget configuration dynamically.

\`\`\`javascript
CampusSarthi.updateConfig('campus-sarthi-widget-123456', {
  defaultLang: 'pa',
  theme: 'dark'
});
\`\`\`

## Events

The widget emits custom events that you can listen to:

### `campusSarthi:messageReceived`

Fired when a message is received from the assistant.

\`\`\`javascript
window.addEventListener('campusSarthi:messageReceived', (event) => {
  console.log('Message:', event.detail);
});
\`\`\`

### `campusSarthi:escalated`

Fired when a conversation is escalated to human support.

\`\`\`javascript
window.addEventListener('campusSarthi:escalated', (event) => {
  console.log('Escalation:', event.detail);
});
\`\`\`

## Auto-Initialization

You can also use data attributes for automatic initialization:

\`\`\`html
<script 
  src="https://your-domain.com/widget-loader.js"
  data-campus-sarthi
  data-host="https://your-domain.com"
  data-api-key="your-api-key"
  data-lang="en"
></script>
\`\`\`

## Multiple Instances

You can initialize multiple widget instances on the same page:

\`\`\`javascript
// First instance
CampusSarthi.init({
  host: 'https://your-domain.com',
  apiKey: 'key-1',
  elId: 'widget-1',
  position: 'bottom-right'
});

// Second instance
CampusSarthi.init({
  host: 'https://your-domain.com',
  apiKey: 'key-2',
  elId: 'widget-2',
  position: 'bottom-left'
});
\`\`\`

## Styling

The widget is fully isolated using an iframe, so it won't conflict with your page styles. However, you can customize the container:

\`\`\`css
#campus-sarthi-widget {
  /* Custom styles for the widget container */
}
\`\`\`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security

- The widget uses iframe isolation for security
- All communication uses postMessage API
- API keys are validated on the backend
- CORS policies are enforced

## Troubleshooting

### Widget not loading

1. Check that the `host` URL is correct
2. Verify your API key is valid
3. Check browser console for errors
4. Ensure CORS is properly configured

### Voice input not working

1. Ensure HTTPS is enabled (required for microphone access)
2. Check browser permissions for microphone
3. Verify browser supports Web Speech API

## Demo

Visit `/widget-demo.html` for a live demo and examples.
