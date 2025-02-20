import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function NewsletterSignupComponent({ cfg }: QuartzComponentProps) {
  return (
    <section className="bg-background/95">
      <div className="container py-8 md:py-12">
        <div className="w-full border-primary/20 bg-card/50 p-4 rounded-md">
          <div className="mb-4 flex items-center gap-2 -mx-4 border-b pb-2">
            <div className="h-3 w-3 ml-4 rounded-full bg-aurora-red" id="reset-form"></div>
            <div className="h-3 w-3 rounded-full bg-aurora-yellow"></div>
            <div className="h-3 w-3 rounded-full bg-aurora-green"></div>
            <span className="ml-2 text-sm font-bold text-muted-foreground">~/subscribe</span>
          </div>

          <div className="space-y-4">
            <div className="font-mono">
              <span className="text-primary/80">$ </span>
              <span>Stay updated with my latest projects, blog posts, and maker adventures.</span>
            </div>

            <form id="newsletter-form" className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  id="newsletter-email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 bg-background border rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-aurora-purple
                    placeholder:text-muted-foreground/50"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 font-mono text-sm bg-primary/10 
                  border border-aurora-purple/20 rounded-md
                  hover:bg-aurora-purple/20 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-aurora-purple
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                $ subscribe
              </button>
            </form>

            <div id="status-alert" className="hidden">
              <div className="rounded-md border px-4 py-3 font-mono font-bold text-md">
                <div className="flex">
                  <span className="text-destructive">&gt; </span>
                  <span id="status-message" className="ml-2"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

NewsletterSignupComponent.beforeDOMLoaded = `
const script = document.createElement('script')
script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
document.head.appendChild(script)
`

NewsletterSignupComponent.afterDOMLoaded = `
const form = document.getElementById('newsletter-form')
const emailInput = document.getElementById('newsletter-email')
const statusAlert = document.getElementById('status-alert')
const statusMessage = document.getElementById('status-message')
const submitButton = form?.querySelector('button[type="submit"]')
const resetButton = document.getElementById('reset-form')
let isSubmitting = false

if (!form || !emailInput || !statusAlert || !statusMessage || !submitButton || !resetButton) return

const setStatus = (type, message) => {
  statusAlert.classList.remove('hidden')
  statusAlert.className = 'rounded-md border px-4 py-3 font-mono font-bold text-md ' + 
    (type === 'error' ? 'border-destructive/50 text-destructive' : 'border-border bg-background')
  statusMessage.textContent = message
}

const handleReset = () => {
  emailInput.value = ''
  statusAlert.classList.add('hidden')
  submitButton.disabled = false
  submitButton.textContent = '$ subscribe'
  isSubmitting = false
}

form.addEventListener('submit', async function(e) {
  e.preventDefault()
  if (isSubmitting) return

  isSubmitting = true
  submitButton.disabled = true
  submitButton.textContent = '$ sending...'
  
  try {
    // Initialize Supabase client
    const supabase = window.supabase.createClient(
      window.ENV.NEXT_PUBLIC_SUPABASE_URL,
      window.ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Extract first name from email
    const email = emailInput.value
    const firstNameGuess = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim()

    // Insert into Supabase
    const { error } = await supabase
      .from('subscribers')
      .insert([{
        email,
        first_name: firstNameGuess,
        created_at: new Date().toISOString()
      }])

    if (error) throw error

    setStatus('success', 'Really?? You want to get my opinions and thoughts? Ok... bet.')
    emailInput.value = ''
  } catch (error) {
    console.error('Error:', error)
    setStatus('error', error instanceof Error ? error.message : 'Something went wrong')
  } finally {
    isSubmitting = false
    submitButton.disabled = false
    submitButton.textContent = '$ subscribe'
  }
})

resetButton.addEventListener('click', handleReset)
`

export { NewsletterSignupComponent }
export default (() => NewsletterSignupComponent) satisfies QuartzComponentConstructor