/** An object that can be executed by an AsyncLoopExecutor */
export default interface AsyncLoop {
	/**
	 * Execute one cycle of the loop
	 * @returns Wether or not the loop should cycle again
	 * */
	cycle(): Promise<boolean>
}
