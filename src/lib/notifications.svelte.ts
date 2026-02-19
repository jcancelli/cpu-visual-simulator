/** Type of a {@link Notification} */
export enum NotificationType {
	ERROR,
	WARNING,
	SUCCESS,
	INFO,
}

/** A notification that will be displayed to the user */
export interface Notification {
	type: NotificationType
	message: string
	/** Amount of milliseconds for which the notification will be displayed.
	 * If undefined the user will be forced to dismiss it manually or keep it if undismissable */
	timerMs?: number
	/** If true, the notification cannot be dismissed and an eventual timerMs value will be ignored */
	undismissable?: true
}
