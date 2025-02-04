export const appLogger = (message: string, ...rest: string[]) => {
	/**
	 * [NOTE]
	 * 本来はログレベルによって出力内容を選定したり構造化が必要ですが、今回はコンソールに出力します。
	 */
	console.log(message, ...rest);
};
