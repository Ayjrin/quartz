import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { YoinkName } from './Creep'

function NewsletterSignupComponent({ cfg }: QuartzComponentProps) {
  return (
    <section className="newsletter-signup">
      <div className="container">
        <div className="signup-card">
          <div className="window-controls">
            <div className="control red"></div>
            <div className="control yellow"></div>
            <div className="control green"></div>
            <span className="window-title">~/subscribe</span>
          </div>

          <div className="content">
            <div className="description">
              <span className="prompt">$ </span>
              <span>Stay updated with my latest projects, blog posts, and maker adventures.</span>
            </div>

            <form className="signup-form">
              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="email-input"
                  id="newsletter-email"
                />
              </div>
              <button
                type="submit"
                className="submit-button"
              >
                $ subscribe
              </button>
            </form>

            <div className="alert hidden">
              <span className="prompt">&gt; </span>
              <span id="alert-message"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

NewsletterSignupComponent.css = `
.newsletter-signup {
  background: var(--light);
}

.signup-card {
  width: 100%;
  border: 1px solid rgba(var(--dark), 0.2);
  background: rgba(var(--light), 0.5);
  padding: 1rem;
  border-radius: 0.5rem;
}

.window-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: -1rem;
  border-bottom: 1px solid var(--lightgray);
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
}

.control {
  height: 0.75rem;
  width: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
}

.control.red { background: var(--red); }
.control.yellow { background: var(--yellow); }
.control.green { background: var(--green); }

.window-title {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--darkgray);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.description {
  font-family: var(--codeFont);
}

.prompt {
  color: var(--secondary);
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .signup-form {
    flex-direction: row;
  }
}

.input-wrapper {
  flex: 1;
}

.email-input {
  width: 100%;
  padding: 0.5rem 1rem;
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 0.375rem;
  font-family: var(--codeFont);
}

.email-input:focus {
  outline: none;
  border-color: var(--secondary);
  box-shadow: 0 0 0 2px rgba(var(--secondary), 0.2);
}

.email-input::placeholder {
  color: var(--darkgray);
  opacity: 0.5;
}

.email-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-button {
  padding: 0.5rem 1.5rem;
  font-family: var(--codeFont);
  font-size: 0.875rem;
  background: rgba(var(--secondary), 0.1);
  border: 1px solid rgba(var(--secondary), 0.2);
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background: rgba(var(--secondary), 0.2);
}

.submit-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(var(--secondary), 0.2);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.alert {
  font-family: var(--codeFont);
  font-weight: bold;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background: var(--light);
  border: 1px solid var(--lightgray);
}

.alert.error {
  background: rgba(var(--red), 0.1);
  border-color: var(--red);
}

.alert.hidden {
  display: none;
}
`

NewsletterSignupComponent.beforeDOMLoaded = `
const script = document.createElement('script')
script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
document.head.appendChild(script)
`

NewsletterSignupComponent.afterDOMLoaded = `
// Wait for Supabase script to load
const checkSupabase = setInterval(() => {
  if (window.supabase) {
    clearInterval(checkSupabase)
    initializeNewsletter()
  }
}, 100)

function initializeNewsletter() {
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
      const result = await YoinkName(emailInput.value)
      if (!result.success) throw result.error

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

  document.querySelector('.control.red').addEventListener('click', function() {
    emailInput.value = ''
    alert.classList.add('hidden')
    alert.classList.remove('error')
    alertMessage.textContent = ''
    submitButton.disabled = false
    submitButton.textContent = '$ subscribe'
  })
}
`

export { NewsletterSignupComponent }
export default (() => NewsletterSignupComponent) satisfies QuartzComponentConstructor
