import type { Contact } from "@/types/interfaces"
import { url } from "@/utils/url-api"
import { useCallback, useEffect, useState } from "react"

export const useLoadContacts = (userId: string | null) => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadContactsFromSupabase = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    const res = await fetch(`${url}/api/contacts/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) {
      setError(`Erro ao carregar contatos. Status: ${res.status}`)
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    setContacts(data)
    setError(null)
    setIsLoading(false)
  }, [userId])

  useEffect(() => {
    if (userId) {
      loadContactsFromSupabase()
    }
  }, [userId, loadContactsFromSupabase])

  return { contacts, isLoading, error, loadContactsFromSupabase }
}

