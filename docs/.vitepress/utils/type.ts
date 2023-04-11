export type KeyMap = {
  [key: string]: string
}

export type List={
  title: string
  content: string
  time: string,
  tag: string,
  path: string
  recommend?: number | null
}

export type Tags={
  tag:string
  color?:string
}
