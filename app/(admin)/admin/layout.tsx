"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAuthenticatedRedirectPath } from "@/lib/auth-bootstrap";
import { isModeratorPath } from "@/lib/auth-role";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		const guardModeratorArea = async () => {
			const redirectPath = await getAuthenticatedRedirectPath();

			if (!redirectPath) {
				router.replace("/login");
				return;
			}

			if (!isModeratorPath(redirectPath)) {
				router.replace(redirectPath);
				return;
			}

			setIsChecking(false);
		};

		void guardModeratorArea();
	}, [router]);

	if (isChecking) {
		return null;
	}

	return <>{children}</>;
}
