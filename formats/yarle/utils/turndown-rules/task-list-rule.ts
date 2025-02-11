import { checkboxDone, checkboxTodo } from './../../constants';

import { getAttributeProxy } from './get-attribute-proxy';

const indentCharacter = '	';
export const taskListRule = {
	filter: 'li',
	replacement: (content: any, node: any, options: any) => {

		const isTodoDoneBlock = (node: any) => {
			const nodeProxy = getAttributeProxy(node);
			const taskFlag = '--en-checked:true;';

			return nodeProxy.style && nodeProxy.style.value.indexOf(taskFlag) >= 0;
		};
		const isTodoBlock = (node: any) => {
			const nodeProxy = getAttributeProxy(node);
			const taskFlag = '--en-checked:false;';

			return nodeProxy.style && nodeProxy.style.value.indexOf(taskFlag) >= 0;
		};

		const indentCount = content.match(/^\n*/)[0].length || 0;
		const indentChars = indentCharacter.repeat(indentCount);

		const singleLineContent = content
			.replace(/^\n+/, '') // Remove leading newlines
			.replace(/\n+$/, '\n') // Replace trailing newlines with just a single one
			.replace(/\n/gm, `\n${indentCharacter}`); // Indent

		let prefix = indentCount > 0
			? indentChars
			: (isTodoDoneBlock(node)
				? `${checkboxDone} `
				: (isTodoBlock(node)
					? `${checkboxTodo} `
					: '* '))
		;
		const parent = node.parentNode;
		if (parent.nodeName === 'OL') {
			const start = parent.getAttribute('start');
			const index = Array.prototype.indexOf.call(parent.children, node);
			prefix = `${(start ? Number(start) + index : index + 1)}. `;
		}

		let ret;

		ret = (prefix + singleLineContent + (node.nextSibling && !/\n$/.test(singleLineContent) ? '\n' : ''));

		return ret;
	},
};
