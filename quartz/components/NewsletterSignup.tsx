import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

const NewsletterSignupComponent = ({ cfg }: QuartzComponentProps) => {
  return (
    <section class="newsletter-signup">
      <div class="container">
        <div class="signup-card">
          <div class="window-controls">
            <div class="control red"></div>
            <div class="control yellow"></div>
            <div class="control green"></div>
            <span class="window-title">~/subscribe</span>
          </div>

          <div class="content">
            <div class="description">
              <span class="prompt">$ </span>
              <span>Stay updated with my latest projects, blog posts, and maker adventures.</span>
            </div>

            <form id="newsletter-form" class="signup-form">
              <div class="input-wrapper">
                <input
                  type="email"
                  id="signup-email"
                  placeholder="your@email.com"
                  class="email-input"
                />
              </div>
              <button type="submit" class="submit-button">
                $ subscribe
              </button>
            </form>

            <div id="signup-alert" class="alert hidden">
              <span class="prompt">&gt; </span>
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
  border-radius: 0.25rem;
  font-family: var(--bodyFont);
}

.email-input:focus {
  outline: none;
  border-color: var(--secondary);
  box-shadow: 0 0 0 2px rgba(var(--secondary), 0.2);
}

.submit-button {
  padding: 0.5rem 1.5rem;
  font-family: var(--codeFont);
  font-size: 0.875rem;
  background: rgba(var(--secondary), 0.1);
  border: 1px solid rgba(var(--secondary), 0.2);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-button:hover {
  background: rgba(var(--secondary), 0.2);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.alert {
  font-family: var(--codeFont);
  font-weight: bold;
  padding: 0.75rem;
  border-radius: 0.25rem;
}

.alert.error {
  background: rgba(var(--red), 0.1);
  color: var(--red);
}

.alert.success {
  background: rgba(var(--green), 0.1);
  color: var(--green);
}

.hidden {
  display: none;
}
`

NewsletterSignupComponent.afterDOMLoaded = `
document.addEventListener('nav', function() {
  const form = document.getElementById('newsletter-form')
  const emailInput = document.getElementById('signup-email')
  const alert = document.getElementById('signup-alert')
  const alertMessage = document.getElementById('alert-message')
  let isSubmitting = false

  if (!form || !emailInput || !alert || !alertMessage) return

  form.addEventListener('submit', async function(e) {
    e.preventDefault()
    if (isSubmitting) return

    isSubmitting = true
    const submitButton = form.querySelector('button')
    if (submitButton) submitButton.disabled = true
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.value }),
      })

      const data = await response.json()
      
      alert.classList.remove('hidden', 'error', 'success')
      if (!response.ok) {
        alert.classList.add('error')
        alertMessage.textContent = data.error || 'Something went wrong'
      } else {
        alert.classList.add('success')
        alertMessage.textContent = data.message || 'Thanks! Please check your email to confirm.'
        emailInput.value = ''
      }
    } catch (error) {
      alert.classList.remove('hidden')
      alert.classList.add('error')
      alertMessage.textContent = 'Something went wrong'
    } finally {
      isSubmitting = false
      if (submitButton) submitButton.disabled = false
    }
  })
})
`

export default (() => NewsletterSignupComponent) satisfies QuartzComponentConstructor
