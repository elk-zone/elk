import type { PngOptions, ResizeOptions } from 'sharp'
import { rm, writeFile } from 'node:fs/promises'
import process from 'node:process'
import { resolve } from 'pathe'
import sharp from 'sharp'
import ico from 'sharp-ico'

interface Icon {
  sizes: number[]
  padding: number
  resizeOptions?: ResizeOptions
}

type IconType = 'transparent' | 'maskable' | 'apple'

/**
 * PWA Icons definition:
 * - transparent: [{ sizes: [192, 512], padding: 0.05, resizeOptions: { fit: 'contain', background: 'transparent' } }]
 * - maskable: [{ sizes: [512], padding: 0.3 }, resizeOptions: { fit: 'contain', background: 'white' } }]
 * - apple: [{ sizes: [180], padding: 0.3 }, resizeOptions: { fit: 'contain', background: 'white' } }]
 */
interface Icons extends Record<IconType, Icon> {
  /**
   * @default: `{ compressionLevel: 9, quality: 60 }`
   */
  png?: PngOptions
  /**
   * @default `pwa-<size>x<size>.png`, `maskable-icon-<size>x<size>.png`, `apple-touch-icon-<size>x<size>.png`
   */
  iconName?: (type: IconType, size: number) => string
  /**
   * Generate `favicon.ico` from transparent icons (from `pwa-<size>x<size>.png` ones)
   */
  ico?: {
    /**
     * @default `favicon-<size>x<size>.ico`
     */
    icoName?: (size: number) => string
    sizes: number[]
  }
}

interface ResolvedIcons extends Required<Omit<Icons, 'ico'>> {
  ico?: {
    /**
     * @default `favicon-<size>x<size>.ico`
     */
    icoName?: (size: number) => string
    sizes: number[]
  }
}

const defaultIcons: Icons = {
  transparent: {
    sizes: [192, 512],
    padding: 0.05,
    resizeOptions: {
      fit: 'contain',
      background: 'transparent',
    },
  },
  maskable: {
    sizes: [512],
    padding: 0.3,
    resizeOptions: {
      fit: 'contain',
      background: 'white',
    },
  },
  apple: {
    sizes: [180],
    padding: 0.3,
    resizeOptions: {
      fit: 'contain',
      background: 'white',
    },
  },
}

const root = process.cwd()

const publicFolders = ['public', 'public-dev', 'public-staging'].map(folder => resolve(root, folder))

async function optimizePng(filePath: string, png: PngOptions) {
  await sharp(filePath).png(png).toFile(`${filePath.replace(/-temp\.png$/, '.png')}`)
  await rm(filePath)
}

async function generateTransparentIcons(icons: ResolvedIcons, svgLogo: string, folder: string) {
  const { sizes, padding, resizeOptions } = icons.transparent
  await Promise.all(sizes.map(async (size) => {
    const filePath = resolve(folder, icons.iconName('transparent', size))
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    }).composite([{
      input: await sharp(svgLogo)
        .resize(
          Math.round(size * (1 - padding)),
          Math.round(size * (1 - padding)),
          resizeOptions,
        )
        .toBuffer(),
    }]).toFile(filePath)
    await optimizePng(filePath, icons.png)
  }))
}

async function generateMaskableIcons(type: IconType, icons: ResolvedIcons, svgLogo: string, folder: string) {
  const { sizes, padding, resizeOptions } = icons[type]
  await Promise.all(sizes.map(async (size) => {
    const filePath = resolve(folder, icons.iconName(type, size))
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: resizeOptions?.background ?? 'white',
      },
    }).composite([{
      input: await sharp(svgLogo)
        .resize(
          Math.round(size * (1 - padding)),
          Math.round(size * (1 - padding)),
          resizeOptions,
        )
        .toBuffer(),
    }]).toFile(filePath)
    await optimizePng(filePath, icons.png)
  }))
}

async function generatePWAIconForEnv(folder: string, icons: ResolvedIcons) {
  const svgLogo = resolve(folder, 'logo.svg')
  await Promise.all([
    generateTransparentIcons(icons, svgLogo, folder),
    generateMaskableIcons('maskable', icons, svgLogo, folder),
    generateMaskableIcons('apple', icons, svgLogo, folder),
  ])

  if (icons.ico) {
    const {
      icoName = size => `favicon-${size}x${size}.ico`,
    } = icons.ico
    await Promise.all(icons.ico.sizes.map(async (size) => {
      const png = await sharp(
        resolve(folder, icons.iconName('transparent', size).replace(/-temp\.png$/, '.png')),
      ).toFormat('png').toBuffer()
      await writeFile(resolve(folder, icoName(size)), new Uint8Array(ico.encode([png])))
    }))
  }
}

async function generatePWAIcons(folders: string[], icons: Icons) {
  const {
    png = { compressionLevel: 9, quality: 60 },
    iconName = (type, size) => {
      switch (type) {
        case 'transparent':
          return `pwa-${size}x${size}.png`
        case 'maskable':
          return `maskable-icon-${size}x${size}.png`
        case 'apple':
          return `apple-touch-icon-${size}x${size}.png`
      }
    },
    transparent = { ...defaultIcons.transparent },
    maskable = { ...defaultIcons.maskable },
    apple = { ...defaultIcons.apple },
    ico,
  } = icons

  if (!transparent.resizeOptions)
    transparent.resizeOptions = { ...defaultIcons.transparent.resizeOptions }

  if (!maskable.resizeOptions)
    maskable.resizeOptions = { ...defaultIcons.maskable.resizeOptions }

  if (!apple.resizeOptions)
    apple.resizeOptions = { ...defaultIcons.apple.resizeOptions }

  await Promise.all(folders.map(folder => generatePWAIconForEnv(folder, {
    png,
    iconName,
    transparent,
    maskable,
    apple,
    ico,
  })))
}

console.log('Generating Elk PWA Icons...')

generatePWAIcons(publicFolders, <Icons>{
  transparent: { ...defaultIcons.transparent, sizes: [64, 192, 512] },
  ico: { sizes: [64], icoName: _ => 'favicon.ico' },
  iconName: (type, size) => {
    switch (type) {
      case 'transparent':
        return `pwa-${size}x${size}-temp.png`
      case 'maskable':
        return 'maskable-icon-temp.png'
      case 'apple':
        return 'apple-touch-icon-temp.png'
    }
  },
}).then(() => console.log('Elk PWA Icons generated')).catch(console.error)
