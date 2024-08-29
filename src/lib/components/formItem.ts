import type { Arrayable, ArrayableFormItemRule } from './baseType';

export type FormItemProp = Arrayable<string>;

export type FormItemValidateState = 'success' | 'error' | 'validating' | '';

export type FormItemProps = {
	label?: string;
	labelWidth?: string | number;
	labelPosition?: 'left' | 'right' | 'top' | '';
	prop?: FormItemProp;
	required?: boolean;
	rules?: object | ArrayableFormItemRule; // 根据实际使用的规则类型进行定义
	error?: string;
	validateStatus?: FormItemValidateState; // 根据实际状态定义
	labelFor?: string;
	inlineMessage?: string | boolean;
	showMessage?: boolean;
};
