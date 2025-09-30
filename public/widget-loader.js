/**
 * Campus SARTHI Widget Loader
 * Embeddable chat widget for external websites
 *
 * Usage:
 * <script src="https://your-domain.com/widget-loader.js"></script>
 * <script>
 *   CampusSarthi.init({
 *     host: 'https://your-domain.com',
 *     apiKey: 'your-api-key',
 *     elId: 'campus-sarthi-widget', // optional
 *     defaultLang: 'en' // optional: en, pa, te, bn
 *   });
 * </script>
 */

;((window, document) => {
  // Prevent multiple initializations
  if (window.CampusSarthi) {
    console.warn("Campus SARTHI widget already initialized")
    return
  }

  const WIDGET_VERSION = "1.0.0"
  const instances = []

  /**
   * Main widget initialization function
   */
  function init(options) {
    // Validate required options
    if (!options || !options.host) {
      console.error("Campus SARTHI: host is required")
      return
    }

    const config = {
      host: options.host.replace(/\/$/, ""), // Remove trailing slash
      apiKey: options.apiKey || "",
      elId: options.elId || `campus-sarthi-widget-${Date.now()}`,
      defaultLang: options.defaultLang || "en",
      theme: options.theme || "light",
      position: options.position || "bottom-right",
    }

    // Check if element already exists
    let mountElement = document.getElementById(config.elId)

    if (!mountElement) {
      // Create mount element
      mountElement = document.createElement("div")
      mountElement.id = config.elId
      mountElement.className = "campus-sarthi-widget-container"
      document.body.appendChild(mountElement)
    }

    // Apply positioning styles
    applyStyles(mountElement, config.position)

    // Load the widget
    loadWidget(mountElement, config)

    // Store instance
    instances.push({
      id: config.elId,
      config: config,
      element: mountElement,
    })

    console.log(`Campus SARTHI widget v${WIDGET_VERSION} initialized`)
  }

  /**
   * Apply positioning styles to the mount element
   */
  function applyStyles(element, position) {
    element.style.position = "fixed"
    element.style.zIndex = "999999"

    switch (position) {
      case "bottom-right":
        element.style.bottom = "0"
        element.style.right = "0"
        break
      case "bottom-left":
        element.style.bottom = "0"
        element.style.left = "0"
        break
      case "top-right":
        element.style.top = "0"
        element.style.right = "0"
        break
      case "top-left":
        element.style.top = "0"
        element.style.left = "0"
        break
      default:
        element.style.bottom = "0"
        element.style.right = "0"
    }
  }

  /**
   * Load the widget iframe or inject React component
   */
  function loadWidget(mountElement, config) {
    // Create iframe for isolation
    const iframe = document.createElement("iframe")
    iframe.id = `${config.elId}-iframe`
    iframe.style.border = "none"
    iframe.style.width = "100%"
    iframe.style.height = "100%"
    iframe.style.colorScheme = "normal"

    // Build widget URL with config params
    const widgetUrl = new URL(`${config.host}/widget/embed`)
    widgetUrl.searchParams.set("apiKey", config.apiKey)
    widgetUrl.searchParams.set("lang", config.defaultLang)
    widgetUrl.searchParams.set("theme", config.theme)

    iframe.src = widgetUrl.toString()

    // Handle iframe load
    iframe.onload = () => {
      console.log("Campus SARTHI widget loaded successfully")

      // Setup postMessage communication
      setupCommunication(iframe, config)
    }

    iframe.onerror = () => {
      console.error("Failed to load Campus SARTHI widget")
      showErrorMessage(mountElement)
    }

    mountElement.appendChild(iframe)
  }

  /**
   * Setup postMessage communication between parent and iframe
   */
  function setupCommunication(iframe, config) {
    // Listen for messages from widget
    window.addEventListener("message", (event) => {
      // Verify origin
      if (event.origin !== config.host) {
        return
      }

      const data = event.data

      if (data.type === "CAMPUS_SARTHI_RESIZE") {
        // Handle resize requests
        iframe.style.width = data.width || "100%"
        iframe.style.height = data.height || "100%"
      } else if (data.type === "CAMPUS_SARTHI_READY") {
        // Widget is ready
        console.log("Campus SARTHI widget ready")

        // Send initial config
        iframe.contentWindow.postMessage(
          {
            type: "CAMPUS_SARTHI_CONFIG",
            config: config,
          },
          config.host,
        )
      } else if (data.type === "CAMPUS_SARTHI_EVENT") {
        // Custom events from widget
        triggerCustomEvent(data.eventName, data.eventData)
      }
    })
  }

  /**
   * Show error message in mount element
   */
  function showErrorMessage(element) {
    element.innerHTML = `
      <div style="
        padding: 20px;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 8px;
        color: #c33;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
      ">
        <strong>Campus SARTHI Error</strong><br>
        Failed to load widget. Please check your configuration.
      </div>
    `
  }

  /**
   * Trigger custom events for parent page
   */
  function triggerCustomEvent(eventName, eventData) {
    const event = new CustomEvent(`campusSarthi:${eventName}`, {
      detail: eventData,
    })
    window.dispatchEvent(event)
  }

  /**
   * Destroy a widget instance
   */
  function destroy(elId) {
    const index = instances.findIndex((inst) => inst.id === elId)
    if (index !== -1) {
      const instance = instances[index]
      if (instance.element && instance.element.parentNode) {
        instance.element.parentNode.removeChild(instance.element)
      }
      instances.splice(index, 1)
      console.log(`Campus SARTHI widget ${elId} destroyed`)
    }
  }

  /**
   * Get all active instances
   */
  function getInstances() {
    return instances
  }

  /**
   * Update widget configuration
   */
  function updateConfig(elId, newConfig) {
    const instance = instances.find((inst) => inst.id === elId)
    if (instance) {
      Object.assign(instance.config, newConfig)

      // Send updated config to iframe
      const iframe = document.querySelector(`#${elId}-iframe`)
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            type: "CAMPUS_SARTHI_CONFIG_UPDATE",
            config: instance.config,
          },
          instance.config.host,
        )
      }
    }
  }

  // Expose public API
  window.CampusSarthi = {
    init: init,
    destroy: destroy,
    getInstances: getInstances,
    updateConfig: updateConfig,
    version: WIDGET_VERSION,
  }

  // Auto-initialize if data attributes are present
  document.addEventListener("DOMContentLoaded", () => {
    const scripts = document.querySelectorAll("script[data-campus-sarthi]")
    scripts.forEach((script) => {
      const host = script.getAttribute("data-host")
      const apiKey = script.getAttribute("data-api-key")
      const lang = script.getAttribute("data-lang")

      if (host) {
        init({
          host: host,
          apiKey: apiKey,
          defaultLang: lang,
        })
      }
    })
  })
})(window, document)
