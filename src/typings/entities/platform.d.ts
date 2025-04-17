namespace Entity {
  interface Platform {
    id?: number
    platformName?: string
    platformCode?: string
    serverUrl?: string
    defaultRoute?: string
    icon?: string
    status?: number
    platformSort?: number
  }
  interface MenuItem {
    id: number
    pid: number
    title: string
    children?: MenuItem[]
  }
}
