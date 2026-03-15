import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Validated {
    completed: boolean;
    description: string;
}
export interface ValidatedInput {
    id: bigint;
    completed: boolean;
    description: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    addTodo(description: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimFirstAdmin(): Promise<boolean>;
    isCallerAdminSafe(): Promise<boolean>;
    saveOrder(orderJson: string): Promise<bigint>;
    getOrders(): Promise<Array<string>>;
    deleteTodo(id: bigint): Promise<void>;
    editTodo(id: bigint, description: string): Promise<void>;
    getCallerUserProfile(): Promise<string | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTodo(id: bigint): Promise<Validated | null>;
    getTodos(): Promise<Array<ValidatedInput> | null>;
    getUserProfile(user: Principal): Promise<string | null>;
    isCallerAdmin(): Promise<boolean>;
    isRegistered(): Promise<boolean>;
    signUp(username: string): Promise<void>;
    toggleTodo(id: bigint): Promise<void>;
}
