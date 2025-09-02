// From: https://github.com/yuehu/word-count

export const WordRegex = /[a-zA-Z0-9_\u0392-\u03c9\u00c0-\u00ff\u0600-\u06ff\u0400-\u04ff']+[a-zA-Z0-9'_\u0392-\u03c9\u00c0-\u00ff\u0600-\u06ff\u0400-\u04ff-]*|[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g

const countWord = (data: string): number => {
  if (data == null) return 0

  const matched = data.match(WordRegex)
  if (!matched) {
    return 0
  }

  let count = 0
  for (const segment of matched) {
    count += segment.charCodeAt(0) >= 0x4e00 ? segment.length : 1
  }

  return count
}

export default countWord
