import { useEffect } from 'react';

export class ThaanaKeyboard {
	private className: string;
	private latinChar: string = '';
	private char: string = '';
	private oldValue: string = '';

	constructor(
		className: string = '.thaana-keyboard',
		autoRun: boolean = true
	) {
		this.className = className;
		if (autoRun) {
			this.run();
		}
	}

	private run() {
		const elements = document.querySelectorAll<
			HTMLInputElement | HTMLTextAreaElement
		>(this.className);
		elements.forEach((element) => {
			element.addEventListener('beforeinput', (e) => {
				if (e instanceof InputEvent) {
					this.beforeInputEvent(e);
				}
			});
			element.addEventListener('input', (e) => {
				if (e instanceof InputEvent) {
					this.inputEvent(e);
				}
			});
		});
		document.addEventListener(
			'selectionchange',
			this.selectionChange
		);
	}

	private selectionChange = () => {
		const activeElement = document.activeElement as
			| HTMLInputElement
			| HTMLTextAreaElement;
		if (activeElement && activeElement.matches(this.className)) {
			activeElement.dataset.start =
				activeElement.selectionStart?.toString();
			activeElement.dataset.end =
				activeElement.selectionEnd?.toString();
		}
	};

	private beforeInputEvent(e: InputEvent) {
		const target = e.target as HTMLInputElement | HTMLTextAreaElement;
		if (
			['insertCompositionText', 'insertText'].includes(e.inputType)
		) {
			this.latinChar = e.data?.charAt(e.data.length - 1) || '';
			this.char = this.getChar(this.latinChar);
			this.oldValue = target.value;
		}
	}

	private inputEvent(e: InputEvent) {
		const target = e.target as HTMLInputElement | HTMLTextAreaElement;
		if (
			['insertCompositionText', 'insertText'].includes(e.inputType) &&
			this.char !== this.latinChar
		) {
			const start = target.selectionStart || 0;
			const end = target.selectionEnd || 0;

			target.value = '';
			target.value = this.oldValue.split(this.latinChar).join('');

			const dataStart = Number(target.dataset.start || 0);
			const dataEnd = Number(target.dataset.end || 0);

			if (dataEnd - dataStart > 0) {
				target.value =
					target.value.substring(0, dataStart) +
					target.value.substring(dataEnd);
			}

			let newValue = target.value.substring(0, start - 1);
			newValue += this.char;
			newValue += target.value.substring(start - 1);
			target.value = newValue;

			target.selectionStart = start;
			target.selectionEnd = end;
		}
	}

	private getChar(latin: string): string {
		const map: { [key: string]: string } = {
			q: 'ް',
			w: 'އ',
			e: 'ެ',
			r: 'ރ',
			t: 'ތ',
			y: 'ޔ',
			u: 'ު',
			i: 'ި',
			o: 'ޮ',
			p: 'ޕ',
			a: 'ަ',
			s: 'ސ',
			d: 'ދ',
			f: 'ފ',
			g: 'ގ',
			h: 'ހ',
			j: 'ޖ',
			k: 'ކ',
			l: 'ލ',
			z: 'ޒ',
			x: '×',
			c: 'ޗ',
			v: 'ވ',
			b: 'ބ',
			n: 'ނ',
			m: 'މ',
			Q: 'ޤ',
			W: 'ޢ',
			E: 'ޭ',
			R: 'ޜ',
			T: 'ޓ',
			Y: 'ޠ',
			U: 'ޫ',
			I: 'ީ',
			O: 'ޯ',
			P: '÷',
			A: 'ާ',
			S: 'ށ',
			D: 'ޑ',
			F: 'ﷲ',
			G: 'ޣ',
			H: 'ޙ',
			J: 'ޛ',
			K: 'ޚ',
			L: 'ޅ',
			Z: 'ޡ',
			X: 'ޘ',
			C: 'ޝ',
			V: 'ޥ',
			B: 'ޞ',
			N: 'ޏ',
			M: 'ޟ',
			',': '،',
			';': '؛',
			'?': '؟',
			'<': '>',
			'>': '<',
			'[': ']',
			']': '[',
			'(': ')',
			')': '(',
			'{': '}',
			'}': '{',
		};
		return map[latin] || latin;
	}
}

// Hook for React components
export function useThaanaKeyboard(
	className: string = '.thaana-keyboard'
) {
	useEffect(() => {
		const keyboard = new ThaanaKeyboard(className);
		// Cleanup not needed as event listeners are bound to specific elements
	}, [className]);
}
