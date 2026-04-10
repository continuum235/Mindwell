// Shared registered users storage
// In production, this would be a database
interface RegisteredUser {
  id: string
  name: string
  email: string
  password: string
}

let registeredUsers: RegisteredUser[] = []

export function getRegisteredUsers(): RegisteredUser[] {
  return registeredUsers
}

export function addRegisteredUser(user: RegisteredUser): void {
  registeredUsers.push(user)
}

export function findUserByEmail(email: string): RegisteredUser | undefined {
  const normalizedEmail = email.toLowerCase().trim()
  return registeredUsers.find((u) => u.email === normalizedEmail)
}

export function clearRegisteredUsers(): void {
  registeredUsers = []
}
