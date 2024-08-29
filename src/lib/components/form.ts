import type { FormRules } from './baseType';

export type FormProps = {
	disabled?: boolean;
	model?: object;
	rules?: object | FormRules; // 根据实际使用的规则类型进行定义
	labelPosition?: 'left' | 'right' | 'top';
	requireAsteriskPosition?: 'left' | 'right';
	hideRequiredAsterisk?: boolean;
	labelWidth?: string | number;
	labelSuffix?: string;
	inline?: boolean;
	inlineMessage?: boolean;
	statusIcon?: boolean;
	showMessage?: boolean;
	validateOnRuleChange?: boolean;
	scrollToError?: boolean;
	scrollIntoViewOptions?: Record<string, any> | boolean;
};
