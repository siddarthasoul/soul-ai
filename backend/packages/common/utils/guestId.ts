import { randomUUID } from "node:crypto";

export function generateGuestId(): string {
    return randomUUID();
}