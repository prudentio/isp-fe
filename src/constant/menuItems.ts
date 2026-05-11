export enum PermissionEnum  {
  CONFIG = "CONFIG",
  MAP = "MAP",
  AUDIT ="AUDIT",
  MAPEDITOR= "MAP_EDITOR",
} 

export interface MenuItems {
  key: string
  label: string
  permission: PermissionEnum
}

export const menuItems : MenuItems[]= [
    { key: "config", label: "Config", permission: PermissionEnum.CONFIG },
    { key: "map", label: "Map", permission: PermissionEnum.MAP },
    { key: "audit-log", label: "Audit", permission: PermissionEnum.AUDIT },
    { key: "map-editor", label: "Map-Editor", permission: PermissionEnum.MAPEDITOR}
  ]