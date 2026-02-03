export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove remaining non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .trim()
}
