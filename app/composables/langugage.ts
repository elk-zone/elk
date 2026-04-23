import ISO6391 from 'iso-639-1'

export const languagesNameList: {
  code: string
  nativeName: string
  name: string
}[] = ISO6391.getAllCodes().map(code => ({
  code,
  nativeName: ISO6391.getNativeName(code),
  name: ISO6391.getName(code),
}))
