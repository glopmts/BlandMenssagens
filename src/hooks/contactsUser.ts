import type { Contact, User } from "@/types/interfaces"
import { supabase } from "@/utils/supabase"
import * as Contacts from "expo-contacts"

export async function fetchContacts(): Promise<Contact[]> {
  const { status } = await Contacts.requestPermissionsAsync()

  if (status !== "granted") {
    throw new Error("Permission to access contacts was denied")
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
  })

  return data
    .filter((contact) => contact.id && contact.name && contact.phoneNumbers?.length)
    .map((contact) => ({
      id: contact.id!,
      name: contact.name,
      image: contact.imageAvailable ? contact.image?.uri : undefined,
      phoneNumbers: contact.phoneNumbers
        ?.map((pn) => (pn.number ? { number: pn.number } : null))
        .filter((pn): pn is { number: string } => pn !== null),
    }))
}

export async function saveContactsToDatabase(contacts: Contact[], clerkId: string | undefined) {
  if (!clerkId) throw new Error("User not authenticated")

  const { data: existingContacts, error: contactError } = await supabase
    .from("contacts")
    .select("id")
    .eq("clerk_id", clerkId)

  if (contactError) {
    throw new Error("Error checking existing contacts: " + contactError.message)
  }

  let existingContactCount = existingContacts?.length || 0

  if (existingContactCount >= 30) {
    console.log("30 contact limit reached. Cannot add more contacts.")
    return
  }

  for (const contact of contacts) {
    if (existingContactCount >= 30) break

    const phone = contact.phoneNumbers?.[0]?.number?.replace(/\D/g, "")
    if (!phone) continue

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("clerk_id, phone")
      .eq("phone", phone)

    if (userError) {
      throw new Error("Error checking if contact exists: " + userError.message)
    }

    if (userData && userData.length > 0) {
      const user = userData[0]

      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("phone", phone)
        .eq("clerk_id", user.clerk_id)

      if (error) {
        throw new Error("Error checking if contact already exists in contacts table: " + error.message)
      }

      if (data?.length === 0) {
        const { error: insertError } = await supabase.from("contacts").insert([
          {
            clerk_id: user.clerk_id,
            name: contact.name,
            phone: phone,
            image: contact.image,
          },
        ])

        if (insertError) {
          throw new Error("Error inserting new contact: " + insertError.message)
        }

        existingContactCount++
      }
    }
  }
}

export async function getContactsUser(contacts: Contact[]): Promise<User[]> {
  if (contacts.length === 0) return []

  const phoneNumbers = contacts
    .map((contact) => contact.phoneNumbers?.[0]?.number?.replace(/\D/g, ""))
    .filter((phone): phone is string => !!phone)

  if (phoneNumbers.length === 0) return []

  const { data, error } = await supabase.from("users").select("*").in("phone", phoneNumbers)

  if (error) {
    throw new Error("Error fetching users: " + error.message)
  }

  return data || []
}

