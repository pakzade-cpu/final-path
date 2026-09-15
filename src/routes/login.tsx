import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/components/app/login-screen";

export const Route = createFileRoute("/login")({ component: LoginScreen });
