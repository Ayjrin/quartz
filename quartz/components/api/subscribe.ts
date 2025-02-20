'use server'

import { YoinkName } from '../Creep'
import { createClient } from '@supabase/supabase-js'

export async function subscribeToNewsletter(formData: FormData) {
  try {
    const email = formData.get('email') as string
    if (!email) throw new Error('Email is required')

    // Get the first name using YoinkName
    const nameResult = await YoinkName(email)

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Insert into Supabase
    const { error } = await supabase
      .from('subscribers')
      .insert([{
        email,
        first_name: nameResult.first_name,
        created_at: new Date().toISOString()
      }])

    if (error) throw error
    return { success: true }

  } catch (error) {
    console.error('Error in subscribeToNewsletter:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Something went wrong' 
    }
  }
}
