import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function NewsletterSignupComponent({ cfg }: QuartzComponentProps) {
  return (
    <div className="newsletter-container">
      <div className="newsletter-header">
        <div className="window-controls">
          <div className="control red"></div>
          <div className="control yellow"></div>
          <div className="control green"></div>
          <span className="window-title">~/subscribe</span>
        </div>
      </div>
      <div className="newsletter-content">
        <p className="newsletter-description">
          <span className="prompt">$ </span>
          Stay updated with my latest projects, blog posts, and maker adventures.
        </p>
        <form className="signup-form">
          <div className="input-group">
            <input 
              type="email" 
              name="email"
              id="newsletter-email" 
              placeholder="your@email.com" 
              required 
            />
            <button type="submit" className="submit-button">$ subscribe</button>
          </div>
          <div className="alert hidden">
            <span className="prompt">&gt; </span>
            <span id="alert-message"></span>
            <button type="button" className="close-button">×</button>
          </div>
        </form>
      </div>
    </div>
  )
}

NewsletterSignupComponent.css = `
.newsletter-container {
  background: var(--lightgray);
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  margin: 2em 0;
  overflow: hidden;
  width: 100%;
}

.newsletter-header {
  background: var(--lightgray);
  border-bottom: 1px solid var(--lightgray);
  padding: 0.75rem;
}

.window-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  cursor: pointer;
}

.control.red { background: var(--red); }
.control.yellow { background: var(--yellow); }
.control.green { background: var(--green); }

.window-title {
  margin-left: 0.75rem;
  color: var(--darkgray);
  font-family: var(--codeFont);
  font-size: 0.9em;
}

.newsletter-content {
  padding: 1.5rem;
}

.newsletter-description {
  color: var(--darkgray);
  font-family: var(--codeFont);
  font-size: 0.9em;
  margin-bottom: 1.5rem;
}

.prompt {
  color: var(--secondary);
}

.signup-form {
  width: 100%;
}

.input-group {
  display: flex;
  gap: 8px;
  width: 100%;
}

#newsletter-email {
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 4px;
  color: var(--darkgray);
  flex: 1;
  font-family: var(--codeFont);
  font-size: 0.9em;
  padding: 8px 12px;
  transition: all 0.2s ease;
}

#newsletter-email:focus {
  border-color: var(--secondary);
  outline: none;
}

#newsletter-email::placeholder {
  color: var(--darkgray);
  opacity: 0.5;
}

.submit-button {
  background: var(--secondary);
  border: none;
  border-radius: 4px;
  color: var(--light);
  cursor: pointer;
  font-family: var(--codeFont);
  font-size: 0.9em;
  padding: 8px 16px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.submit-button:hover {
  opacity: 0.9;
}

.submit-button:disabled {
  background: var(--gray);
  cursor: not-allowed;
  opacity: 0.7;
}

.alert {
  align-items: center;
  background: var(--secondary);
  border-radius: 4px;
  color: var(--light);
  display: flex;
  font-family: var(--codeFont);
  font-size: 0.9em;
  gap: 8px;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 8px 12px;
}

.alert.error {
  background: var(--red);
}

.alert.hidden {
  display: none;
}

.close-button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.2em;
  padding: 0;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-button:hover {
  opacity: 1;
}
`

NewsletterSignupComponent.beforeDOMLoaded = `
const script = document.createElement('script')
script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
document.head.appendChild(script)
`

NewsletterSignupComponent.afterDOMLoaded = `
const form = document.querySelector('.signup-form')
const emailInput = document.getElementById('newsletter-email')
const alert = document.querySelector('.alert')
const alertMessage = document.getElementById('alert-message')
const submitButton = document.querySelector('.submit-button')
let isSubmitting = false

if (!form || !emailInput || !alert || !alertMessage || !submitButton) return

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

    alert.classList.remove('hidden', 'error')
    alertMessage.textContent = 'Really?? You want to get my opinions and thoughts? Ok... bet.'
    emailInput.value = ''
  } catch (error) {
    console.error('Error:', error)
    alert.classList.remove('hidden')
    alert.classList.add('error')
    alertMessage.textContent = error instanceof Error ? error.message : 'Something went wrong'
  } finally {
    isSubmitting = false
    submitButton.disabled = false
    submitButton.textContent = '$ subscribe'
  }
})

document.querySelector('.close-button').addEventListener('click', function() {
  emailInput.value = ''
  alert.classList.add('hidden')
  alert.classList.remove('error')
  alertMessage.textContent = ''
  submitButton.disabled = false
  submitButton.textContent = '$ subscribe'
})
`

export { NewsletterSignupComponent }
export default (() => NewsletterSignupComponent) satisfies QuartzComponentConstructor