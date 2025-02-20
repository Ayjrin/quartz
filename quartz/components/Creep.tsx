'use server'

import { Stagehand } from '@browserbasehq/stagehand'
import { z } from 'zod'

export async function YoinkName(email: string): Promise<string> {
  try {
    // First try OpenAI to extract name from email
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `Extract the first name from this email address if obvious: ${email}. Only return the name if you're very confident. If not confident, return "UNCERTAIN". For example, for "john.smith@gmail.com" return "John", for "js123@gmail.com" return "UNCERTAIN".`
        }]
      })
    })
    
    const openaiData = await openaiResponse.json()
    const aiGuess = openaiData.choices[0].message.content.trim()
    
    if (aiGuess !== "UNCERTAIN") {
      return aiGuess
    }
    
    // If AI is uncertain, try browser search
    const stagehand = new Stagehand({
      env: 'BROWSERBASE',
      enableCaching: true,
      verbose: 1
    })
    await stagehand.init()

    const nameSchema = z.object({
      firstName: z.string(),
      confidence: z.enum(['HIGH', 'LOW'])
    })
    
    // Try searching on various platforms
    const platforms = [
      {
        url: `https://www.google.com/search?q=${encodeURIComponent(`"${email}" OR "${email.replace('@', ' ')}" name OR profile OR about`)}`,
        instruction: "Find the person's first name from search results. Look for social media profiles, personal websites, or professional listings that clearly associate this email with a name."
      },
      {
        url: `https://www.linkedin.com/pub/dir?email=${email}`,
        instruction: "Find the first name of the person associated with this email. If multiple results, only extract if there's a clear match with high confidence."
      },
      {
        url: `https://github.com/search?q=${email}`,
        instruction: "Look for the person's first name in their GitHub profile or commits associated with this email."
      },
      {
        url: `https://twitter.com/search?q=${email}`,
        instruction: "Find the first name from profile information or tweets containing this email."
      }
    ]
    
    for (const platform of platforms) {
      try {
        await stagehand.page.goto(platform.url)
        
        // First observe the page to see if we have relevant content
        const observations = await stagehand.page.observe({
          instruction: "Look for elements containing personal information or profile data",
          onlyVisible: true
        })
        
        if (observations.length > 0) {
          // Extract name data using the schema
          const extractedData = await stagehand.page.extract({
            instruction: platform.instruction,
            schema: nameSchema,
            useTextExtract: true
          })
          
          if (extractedData.confidence === 'HIGH') {
            await stagehand.close()
            return extractedData.firstName
          }
        }
      } catch (err) {
        console.error(`Error searching ${platform.url}:`, err)
        continue
      }
    }
    
    await stagehand.close()
    
    // If no name found, return email prefix
    return email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim()
    
  } catch (error) {
    console.error('Error in YoinkName:', error)
    // Fallback to email prefix
    return email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim()
  }
}