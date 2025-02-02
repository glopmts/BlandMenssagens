import type { Contact } from "@/types/interfaces"
import { supabase } from "@/utils/supabase"
import { useCallback, useEffect, useState } from "react"

export const useLoadContacts = (userId: string | null) => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadContactsFromSupabase = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)

    const { data, error } = await supabase
      .from("contacts")
      .select(`
        *,
        contact:users!contacts_contact_id_fkey (
          clerk_id,
          phone,
          name,
          imageurl
        )
      `)
      .eq("user_id", userId)

    if (error) {
      console.error("Erro ao carregar contatos do Supabase:", error.message)
      setError("Erro ao carregar contatos.")
    } else {
      setContacts(data || [])
    }

    setIsLoading(false)
  }, [userId])

  useEffect(() => {
    if (userId) {
      loadContactsFromSupabase()
    }
  }, [userId, loadContactsFromSupabase])

  return { contacts, isLoading, error, loadContactsFromSupabase }
}

