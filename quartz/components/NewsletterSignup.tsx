import { QuartzComponent, QuartzComponentProps } from "./types"
import style from "./styles/newsletter.scss"

interface NewsletterSignupProps extends QuartzComponentProps {
  subscribeText?: string
  placeholderText?: string
  buttonText?: string
}

export const NewsletterSignup: QuartzComponent = ({
  displayClass,
  subscribeText = "Subscribe to our newsletter",
  placeholderText = "Enter your email",
  buttonText = "Subscribe",
}: NewsletterSignupProps) => {
  return (
    <section class={`newsletter-signup ${displayClass ?? ""}`}>
      <div class="container py-8 md:py-12">
        <div class="w-full border-primary/20 bg-card/50 p-4 rounded-md">
          <div class="mb-4 flex items-center gap-2 -mx-4 border-b pb-2">
            <div class="h-3 w-3 ml-4 rounded-full bg-aurora-red" id="reset-form"></div>
            <div class="h-3 w-3 rounded-full bg-aurora-yellow"></div>
            <div class="h-3 w-3 rounded-full bg-aurora-green"></div>
            <span class="ml-2 text-sm font-bold text-muted-foreground">~/subscribe</span>
          </div>

          <div class="space-y-4">
            <div class="font-mono">
              <span class="text-primary/80">$ </span>
              <span>{subscribeText}</span>
            </div>

            <form id="newsletter-form" class="flex flex-col sm:flex-row gap-3">
              <div class="flex-1">
                <input
                  type="email"
                  id="newsletter-email"
                  placeholder={placeholderText}
                  class="w-full px-4 py-2 bg-background border rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-aurora-purple
                    placeholder:text-muted-foreground/50"
                  required
                />
              </div>
              <button
                type="submit"
                class="px-6 py-2 font-mono text-sm bg-primary/10 
                  border border-aurora-purple/20 rounded-md
                  hover:bg-aurora-purple/20 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-aurora-purple
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buttonText}
              </button>
            </form>

            <div id="status-alert" class="hidden">
              <div class="rounded-md border px-4 py-3 font-mono font-bold text-md">
                <div class="flex">
                  <span class="text-destructive">&gt; </span>
                  <span id="status-message" class="ml-2"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

NewsletterSignup.css = style
NewsletterSignup.beforeDOMLoaded = `
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newsletter-form')
  const emailInput = document.getElementById('newsletter-email')
  const statusAlert = document.getElementById('status-alert')
  const statusMessage = document.getElementById('status-message')
  const resetForm = document.getElementById('reset-form')

  if (!form || !emailInput || !statusAlert || !statusMessage || !resetForm) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = (emailInput as HTMLInputElement).value

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      statusAlert.classList.remove('hidden')
      statusMessage.textContent = data.message
      statusMessage.className = response.ok ? 'text-success' : 'text-error'
      
      if (response.ok) {
        (emailInput as HTMLInputElement).value = ''
      }
    } catch (error) {
      statusAlert.classList.remove('hidden')
      statusMessage.textContent = 'An error occurred. Please try again later.'
      statusMessage.className = 'text-error'
    }
  })

  resetForm.addEventListener('click', () => {
    (emailInput as HTMLInputElement).value = ''
    statusAlert.classList.add('hidden')
  })
})
`

export default NewsletterSignup