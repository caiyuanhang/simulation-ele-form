import type { RuleItem, ValidateError, ValidateFieldsError } from 'async-validator';

import type { FormProps } from './form';
import type { FormItemProp, FormItemProps, FormItemValidateState } from './formItem';
import type { Arrayable } from './baseType';

export type FormLabelWidthContext = {
	autoLabelWidth: string;
	registerLabelWidth: (val: number, oldVal: number) => void;
	deregisterLabelWidth: (val: number) => void;
};

export type FormContext = FormProps &
	FormLabelWidthContext & {
		// emit: SetupContext<FormEmits>['emit'];
		getField: (prop: string) => FormItemContext | undefined;
		addField: (field: FormItemContext) => void;
		removeField: (field: FormItemContext) => void;
		resetFields: (props?: Arrayable<FormItemProp>) => void;
		clearValidate: (props?: Arrayable<FormItemProp>) => void;
		validateField: (
			props?: Arrayable<FormItemProp>,
			callback?: FormValidateCallback
		) => FormValidationResult;
	};

export type FormValidationResult = Promise<boolean>;

export type FormValidateCallback = (
	isValid: boolean,
	invalidFields?: ValidateFieldsError
) => Promise<void> | void;

export interface FormItemContext extends FormItemProps {
	$el: HTMLDivElement | undefined;
	validateState: FormItemValidateState;
	isGroup: boolean;
	labelId: string;
	inputIds: string[];
	hasLabel: boolean;
	fieldValue: any;
	addInputId: (id: string) => void;
	removeInputId: (id: string) => void;
	validate: (trigger: string, callback?: FormValidateCallback) => FormValidationResult;
	resetField(): void;
	clearValidate(): void;
}
