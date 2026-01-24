import type { PageLoad } from "./$types"
import { goto } from "$app/navigation"
import { resolve } from "$app/paths"
import { localizeHref } from "$lib/paraglide/runtime"
import { browser } from "$app/environment"

export const load: PageLoad = () => {
	if (browser) {
		goto(resolve(localizeHref("/simulator") as "/simulator"))
	}
}
