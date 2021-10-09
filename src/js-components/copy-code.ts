const AllCodeBlocks = document.querySelectorAll('article .code-wrapper')

for (const CodeBlock of AllCodeBlocks) {
  const CopyButton = CodeBlock.querySelector('.code-copy') as HTMLLinkElement
  const Code = CodeBlock.getElementsByTagName('pre')[0] as HTMLPreElement
  const Message = CodeBlock.querySelector('.code-copy-success') as HTMLElement

  CopyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(Code.innerText)
    Message.classList.remove('hidden')
    setTimeout(() => {
      Message.classList.add('hidden')
    }, 1000)
  })
}

export {}