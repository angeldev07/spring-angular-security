interface SidebarItem {
  title: string,
  icon?: string,
  link?: string[],
  children?: SidebarItem[]
  hidden?: boolean
}

export const sidebarItems: Array<SidebarItem> = [
  {
    title: 'usuarios',
    icon: 'pi pi-users',
    link: ['users']
  },
  {
    title: 'perfil',
    icon: 'pi pi-user',
    link: ['profile']
  },
]
