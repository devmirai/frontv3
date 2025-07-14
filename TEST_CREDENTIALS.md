# Test Credentials for mirAI

## Backend Connection Testing

### Test Users for Login
Create these users via the registration form to test the login functionality:

#### Test User 1 (Regular User)
- **Email**: `test@usuario.com`
- **Password**: `password123`
- **First Name**: `Juan`
- **Paternal Surname**: `Pérez`
- **Maternal Surname**: `García`
- **Phone**: `987654321` (must start with 9 and have 9 digits)
- **Birth Date**: Any date that makes the person 18+ years old

#### Test User 2 (Company User)
- **Email**: `test@empresa.com`
- **Password**: `password123`
- **Company Name**: `Tech Corp`

#### Test Admin
- **Email**: `admin@mirai.com`
- **Password**: `admin123`

## Backend Endpoints Being Used

### Authentication
- **Login**: `POST http://localhost:8081/auth/login`
- **Create User**: `POST http://localhost:8081/api/usuarios`

### Expected Response Format

#### Login Response
```json
{
  "token": "jwt_token_here",
  "tipo": "USUARIO|EMPRESA|ADMIN",
  "id": 1,
  "nombre": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "email": "test@usuario.com"
}
```

#### Registration Response
```json
{
  "id": 1,
  "email": "test@usuario.com",
  "nombre": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "rol": "USUARIO"
}
```

#### Registration Request (Updated Format)
```json
{
  "email": "usuario@example.com",
  "nombre": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "nacimiento": "1990-05-15",
  "telefono": 987654321,
  "password": "password123",
  "rol": "USUARIO"
}
```

## Testing Steps

1. **Start Backend Server** (port 8081)
2. **Start Frontend Server** (port 5173)
3. **Test Registration**: Create a new user via the registration form
   - Phone number must start with 9 and have exactly 9 digits (e.g., 987654321)
   - Birth date must make the person at least 18 years old
   - All fields are required
4. **Test Login**: Use the created credentials to log in
5. **Verify Navigation**: Ensure proper redirection based on user role

## Validation Rules

### Phone Number
- Must start with 9
- Must have exactly 9 digits
- Example: `987654321`

### Birth Date
- Person must be at least 18 years old
- Cannot select future dates
- Format: DD/MM/YYYY (display) → YYYY-MM-DD (backend)

## Fallback to Mock Data

If the backend is not available, the system will automatically fall back to mock data for testing purposes.
