export function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-white border-t shadow-sm py-6 mt-12">
      <div className="container text-center text-muted-foreground text-sm">
        <p>&copy; {currentYear} Truvay LLC. All rights reserved.</p>
      </div>
    </footer>
  )
}
