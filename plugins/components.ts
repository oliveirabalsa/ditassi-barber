export default defineNuxtPlugin(async (nuxtApp) => {
  // Register all UI components to avoid separate imports
  const components = import.meta.glob('../components/ui/**/*.vue', { eager: true })
  
  Object.entries(components).forEach(([path, component]) => {
    const componentName = path.split('/').pop()?.replace(/\.\w+$/, '')
    if (componentName && 'default' in component) {
      // @ts-ignore
      nuxtApp.vueApp.component(componentName, component.default)
    }
  })
})