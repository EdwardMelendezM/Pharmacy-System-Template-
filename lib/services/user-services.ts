/**
 * User Service
 *
 * This service handles all user-related operations including authentication,
 * user management, and permission checking.
 */

import {
  type User,
  type UserPayload,
  type Role,
  type Company,
  type CompanyPayload,
  SystemModule,
  PermissionLevel,
} from "@/lib/models/user"

// Mock data for users
const mockUsers: User[] = [
  {
    id: "1",
    firstName: "John", // Nombre
    lastName: "Doe", // Apellido
    email: "john.doe@example.com", // Correo electrónico
    username: "john.doe", // Nombre de usuario
    status: "active", // Estado: activo
    roleId: "1", // Rol de administrador
    companyId: "1", // ID de la empresa
    lastLogin: new Date("2023-05-01T14:30:00Z"), // Último acceso
    createdAt: new Date("2022-01-15T10:00:00Z"), // Fecha de creación
    updatedAt: new Date("2022-01-15T10:00:00Z"), // Fecha de última actualización
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    username: "jane.smith",
    status: "active", // Estado: activo
    roleId: "2", // Rol de farmacéutico
    companyId: "1",
    lastLogin: new Date("2023-04-28T09:15:00Z"),
    createdAt: new Date("2022-02-10T11:30:00Z"),
    updatedAt: new Date("2022-02-10T11:30:00Z"),
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.johnson@example.com",
    username: "robert.johnson",
    status: "inactive", // Estado: inactivo
    roleId: "3", // Rol de cajero
    companyId: "2",
    lastLogin: new Date("2023-03-15T10:45:00Z"),
    createdAt: new Date("2022-03-05T14:20:00Z"),
    updatedAt: new Date("2023-04-01T09:30:00Z"),
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@example.com",
    username: "emily.davis",
    status: "active",
    roleId: "4", // Rol de responsable de inventario
    companyId: "3",
    lastLogin: new Date("2023-04-25T16:20:00Z"),
    createdAt: new Date("2022-04-12T13:10:00Z"),
    updatedAt: new Date("2022-04-12T13:10:00Z"),
  },
  {
    id: "5",
    firstName: "Michael",
    lastName: "Wilson",
    email: "michael.wilson@example.com",
    username: "michael.wilson",
    status: "active",
    roleId: "5", // Rol de responsable financiero
    companyId: "1",
    lastLogin: new Date("2023-04-20T11:05:00Z"),
    createdAt: new Date("2022-05-08T09:45:00Z"),
    updatedAt: new Date("2022-05-08T09:45:00Z"),
  },
]


// Mock data for roles with permissions
const mockRoles: Role[] = [
  {
    id: "1",
    name: "Administrador", // Nombre del rol
    description: "Acceso completo al sistema", // Descripción
    isSystem: true, // Indica que es un rol del sistema (no personalizado)
    permissions: Object.values(SystemModule).map((module) => ({
      module,
      level: PermissionLevel.ADMIN, // Permiso de administrador en todos los módulos
    })),
    createdAt: new Date("2022-01-01T00:00:00Z"), // Fecha de creación
    updatedAt: new Date("2022-01-01T00:00:00Z"), // Fecha de última actualización
  },
  {
    id: "2",
    name: "Farmacéutico",
    description: "Gestiona inventario y recetas",
    isSystem: true,
    permissions: [
      { module: SystemModule.DASHBOARD, level: PermissionLevel.STAFF }, // Acceso nivel empleado al panel
      { module: SystemModule.INVENTORY, level: PermissionLevel.ADMIN }, // Administración total del inventario
      { module: SystemModule.POS, level: PermissionLevel.STAFF }, // Acceso nivel empleado al punto de venta
      { module: SystemModule.REPORTS, level: PermissionLevel.STAFF }, // Acceso nivel empleado a reportes
      { module: SystemModule.SETTINGS, level: PermissionLevel.NONE }, // Sin acceso a configuración
      { module: SystemModule.USERS, level: PermissionLevel.NONE }, // Sin acceso a gestión de usuarios
      { module: SystemModule.ACCOUNTING, level: PermissionLevel.NONE }, // Sin acceso contable
      { module: SystemModule.BILLING, level: PermissionLevel.STAFF }, // Acceso nivel empleado a facturación
    ],
    createdAt: new Date("2022-01-01T00:00:00Z"),
    updatedAt: new Date("2022-01-01T00:00:00Z"),
  },
  {
    id: "3",
    name: "Cajero",
    description: "Maneja ventas y transacciones con clientes",
    isSystem: true,
    permissions: [
      { module: SystemModule.DASHBOARD, level: PermissionLevel.STAFF },
      { module: SystemModule.POS, level: PermissionLevel.STAFF },
      { module: SystemModule.INVENTORY, level: PermissionLevel.STAFF },
      { module: SystemModule.BILLING, level: PermissionLevel.STAFF },
      { module: SystemModule.REPORTS, level: PermissionLevel.NONE },
      { module: SystemModule.SETTINGS, level: PermissionLevel.NONE },
      { module: SystemModule.USERS, level: PermissionLevel.NONE },
      { module: SystemModule.ACCOUNTING, level: PermissionLevel.NONE },
    ],
    createdAt: new Date("2022-01-01T00:00:00Z"),
    updatedAt: new Date("2022-01-01T00:00:00Z"),
  },
  {
    id: "4",
    name: "Responsable de Inventario",
    description: "Gestiona el inventario de productos y proveedores",
    isSystem: true,
    permissions: [
      { module: SystemModule.DASHBOARD, level: PermissionLevel.STAFF },
      { module: SystemModule.INVENTORY, level: PermissionLevel.ADMIN },
      { module: SystemModule.REPORTS, level: PermissionLevel.STAFF },
      { module: SystemModule.POS, level: PermissionLevel.NONE },
      { module: SystemModule.SETTINGS, level: PermissionLevel.NONE },
      { module: SystemModule.USERS, level: PermissionLevel.NONE },
      { module: SystemModule.ACCOUNTING, level: PermissionLevel.NONE },
      { module: SystemModule.BILLING, level: PermissionLevel.NONE },
    ],
    createdAt: new Date("2022-01-01T00:00:00Z"),
    updatedAt: new Date("2022-01-01T00:00:00Z"),
  },
  {
    id: "5",
    name: "Responsable Financiero",
    description: "Gestiona contabilidad e informes financieros",
    isSystem: true,
    permissions: [
      { module: SystemModule.DASHBOARD, level: PermissionLevel.STAFF },
      { module: SystemModule.ACCOUNTING, level: PermissionLevel.ADMIN },
      { module: SystemModule.BILLING, level: PermissionLevel.ADMIN },
      { module: SystemModule.REPORTS, level: PermissionLevel.ADMIN },
      { module: SystemModule.INVENTORY, level: PermissionLevel.STAFF },
      { module: SystemModule.POS, level: PermissionLevel.NONE },
      { module: SystemModule.SETTINGS, level: PermissionLevel.NONE },
      { module: SystemModule.USERS, level: PermissionLevel.NONE },
    ],
    createdAt: new Date("2022-01-01T00:00:00Z"),
    updatedAt: new Date("2022-01-01T00:00:00Z"),
  },
]

// Mock data for companies
const mockCompanies: Company[] = [
  {
    id: "1",
    name: "MediCorp Farmacéutica",
    ruc: "20123456789",
    address: "123 Calle Principal, Oficina 100",
    city: "Lima",
    phone: "+51 1 234 5678",
    email: "contacto@medicorp.com",
    contactPerson: "Carlos Rodríguez",
    status: "active",
    createdAt: new Date("2021-01-01T00:00:00Z"),
    updatedAt: new Date("2021-01-01T00:00:00Z"),
  },
  {
    id: "2",
    name: "Suministros HealthPlus",
    ruc: "20987654321",
    address: "456 Avenida Park, Piso 3",
    city: "Arequipa",
    phone: "+51 54 321 6547",
    email: "info@healthplus.com",
    contactPerson: "María Sánchez",
    status: "active",
    createdAt: new Date("2021-02-15T00:00:00Z"),
    updatedAt: new Date("2021-02-15T00:00:00Z"),
  },
  {
    id: "3",
    name: "Distribuidores Wellness",
    ruc: "20456789123",
    address: "789 Calle Oak",
    city: "Trujillo",
    phone: "+51 44 789 1234",
    email: "soporte@wellness.com",
    contactPerson: "Juan Pérez",
    status: "active",
    createdAt: new Date("2021-03-10T00:00:00Z"),
    updatedAt: new Date("2021-03-10T00:00:00Z"),
  },
  {
    id: "4",
    name: "Soluciones PharmaTech",
    ruc: "20321654987",
    address: "321 Calle Pine, Oficina 200",
    city: "Cusco",
    phone: "+51 84 654 9873",
    email: "info@pharmatech.com",
    contactPerson: "Ana López",
    status: "inactive",
    createdAt: new Date("2021-04-05T00:00:00Z"),
    updatedAt: new Date("2022-01-10T00:00:00Z"),
  },
  {
    id: "5",
    name: "MediSupply S.A.",
    ruc: "20789123456",
    address: "654 Calle Cedar",
    city: "Chiclayo",
    phone: "+51 74 123 4567",
    email: "contacto@medisupply.com",
    contactPerson: "Pedro Gómez",
    status: "active",
    createdAt: new Date("2021-05-20T00:00:00Z"),
    updatedAt: new Date("2021-05-20T00:00:00Z"),
  },
]


// Helper function to generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// User Service implementation
export const UserService = {
  // Get all users with optional filtering
  getUsers: async (filters?: { search?: string; status?: string; roleId?: string; companyId?: string }): Promise<
    User[]
  > => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredUsers = [...mockUsers]

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchLower) ||
            user.lastName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.username.toLowerCase().includes(searchLower),
        )
      }

      if (filters.status) {
        filteredUsers = filteredUsers.filter((user) => user.status === filters.status)
      }

      if (filters.roleId) {
        filteredUsers = filteredUsers.filter((user) => user.roleId === filters.roleId)
      }

      if (filters.companyId) {
        filteredUsers = filteredUsers.filter((user) => user.companyId === filters.companyId)
      }
    }

    // Add role information to each user
    return filteredUsers.map((user) => ({
      ...user,
      role: mockRoles.find((role) => role.id === user.roleId),
    }))
  },

  // Get a single user by ID
  getUserById: async (id: string): Promise<User | null> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const user = mockUsers.find((user) => user.id === id)

    if (!user) {
      return null
    }

    // Add role information
    return {
      ...user,
      role: mockRoles.find((role) => role.id === user.roleId),
    }
  },

  // Create a new user
  createUser: async (userData: UserPayload): Promise<User> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Check if username or email already exists
    const existingUser = mockUsers.find((user) => user.username === userData.username || user.email === userData.email)

    if (existingUser) {
      throw new Error(existingUser.username === userData.username ? "Username already exists" : "Email already exists")
    }

    const newUser: User = {
      id: generateId(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockUsers.push(newUser)
    return newUser
  },

  // Update an existing user
  updateUser: async (id: string, userData: Partial<UserPayload>): Promise<User> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const userIndex = mockUsers.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Check if username or email already exists (excluding the current user)
    if (userData.username || userData.email) {
      const existingUser = mockUsers.find(
        (user) =>
          user.id !== id &&
          ((userData.username && user.username === userData.username) ||
            (userData.email && user.email === userData.email)),
      )

      if (existingUser) {
        throw new Error(
          existingUser.username === userData.username ? "Username already exists" : "Email already exists",
        )
      }
    }

    // Update the user
    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData,
      updatedAt: new Date(),
    }

    mockUsers[userIndex] = updatedUser

    return {
      ...updatedUser,
      role: mockRoles.find((role) => role.id === updatedUser.roleId),
    }
  },

  // Delete a user
  deleteUser: async (id: string): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const userIndex = mockUsers.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    mockUsers.splice(userIndex, 1)
  },

  // Get all roles
  getRoles: async (): Promise<Role[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return [...mockRoles]
  },

  // Get a single role by ID
  getRoleById: async (id: string): Promise<Role | null> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    return mockRoles.find((role) => role.id === id) || null
  },

  // Create a new role
  createRole: async (roleData: Omit<Role, "id" | "createdAt" | "updatedAt">): Promise<Role> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Check if role name already exists
    const existingRole = mockRoles.find((role) => role.name === roleData.name)

    if (existingRole) {
      throw new Error("Role name already exists")
    }

    const newRole: Role = {
      id: generateId(),
      ...roleData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockRoles.push(newRole)
    return newRole
  },

  // Update an existing role
  updateRole: async (id: string, roleData: Partial<Omit<Role, "id" | "createdAt" | "updatedAt">>): Promise<Role> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const roleIndex = mockRoles.findIndex((role) => role.id === id)

    if (roleIndex === -1) {
      throw new Error("Role not found")
    }

    // Check if this is a system role
    if (mockRoles[roleIndex].isSystem) {
      throw new Error("Cannot modify a system role")
    }

    // Check if role name already exists (excluding the current role)
    if (roleData.name) {
      const existingRole = mockRoles.find((role) => role.id !== id && role.name === roleData.name)

      if (existingRole) {
        throw new Error("Role name already exists")
      }
    }

    // Update the role
    const updatedRole = {
      ...mockRoles[roleIndex],
      ...roleData,
      updatedAt: new Date(),
    }

    mockRoles[roleIndex] = updatedRole
    return updatedRole
  },

  // Delete a role
  deleteRole: async (id: string): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const roleIndex = mockRoles.findIndex((role) => role.id === id)

    if (roleIndex === -1) {
      throw new Error("Role not found")
    }

    // Check if this is a system role
    if (mockRoles[roleIndex].isSystem) {
      throw new Error("Cannot delete a system role")
    }

    // Check if any users are using this role
    const usersWithRole = mockUsers.find((user) => user.roleId === id)

    if (usersWithRole) {
      throw new Error("Cannot delete a role that is assigned to users")
    }

    mockRoles.splice(roleIndex, 1)
  },

  // Get all companies with optional filtering
  getCompanies: async (filters?: { search?: string; status?: string }): Promise<Company[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredCompanies = [...mockCompanies]

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredCompanies = filteredCompanies.filter(
          (company) =>
            company.name.toLowerCase().includes(searchLower) ||
            company.ruc.includes(filters.search!) ||
            (company.email && company.email.toLowerCase().includes(searchLower)) ||
            (company.contactPerson && company.contactPerson.toLowerCase().includes(searchLower)),
        )
      }

      if (filters.status) {
        filteredCompanies = filteredCompanies.filter((company) => company.status === filters.status)
      }
    }

    return filteredCompanies
  },

  // Get a single company by ID
  getCompanyById: async (id: string): Promise<Company | null> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return mockCompanies.find((company) => company.id === id) || null
  },

  // Create a new company
  createCompany: async (companyData: CompanyPayload): Promise<Company> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Check if company RUC already exists
    const existingCompany = mockCompanies.find((company) => company.ruc === companyData.ruc)

    if (existingCompany) {
      throw new Error("Company with this RUC already exists")
    }

    const newCompany: Company = {
      id: generateId(),
      ...companyData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockCompanies.push(newCompany)
    return newCompany
  },

  // Update an existing company
  updateCompany: async (id: string, companyData: Partial<CompanyPayload>): Promise<Company> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const companyIndex = mockCompanies.findIndex((company) => company.id === id)

    if (companyIndex === -1) {
      throw new Error("Company not found")
    }

    // Check if RUC already exists (excluding the current company)
    if (companyData.ruc) {
      const existingCompany = mockCompanies.find((company) => company.id !== id && company.ruc === companyData.ruc)

      if (existingCompany) {
        throw new Error("Company with this RUC already exists")
      }
    }

    // Update the company
    const updatedCompany = {
      ...mockCompanies[companyIndex],
      ...companyData,
      updatedAt: new Date(),
    }

    mockCompanies[companyIndex] = updatedCompany
    return updatedCompany
  },

  // Delete a company
  deleteCompany: async (id: string): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const companyIndex = mockCompanies.findIndex((company) => company.id === id)

    if (companyIndex === -1) {
      throw new Error("Company not found")
    }

    // Check if any users are associated with this company
    const usersWithCompany = mockUsers.find((user) => user.companyId === id)

    if (usersWithCompany) {
      throw new Error("Cannot delete a company that has associated users")
    }

    mockCompanies.splice(companyIndex, 1)
  },

  // Check if a user has permission for a specific module and level
  hasPermission: (user: User, module: SystemModule, requiredLevel: PermissionLevel): boolean => {
    if (!user.role) {
      return false
    }

    const permission = user.role.permissions.find((p) => p.module === module)

    if (!permission) {
      return false
    }

    // Admin level has access to everything
    if (permission.level === PermissionLevel.ADMIN) {
      return true
    }

    // Staff level has access to staff operations but not admin
    if (permission.level === PermissionLevel.STAFF && requiredLevel === PermissionLevel.STAFF) {
      return true
    }

    return false
  },

  // Get user activity (mock implementation)
  getUserActivity: async (userId: string): Promise<{ action: string; timestamp: Date }[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    // Mock activity data
    return [
      { action: "Logged in", timestamp: new Date("2023-05-01T14:30:00Z") },
      { action: "Updated product inventory", timestamp: new Date("2023-04-30T11:45:00Z") },
      { action: "Created new user", timestamp: new Date("2023-04-28T09:15:00Z") },
      { action: "Generated monthly report", timestamp: new Date("2023-04-25T16:20:00Z") },
      { action: "Processed customer refund", timestamp: new Date("2023-04-22T13:10:00Z") },
      { action: "Added new supplier", timestamp: new Date("2023-04-20T10:30:00Z") },
      { action: "Updated system settings", timestamp: new Date("2023-04-18T15:45:00Z") },
    ]
  },
}
