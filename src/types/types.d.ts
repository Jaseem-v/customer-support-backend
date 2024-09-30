
export interface requestWithUser extends Request {
    user: any
    role: "DOCTOR" | "CLINIC"
}