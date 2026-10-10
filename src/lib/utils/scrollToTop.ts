export function scrollToTop() {
  const scrollContainer = document.querySelector('main')

  if (scrollContainer) {
    scrollContainer.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    return
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
